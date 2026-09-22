import { Router, type Request, type Response } from "express";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { getAuth } from "./auth.js";
import { admin } from "./supabase.js";
import {
  audit, badRequest, getChecklistStatus, must, mustMaybe, notFound, ownedApplication, setChecklist,
} from "./db.js";
import {
  BOOKING_WINDOW_DAYS, FAMILY_DOC_KINDS, INTERVIEW_KINDS, INTERVIEW_LEAD_MS, MAX_FILES_PER_KIND,
  MAX_REC_SENDS, REC_KINDS, REC_LINK_DAYS, type InterviewKind, type RecKind,
} from "./constants.js";
import { cleanFileName, detectFile, removeFile, signedUrl, storeFile } from "./storage.js";
import { upload } from "./uploads.js";
import {
  emailInterviewBooked, emailInterviewCancelled, emailParentRequestSent, emailRecommenderRequest,
  type Lang,
} from "./notices.js";

// Mounted at /api/applications/:id — every route here is already behind requireAuth and only
// ever touches the signed-in family's own application.
export const extrasRouter = Router({ mergeParams: true });

const appId = (req: Request) => String((req.params as Record<string, string>).id);
const localeOf = (body: unknown): Lang => ((body as { locale?: unknown } | undefined)?.locale === "zh" ? "zh" : "en");
type AppRow = NonNullable<Awaited<ReturnType<typeof ownedApplication>>>;

/** The application, if it's this family's and has been submitted (the checklist only exists after that). */
async function submittedApp(req: Request, res: Response): Promise<AppRow | null> {
  const app = await ownedApplication(appId(req), res);
  if (!app) {
    notFound(res);
    return null;
  }
  if (app.status === "draft") {
    res.status(409).json({ code: "not_submitted", error: "Please submit the application first." });
    return null;
  }
  return app;
}

const student = (app: AppRow) => ({
  studentName: `${app.applicant_first_name ?? ""} ${app.applicant_last_name ?? ""}`.trim(),
  grade: String(app.grade_applying),
  schoolYear: String(app.school_year),
});

// Emails are a courtesy on top of the saved action, so a delivery hiccup must not undo it.
async function bestEffort(label: string, task: Promise<unknown>) {
  try {
    await task;
  } catch (err) {
    console.error(`${label} email failed:`, err instanceof Error ? err.message : err);
  }
}

// --- Documents (birth certificate, report card) ---------------------------------

extrasRouter.post("/documents", upload.single("file"), async (req, res) => {
  const app = await submittedApp(req, res);
  if (!app) return;
  const kind = z.enum(FAMILY_DOC_KINDS).safeParse(req.body?.kind);
  if (!kind.success) return badRequest(res);
  if (!req.file) return badRequest(res, "Please choose a file.", "no_file");

  const type = detectFile(req.file.buffer);
  if (!type) {
    res.status(415).json({ code: "bad_file_type", error: "Please upload a PDF, JPG or PNG file." });
    return;
  }
  const existing = must(await admin.from("documents").select("id").eq("application_id", app.id).eq("kind", kind.data));
  if (existing.length >= MAX_FILES_PER_KIND) {
    res.status(409).json({ code: "too_many_files", error: `You can upload up to ${MAX_FILES_PER_KIND} files here.` });
    return;
  }
  const status = await getChecklistStatus(app.id, kind.data);
  if (status === "waived") {
    res.status(409).json({ code: "locked", error: "This item doesn’t need a file." });
    return;
  }

  const path = await storeFile(app.id, kind.data, req.file.buffer, type);
  const { error } = await admin.from("documents").insert({
    application_id: app.id, kind: kind.data, storage_path: path, original_name: cleanFileName(req.file.originalname),
    mime_type: type.mime, size_bytes: req.file.size, uploaded_by: getAuth(res).userId,
  });
  if (error) {
    await removeFile(path); // don't leave an orphaned file behind
    throw new Error(error.message);
  }
  if (status === "pending") await setChecklist(app.id, kind.data, "submitted");
  await audit(req, getAuth(res).userId, "document.upload", app.id, { kind: kind.data });
  res.status(201).json({ ok: true });
});

async function ownDocument(req: Request, res: Response, app: AppRow) {
  const docId = String((req.params as Record<string, string>).docId);
  if (!z.uuid().safeParse(docId).success) return null;
  return mustMaybe(
    await admin
      .from("documents")
      .select("id, kind, storage_path, original_name")
      .eq("id", docId)
      .eq("application_id", app.id)
      .in("kind", [...FAMILY_DOC_KINDS]) // recommendation letters are never exposed to families
      .maybeSingle(),
  );
}

extrasRouter.get("/documents/:docId/url", async (req, res) => {
  const app = await ownedApplication(appId(req), res);
  if (!app) return notFound(res);
  const doc = await ownDocument(req, res, app);
  if (!doc) return notFound(res);
  res.json({ url: await signedUrl(doc.storage_path, doc.original_name) });
});

extrasRouter.delete("/documents/:docId", async (req, res) => {
  const app = await ownedApplication(appId(req), res);
  if (!app) return notFound(res);
  const doc = await ownDocument(req, res, app);
  if (!doc) return notFound(res);

  const status = await getChecklistStatus(app.id, doc.kind);
  if (status === "verified" || status === "waived") {
    res.status(409).json({ code: "locked", error: "This document has already been reviewed by the school." });
    return;
  }
  mustMaybe(await admin.from("documents").delete().eq("id", doc.id));
  await removeFile(doc.storage_path);
  const left = must(await admin.from("documents").select("id").eq("application_id", app.id).eq("kind", doc.kind));
  if (left.length === 0 && status === "submitted") await setChecklist(app.id, doc.kind, "pending");
  await audit(req, getAuth(res).userId, "document.delete", app.id, { kind: doc.kind });
  res.json({ ok: true });
});

// --- Recommendations ------------------------------------------------------------

const recKind = z.enum(Object.keys(REC_KINDS) as [RecKind, ...RecKind[]]);
const recBody = z.object({
  kind: recKind,
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
});

/** Issues a fresh single-use link (only its hash is stored) and emails the recommender and the parent. */
async function issueRecommendation(
  req: Request, res: Response, app: AppRow,
  p: { kind: RecKind; name: string; email: string; lang: Lang },
) {
  const existing = mustMaybe(
    await admin.from("recommendations").select("*").eq("application_id", app.id).eq("kind", p.kind).maybeSingle(),
  );
  if (existing?.submitted_at) {
    res.status(409).json({ code: "already_received", error: "This recommendation has already been received." });
    return;
  }
  const sameRecipient = existing?.recommender_email === p.email;
  const sendCount = existing && sameRecipient ? existing.send_count + 1 : 1;
  if (sendCount > MAX_REC_SENDS) {
    res.status(429).json({ code: "too_many_sends", error: "This link has been sent too many times. Please contact the Admission Office." });
    return;
  }

  const token = randomBytes(32).toString("base64url");
  const row = {
    recommender_name: p.name,
    recommender_email: p.email,
    token_hash: createHash("sha256").update(token).digest("hex"),
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + REC_LINK_DAYS * 86_400_000).toISOString(),
    send_count: sendCount,
  };
  if (existing) mustMaybe(await admin.from("recommendations").update(row).eq("id", existing.id));
  else mustMaybe(await admin.from("recommendations").insert({ ...row, application_id: app.id, kind: p.kind }));

  const info = student(app);
  try {
    await emailRecommenderRequest(p.email, { ...info, recommenderName: p.name, kind: p.kind, token, expiresAt: new Date(row.expires_at) });
  } catch (err) {
    console.error("recommender email failed:", err instanceof Error ? err.message : err);
    res.status(502).json({ code: "email_failed", error: "We couldn’t send the email. Please try again." });
    return;
  }
  await bestEffort("parent confirmation", emailParentRequestSent(getAuth(res).email, p.lang, {
    ...info, recommenderName: p.name, recommenderEmail: p.email, kind: p.kind, resent: !!existing && sameRecipient,
  }));
  await audit(req, getAuth(res).userId, "recommendation.request", app.id, { kind: p.kind });
  res.status(existing ? 200 : 201).json({ ok: true });
}

extrasRouter.post("/recommendations", async (req, res) => {
  const app = await submittedApp(req, res);
  if (!app) return;
  const body = recBody.safeParse(req.body);
  if (!body.success) return badRequest(res);
  await issueRecommendation(req, res, app, { ...body.data, lang: localeOf(req.body) });
});

extrasRouter.post("/recommendations/:kind/resend", async (req, res) => {
  const app = await submittedApp(req, res);
  if (!app) return;
  const kind = recKind.safeParse((req.params as Record<string, string>).kind);
  if (!kind.success) return notFound(res);
  const existing = mustMaybe(
    await admin.from("recommendations").select("recommender_name, recommender_email").eq("application_id", app.id).eq("kind", kind.data).maybeSingle(),
  );
  if (!existing) return notFound(res);
  await issueRecommendation(req, res, app, {
    kind: kind.data, name: existing.recommender_name, email: existing.recommender_email, lang: localeOf(req.body),
  });
});

// --- Interviews -----------------------------------------------------------------

const interviewKind = z.enum(Object.keys(INTERVIEW_KINDS) as [InterviewKind, ...InterviewKind[]]);

/** Interviews open once the school has verified the birth certificate. */
async function interviewsUnlocked(app: AppRow, res: Response) {
  if ((await getChecklistStatus(app.id, "birth_certificate")) === "verified") return true;
  res.status(403).json({ code: "locked", error: "Interviews open once your child’s birth certificate has been verified." });
  return false;
}

extrasRouter.get("/interview-slots", async (req, res) => {
  const app = await submittedApp(req, res);
  if (!app) return;
  const kind = interviewKind.safeParse(req.query.kind);
  if (!kind.success) return badRequest(res);
  if (!(await interviewsUnlocked(app, res))) return;

  const now = Date.now();
  const slots = must(
    await admin
      .from("interview_slots")
      .select("id, starts_at, ends_at, location")
      .eq("kind", kind.data)
      .gte("starts_at", new Date(now + INTERVIEW_LEAD_MS).toISOString())
      .lte("starts_at", new Date(now + BOOKING_WINDOW_DAYS * 86_400_000).toISOString())
      .order("starts_at")
      .limit(300),
  );
  const held = slots.length
    ? must(
        await admin.from("interviews").select("slot_id").eq("status", "scheduled").in("slot_id", slots.map((s) => s.id)),
      )
    : [];
  const taken = new Set(held.map((h) => h.slot_id));
  res.json({
    slots: slots.filter((s) => !taken.has(s.id)).map((s) => ({
      id: s.id, startsAt: s.starts_at, endsAt: s.ends_at, location: s.location,
    })),
  });
});

extrasRouter.post("/interviews", async (req, res) => {
  const app = await submittedApp(req, res);
  if (!app) return;
  if (!(await interviewsUnlocked(app, res))) return;
  const slotId = z.uuid().safeParse(req.body?.slotId);
  if (!slotId.success) return badRequest(res);

  const slot = mustMaybe(
    await admin.from("interview_slots").select("id, kind, starts_at, ends_at, location").eq("id", slotId.data).maybeSingle(),
  );
  if (!slot || new Date(slot.starts_at).getTime() < Date.now() + INTERVIEW_LEAD_MS) {
    res.status(409).json({ code: "slot_unavailable", error: "That time is no longer available." });
    return;
  }
  const kind = slot.kind as InterviewKind;

  // The database enforces both rules with unique indexes, so two families can't grab one slot
  // and one family can't hold two interviews of the same kind, even if requests race.
  const { error } = await admin.from("interviews").insert({
    application_id: app.id, kind, slot_id: slot.id, starts_at: slot.starts_at, ends_at: slot.ends_at, status: "scheduled",
  });
  if (error) {
    if (error.code === "23505") {
      const mine = error.message.includes("one_active_per_kind");
      res.status(409).json({
        code: mine ? "already_scheduled" : "slot_taken",
        error: mine ? "You already have this interview scheduled." : "Sorry, someone just took that time. Please pick another.",
      });
      return;
    }
    throw new Error(error.message);
  }
  await setChecklist(app.id, INTERVIEW_KINDS[kind], "submitted");
  await bestEffort("interview", emailInterviewBooked(getAuth(res).email, localeOf(req.body), {
    ...student(app), kind, startsAt: slot.starts_at, endsAt: slot.ends_at, location: slot.location,
  }));
  await audit(req, getAuth(res).userId, "interview.book", app.id, { kind, slotId: slot.id });
  res.status(201).json({ ok: true });
});

extrasRouter.delete("/interviews/:interviewId", async (req, res) => {
  const app = await ownedApplication(appId(req), res);
  if (!app) return notFound(res);
  const id = z.uuid().safeParse((req.params as Record<string, string>).interviewId);
  if (!id.success) return notFound(res);

  const interview = mustMaybe(
    await admin.from("interviews").select("id, kind, starts_at, ends_at").eq("id", id.data).eq("application_id", app.id).eq("status", "scheduled").maybeSingle(),
  );
  if (!interview) return notFound(res);
  if (new Date(interview.starts_at).getTime() - Date.now() < INTERVIEW_LEAD_MS) {
    res.status(409).json({ code: "too_late", error: "Interviews can be cancelled up to 24 hours before they start. Please contact the Admission Office." });
    return;
  }
  mustMaybe(await admin.from("interviews").update({ status: "cancelled" }).eq("id", interview.id));
  const kind = interview.kind as InterviewKind;
  if ((await getChecklistStatus(app.id, INTERVIEW_KINDS[kind])) === "submitted") {
    await setChecklist(app.id, INTERVIEW_KINDS[kind], "pending");
  }
  await bestEffort("interview cancel", emailInterviewCancelled(getAuth(res).email, localeOf(req.body), {
    ...student(app), kind, startsAt: interview.starts_at, endsAt: interview.ends_at,
  }));
  await audit(req, getAuth(res).userId, "interview.cancel", app.id, { kind });
  res.json({ ok: true });
});

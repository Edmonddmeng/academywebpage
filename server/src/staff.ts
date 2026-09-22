import { Router } from "express";
import { z } from "zod";
import { getAuth, requireAuth, requireRole } from "./auth.js";
import { admin } from "./supabase.js";
import { audit, badRequest, idSchema, must, mustMaybe, notFound, setChecklist } from "./db.js";
import { CHECKLIST_KINDS } from "./form/schema.js";
import { CHECKLIST_STATUSES, INTERVIEW_KINDS, type InterviewKind } from "./constants.js";
import { signedUrl } from "./storage.js";
import { schoolTimeToUtc } from "./time.js";

// Everything the admissions team does. Signed-in staff or admins only — the role comes from the
// profiles table, which families cannot edit — and every look at a file or record is logged.
export const staffRouter = Router();
staffRouter.use(requireAuth, requireRole("staff", "admin"));

const param = (req: { params: unknown }, name: string) => String((req.params as Record<string, string>)[name]);
const STATUSES = ["submitted", "in_review", "admitted", "waitlisted", "declined", "withdrawn", "draft"] as const;

staffRouter.get("/applications", async (req, res) => {
  const { status, year, grade, q } = req.query as Record<string, string | undefined>;
  let query = admin
    .from("applications")
    .select("id, status, school_year, grade_applying, applicant_first_name, applicant_last_name, submitted_at, checklist_items(kind, status)")
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .limit(500);
  query = status && (STATUSES as readonly string[]).includes(status) ? query.eq("status", status) : query.neq("status", "draft");
  if (year) query = query.eq("school_year", year);
  if (grade) query = query.eq("grade_applying", grade);
  const term = (q ?? "").replace(/[^\p{L}\p{N} '-]/gu, "").trim().slice(0, 40);
  if (term) query = query.or(`applicant_first_name.ilike.%${term}%,applicant_last_name.ilike.%${term}%`);

  const rows = must(await query);
  res.json({
    applications: rows.map((a) => {
      const items = a.checklist_items as { kind: string; status: string }[];
      return {
        id: a.id, status: a.status, schoolYear: a.school_year, grade: a.grade_applying,
        firstName: a.applicant_first_name, lastName: a.applicant_last_name, submittedAt: a.submitted_at,
        checklist: Object.fromEntries(items.map((c) => [c.kind, c.status])),
      };
    }),
  });
});

staffRouter.get("/applications/:id", async (req, res) => {
  const id = param(req, "id");
  if (!idSchema.safeParse(id).success) return notFound(res);
  const app = mustMaybe(await admin.from("applications").select("*").eq("id", id).maybeSingle());
  if (!app) return notFound(res);

  const [sections, checklist, documents, recs, interviews, notes, signatures, owner, ownerProfile] = await Promise.all([
    admin.from("application_sections").select("section, data, is_complete").eq("application_id", id),
    admin.from("checklist_items").select("kind, status, notes, completed_at").eq("application_id", id),
    admin.from("documents").select("id, kind, original_name, size_bytes, created_at, uploaded_by").eq("application_id", id).order("created_at"),
    admin.from("recommendations").select("kind, recommender_name, recommender_email, requested_at, expires_at, submitted_at, send_count").eq("application_id", id),
    admin.from("interviews").select("id, kind, status, starts_at, ends_at, interview_slots(location)").eq("application_id", id).order("starts_at"),
    admin.from("staff_notes").select("id, body, created_at, author_id").eq("application_id", id).order("created_at", { ascending: false }),
    admin.from("signatures").select("signer_name, signer_email, signed_at, consent_text_version").eq("application_id", id).order("signed_at", { ascending: false }),
    admin.auth.admin.getUserById(app.owner_id),
    admin.from("profiles").select("full_name, phone").eq("id", app.owner_id).maybeSingle(),
  ]);

  const noteRows = must(notes);
  const authorIds = [...new Set(noteRows.map((n) => n.author_id).filter(Boolean))];
  const authors = authorIds.length ? must(await admin.from("profiles").select("id, full_name").in("id", authorIds)) : [];
  const authorName = new Map(authors.map((a) => [a.id, a.full_name]));

  await audit(req, getAuth(res).userId, "staff.view", id);
  res.json({
    application: {
      id: app.id, status: app.status, schoolYear: app.school_year, grade: app.grade_applying,
      firstName: app.applicant_first_name, lastName: app.applicant_last_name, submittedAt: app.submitted_at,
    },
    family: { email: owner.data.user?.email ?? null, name: ownerProfile.data?.full_name ?? null },
    sections: Object.fromEntries(must(sections).map((s) => [s.section, { data: s.data, isComplete: s.is_complete }])),
    checklist: must(checklist).map((c) => ({ kind: c.kind, status: c.status, notes: c.notes, completedAt: c.completed_at })),
    documents: must(documents).map((d) => ({
      id: d.id, kind: d.kind, name: d.original_name, size: d.size_bytes, createdAt: d.created_at, byRecommender: d.uploaded_by === null,
    })),
    recommendations: must(recs).map((r) => ({
      kind: r.kind, name: r.recommender_name, email: r.recommender_email, requestedAt: r.requested_at,
      expiresAt: r.expires_at, submittedAt: r.submitted_at, sendCount: r.send_count,
    })),
    interviews: must(interviews).map((i) => ({
      id: i.id, kind: i.kind, status: i.status, startsAt: i.starts_at, endsAt: i.ends_at,
      location: (i.interview_slots as unknown as { location: string } | null)?.location ?? "",
    })),
    notes: noteRows.map((n) => ({ id: n.id, body: n.body, createdAt: n.created_at, author: authorName.get(n.author_id) ?? "Staff" })),
    signatures: must(signatures).map((s) => ({
      name: s.signer_name, email: s.signer_email, signedAt: s.signed_at, version: s.consent_text_version,
    })),
  });
});

staffRouter.get("/documents/:docId/url", async (req, res) => {
  const docId = param(req, "docId");
  if (!idSchema.safeParse(docId).success) return notFound(res);
  const doc = mustMaybe(
    await admin.from("documents").select("application_id, kind, storage_path, original_name").eq("id", docId).maybeSingle(),
  );
  if (!doc) return notFound(res);
  await audit(req, getAuth(res).userId, "document.view", doc.application_id, { docId, kind: doc.kind });
  res.json({ url: await signedUrl(doc.storage_path, doc.original_name) });
});

const checklistPatch = z.object({
  status: z.enum(CHECKLIST_STATUSES),
  notes: z.string().trim().max(500).optional(),
});

// Tick an item off (or back): test scores received, fee paid or waived, documents verified, …
staffRouter.patch("/applications/:id/checklist/:kind", async (req, res) => {
  const id = param(req, "id");
  const kind = z.enum(CHECKLIST_KINDS).safeParse(param(req, "kind"));
  const body = checklistPatch.safeParse(req.body);
  if (!idSchema.safeParse(id).success || !kind.success) return notFound(res);
  if (!body.success) return badRequest(res);
  if (kind.data === "application_form") return badRequest(res, "The application form is completed by the family.");

  const app = mustMaybe(await admin.from("applications").select("status").eq("id", id).maybeSingle());
  if (!app || app.status === "draft") return notFound(res);
  await setChecklist(id, kind.data, body.data.status, body.data.notes ?? null);
  await audit(req, getAuth(res).userId, "checklist.update", id, { kind: kind.data, status: body.data.status });
  res.json({ ok: true });
});

staffRouter.post("/applications/:id/notes", async (req, res) => {
  const id = param(req, "id");
  const body = z.object({ body: z.string().trim().min(1).max(2000) }).safeParse(req.body);
  if (!idSchema.safeParse(id).success) return notFound(res);
  if (!body.success) return badRequest(res);
  mustMaybe(await admin.from("staff_notes").insert({ application_id: id, author_id: getAuth(res).userId, body: body.data.body }));
  res.status(201).json({ ok: true });
});

// --- Interview availability -------------------------------------------------------

staffRouter.get("/interview-slots", async (_req, res) => {
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const slots = must(
    await admin.from("interview_slots").select("id, kind, starts_at, ends_at, location").gte("starts_at", since).order("starts_at").limit(500),
  );
  const held = slots.length
    ? must(
        await admin
          .from("interviews")
          .select("id, slot_id, application_id, status, applications(applicant_first_name, applicant_last_name)")
          .in("slot_id", slots.map((s) => s.id))
          .in("status", ["scheduled", "completed", "no_show"]),
      )
    : [];
  const bySlot = new Map(held.map((h) => [h.slot_id, h]));
  res.json({
    slots: slots.map((s) => {
      const h = bySlot.get(s.id);
      const a = h?.applications as unknown as { applicant_first_name: string; applicant_last_name: string } | undefined;
      return {
        id: s.id, kind: s.kind, startsAt: s.starts_at, endsAt: s.ends_at, location: s.location,
        booking: h ? { interviewId: h.id, applicationId: h.application_id, status: h.status, student: a ? `${a.applicant_first_name} ${a.applicant_last_name}` : "" } : null,
      };
    }),
  });
});

const slotBody = z.object({
  kind: z.enum(Object.keys(INTERVIEW_KINDS) as [InterviewKind, ...InterviewKind[]]),
  location: z.string().trim().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  minutes: z.number().int().min(10).max(180),
});

// Opens a block of back-to-back slots, e.g. 9:00–12:00 in 30-minute pieces. Times are school time.
staffRouter.post("/interview-slots", async (req, res) => {
  const body = slotBody.safeParse(req.body);
  if (!body.success) return badRequest(res);
  const { kind, location, date, startTime, endTime, minutes } = body.data;

  const start = schoolTimeToUtc(date, startTime).getTime();
  const end = schoolTimeToUtc(date, endTime).getTime();
  if (Number.isNaN(start) || end <= start) return badRequest(res, "The end time must be after the start time.");
  if (start < Date.now()) return badRequest(res, "Slots must be in the future.");

  const rows: { kind: string; location: string; starts_at: string; ends_at: string; created_by: string }[] = [];
  for (let t = start; t + minutes * 60_000 <= end; t += minutes * 60_000) {
    rows.push({ kind, location, starts_at: new Date(t).toISOString(), ends_at: new Date(t + minutes * 60_000).toISOString(), created_by: getAuth(res).userId });
  }
  if (rows.length === 0) return badRequest(res, "That time range is shorter than one slot.");
  if (rows.length > 40) return badRequest(res, "That would create more than 40 slots at once. Please use a shorter range.");

  const created = must(
    await admin.from("interview_slots").upsert(rows, { onConflict: "kind,starts_at,location", ignoreDuplicates: true }).select("id"),
  );
  res.status(201).json({ created: created.length, skipped: rows.length - created.length });
});

staffRouter.delete("/interview-slots/:id", async (req, res) => {
  const id = param(req, "id");
  if (!idSchema.safeParse(id).success) return notFound(res);
  const held = must(await admin.from("interviews").select("id").eq("slot_id", id).eq("status", "scheduled"));
  if (held.length) {
    res.status(409).json({ code: "booked", error: "A family has booked this slot. Cancel the interview first." });
    return;
  }
  const { error } = await admin.from("interview_slots").delete().eq("id", id);
  if (error?.code === "23503") {
    res.status(409).json({ code: "has_history", error: "This slot has interview history and can’t be deleted." });
    return;
  }
  if (error) throw new Error(error.message);
  res.json({ ok: true });
});

// Mark a booked interview as done, a no-show, or cancelled (which frees the slot).
staffRouter.patch("/interviews/:id", async (req, res) => {
  const id = param(req, "id");
  const body = z.object({ status: z.enum(["completed", "no_show", "cancelled"]) }).safeParse(req.body);
  if (!idSchema.safeParse(id).success) return notFound(res);
  if (!body.success) return badRequest(res);

  const interview = mustMaybe(await admin.from("interviews").select("id, application_id, kind, status").eq("id", id).maybeSingle());
  if (!interview || interview.status !== "scheduled") return notFound(res);
  mustMaybe(await admin.from("interviews").update({ status: body.data.status }).eq("id", id));
  await setChecklist(interview.application_id, INTERVIEW_KINDS[interview.kind as InterviewKind], body.data.status === "completed" ? "verified" : "pending");
  await audit(req, getAuth(res).userId, `interview.${body.data.status}`, interview.application_id, { kind: interview.kind });
  res.json({ ok: true });
});

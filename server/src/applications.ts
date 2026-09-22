import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { getAuth, requireAuth } from "./auth.js";
import { admin } from "./supabase.js";
import { audit, badRequest, must, mustMaybe, notFound, ownedApplication } from "./db.js";
import { FAMILY_DOC_KINDS } from "./constants.js";
import { extrasRouter } from "./applicationExtras.js";
import {
  CHECKLIST_KINDS, CONSENT_VERSION, GRADES, SCHOOL_YEARS, STEPS, STEP_IDS,
} from "./form/schema.js";
import { sanitizeStep, validateStep, type Data } from "./form/validate.js";

export const applicationsRouter = Router();
applicationsRouter.use(requireAuth);

const MAX_APPLICATIONS_PER_USER = 10;

const name = z.string().trim().min(1).max(50);
const cohort = z.object({
  schoolYear: z.enum(SCHOOL_YEARS as [string, ...string[]]),
  gradeApplying: z.enum(GRADES as [string, ...string[]]),
});
const createSchema = cohort.extend({ firstName: name, lastName: name });

const bad = (res: Response) => badRequest(res);

async function createApplication(
  req: Request,
  res: Response,
  input: z.infer<typeof createSchema>,
  seed: Record<string, Data> = {},
) {
  const userId = getAuth(res).userId;

  const existing = must(
    await admin
      .from("applications")
      .select("id, applicant_first_name, applicant_last_name, school_year, status")
      .eq("owner_id", userId),
  );
  if (existing.length >= MAX_APPLICATIONS_PER_USER) {
    res.status(400).json({ code: "limit", error: "Application limit reached. Please contact the Admission Office." });
    return null;
  }
  const same = (a: string | null, b: string) => (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();
  if (
    existing.some(
      (a) =>
        a.status !== "withdrawn" && a.school_year === input.schoolYear &&
        same(a.applicant_first_name, input.firstName) && same(a.applicant_last_name, input.lastName),
    )
  ) {
    res.status(409).json({ code: "duplicate", error: "An application for this student and year already exists." });
    return null;
  }

  const app = must(
    await admin
      .from("applications")
      .insert({
        owner_id: userId,
        school_year: input.schoolYear,
        grade_applying: input.gradeApplying,
        applicant_first_name: input.firstName,
        applicant_last_name: input.lastName,
      })
      .select("id")
      .single(),
  );

  try {
    mustMaybe(await admin.from("checklist_items").insert(CHECKLIST_KINDS.map((kind) => ({ application_id: app.id, kind }))));
    const rows = STEP_IDS.filter((s) => s === "applicant" || seed[s]).map((section) => ({
      application_id: app.id,
      section,
      data: section === "applicant" ? { ...(seed.applicant ?? {}), firstName: input.firstName, lastName: input.lastName } : seed[section],
      is_complete: false,
    }));
    mustMaybe(await admin.from("application_sections").insert(rows));
  } catch (err) {
    await admin.from("applications").delete().eq("id", app.id); // don't leave a half-built application
    throw err;
  }

  await audit(req, userId, "application.create", app.id);
  return app.id as string;
}

// Keep the searchable columns in step with what the family typed.
async function syncColumns(appId: string, section: string, data: Data) {
  const patch: Record<string, unknown> = {};
  if (section === "applicant") {
    if (typeof data.firstName === "string") patch.applicant_first_name = data.firstName;
    if (typeof data.lastName === "string") patch.applicant_last_name = data.lastName;
    patch.applicant_dob = typeof data.dob === "string" ? data.dob : null;
    patch.is_international = data.usCitizen === "no" ? true : data.usCitizen === "yes" ? false : null;
  } else if (section === "interests") {
    patch.sports = Array.isArray(data.sports) ? data.sports : [];
  }
  if (Object.keys(patch).length) mustMaybe(await admin.from("applications").update(patch).eq("id", appId));
}

// --- Routes -----------------------------------------------------------------

// The form definition (steps, fields, options) the browser renders.
applicationsRouter.get("/form", (_req, res) => {
  res.json({ steps: STEPS, schoolYears: SCHOOL_YEARS, grades: GRADES });
});

// "My Students": one row per application with progress.
applicationsRouter.get("/", async (_req, res) => {
  const rows = must(
    await admin
      .from("applications")
      .select(
        "id, status, school_year, grade_applying, applicant_first_name, applicant_last_name, submitted_at, created_at, application_sections(section, is_complete), checklist_items(kind, status)",
      )
      .eq("owner_id", getAuth(res).userId)
      .order("created_at", { ascending: false }),
  );
  res.json({
    applications: rows.map((a) => ({
      id: a.id,
      status: a.status,
      schoolYear: a.school_year,
      grade: a.grade_applying,
      firstName: a.applicant_first_name,
      lastName: a.applicant_last_name,
      submittedAt: a.submitted_at,
      stepsComplete: a.application_sections.filter((s) => s.is_complete).length,
      stepsTotal: STEP_IDS.length,
      itemsLeft: a.checklist_items.filter((c) => c.kind !== "application_form" && c.status === "pending").length,
    })),
  });
});

// Create a new student's application.
applicationsRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return bad(res);
  const id = await createApplication(req, res, parsed.data);
  if (id) res.status(201).json({ id });
});

// Apply for a new year with a previously entered student: copies the answers, marks every
// step for review, and leaves the questionnaire and signature blank.
applicationsRouter.post("/:id/renew", async (req, res) => {
  const source = await ownedApplication(req.params.id, res);
  if (!source) return notFound(res);
  const parsed = cohort.safeParse(req.body);
  if (!parsed.success) return bad(res);

  const sections = must(
    await admin.from("application_sections").select("section, data").eq("application_id", source.id),
  );
  const seed: Record<string, Data> = {};
  for (const s of sections) if (s.section !== "questionnaire") seed[s.section] = s.data as Data;

  const id = await createApplication(
    req, res,
    { ...parsed.data, firstName: source.applicant_first_name ?? "", lastName: source.applicant_last_name ?? "" },
    seed,
  );
  if (id) res.status(201).json({ id });
});

applicationsRouter.get("/:id", async (req, res) => {
  const app = await ownedApplication(req.params.id, res);
  if (!app) return notFound(res);

  const [sections, checklist, documents, recs, interviews] = await Promise.all([
    admin.from("application_sections").select("section, data, is_complete").eq("application_id", app.id),
    admin.from("checklist_items").select("kind, status, completed_at").eq("application_id", app.id),
    // Families only ever see the files they uploaded themselves — never recommendation letters.
    admin
      .from("documents")
      .select("id, kind, original_name, size_bytes, created_at")
      .eq("application_id", app.id)
      .in("kind", [...FAMILY_DOC_KINDS])
      .order("created_at"),
    admin
      .from("recommendations")
      .select("kind, recommender_name, recommender_email, requested_at, expires_at, submitted_at, send_count")
      .eq("application_id", app.id),
    admin
      .from("interviews")
      .select("id, kind, status, starts_at, ends_at, interview_slots(location)")
      .eq("application_id", app.id)
      .in("status", ["scheduled", "completed", "no_show"])
      .order("starts_at"),
  ]);
  res.json({
    application: {
      id: app.id, status: app.status, schoolYear: app.school_year, grade: app.grade_applying,
      firstName: app.applicant_first_name, lastName: app.applicant_last_name, submittedAt: app.submitted_at,
    },
    sections: Object.fromEntries(
      must(sections).map((s) => [s.section, { data: s.data, isComplete: s.is_complete }]),
    ),
    checklist: must(checklist).map((c) => ({ kind: c.kind, status: c.status, completedAt: c.completed_at })),
    documents: must(documents).map((d) => ({
      id: d.id, kind: d.kind, name: d.original_name, size: d.size_bytes, createdAt: d.created_at,
    })),
    recommendations: must(recs).map((r) => ({
      kind: r.kind, name: r.recommender_name, email: r.recommender_email, requestedAt: r.requested_at,
      expiresAt: r.expires_at, submittedAt: r.submitted_at, sendCount: r.send_count,
    })),
    interviews: must(interviews).map((i) => ({
      id: i.id, kind: i.kind, status: i.status, startsAt: i.starts_at, endsAt: i.ends_at,
      location: (i.interview_slots as unknown as { location: string } | null)?.location ?? "",
    })),
  });
});

// Autosave (complete: false) or finish a step (complete: true). Answers are always saved;
// asking to complete a step with unanswered required questions returns 422 with the field errors.
applicationsRouter.put("/:id/sections/:section", async (req, res) => {
  const app = await ownedApplication(req.params.id, res);
  if (!app) return notFound(res);
  if (app.status !== "draft") {
    res.status(409).json({ code: "locked", error: "This application has been submitted." });
    return;
  }
  const step = STEPS.find((s) => s.id === req.params.section);
  if (!step) return notFound(res);

  const data = sanitizeStep(step, req.body?.data);
  // Completion always reflects whether the saved answers are actually valid, so autosaving or
  // stepping away never un-completes a finished step.
  const errors = validateStep(step, data);
  const isComplete = Object.keys(errors).length === 0;

  mustMaybe(
    await admin
      .from("application_sections")
      .upsert({ application_id: app.id, section: step.id, data, is_complete: isComplete }, { onConflict: "application_id,section" }),
  );
  await syncColumns(app.id, step.id, data);

  if (req.body?.complete === true && !isComplete) {
    res.status(422).json({ code: "incomplete", error: "Please complete the highlighted questions.", errors });
    return;
  }
  res.json({ ok: true, isComplete });
});

// Submit: re-validates every step on the server, records the e-signature, locks the application.
applicationsRouter.post("/:id/submit", async (req, res) => {
  const app = await ownedApplication(req.params.id, res);
  if (!app) return notFound(res);
  if (app.status !== "draft") {
    res.status(409).json({ code: "locked", error: "This application has already been submitted." });
    return;
  }

  const rows = must(await admin.from("application_sections").select("section, data").eq("application_id", app.id));
  const byId = new Map(rows.map((r) => [r.section, r.data as Data]));
  const incomplete = STEPS.filter((s) => Object.keys(validateStep(s, sanitizeStep(s, byId.get(s.id)))).length > 0).map((s) => s.id);
  if (incomplete.length) {
    res.status(422).json({ code: "incomplete_steps", error: "Some steps still need answers.", steps: incomplete });
    return;
  }

  // Guarded update: only one request can flip draft -> submitted (prevents double submits).
  const locked = must(
    await admin
      .from("applications")
      .update({ status: "submitted", submitted_at: new Date().toISOString() })
      .eq("id", app.id).eq("owner_id", getAuth(res).userId).eq("status", "draft")
      .select("id"),
  );
  if (locked.length === 0) {
    res.status(409).json({ code: "locked", error: "This application has already been submitted." });
    return;
  }

  const q = byId.get("questionnaire") ?? {};
  const { userId, email } = getAuth(res);
  mustMaybe(
    await admin.from("signatures").insert({
      application_id: app.id,
      signer_user_id: userId,
      signer_name: String(q.signatureName ?? ""),
      signer_email: email,
      consent_text_version: CONSENT_VERSION,
      ip: req.ip ?? null,
      user_agent: (req.get("user-agent") ?? "").slice(0, 300),
    }),
  );
  mustMaybe(
    await admin
      .from("checklist_items")
      .update({ status: "submitted", completed_at: new Date().toISOString() })
      .eq("application_id", app.id).eq("kind", "application_form"),
  );
  await audit(req, userId, "application.submit", app.id);
  res.json({ ok: true });
});

// Documents, recommendation requests and interview booking for one application.
applicationsRouter.use("/:id", extrasRouter);

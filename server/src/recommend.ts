import { Router, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { createHash } from "node:crypto";
import { admin } from "./supabase.js";
import { audit, mustMaybe, setChecklist } from "./db.js";
import { REC_KINDS, REC_LABELS, type RecKind } from "./constants.js";
import { cleanFileName, detectFile, removeFile, storeFile } from "./storage.js";
import { upload } from "./uploads.js";
import { emailParentRecommendationReceived, emailRecommenderThanks } from "./notices.js";

// Public, no login: a recommender reaches this only through the single link emailed to them.
// The link carries 256 random bits; only its SHA-256 hash is stored, so a database leak can't
// reveal working links. The page exposes just the student's name, grade and year.
export const recommendRouter = Router();

recommendRouter.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: false, legacyHeaders: false,
    message: { code: "rate_limited", error: "Too many attempts. Please wait and try again." },
  }),
  (_req: Request, res: Response, next: NextFunction) => {
    res.set("Cache-Control", "no-store");
    next();
  },
);

async function lookup(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const hash = createHash("sha256").update(token).digest("hex");
  const rec = mustMaybe(
    await admin
      .from("recommendations")
      .select("id, application_id, kind, recommender_name, recommender_email, expires_at, submitted_at, applications(applicant_first_name, applicant_last_name, grade_applying, school_year, owner_id)")
      .eq("token_hash", hash)
      .maybeSingle(),
  );
  if (!rec) return null;
  const app = rec.applications as unknown as {
    applicant_first_name: string; applicant_last_name: string; grade_applying: string; school_year: string; owner_id: string;
  };
  return { rec, app, kind: rec.kind as RecKind };
}

const gone = (res: Response, expired: boolean) =>
  expired
    ? res.status(410).json({ code: "expired", error: "This link has expired. Please ask the family to send a new one." })
    : res.status(404).json({ code: "not_found", error: "This link isn’t valid." });

recommendRouter.get("/:token", async (req, res) => {
  const found = await lookup(String(req.params.token));
  if (!found) return gone(res, false);
  const { rec, app, kind } = found;
  const submitted = !!rec.submitted_at;
  if (!submitted && new Date(rec.expires_at) < new Date()) return gone(res, true);
  res.json({
    studentName: `${app.applicant_first_name} ${app.applicant_last_name}`.trim(),
    grade: app.grade_applying,
    schoolYear: app.school_year,
    recommenderName: rec.recommender_name,
    role: REC_LABELS[kind],
    submitted,
  });
});

recommendRouter.post("/:token", upload.single("file"), async (req, res) => {
  const found = await lookup(String(req.params.token));
  if (!found) return gone(res, false);
  const { rec, app, kind } = found;
  if (rec.submitted_at) {
    res.status(409).json({ code: "already_received", error: "Your recommendation has already been received. Thank you!" });
    return;
  }
  if (new Date(rec.expires_at) < new Date()) return gone(res, true);
  if (!req.file) {
    res.status(400).json({ code: "no_file", error: "Please choose a file." });
    return;
  }
  const type = detectFile(req.file.buffer);
  if (!type) {
    res.status(415).json({ code: "bad_file_type", error: "Please upload a PDF, JPG or PNG file." });
    return;
  }

  const docKind = REC_KINDS[kind];
  const path = await storeFile(rec.application_id, docKind, req.file.buffer, type);

  // Claim the submission first: only one request can flip submitted_at from null, so the same
  // link can't be used twice even if two uploads arrive together.
  const claimed = mustMaybe(
    await admin.from("recommendations").update({ submitted_at: new Date().toISOString() }).eq("id", rec.id).is("submitted_at", null).select("id"),
  );
  if (!claimed || claimed.length === 0) {
    await removeFile(path);
    res.status(409).json({ code: "already_received", error: "Your recommendation has already been received. Thank you!" });
    return;
  }
  const { error } = await admin.from("documents").insert({
    application_id: rec.application_id, kind: docKind, storage_path: path,
    original_name: cleanFileName(req.file.originalname), mime_type: type.mime, size_bytes: req.file.size, uploaded_by: null,
  });
  if (error) {
    await admin.from("recommendations").update({ submitted_at: null }).eq("id", rec.id); // let them retry
    await removeFile(path);
    throw new Error(error.message);
  }
  await setChecklist(rec.application_id, docKind, "submitted");
  await audit(req, null, "recommendation.received", rec.application_id, { kind });

  // Confirmations are best-effort: the upload is already safely recorded.
  const info = { studentName: `${app.applicant_first_name} ${app.applicant_last_name}`.trim(), grade: app.grade_applying, schoolYear: app.school_year };
  try {
    await emailRecommenderThanks(rec.recommender_email, { ...info, recommenderName: rec.recommender_name });
    const [{ data: owner }, { data: profile }] = await Promise.all([
      admin.auth.admin.getUserById(app.owner_id),
      admin.from("profiles").select("locale").eq("id", app.owner_id).maybeSingle(),
    ]);
    if (owner.user?.email) {
      await emailParentRecommendationReceived(owner.user.email, profile?.locale === "zh" ? "zh" : "en", {
        ...info, recommenderName: rec.recommender_name, kind,
      });
    }
  } catch (err) {
    console.error("recommendation confirmation email failed:", err instanceof Error ? err.message : err);
  }
  res.json({ ok: true });
});

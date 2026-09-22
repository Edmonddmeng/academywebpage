// Shared names for the checklist, documents, recommendations and interviews.

/** Documents a family uploads themselves. */
export const FAMILY_DOC_KINDS = ["birth_certificate", "report_card"] as const;
export const MAX_FILES_PER_KIND = 5;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** URL/API name of a recommender role → its checklist item. */
export const REC_KINDS = {
  principal_counselor: "rec_principal",
  math_teacher: "rec_math",
  english_teacher: "rec_english",
} as const;
export type RecKind = keyof typeof REC_KINDS;
export const REC_LABELS: Record<RecKind, string> = {
  principal_counselor: "current principal or counselor",
  math_teacher: "current math teacher",
  english_teacher: "current English teacher",
};
export const REC_LINK_DAYS = 30;
export const MAX_REC_SENDS = 5;

export const INTERVIEW_KINDS = { athletic: "athletic_interview", admissions: "admissions_interview" } as const;
export type InterviewKind = keyof typeof INTERVIEW_KINDS;
/** Families can book, and cancel, only this far ahead of the start time. */
export const INTERVIEW_LEAD_MS = 24 * 60 * 60 * 1000;
export const BOOKING_WINDOW_DAYS = 90;

export const CHECKLIST_STATUSES = ["pending", "submitted", "verified", "waived"] as const;

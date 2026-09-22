import type { Request, Response } from "express";
import { z } from "zod";
import { getAuth } from "./auth.js";
import { admin } from "./supabase.js";

// Supabase calls return { error } instead of throwing; turn that into an exception so the
// central handler logs it and replies 500 without leaking details.
export function must<T>(result: { data: T; error: { message: string } | null }): NonNullable<T> {
  if (result.error) throw new Error(result.error.message);
  if (result.data === null || result.data === undefined) throw new Error("Unexpected empty result");
  return result.data;
}
/** Like must(), but an empty result is fine (e.g. a lookup that may find nothing, or a write with no rows back). */
export function mustMaybe<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export const idSchema = z.uuid();
export const notFound = (res: Response) => res.status(404).json({ code: "not_found", error: "Not found." });
export const badRequest = (res: Response, error = "Please check your details and try again.", code = "validation") =>
  res.status(400).json({ code, error });

export async function audit(
  req: Request, actorId: string | null, action: string, applicationId: string, metadata: Record<string, unknown> = {},
) {
  await admin.from("audit_log").insert({
    actor_id: actorId, action, entity: "application", entity_id: applicationId, metadata, ip: req.ip ?? null,
  });
}

/** Loads an application only if it belongs to the signed-in user. */
export async function ownedApplication(id: string, res: Response) {
  if (!idSchema.safeParse(id).success) return null;
  return mustMaybe(
    await admin.from("applications").select("*").eq("id", id).eq("owner_id", getAuth(res).userId).maybeSingle(),
  );
}

export async function getChecklistStatus(appId: string, kind: string): Promise<string | null> {
  const row = mustMaybe(
    await admin.from("checklist_items").select("status").eq("application_id", appId).eq("kind", kind).maybeSingle(),
  );
  return row?.status ?? null;
}

export async function setChecklist(appId: string, kind: string, status: string, notes?: string | null) {
  const patch: Record<string, unknown> = {
    status,
    completed_at: status === "pending" ? null : new Date().toISOString(),
  };
  if (notes !== undefined) patch.notes = notes;
  mustMaybe(await admin.from("checklist_items").update(patch).eq("application_id", appId).eq("kind", kind));
}

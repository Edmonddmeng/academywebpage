import { randomUUID } from "node:crypto";
import { admin } from "./supabase.js";

const BUCKET = "application-documents";

export type Detected = { mime: string; ext: string };

/** Identify the file by its first bytes, never by its name or the browser's claim. PDF, JPEG or PNG only. */
export function detectFile(buf: Buffer): Detected | null {
  if (buf.length > 5 && buf.subarray(0, 5).toString("latin1") === "%PDF-") return { mime: "application/pdf", ext: "pdf" };
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (
    buf.length > 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) return { mime: "image/png", ext: "png" };
  return null;
}

/** Display-only name: strips paths and control characters. It is never used as a storage path. */
export function cleanFileName(name: string): string {
  // multer reads names as latin1; recover UTF-8 (e.g. Chinese file names).
  const decoded = Buffer.from(name, "latin1").toString("utf8");
  const base = decoded.split(/[\\/]/).pop() ?? "file";
  // eslint-disable-next-line no-control-regex
  return base.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 120) || "file";
}

/** Stores the bytes under a random name inside the application's folder and returns the storage path. */
export async function storeFile(applicationId: string, kind: string, buf: Buffer, type: Detected): Promise<string> {
  const path = `${applicationId}/${kind}/${randomUUID()}.${type.ext}`;
  const { error } = await admin.storage.from(BUCKET).upload(path, buf, { contentType: type.mime, upsert: false });
  if (error) throw new Error(`storage upload failed: ${error.message}`);
  return path;
}

export async function removeFile(path: string) {
  await admin.storage.from(BUCKET).remove([path]);
}

/** A short-lived link to a private file. */
export async function signedUrl(path: string, downloadName?: string, seconds = 60): Promise<string> {
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(path, seconds, downloadName ? { download: downloadName } : undefined);
  if (error || !data) throw new Error(`signed url failed: ${error?.message}`);
  return data.signedUrl;
}

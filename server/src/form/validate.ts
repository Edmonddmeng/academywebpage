import type { Field, ShowIf, Step } from "./schema.js";

export type Data = Record<string, unknown>;
export type Errors = Record<string, "required" | "invalid">;

const TEXT_MAX = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isObject = (v: unknown): v is Data => typeof v === "object" && v !== null && !Array.isArray(v);

function visible(field: Field, scope: Data): boolean {
  const c: ShowIf | undefined = field.showIf;
  if (!c) return true;
  const v = scope[c.field];
  const flat = Array.isArray(v) ? v : [v];
  if (c.equals !== undefined) return flat.includes(c.equals);
  if (c.in) return flat.some((x) => typeof x === "string" && c.in!.includes(x));
  return true;
}

function validDate(s: string): boolean {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

/** Coerce one incoming value to the field's type, or undefined if it is empty/unusable. */
function cleanValue(field: Field, raw: unknown): unknown {
  switch (field.type) {
    case "text": case "textarea": case "email": case "tel": {
      if (typeof raw !== "string") return undefined;
      const s = raw.trim().slice(0, field.max ?? (field.type === "textarea" ? 4000 : TEXT_MAX));
      return s || undefined;
    }
    case "date":
      return typeof raw === "string" && validDate(raw.trim()) ? raw.trim() : undefined;
    case "number": {
      const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
      return Number.isFinite(n) && n >= 0 && n <= 100 ? n : undefined;
    }
    case "select":
      return typeof raw === "string" && field.options?.some((o) => o.value === raw) ? raw : undefined;
    case "yesno":
      return raw === "yes" || raw === "no" ? raw : undefined;
    case "checkboxes": {
      if (!Array.isArray(raw)) return undefined;
      const allowed = new Set(field.options?.map((o) => o.value));
      const picked = [...new Set(raw.filter((x): x is string => typeof x === "string" && allowed.has(x)))];
      return picked.length ? picked : undefined;
    }
    case "checkbox":
      return raw === true ? true : undefined;
    default:
      return undefined;
  }
}

/** Keep only known, visible fields, coerced to their types. Never trust the client's shape. */
export function sanitize(fields: Field[], input: unknown): Data {
  const src = isObject(input) ? input : {};
  const out: Data = {};
  for (const field of fields) {
    if (field.type === "note" || !visible(field, src)) continue;
    if (field.type === "group") {
      const inner = sanitize(field.fields ?? [], src[field.id]);
      if (Object.keys(inner).length) out[field.id] = inner;
    } else if (field.type === "repeat") {
      const list = Array.isArray(src[field.id]) ? (src[field.id] as unknown[]).slice(0, field.max ?? 6) : [];
      const items = list.map((item) => sanitize(field.fields ?? [], item)).filter((i) => Object.keys(i).length);
      if (items.length) out[field.id] = items;
    } else {
      const v = cleanValue(field, src[field.id]);
      if (v !== undefined) out[field.id] = v;
    }
  }
  return out;
}

/** Required / format checks on already-sanitized data. Keys are dotted paths, e.g. "parent1.email". */
export function validate(fields: Field[], data: Data, prefix = ""): Errors {
  const errors: Errors = {};
  for (const field of fields) {
    if (field.type === "note" || !visible(field, data)) continue;
    const path = prefix + field.id;
    const value = data[field.id];

    if (field.type === "group") {
      Object.assign(errors, validate(field.fields ?? [], isObject(value) ? value : {}, `${path}.`));
    } else if (field.type === "repeat") {
      const items = Array.isArray(value) ? value : [];
      if (field.required && items.length === 0) errors[path] = "required";
      items.forEach((item, i) => Object.assign(errors, validate(field.fields ?? [], isObject(item) ? item : {}, `${path}.${i}.`)));
    } else if (value === undefined) {
      if (field.required) errors[path] = "required";
    } else if (field.type === "email" && !EMAIL_RE.test(String(value))) {
      errors[path] = "invalid";
    }
  }
  return errors;
}

export function sanitizeStep(step: Step, input: unknown): Data {
  return sanitize(step.fields, input);
}
export function validateStep(step: Step, data: Data): Errors {
  return validate(step.fields, data);
}

import { Router, type NextFunction, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { z } from "zod";
import type { Session } from "@supabase/supabase-js";
import { isProd } from "./env.js";
import { admin, anonClient } from "./supabase.js";
import { sendAuthEmail, type EmailKind, type Locale } from "./email.js";

// Sessions live in httpOnly cookies set by this server, never in JS-readable storage,
// so an XSS bug cannot steal them. `path: /api` keeps them off page requests.
const ACCESS = "sb-access";
const REFRESH = "sb-refresh";
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const cookieBase = { httpOnly: true, secure: isProd, sameSite: "lax", path: "/api" } as const;

function setSession(res: Response, session: Session) {
  res.cookie(ACCESS, session.access_token, { ...cookieBase, maxAge: session.expires_in * 1000 });
  res.cookie(REFRESH, session.refresh_token, { ...cookieBase, maxAge: REFRESH_MAX_AGE_MS });
}

function clearSession(res: Response) {
  res.clearCookie(ACCESS, cookieBase);
  res.clearCookie(REFRESH, cookieBase);
}

export type Role = "guardian" | "staff" | "admin";
export type AuthContext = { userId: string; email: string; role: Role; fullName: string | null };

export const getAuth = (res: Response) => res.locals.auth as AuthContext;

/** Requires a signed-in, email-verified user. Transparently refreshes an expired access token. */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const access: string | undefined = req.cookies?.[ACCESS];
  const refresh: string | undefined = req.cookies?.[REFRESH];

  let user = access ? (await admin.auth.getUser(access)).data.user : null;

  if (!user && refresh) {
    const { data } = await anonClient().auth.refreshSession({ refresh_token: refresh });
    if (data.session && data.user) {
      setSession(res, data.session);
      user = data.user;
    }
  }

  if (!user) {
    clearSession(res);
    res.status(401).json({ code: "unauthenticated", error: "Please sign in." });
    return;
  }
  if (!user.email_confirmed_at) {
    res.status(403).json({ code: "email_not_confirmed", error: "Please verify your email." });
    return;
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  res.locals.auth = {
    userId: user.id,
    email: user.email ?? "",
    role: (profile?.role as Role) ?? "guardian",
    fullName: profile?.full_name ?? null,
  } satisfies AuthContext;
  next();
}

/** Use after requireAuth. Role comes from the profiles table, which users cannot edit. */
export const requireRole =
  (...roles: Role[]) =>
  (_req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(getAuth(res).role)) {
      res.status(403).json({ code: "forbidden", error: "You don't have access to this." });
      return;
    }
    next();
  };

// --- Validation -------------------------------------------------------------

const email = z.string().trim().toLowerCase().pipe(z.email().max(254));
// Length beats composition rules. Supabase additionally enforces its own minimum.
const password = z.string().min(12).max(128);
const code = z.string().trim().regex(/^\d{6,10}$/);

const locale = z.enum(["en", "zh"]).default("en");

const signupSchema = z.object({
  email,
  password,
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  locale,
});
const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
const verifySchema = z.object({ email, code });
const emailOnlySchema = z.object({ email, locale });
const resetSchema = z.object({ email, code, password });

function parse<T extends z.ZodType>(schema: T, req: Request, res: Response): z.infer<T> | null {
  const result = schema.safeParse(req.body);
  if (result.success) return result.data;
  res.status(400).json({
    code: "validation",
    error: "Please check your details and try again.",
    fields: Object.keys(z.flattenError(result.error).fieldErrors),
  });
  return null;
}

// --- Routes -----------------------------------------------------------------

// Tight per-IP limit on everything that can be used to guess passwords or codes,
// or to trigger emails. (Supabase applies its own limits on top of this.)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { code: "rate_limited", error: "Too many attempts. Please wait and try again." },
});

// Stops one person's inbox being flooded with codes: 5 code emails per address per 15 min.
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) =>
    typeof req.body?.email === "string"
      ? `email:${req.body.email.trim().toLowerCase()}`
      : ipKeyGenerator(req.ip ?? ""),
  message: { code: "rate_limited", error: "Too many attempts. Please wait and try again." },
});

/** Sends a code email; a delivery failure is reported to the caller rather than hidden. */
async function sendOrFail(res: Response, to: string, kind: EmailKind, lang: Locale, code?: string) {
  try {
    await sendAuthEmail(to, kind, lang, code);
    return true;
  } catch (err) {
    console.error("email send failed:", err instanceof Error ? err.message : err);
    res.status(502).json({ code: "email_failed", error: "We couldn't send the email. Please try again." });
    return false;
  }
}

export const authRouter = Router();

// Same response whether or not the email is already registered (no account enumeration).
// Supabase only creates the user and hands us a one-time code; we email it ourselves.
authRouter.post("/signup", authLimiter, emailLimiter, async (req, res) => {
  const body = parse(signupSchema, req, res);
  if (!body) return;

  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email: body.email,
    password: body.password,
    options: { data: { full_name: `${body.firstName} ${body.lastName}`, locale: body.locale } },
  });

  if (error) {
    if (error.code === "weak_password") {
      res.status(400).json({ code: "weak_password", error: "Please choose a stronger password." });
      return;
    }
    if (error.code === "email_exists") {
      // Tell the real owner by email instead of revealing it on screen.
      if (await sendOrFail(res, body.email, "exists", body.locale)) res.json({ ok: true });
      return;
    }
    console.error("signup failed:", error.code ?? error.status);
    res.status(400).json({ code: "signup_failed", error: "We couldn't create that account." });
    return;
  }

  if (await sendOrFail(res, body.email, "verify", body.locale, data.properties.email_otp)) {
    res.json({ ok: true });
  }
});

// Confirms the emailed code, then signs the user in via cookies.
authRouter.post("/verify", authLimiter, async (req, res) => {
  const body = parse(verifySchema, req, res);
  if (!body) return;

  // A first-time signup code verifies as "email"; a re-sent code is a "recovery" code.
  const anon = anonClient();
  let { data, error } = await anon.auth.verifyOtp({ email: body.email, token: body.code, type: "email" });
  if (error || !data.session) {
    ({ data, error } = await anon.auth.verifyOtp({ email: body.email, token: body.code, type: "recovery" }));
  }
  if (error || !data.session || !data.user) {
    res.status(400).json({ code: "invalid_code", error: "That code is invalid or has expired." });
    return;
  }

  const name = data.user.user_metadata?.full_name;
  if (typeof name === "string" && name.trim()) {
    await admin
      .from("profiles")
      .update({ full_name: name.trim().slice(0, 100) })
      .eq("id", data.user.id)
      .is("full_name", null);
  }
  // Remember the language they signed up in, so later emails (e.g. "recommendation received") match it.
  if (data.user.user_metadata?.locale === "zh") {
    await admin.from("profiles").update({ locale: "zh" }).eq("id", data.user.id);
  }

  setSession(res, data.session);
  res.json({ ok: true });
});

// Re-sends a code. Uses a recovery code because Supabase returns "not found" for unknown
// emails (a magic-link request would silently create an account). It also confirms an
// unverified email and leaves the password untouched. Same response either way.
authRouter.post("/resend", authLimiter, emailLimiter, async (req, res) => {
  const body = parse(emailOnlySchema, req, res);
  if (!body) return;
  const { data } = await admin.auth.admin.generateLink({ type: "recovery", email: body.email });
  if (data?.properties?.email_otp) {
    if (!(await sendOrFail(res, body.email, "verify", body.locale, data.properties.email_otp))) return;
  }
  res.json({ ok: true });
});

authRouter.post("/login", authLimiter, async (req, res) => {
  const body = parse(loginSchema, req, res);
  if (!body) return;

  const { data, error } = await anonClient().auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error || !data.session) {
    if (error?.code === "email_not_confirmed") {
      res.status(403).json({ code: "email_not_confirmed", error: "Please verify your email." });
      return;
    }
    res.status(401).json({ code: "invalid_credentials", error: "Incorrect email or password." });
    return;
  }
  setSession(res, data.session);
  res.json({ ok: true });
});

authRouter.post("/logout", async (req, res) => {
  const access: string | undefined = req.cookies?.[ACCESS];
  if (access) {
    try {
      await admin.auth.admin.signOut(access, "local");
    } catch {
      // cookies are cleared regardless
    }
  }
  clearSession(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (_req, res) => {
  const { userId, email, role, fullName } = getAuth(res);
  res.json({ user: { id: userId, email, role, fullName } });
});

// Sends a recovery code. Always the same response (no account enumeration).
authRouter.post("/forgot", authLimiter, emailLimiter, async (req, res) => {
  const body = parse(emailOnlySchema, req, res);
  if (!body) return;
  const { data } = await admin.auth.admin.generateLink({ type: "recovery", email: body.email });
  if (data?.properties?.email_otp) {
    if (!(await sendOrFail(res, body.email, "reset", body.locale, data.properties.email_otp))) return;
  }
  res.json({ ok: true });
});

// Confirms the recovery code and sets the new password in a single step.
authRouter.post("/reset-password", authLimiter, async (req, res) => {
  const body = parse(resetSchema, req, res);
  if (!body) return;

  const { data, error } = await anonClient().auth.verifyOtp({
    email: body.email,
    token: body.code,
    type: "recovery",
  });
  if (error || !data.session || !data.user) {
    res.status(400).json({ code: "invalid_code", error: "That code is invalid or has expired." });
    return;
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(data.user.id, {
    password: body.password,
  });
  if (updateError) {
    res.status(400).json({ code: "weak_password", error: "Please choose a stronger password." });
    return;
  }

  setSession(res, data.session);
  res.json({ ok: true });
});

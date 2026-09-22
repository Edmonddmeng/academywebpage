import { z } from "zod";

// Node loads server/.env when present; in production the host injects real env vars.
try {
  process.loadEnvFile();
} catch {
  // no .env file — rely on the process environment
}

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3001),
  CLIENT_ORIGIN: z.url(),
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("onboarding@resend.dev"),
  // Development only: print emails (and their links) instead of sending them.
  EMAIL_DRY_RUN: z.enum(["true", "false"]).default("false"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
  console.error(`Invalid or missing environment variables: ${missing}. See server/.env.example.`);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";

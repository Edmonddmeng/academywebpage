import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const options = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};

// Service-role client: bypasses RLS. Server-only. All data access goes through this.
export const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, options);

// Anon client for user-facing auth calls (sign-up, sign-in, verify). Stateless, and a
// fresh one per call so one visitor's session can never leak into another's request.
export const anonClient = () => createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, options);

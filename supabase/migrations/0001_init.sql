-- 0001_init.sql — applicant portal foundation.
--
-- Security model: the browser never talks to these tables. Every table has RLS
-- enabled with NO policies for anon/authenticated, and table privileges are also
-- revoked from those roles. Only the Express server (service_role key) reads or
-- writes data, and it enforces ownership and staff roles itself.
--
-- Run once in the Supabase dashboard: SQL Editor → paste → Run.

-- ---------------------------------------------------------------------------
-- Lock-down defaults: nothing new in `public` is reachable by browser roles.
-- ---------------------------------------------------------------------------
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user. `role` is the source of truth for staff access
-- and is only ever changed by an admin through the server (never user-editable).
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'guardian' check (role in ('guardian', 'staff', 'admin')),
  full_name   text,
  phone       text,
  locale      text not null default 'en' check (locale in ('en', 'zh')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a guardian profile automatically whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- applications: one per applicant. Columns that staff filter on are real columns;
-- the long-form intake answers live in application_sections.
-- ---------------------------------------------------------------------------
create type public.application_status as enum (
  'draft', 'submitted', 'in_review', 'admitted', 'waitlisted', 'declined', 'withdrawn'
);

create table public.applications (
  id                    uuid primary key default gen_random_uuid(),
  owner_id              uuid not null references auth.users (id) on delete restrict,
  status                public.application_status not null default 'draft',
  school_year           text not null,           -- e.g. '2026-2027'
  grade_applying        text not null,           -- e.g. '7'
  applicant_first_name  text,
  applicant_last_name   text,
  applicant_dob         date,
  sports                text[] not null default '{}',
  is_international      boolean,
  submitted_at          timestamptz,
  decided_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index applications_owner_idx  on public.applications (owner_id);
create index applications_status_idx on public.applications (status);
create index applications_cohort_idx on public.applications (school_year, grade_applying);
create trigger applications_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

-- Intake sections: applicant, education, interests, international, household,
-- family, questionnaire. Shape is validated by the server (Zod) before it is stored.
create table public.application_sections (
  application_id  uuid not null references public.applications (id) on delete cascade,
  section         text not null,
  data            jsonb not null default '{}'::jsonb,
  is_complete     boolean not null default false,
  updated_at      timestamptz not null default now(),
  primary key (application_id, section)
);
create trigger application_sections_updated_at before update on public.application_sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Checklist: what the school still needs from the family, item by item.
-- ---------------------------------------------------------------------------
create table public.checklist_items (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.applications (id) on delete cascade,
  kind            text not null check (kind in (
    'application_form', 'application_fee', 'birth_certificate', 'student_interview',
    'test_scores', 'rec_principal', 'rec_math', 'rec_english', 'report_card'
  )),
  status          text not null default 'pending'
                  check (status in ('pending', 'submitted', 'verified', 'waived')),
  completed_at    timestamptz,
  notes           text,
  updated_at      timestamptz not null default now(),
  unique (application_id, kind)
);
create trigger checklist_items_updated_at before update on public.checklist_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Uploaded documents (files live in the private storage bucket below).
-- ---------------------------------------------------------------------------
create table public.documents (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.applications (id) on delete cascade,
  kind            text not null,                 -- matches a checklist kind, e.g. 'birth_certificate'
  storage_path    text not null unique,
  original_name   text not null,
  mime_type       text not null,
  size_bytes      bigint not null check (size_bytes > 0),
  uploaded_by     uuid references auth.users (id) on delete set null,
  verified_at     timestamptz,
  verified_by     uuid references auth.users (id) on delete set null,
  created_at      timestamptz not null default now()
);
create index documents_application_idx on public.documents (application_id);

-- ---------------------------------------------------------------------------
-- Recommendations: requested from teachers/counselors who have no account.
-- They reach a form through a single-use link; only a hash of the token is stored.
-- ---------------------------------------------------------------------------
create table public.recommendations (
  id                 uuid primary key default gen_random_uuid(),
  application_id     uuid not null references public.applications (id) on delete cascade,
  kind               text not null check (kind in ('principal_counselor', 'math_teacher', 'english_teacher')),
  recommender_name   text not null,
  recommender_email  text not null,
  token_hash         text not null unique,
  requested_at       timestamptz not null default now(),
  expires_at         timestamptz not null,
  submitted_at       timestamptz,
  response           jsonb,
  unique (application_id, kind)
);

-- ---------------------------------------------------------------------------
-- Interviews, e-signatures, payments, staff notes, inquiries, audit log
-- ---------------------------------------------------------------------------
create table public.interviews (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.applications (id) on delete cascade,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  status          text not null default 'scheduled'
                  check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  interviewer_id  uuid references auth.users (id) on delete set null,
  notes           text,
  created_at      timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index interviews_application_idx on public.interviews (application_id);

create table public.signatures (
  id                     uuid primary key default gen_random_uuid(),
  application_id         uuid not null references public.applications (id) on delete cascade,
  signer_user_id         uuid references auth.users (id) on delete set null,
  signer_name            text not null,
  signer_email           text not null,
  consent_text_version   text not null,
  signed_at              timestamptz not null default now(),
  ip                     inet,
  user_agent             text
);
create index signatures_application_idx on public.signatures (application_id);

create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.applications (id) on delete cascade,
  provider        text not null default 'stripe',
  provider_ref    text unique,
  amount_cents    integer not null check (amount_cents >= 0),
  currency        text not null default 'usd',
  status          text not null default 'pending'
                  check (status in ('pending', 'paid', 'failed', 'refunded', 'waived')),
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);
create index payments_application_idx on public.payments (application_id);

create table public.staff_notes (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.applications (id) on delete cascade,
  author_id       uuid references auth.users (id) on delete set null,
  body            text not null,
  created_at      timestamptz not null default now()
);
create index staff_notes_application_idx on public.staff_notes (application_id);

create table public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  locale      text not null default 'en',
  handled_at  timestamptz,
  created_at  timestamptz not null default now()
);

create table public.audit_log (
  id           bigint generated always as identity primary key,
  actor_id     uuid references auth.users (id) on delete set null,
  action       text not null,            -- e.g. 'application.submit', 'document.view'
  entity       text not null,
  entity_id    text,
  metadata     jsonb not null default '{}'::jsonb,
  ip           inet,
  created_at   timestamptz not null default now()
);
create index audit_log_entity_idx on public.audit_log (entity, entity_id);
create index audit_log_actor_idx  on public.audit_log (actor_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS: enabled everywhere, deliberately with no policies. Browser roles get
-- nothing; service_role bypasses RLS and is used only by the server.
-- Belt and braces: also revoke table privileges from browser roles.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'applications', 'application_sections', 'checklist_items', 'documents',
    'recommendations', 'interviews', 'signatures', 'payments', 'staff_notes',
    'inquiries', 'audit_log'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Private storage bucket for applicant documents. Storage RLS is on by default and
-- we add no policies, so only the server (signed URLs) can reach these files.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'application-documents', 'application-documents', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

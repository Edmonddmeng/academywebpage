-- 0002 — documents, recommendation links, and two-part interview scheduling.
-- Run once in the Supabase dashboard: SQL Editor → paste → Run. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. The single "student interview" becomes an athletic and an admissions interview.
-- ---------------------------------------------------------------------------
alter table public.checklist_items drop constraint if exists checklist_items_kind_check;

update public.checklist_items set kind = 'admissions_interview' where kind = 'student_interview';

insert into public.checklist_items (application_id, kind)
select id, 'athletic_interview' from public.applications
on conflict (application_id, kind) do nothing;

alter table public.checklist_items add constraint checklist_items_kind_check check (kind in (
  'application_form', 'application_fee', 'birth_certificate',
  'athletic_interview', 'admissions_interview',
  'test_scores', 'rec_principal', 'rec_math', 'rec_english', 'report_card'
));

-- ---------------------------------------------------------------------------
-- 2. Interview slots (opened by staff) and bookings (made by families).
-- ---------------------------------------------------------------------------
create table if not exists public.interview_slots (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('athletic', 'admissions')),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  location    text not null,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  check (ends_at > starts_at),
  unique (kind, starts_at, location)
);
create index if not exists interview_slots_start_idx on public.interview_slots (kind, starts_at);

alter table public.interviews
  add column if not exists kind text not null default 'admissions' check (kind in ('athletic', 'admissions')),
  add column if not exists slot_id uuid references public.interview_slots (id) on delete restrict;

-- A slot can be held by one family at a time, and a family can hold one interview of each kind.
create unique index if not exists interviews_one_booking_per_slot
  on public.interviews (slot_id) where status = 'scheduled';
create unique index if not exists interviews_one_active_per_kind
  on public.interviews (application_id, kind) where status = 'scheduled';

-- ---------------------------------------------------------------------------
-- 3. Documents and recommendation links.
-- ---------------------------------------------------------------------------
alter table public.documents drop constraint if exists documents_kind_check;
alter table public.documents add constraint documents_kind_check
  check (kind in ('birth_certificate', 'report_card', 'rec_principal', 'rec_math', 'rec_english'));

-- How many times a link has been sent, so one address can't be mailed endlessly.
alter table public.recommendations add column if not exists send_count integer not null default 1;

-- ---------------------------------------------------------------------------
-- 4. Lock down the new table like every other one: RLS on, no policies, no browser access.
-- ---------------------------------------------------------------------------
alter table public.interview_slots enable row level security;
revoke all on public.interview_slots from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Making someone a staff member (run separately, with their real email):
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'someone@jmcsports.org');
-- Roles: 'guardian' (default) · 'staff' (admissions team) · 'admin'.
-- ---------------------------------------------------------------------------

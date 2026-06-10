-- HALO share path: cross-browser share invitations + recipient responses.
-- SCOPE: only the share path. Moment Cards + the Memory Map stay in localStorage.
-- All access is server-side via the service_role key (Next.js API routes).
--
-- Apply once in the Supabase SQL Editor (or via psql against the project DB).

create extension if not exists pgcrypto;  -- gen_random_uuid()

-- ── share_invitations ────────────────────────────────────────────────
create table if not exists public.share_invitations (
  id          uuid        primary key default gen_random_uuid(), -- = shareId in the URL
  card_id     text        not null,        -- originating MomentCard id (reference only)
  card        jsonb       not null,        -- full MomentCard snapshot at share time
  share_mode  text        not null default 'ask_their_version',
  question    text,
  sender_name text,
  created_at  timestamptz not null default now(),
  constraint share_mode_valid check (share_mode in
    ('card_only','with_question','ask_their_version','similar_experience')),
  constraint question_len    check (question    is null or char_length(question)    <= 500),
  constraint sender_name_len check (sender_name is null or char_length(sender_name) <= 80)
);

-- ── shared_responses ─────────────────────────────────────────────────
create table if not exists public.shared_responses (
  id             uuid        primary key default gen_random_uuid(),
  invitation_id  uuid        not null references public.share_invitations(id) on delete cascade,
  response_text  text        not null,
  responder_name text,
  created_at     timestamptz not null default now(),
  constraint response_text_nonempty check (char_length(btrim(response_text)) > 0),
  constraint response_text_len      check (char_length(response_text) <= 4000),
  constraint responder_name_len     check (responder_name is null or char_length(responder_name) <= 80)
);

-- ── index: fetch a thread's responses in order (PKs already index id lookups) ──
create index if not exists shared_responses_invitation_created_idx
  on public.shared_responses (invitation_id, created_at);

-- ── RLS: deny-by-default; only the server (service_role, which bypasses RLS) may touch these ──
alter table public.share_invitations enable row level security;
alter table public.shared_responses  enable row level security;
-- No policies created → anon/authenticated get ZERO rows via PostgREST.
-- Belt-and-suspenders: drop the default API grants too.
revoke all on public.share_invitations from anon, authenticated;
revoke all on public.shared_responses  from anon, authenticated;

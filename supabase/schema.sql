-- Asumit Construcciones: public website inquiry form
-- Run this script in Supabase Dashboard > SQL Editor.
-- The browser receives only the publishable/anon key. Never expose service_role keys.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 1 and 30),
  email text check (email is null or char_length(email) <= 254),
  project_type text not null check (char_length(project_type) between 1 and 100),
  budget text check (budget is null or char_length(budget) <= 100),
  details text not null check (char_length(details) between 1 and 5000),
  consent boolean not null default false check (consent = true),
  source text not null default 'website' check (source = 'website'),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- The public website can INSERT a consented inquiry only.
-- No SELECT, UPDATE or DELETE policy is created for anonymous website visitors.
drop policy if exists "Public can submit consented inquiries" on public.leads;
create policy "Public can submit consented inquiries"
  on public.leads
  for insert
  to anon, authenticated
  with check (consent = true and source = 'website');

revoke all on table public.leads from anon, authenticated;
grant insert on table public.leads to anon, authenticated;

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

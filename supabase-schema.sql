-- ================================================================
-- NextEdgeAI — Supabase Schema
-- Run this entire script in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------
-- TABLE: portfolio_projects
-- ----------------------------------------------------------------
create table if not exists portfolio_projects (
  id            uuid        default uuid_generate_v4() primary key,
  title         text        not null,
  category      text        not null default 'AI Feature Film',
  year          text        not null default extract(year from now())::text,
  description   text        not null default '',
  tags          text[]      not null default '{}',
  gradient      text        not null default 'from-cyan-900/80 via-blue-900/60 to-[#0a0a18]',
  accent        text        not null default '#22d3ee',
  thumbnail_url text,
  youtube_url   text,
  youtube_id    text,
  display_order integer     not null default 0,
  is_featured   boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- TABLE: contact_submissions
-- ----------------------------------------------------------------
create table if not exists contact_submissions (
  id           uuid        default uuid_generate_v4() primary key,
  name         text        not null,
  email        text        not null,
  mobile       text,
  company      text,
  project_type text,
  budget       text,
  message      text        not null,
  status       text        not null default 'new'
                           check (status in ('new', 'read', 'replied', 'archived')),
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------
alter table portfolio_projects    enable row level security;
alter table contact_submissions   enable row level security;

-- Portfolio: public read, authenticated full access
create policy "portfolio_public_select"
  on portfolio_projects for select to anon
  using (true);

create policy "portfolio_auth_all"
  on portfolio_projects for all to authenticated
  using (true) with check (true);

-- Contact: anonymous insert only, authenticated full access
create policy "contact_anon_insert"
  on contact_submissions for insert to anon
  with check (true);

create policy "contact_auth_all"
  on contact_submissions for all to authenticated
  using (true) with check (true);

-- ----------------------------------------------------------------
-- Storage bucket: portfolio-thumbnails
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-thumbnails',
  'portfolio-thumbnails',
  true,
  10485760,   -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do nothing;

-- Storage policies
create policy "thumbnails_public_read"
  on storage.objects for select to anon
  using (bucket_id = 'portfolio-thumbnails');

create policy "thumbnails_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-thumbnails');

create policy "thumbnails_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-thumbnails');

create policy "thumbnails_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-thumbnails');

-- ----------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolio_projects_updated_at
  before update on portfolio_projects
  for each row execute function handle_updated_at();

create trigger contact_submissions_updated_at
  before update on contact_submissions
  for each row execute function handle_updated_at();

-- ----------------------------------------------------------------
-- Helper views (optional — useful for admin dashboard)
-- ----------------------------------------------------------------
create or replace view inquiry_counts as
select
  count(*) filter (where status = 'new')      as new_count,
  count(*) filter (where status = 'read')     as read_count,
  count(*) filter (where status = 'replied')  as replied_count,
  count(*) filter (where status = 'archived') as archived_count,
  count(*)                                     as total_count
from contact_submissions;

-- Allow authenticated users to read the view
grant select on inquiry_counts to authenticated;

-- ----------------------------------------------------------------
-- TABLE: services
-- Run this block if upgrading an existing deployment.
-- ----------------------------------------------------------------
create table if not exists services (
  id            uuid        default uuid_generate_v4() primary key,
  title         text        not null,
  tagline       text        not null default '',
  description   text        not null default '',
  icon_name     text        not null default 'film',
  color_theme   text        not null default 'cyan',
  image_url     text,
  display_order integer     not null default 0,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- If upgrading an existing deployment, run:
-- alter table services add column if not exists image_url text;

-- If upgrading an existing deployment, run:
-- alter table contact_submissions add column if not exists mobile text;

alter table services enable row level security;

-- Public: read active services only
create policy "services_public_select"
  on services for select to anon
  using (is_active = true);

-- Authenticated: full access (needed to read inactive rows in admin)
create policy "services_auth_all"
  on services for all to authenticated
  using (true) with check (true);

create trigger services_updated_at
  before update on services
  for each row execute function handle_updated_at();

-- ----------------------------------------------------------------
-- Storage bucket: service-images
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-images',
  'service-images',
  true,
  10485760,   -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do nothing;

create policy "service_images_public_read"
  on storage.objects for select to anon
  using (bucket_id = 'service-images');

create policy "service_images_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'service-images');

create policy "service_images_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'service-images');

create policy "service_images_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'service-images');

-- ----------------------------------------------------------------
-- TABLE: clients
-- Brands shown in the "Trusted by Forward-Thinking Brands" section.
-- ----------------------------------------------------------------
create table if not exists clients (
  id            uuid        default uuid_generate_v4() primary key,
  name          text        not null,
  color         text        not null default '#22d3ee',
  logo_url      text,
  display_order integer     not null default 0,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- If upgrading an existing deployment, run:
-- alter table clients add column if not exists logo_url text;

alter table clients enable row level security;

-- Public: read active clients only
create policy "clients_public_select"
  on clients for select to anon
  using (is_active = true);

-- Authenticated: full access
create policy "clients_auth_all"
  on clients for all to authenticated
  using (true) with check (true);

create trigger clients_updated_at
  before update on clients
  for each row execute function handle_updated_at();

-- ----------------------------------------------------------------
-- Storage bucket: client-logos
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-logos',
  'client-logos',
  true,
  5242880,   -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "client_logos_public_read"
  on storage.objects for select to anon
  using (bucket_id = 'client-logos');

create policy "client_logos_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'client-logos');

create policy "client_logos_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'client-logos');

create policy "client_logos_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'client-logos');

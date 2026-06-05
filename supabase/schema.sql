create extension if not exists "pgcrypto";

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_date text not null,
  location text not null,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  content text not null default '',
  category text not null default 'Noticias',
  published_at text not null,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_images (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('event', 'post')),
  owner_id uuid not null,
  image_url text not null,
  alt_text text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists content_images_owner_idx
on public.content_images (owner_type, owner_id, position, created_at);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists gallery_images_set_updated_at on public.gallery_images;
create trigger gallery_images_set_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.posts enable row level security;
alter table public.gallery_images enable row level security;
alter table public.content_images enable row level security;

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
on public.events for select
using (is_published = true);

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts for select
using (is_published = true);

drop policy if exists "Public can read published gallery images" on public.gallery_images;
create policy "Public can read published gallery images"
on public.gallery_images for select
using (is_published = true);

drop policy if exists "Public can read published event images" on public.content_images;
create policy "Public can read published event images"
on public.content_images for select
using (
  owner_type = 'event'
  and exists (
    select 1 from public.events
    where events.id = content_images.owner_id
    and events.is_published = true
  )
);

drop policy if exists "Public can read published post images" on public.content_images;
create policy "Public can read published post images"
on public.content_images for select
using (
  owner_type = 'post'
  and exists (
    select 1 from public.posts
    where posts.id = content_images.owner_id
    and posts.is_published = true
  )
);

insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read content images" on storage.objects;
create policy "Public can read content images"
on storage.objects for select
using (bucket_id = 'content-images');

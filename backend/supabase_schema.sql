-- ============================================================
-- PURFAM / Luxe Essence – Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── USERS ───────────────────────────────────────────────────
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'user' check (role in ('user', 'admin')),
  phone         text default '',
  address       jsonb default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── PRODUCTS ────────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        jsonb not null,          -- { en: string, ar: string }
  description jsonb not null,          -- { en: string, ar: string }
  brand       text not null,
  gender      text not null check (gender in ('women', 'men')),
  category    text not null check (category in ('floral', 'woody', 'oriental', 'fresh', 'citrus', 'gourmand')),
  sizes       jsonb not null default '[]',  -- [{ ml: number, price: number }]
  images      text[] default '{}',
  stock       integer default 100,
  featured    boolean default false,
  ratings     jsonb default '{"average": 0, "count": 0}',
  slug        text unique,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── CARTS ───────────────────────────────────────────────────
create table if not exists carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  qty        integer not null check (qty > 0),
  size_ml    integer not null,
  price      numeric(10,2) not null,
  unique (cart_id, product_id, size_ml)
);

-- ─── ORDERS ──────────────────────────────────────────────────
create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references users(id) on delete set null,
  items              jsonb not null default '[]',
  shipping_address   jsonb not null,
  payment_intent_id  text,
  status             text not null default 'pending'
                       check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  subtotal           numeric(10,2) not null,
  shipping_cost      numeric(10,2) default 0,
  total              numeric(10,2) not null,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- ─── SITE SETTINGS ───────────────────────────────────────────
create table if not exists settings (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- ─── AUTO-UPDATE updated_at ──────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at    before update on users    for each row execute function update_updated_at();
create trigger products_updated_at before update on products for each row execute function update_updated_at();
create trigger carts_updated_at    before update on carts    for each row execute function update_updated_at();
create trigger orders_updated_at   before update on orders   for each row execute function update_updated_at();

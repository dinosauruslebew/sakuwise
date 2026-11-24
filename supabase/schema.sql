-- SakuWise database schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Every table is protected by Row Level Security: a signed-in user can only
-- read and write rows where user_id = their own auth.uid().

create extension if not exists pgcrypto;

-- One row per user: monthly allowance and the date of the next allowance
create table if not exists public.finance_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  income bigint not null default 0 check (income >= 0),
  next_allowance_date date not null default (date_trunc('month', now()) + interval '1 month')::date,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  budget bigint not null default 0 check (budget >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  amount bigint not null check (amount > 0),
  date date not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount bigint not null check (amount > 0),
  due_date date not null,
  category text not null,
  paid boolean not null default false,
  paid_date date,
  created_at timestamptz not null default now()
);
create index if not exists bills_user_due_idx on public.bills (user_id, due_date);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subtitle text not null default '',
  current bigint not null default 0 check (current >= 0),
  target bigint not null check (target > 0),
  deadline text not null default '',
  color text not null default 'bg-[#244833]',
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.finance_settings enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.bills enable row level security;
alter table public.goals enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['finance_settings','categories','transactions','bills','goals']
  loop
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format(
      'create policy "own rows" on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())',
      t
    );
  end loop;
end $$;

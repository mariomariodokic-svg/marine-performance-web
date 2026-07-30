create table if not exists public.orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  stripe_session_id text not null unique,
  customer_email text not null,
  product_key text not null,
  amount_total integer,
  currency text,
  payment_status text not null
);

alter table public.orders enable row level security;
-- Nema javnih policyja. Tablici pristupa samo server preko service role ključa.

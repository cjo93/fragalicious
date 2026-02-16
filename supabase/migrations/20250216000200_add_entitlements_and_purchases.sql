-- Extend profiles with Stripe entitlements
alter table profiles add column if not exists stripe_customer_id text;
alter table profiles add column if not exists plan_code text;
alter table profiles add column if not exists subscription_status text;
alter table profiles add column if not exists current_period_end timestamptz;
alter table profiles add column if not exists has_manual boolean default false;
alter table profiles add column if not exists updated_at timestamptz default now();

-- Purchases ledger for one-time products
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_code text not null,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

create index if not exists purchases_user_id_created_at_idx on purchases (user_id, created_at desc);
create unique index if not exists purchases_stripe_checkout_session_id_uidx on purchases (stripe_checkout_session_id);

-- RLS policies
alter table profiles enable row level security;
create policy if not exists "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy if not exists "profiles_update_own" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

alter table purchases enable row level security;
create policy if not exists "purchases_select_own" on purchases
  for select using (auth.uid() = user_id);

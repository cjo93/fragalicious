-- DEFRAG Supabase Schema (v27.0)

-- 1. Profiles Table
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    credits_balance integer default 0,
    stripe_customer_id text,
    subscription_tier text check (subscription_tier in ('FREE', 'CORE', 'PREMIUM')) default 'FREE',
    role text check (role in ('USER', 'ADMIN', 'ARCHITECT')) default 'USER',
    created_at timestamptz default now()
);

-- 2. Charts Table
create table if not exists charts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade,
    name text,
    birth_data jsonb,
    time_fidelity text check (time_fidelity in ('EXACT', 'NOON_STABLE')),
    raw_mechanics jsonb,
    natural_law_profile jsonb,
    created_at timestamptz default now()
);

-- 3. Connections Table
create table if not exists connections (
    id uuid primary key default gen_random_uuid(),
    chart_id_a uuid references charts(id) on delete cascade,
    chart_id_b uuid references charts(id) on delete cascade,
    relationship_type text check (relationship_type in ('PARENT', 'PARTNER', 'BOSS', 'ANCESTOR')),
    bowen_attributes jsonb,
    friction_report jsonb,
    created_at timestamptz default now()
);

-- 4. Lineage Nodes Table
create table if not exists lineage_nodes (
    id uuid primary key default gen_random_uuid(),
    root_user_id uuid references profiles(id) on delete cascade,
    generation_index integer,
    parent_node_id uuid references lineage_nodes(id) on delete set null,
    inherited_traits jsonb,
    created_at timestamptz default now()
);

-- 5. RLS Policy for Admins
alter table profiles enable row level security;
create policy "Admins can view all" on profiles for select using (auth.jwt() ->> 'role' = 'ADMIN');

-- 6. GDPR Delete RPC
create or replace function delete_user_account() returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer;


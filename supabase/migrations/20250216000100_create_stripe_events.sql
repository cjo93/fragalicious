create table if not exists stripe_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz default now(),
  processed_at timestamptz,
  status text not null,
  error text
);

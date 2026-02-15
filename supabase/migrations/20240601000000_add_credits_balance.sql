-- Add credits_balance to profiles for the Credits system
ALTER TABLE profiles ADD COLUMN credits_balance integer NOT NULL DEFAULT 0;

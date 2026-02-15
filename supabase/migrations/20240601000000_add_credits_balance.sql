ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credits_balance integer DEFAULT 0;

-- Atomic refueling function: increment_credits
CREATE OR REPLACE FUNCTION increment_credits(user_uuid UUID, amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  BEGIN
    UPDATE public.profiles
    SET credits_balance = credits_balance + amount
    WHERE id = user_uuid;
  END;
$$;

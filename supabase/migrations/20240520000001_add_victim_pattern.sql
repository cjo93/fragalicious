-- Add victim_pattern to gene_keys
ALTER TABLE gene_keys ADD COLUMN IF NOT EXISTS victim_pattern TEXT;

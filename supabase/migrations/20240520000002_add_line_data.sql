-- Add line_data JSONB column to gene_keys table
ALTER TABLE gene_keys ADD COLUMN IF NOT EXISTS line_data JSONB;

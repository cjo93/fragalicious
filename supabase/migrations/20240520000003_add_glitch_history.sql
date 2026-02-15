-- 7. Glitch History (Persistence for Reports)
CREATE TYPE glitch_status AS ENUM ('Active', 'Acknowledged', 'Resolved');

CREATE TABLE IF NOT EXISTS glitch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    glitch_signature JSONB NOT NULL, -- {gate: 55, line: 5, ancestor: "Grandparent"}
    report_content JSONB NOT NULL, -- The full DebugReport
    status glitch_status DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for user lookup
CREATE INDEX IF NOT EXISTS idx_glitch_history_user ON glitch_history(user_id);

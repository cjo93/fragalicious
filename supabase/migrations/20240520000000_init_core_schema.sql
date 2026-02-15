-- Initialize Core Knowledge Graph Schema

-- 1. Gene Keys Table
CREATE TABLE IF NOT EXISTS gene_keys (
    key_number INTEGER PRIMARY KEY,
    shadow TEXT NOT NULL,
    gift TEXT NOT NULL,
    siddhi TEXT NOT NULL,
    programming_partner INTEGER REFERENCES gene_keys(key_number),
    codon_group TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Human Design Gates Table
CREATE TABLE IF NOT EXISTS hd_gates (
    gate_number INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    center TEXT NOT NULL,
    circuit TEXT,
    gene_key_id INTEGER REFERENCES gene_keys(key_number),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Profiles (Extending Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    birth_date TIMESTAMPTZ,
    birth_location_name TEXT,
    birth_lat_lon POINT,
    subscription_status TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Natal Charts
CREATE TABLE IF NOT EXISTS natal_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    birth_data JSONB NOT NULL,
    planetary_positions JSONB NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Family Nodes (Graph Nodes)
CREATE TABLE IF NOT EXISTS family_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT CHECK (type IN ('male', 'female', 'self')),
    trait_id TEXT,
    mechanics_cache JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Family Edges (Graph Edges)
CREATE TABLE IF NOT EXISTS family_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id UUID REFERENCES family_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES family_nodes(id) ON DELETE CASCADE,
    interaction_type TEXT CHECK (interaction_type IN ('conflict', 'projection', 'cutoff', 'glitch')),
    is_recursive BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for Graph Traversal
CREATE INDEX IF NOT EXISTS idx_family_edges_source ON family_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_family_edges_target ON family_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_family_nodes_user ON family_nodes(user_id);

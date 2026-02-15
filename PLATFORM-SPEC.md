# PLATFORM-SPEC | DEFRAG Core Knowledge Graph

## 1. CoreSystemSchema

The CoreSystemSchema defines the fundamental data structures for the DEFRAG platform, integrating Human Design, Gene Keys, and Astrology into a unified mechanical framework.

### 1.1 Human Design Gates (`hd_gates`)
Stores the 64 gates of the RAV wheel.
| Field | Type | Description |
|-------|------|-------------|
| `gate_number` | INTEGER (PK) | 1-64 |
| `name` | TEXT | Traditional name |
| `center` | TEXT | Center of activation (e.g., Root, Sacral) |
| `circuit` | TEXT | Circuitry group |
| `gene_key_id` | INTEGER (FK) | Reference to Gene Keys |

### 1.2 Gene Keys (`gene_keys`)
Stores the 64 Gene Keys and their frequency bands.
| Field | Type | Description |
|-------|------|-------------|
| `key_number` | INTEGER (PK) | 1-64 |
| `shadow` | TEXT | Low frequency |
| `gift` | TEXT | Mid frequency |
| `siddhi` | TEXT | High frequency |
| `programming_partner` | INTEGER | Opposing Gene Key |
| `codon_group` | TEXT | Chemical/Biological grouping |

### 1.3 Astrological Natal Charts (`natal_charts`)
Stores high-fidelity planetary positions.
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `user_id` | UUID (FK) | Reference to Supabase Auth |
| `birth_data` | JSONB | Raw birth inputs (date, lat, lon) |
| `planetary_positions` | JSONB | Map of planet -> {long, gate, line, house} |
| `calculated_at` | TIMESTAMP | Creation timestamp |

## 2. Ancestral Glitch & Recursive Loops

To handle the "Ancestral Glitch"—recursive patterns inherited through family systems—we utilize a Graph Structure within the relational database.

### 2.1 Family Nodes (`family_nodes`)
Represents individual units in a genogram.
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `user_id` | UUID (FK) | The subject owner |
| `label` | TEXT | Relationship label (Mother, Father, etc.) |
| `type` | TEXT | male | female | self |
| `trait_id` | TEXT | Primary conditioning trait |
| `mechanics_cache` | JSONB | Known HD/Astro data for this node |

### 2.2 Family Edges (`family_edges`)
Represents the "Friction Vectors" and "Recursive Loops" between nodes.
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `source_node_id` | UUID (FK) | Origin of the pattern |
| `target_node_id` | UUID (FK) | Recipient of the pattern |
| `interaction_type` | TEXT | conflict | projection | cutoff | glitch |
| `is_recursive` | BOOLEAN | If TRUE, marks an "Ancestral Glitch" loop |
| `metadata` | JSONB | Specific mechanics of the glitch |

## 3. Database Implementation (Supabase/PostgreSQL)

While Neo4j is considered for deep graph traversal, the initial implementation uses PostgreSQL with Recursive Common Table Expressions (CTEs) to handle ancestral loops.

### Recursive CTE for Glitch Detection:
```sql
WITH RECURSIVE glitch_path AS (
    SELECT source_node_id, target_node_id, interaction_type, 1 as depth
    FROM family_edges
    WHERE is_recursive = true
    UNION ALL
    SELECT e.source_node_id, e.target_node_id, e.interaction_type, gp.depth + 1
    FROM family_edges e
    JOIN glitch_path gp ON e.source_node_id = gp.target_node_id
    WHERE gp.depth < 10
)
SELECT * FROM glitch_path;
```

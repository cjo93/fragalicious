export interface Subject {
  full_name: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
}

export interface AstroPoint {
  name: string;
  sign: string;
  longitude: number;
  gate: number;
  line: number;
}

export interface NatalChart {
  id: string;
  user_id: string;
  birth_data: any;
  planetary_positions: Record<string, AstroPoint>;
  calculated_at: string;
}

export interface HDGate {
  gate_number: number;
  name: string;
  center: string;
  circuit?: string;
  gene_key_id: number;
}

export interface GeneKey {
  key_number: number;
  shadow: string;
  gift: string;
  siddhi: string;
  programming_partner: number;
  codon_group?: string;
}

export interface Node {
  id: string;
  label: string;
  type: "male" | "female" | "self";
  trait?: string;
  mechanics_cache?: any;
}

export interface Edge {
  source: string;
  target: string;
  interaction: "conflict" | "projection" | "cutoff" | "glitch";
  label?: string;
  color?: string;
  animated?: boolean;
  is_recursive?: boolean;
  metadata?: any;
}

export interface InsightCardData {
  type: string;
  status: string;
  mechanic: string;
  analysis: string;
}

export interface FamilyMapData {
  nodes: Node[];
  edges: Edge[];
}

export interface StrategyStep {
  instruction: string;
  timing: string;
  expected_output: string;
}

export interface StrategyLogData {
  steps: StrategyStep[];
}

export interface InteractionEvent {
  type: string;
  gate_a?: number;
  gate_b?: number;
  channel?: [number, number];
  description: string;
  impact: "SHADOW" | "GIFT";
}

export interface GlitchLoop {
  gate: number;
  type: string;
  path: string[];
  shadow: string;
  gift: string;
  victim_pattern?: string;
  inversion_protocol: string;
}

export interface DefragProtocol {
  trigger_mechanism: string;
  contemplation_cue: string;
  action_step: string;
}

export interface DebugReport {
  explanation: string;
  defrag_protocol: DefragProtocol;
  severity_level: "NORMAL" | "CRITICAL";
}

export interface DefragData {
  subject?: Subject;
  astro_points?: AstroPoint[];
  insight_card?: InsightCardData;
  family_map?: FamilyMapData;
  strategy_log?: StrategyLogData;
  synthesis?: string;
}

// --- DEFRAG Dashboard Graph Types ---
export type EngineType = 'SOLAR' | 'LUNAR';
export type AuthorityType = 'SACRAL' | 'SPLENIC' | 'EMOTIONAL' | 'EGO' | 'G_CENTER';
export type BowenDynamic = 'CUTOFF' | 'FUSION' | 'PROJECTION' | 'TRIANGLE' | 'HEALTHY';

export interface ChartNodeData {
  id: string;
  type: 'NODE';
  name: string;
  avatar_seed: string;
  mechanics: {
    engine: EngineType;
    authority: AuthorityType;
    profile: string;
    strategy: string;
  };
  shadow: string; // The "Resistance" Signal
}

export interface ConnectionEdgeData {
  id: string;
  type: 'EDGE';
  source: string;
  target: string;
  relationship: string;
  bowen: {
    dynamic: BowenDynamic;
    intensity: number; // 1-10 scale
  };
  friction_point: string;
  recommended_script_id?: string;
}

export type SelectedElement = ChartNodeData | ConnectionEdgeData | null;

from pydantic import BaseModel
from typing import List, Dict, Optional, Set
from .CalculationEngine import ChartData, PlanetPosition

class InteractionType:
    CONDITIONING = "conditioning"   # A has it, B doesn't
    ELECTROMAGNETIC = "electromagnetic" # A has Gate 1, B has Gate 2 (Completes Channel)
    COMPROMISE = "compromise"       # A has full channel, B only has one gate
    DOMINANCE = "dominance"         # A has full channel, B has nothing

class InteractionEvent(BaseModel):
    type: str
    gate_a: Optional[int] = None
    gate_b: Optional[int] = None
    channel: Optional[tuple] = None
    description: str
    impact: str # 'SHADOW' or 'GIFT' (Potential)
    severity: str = "NORMAL"

CHANNELS = [
    (1, 8), (2, 14), (3, 60), (4, 63), (5, 15), (6, 59), (7, 31), (9, 52),
    (10, 20), (10, 34), (10, 57), (11, 56), (12, 22), (13, 33), (16, 48),
    (17, 62), (18, 58), (19, 49), (20, 34), (20, 57), (21, 45), (23, 43),
    (24, 61), (25, 51), (26, 44), (27, 50), (28, 38), (29, 46), (30, 41),
    (32, 54), (34, 57), (35, 36), (37, 40), (39, 55), (42, 53), (47, 64)
]

class ChartComparator:
    def __init__(self):
        pass

    def _get_active_gates(self, chart: ChartData) -> Set[int]:
        gates = set()
        # Extract all gates from planetary positions
        for field in chart.model_fields:
            pos = getattr(chart, field)
            if isinstance(pos, PlanetPosition):
                gates.add(pos.gate)
        return gates

    def _get_active_gates_with_lines(self, chart: ChartData) -> Dict[int, int]:
        gates = {}
        for field in chart.model_fields:
            pos = getattr(chart, field)
            if isinstance(pos, PlanetPosition):
                gates[pos.gate] = pos.line
        return gates

    def _get_defined_channels(self, gates: Set[int]) -> List[tuple]:
        defined = []
        for g1, g2 in CHANNELS:
            if g1 in gates and g2 in gates:
                defined.append((g1, g2))
        return defined

    def analyze_connection(self, agent_chart: ChartData, subject_chart: ChartData) -> List[InteractionEvent]:
        events = []
        agent_gates_map = self._get_active_gates_with_lines(agent_chart)
        subject_gates_map = self._get_active_gates_with_lines(subject_chart)
        agent_gates = set(agent_gates_map.keys())
        subject_gates = set(subject_gates_map.keys())
        agent_channels = self._get_defined_channels(agent_gates)
        subject_channels = self._get_defined_channels(subject_gates)

        # 1. Dominance (A has full channel, B has nothing)
        # We process channels first to avoid double counting as conditioning
        processed_dominance_gates = set()
        
        for g1, g2 in agent_channels:
            if g1 not in subject_gates and g2 not in subject_gates:
                events.append(InteractionEvent(
                    type=InteractionType.DOMINANCE,
                    channel=(g1, g2),
                    description=f"Dominance: Agent defines full channel {g1}-{g2}, Subject has total openness.",
                    impact="SHADOW",
                    severity="MEDIUM"
                ))
                processed_dominance_gates.add(g1)
                processed_dominance_gates.add(g2)

        # 2. Conditioning (Individual Gates)
        for gate in agent_gates:
            if gate not in subject_gates and gate not in processed_dominance_gates:
                events.append(InteractionEvent(
                    type=InteractionType.CONDITIONING,
                    gate_a=gate,
                    description=f"Agent defines Gate {gate}, conditioning Subject's openness.",
                    impact="SHADOW",
                    severity="NORMAL"
                ))
        
        # 3. Electromagnetic Hooks (Spark): Each has one gate, together form a channel
        for g1, g2 in CHANNELS:
            # Agent has g1, Subject has g2 (and neither has the other's gate)
            if (g1 in agent_gates and g2 in subject_gates and 
                g1 not in subject_gates and g2 not in agent_gates):
                events.append(InteractionEvent(
                    type=InteractionType.ELECTROMAGNETIC,
                    gate_a=g1,
                    gate_b=g2,
                    channel=(g1, g2),
                    description=f"Electromagnetic spark: Agent has Gate {g1}, Subject has Gate {g2}.",
                    impact="GIFT",
                    severity="NORMAL"
                ))
            elif (g2 in agent_gates and g1 in subject_gates and 
                  g2 not in subject_gates and g1 not in agent_gates):
                events.append(InteractionEvent(
                    type=InteractionType.ELECTROMAGNETIC,
                    gate_a=g2,
                    gate_b=g1,
                    channel=(g1, g2),
                    description=f"Electromagnetic spark: Agent has Gate {g2}, Subject has Gate {g1}.",
                    impact="GIFT",
                    severity="NORMAL"
                ))

        # 4. Compromise (Highest Friction): Agent has full channel, subject has only one gate
        for g1, g2 in agent_channels:
            # Agent has both, subject has only one
            has_g1 = g1 in subject_gates
            has_g2 = g2 in subject_gates
            if (has_g1 and not has_g2) or (has_g2 and not has_g1):
                gate_subject_has = g1 if has_g1 else g2
                events.append(InteractionEvent(
                    type=InteractionType.COMPROMISE,
                    gate_a=gate_subject_has, # The one the subject has
                    channel=(g1, g2),
                    description=f"Compromise: Agent defines full channel {g1}-{g2}, Subject only has Gate {gate_subject_has}.",
                    impact="SHADOW",
                    severity="HIGH"
                ))

        # Reverse Compromise: Subject has full channel, agent has only one gate
        for g1, g2 in subject_channels:
            has_g1 = g1 in agent_gates
            has_g2 = g2 in agent_gates
            if (has_g1 and not has_g2) or (has_g2 and not has_g1):
                gate_agent_has = g1 if has_g1 else g2
                events.append(InteractionEvent(
                    type=InteractionType.COMPROMISE,
                    gate_a=gate_agent_has, # The one the agent has
                    channel=(g1, g2),
                    description=f"Compromise (Reverse): Subject defines full channel {g1}-{g2}, Agent only has Gate {gate_agent_has}.",
                    impact="SHADOW",
                    severity="HIGH"
                ))

        return events

from datetime import datetime, timezone
from typing import List, Dict, Any
from .CalculationEngine import ChartData, PlanetPosition

CHANNELS = [
    (1, 8), (2, 14), (3, 60), (4, 63), (5, 15), (6, 59), (7, 31), (9, 52),
    (10, 20), (10, 34), (10, 57), (11, 56), (12, 22), (13, 33), (16, 48),
    (17, 62), (18, 58), (19, 49), (20, 34), (20, 57), (21, 45), (23, 43),
    (24, 61), (25, 51), (26, 44), (27, 50), (28, 38), (29, 46), (30, 41),
    (32, 54), (34, 57), (35, 36), (37, 40), (39, 55), (42, 53), (47, 64)
]

class TransitReport:
    def __init__(self, active_transits: List[Dict[str, Any]], temporary_definitions: List[Dict[str, Any]]):
        self.active_transits = active_transits
        self.temporary_definitions = temporary_definitions

class RuntimeMonitor:
    def __init__(self, calculation_engine=None):
        self.calculation_engine = calculation_engine or __import__('core_logic.CalculationEngine').CalculationEngine

    def check_current_weather(self, user_chart: ChartData) -> TransitReport:
        now = datetime.now(timezone.utc)
        # Calculate current planetary positions (transits)
        calc_engine = self.calculation_engine
        current_transits = calc_engine.calculate_chart(now, None)  # None for location: use geocentric
        # User's defined gates
        user_gates = set()
        for field in user_chart.model_fields:
            pos = getattr(user_chart, field)
            if isinstance(pos, PlanetPosition):
                user_gates.add(pos.gate)
        # Find transits activating user's undefined gates
        active_transits = []
        for field in current_transits.model_fields:
            pos = getattr(current_transits, field)
            if isinstance(pos, PlanetPosition) and pos.gate not in user_gates:
                active_transits.append({
                    "planet": pos.name,
                    "gate": pos.gate,
                    "line": pos.line,
                    "zodiac_sign": pos.zodiac_sign
                })
        # Find temporary channel completions
        temporary_definitions = []
        for g1, g2 in CHANNELS:
            # If user has g1, transit has g2 (or vice versa), but user does not have both
            if (g1 in user_gates and any(pos.gate == g2 for pos in current_transits.__dict__.values() if isinstance(pos, PlanetPosition)) and g2 not in user_gates):
                temporary_definitions.append({"user_gate": g1, "transit_gate": g2, "channel": (g1, g2)})
            elif (g2 in user_gates and any(pos.gate == g1 for pos in current_transits.__dict__.values() if isinstance(pos, PlanetPosition)) and g1 not in user_gates):
                temporary_definitions.append({"user_gate": g2, "transit_gate": g1, "channel": (g1, g2)})
        return TransitReport(active_transits, temporary_definitions)


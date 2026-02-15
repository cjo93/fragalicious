import sys
import os
from unittest.mock import MagicMock, patch

# Add root to path
sys.path.append(os.getcwd())

from core_logic.CalculationEngine import engine as calc_engine
from core_logic.RelationshipDebugger import ChartComparator, InteractionType
from core_logic.InteractionSequencer import InteractionSequencer

def test_interpersonal_logic():
    print("Testing Interpersonal Logic (Compromise & Electromagnetic)...")
    
    # Calculate two charts
    chart_a = calc_engine.calculate("1990-01-01", "12:00", 40.71, -74.00)
    chart_b = calc_engine.calculate("2020-01-01", "12:00", 51.50, -0.12)
    
    # 1. Force a COMPROMISE: Agent has Channel 59-6, Subject has only Gate 59
    # Channel 59-6: Gate 59 and Gate 6
    chart_a.sun.gate = 59
    chart_a.earth.gate = 6
    chart_b.sun.gate = 59
    # Ensure chart_b doesn't have 6
    for field in chart_b.model_fields:
        if field != 'sun':
            pos = getattr(chart_b, field)
            if hasattr(pos, 'gate') and pos.gate == 6: pos.gate = 1
            
    comparator = ChartComparator()
    events = comparator.analyze_connection(chart_a, chart_b)
    
    compromise_event = next((e for e in events if e.type == InteractionType.COMPROMISE), None)
    assert compromise_event is not None
    assert compromise_event.severity == "HIGH"
    print(f"SUCCESS: Compromise detected with severity {compromise_event.severity}")

    # 2. Test InteractionSequencer for this compromise
    sequencer = InteractionSequencer()
    patch = sequencer.generate_interaction_protocol(
        InteractionType.COMPROMISE,
        "Receiver",
        59,
        "Conflict",
        "Diplomacy"
    )
    
    assert "Surrender" in patch.your_strategy
    assert "internal settings" in patch.relational_narrative
    print("SUCCESS: Sequencer generated correct Receiver protocol for Compromise")

def test_dominance_logic():
    print("\nTesting Dominance Logic...")
    chart_a = calc_engine.calculate("1990-01-01", "12:00", 40.71, -74.00)
    chart_b = calc_engine.calculate("2020-01-01", "12:00", 51.50, -0.12)
    
    # Force Dominance: Agent has 59-6, Subject has neither
    chart_a.sun.gate = 59
    chart_a.earth.gate = 6
    for field in chart_b.model_fields:
        pos = getattr(chart_b, field)
        if hasattr(pos, 'gate') and pos.gate in [59, 6]: pos.gate = 1
        
    comparator = ChartComparator()
    events = comparator.analyze_connection(chart_a, chart_b)
    
    dominance_event = next((e for e in events if e.type == InteractionType.DOMINANCE), None)
    assert dominance_event is not None
    assert dominance_event.severity == "MEDIUM"
    print(f"SUCCESS: Dominance detected with severity {dominance_event.severity}")

@patch('core_logic.AncestralPatternFinder.AncestralPatternFinder._get_gene_key_data')
def test_api_endpoint(mock_get_gk):
    print("\nTesting API logic in main.py (Mocked)...")
    from backend_context.app.main import analyze_relationship
    
    mock_get_gk.return_value = {"shadow": "Conflict", "gift": "Diplomacy"}
    
    chart_a = calc_engine.calculate("1990-01-01", "12:00", 40.71, -74.00)
    chart_b = calc_engine.calculate("2020-01-01", "12:00", 51.50, -0.12)
    
    # Force Compromise
    chart_a.sun.gate = 59
    chart_a.earth.gate = 6
    chart_b.sun.gate = 59
    for field in chart_b.model_fields:
        if field != 'sun':
            pos = getattr(chart_b, field)
            if hasattr(pos, 'gate') and pos.gate == 6: pos.gate = 1

    import asyncio
    async def run_test():
        audit = await analyze_relationship(chart_a.model_dump(), chart_b.model_dump())
        print(f"Found {len(audit.friction_points)} friction points")
        assert len(audit.friction_points) > 0
        assert audit.friction_points[0].type == "COMPROMISE"
        assert audit.friction_points[0].impact_level == "CRITICAL"
        print("SUCCESS: API logic returned structured Relationship Audit")

    asyncio.run(run_test())

if __name__ == "__main__":
    test_interpersonal_logic()
    test_dominance_logic()
    test_api_endpoint()

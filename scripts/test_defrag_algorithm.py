import sys
import os
import json
from unittest.mock import MagicMock, patch

# Add root to path
sys.path.append(os.getcwd())

from core_logic.CalculationEngine import engine as calc_engine
from core_logic.RelationshipDebugger import ChartComparator
from core_logic.AncestralPatternFinder import AncestralPatternFinder
from core_logic.InversionSequencer import DefragEngine

def test_defrag_engine():
    print("Testing DefragEngine...")
    engine = DefragEngine()
    
    # Test Gate 55 Line 5 (Specific override)
    protocol_55_5 = engine.generate_protocol(55, 5, "Victimization")
    print(f"Gate 55.5: {protocol_55_5.action_step}")
    assert "Withdraw projection" in protocol_55_5.action_step
    
    # Test Gate 55 Line 1 (Specific override)
    protocol_55_1 = engine.generate_protocol(55, 1, "Victimization")
    print(f"Gate 55.1: {protocol_55_1.action_step}")
    assert "core insecurity" in protocol_55_1.action_step
    
    # Test generic Line 3
    protocol_generic_3 = engine.generate_protocol(1, 3, "Entropy")
    print(f"Gate 1.3: {protocol_generic_3.action_step}")
    assert "reframe the error" in protocol_generic_3.action_step.lower()
    
    print("DefragEngine test SUCCESS\n")

@patch('requests.get')
def test_compounded_pattern_detection(mock_get):
    print("Testing Compounded Pattern Detection (Mocked)...")
    
    # 1. Setup Mock Data
    child_id = "child-uuid"
    parent_id = "parent-uuid"
    gparent_id = "gparent-uuid"
    
    chart_child = calc_engine.calculate("2020-01-01", "12:00", 51.50, -0.12)
    chart_parent = calc_engine.calculate("1990-01-01", "12:00", 51.50, -0.12)
    chart_gparent = calc_engine.calculate("1960-01-01", "12:00", 51.50, -0.12)
    
    # Force a Compounded Pattern: Gate 55 Line 5 in ALL 3 generations
    # We use Sun for all of them
    chart_child.sun.gate = 55
    chart_child.sun.line = 5
    chart_parent.sun.gate = 55
    chart_parent.sun.line = 5
    chart_gparent.sun.gate = 55
    chart_gparent.sun.line = 5
    
    def side_effect(url, headers=None):
        mock_res = MagicMock()
        if f"family_nodes?id=eq.{child_id}" in url:
            mock_res.json.return_value = [{"id": child_id, "label": "Child", "type": "self", "mechanics_cache": chart_child.model_dump()}]
        elif f"family_nodes?id=eq.{parent_id}" in url:
            mock_res.json.return_value = [{"id": parent_id, "label": "Parent", "type": "female", "mechanics_cache": chart_parent.model_dump()}]
        elif f"family_nodes?id=eq.{gparent_id}" in url:
            mock_res.json.return_value = [{"id": gparent_id, "label": "Grandparent", "type": "female", "mechanics_cache": chart_gparent.model_dump()}]
        elif f"family_edges?target_node_id=eq.{child_id}" in url:
            mock_res.json.return_value = [{"source_node_id": parent_id, "target_node_id": child_id}]
        elif f"family_edges?target_node_id=eq.{parent_id}" in url:
            mock_res.json.return_value = [{"source_node_id": gparent_id, "target_node_id": parent_id}]
        elif "gene_keys?key_number=eq." in url:
            gate_num = url.split("eq.")[-1]
            mock_res.json.return_value = [{
                "key_number": int(gate_num),
                "shadow": "Victimization",
                "gift": "Freedom",
                "victim_pattern": "Victim of Fate"
            }]
        else:
            mock_res.json.return_value = []
        return mock_res

    mock_get.side_effect = side_effect
    
    os.environ["SUPABASE_URL"] = "http://mock"
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "mock"
    
    finder = AncestralPatternFinder()
    results = finder.find_recursive_loops(child_id)
    
    print(f"Found {len(results)} Ancestral Patterns.")
    core_wound_found = False
    for res in results:
        print(f"- {res['type']} (Gate {res['gate']}.{res['line']}): {res['path']}")
        print(f"  Severity: {res.get('severity')}, Tags: {res.get('tags')}")
        if res['type'] == "Lineage Core Wound" and res['gate'] == 55:
            core_wound_found = True
            assert res['severity'] == "CRITICAL"
            assert "System Reset Required" in res['tags']
            assert "Withdraw projection" in res['inversion_protocol']['action_step']
    
    assert core_wound_found, "Should have detected a Lineage Core Wound"
    print("Compounded Pattern Detection test SUCCESS")

if __name__ == "__main__":
    test_defrag_engine()
    test_compounded_pattern_detection()

import sys
import os
from unittest.mock import MagicMock, patch

# Ensure project root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core_logic.NarrativeService import NarrativeEngine
from backend_context.app.models import GlitchLoop

def test_narrative_fallback():
    print("Testing NarrativeEngine fallback (no API key)...")
    engine = NarrativeEngine()
    engine.api_key = None # Force fallback
    
    glitch = GlitchLoop(
        gate=55,
        type="Ancestral Glitch Loop",
        path=["Grandparent", "Parent", "Child"],
        shadow="Victimization",
        gift="Freedom",
        victim_pattern="Feeling trapped by external circumstances",
        inversion_protocol="Move from Victimization to Freedom"
    )
    
    report = engine.generate_glitch_report(glitch)
    print(f"Report:\n{report}")
    
    assert "explanation" in report
    explanation = report["explanation"]
    assert "Victimization" in explanation
    assert "Freedom" in explanation
    assert "Grandparent" in explanation
    assert "defrag_protocol" in report
    assert report["severity_level"] == "NORMAL"
    print("Fallback test SUCCESS")

def test_narrative_critical_fallback():
    print("\nTesting NarrativeEngine CRITICAL fallback (no API key)...")
    engine = NarrativeEngine()
    engine.api_key = None # Force fallback
    
    glitch = GlitchLoop(
        gate=55,
        line=5,
        type="Lineage Core Wound",
        severity="CRITICAL",
        path=["Grandparent", "Parent", "Child"],
        shadow="Victimization",
        gift="Freedom",
        victim_pattern="Feeling trapped",
        inversion_protocol={}
    )
    
    report = engine.generate_glitch_report(glitch)
    print(f"Critical Report:\n{report}")
    
    explanation = report["explanation"]
    assert "LINEAGE CORE WOUND" in explanation
    assert "Victimization" in explanation
    assert "Grandparent" in explanation
    assert "Withdraw projection" in explanation
    assert report["severity_level"] == "CRITICAL"
    print("Critical fallback test SUCCESS")

@patch('requests.post')
def test_narrative_llm_mock(mock_post):
    print("\nTesting NarrativeEngine with mocked LLM response...")
    # Mock OpenAI response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [
            {
                "message": {
                    "content": "The Pattern: We detected a loop of Victimization from your Grandparent.\nHow it Affects You: You feel trapped.\nThe Shift: Focus on Freedom."
                }
            }
        ]
    }
    mock_post.return_value = mock_response
    
    engine = NarrativeEngine()
    engine.api_key = "mock-key"
    
    glitch = GlitchLoop(
        gate=55,
        type="Ancestral Glitch Loop",
        path=["Grandparent", "Parent", "Child"],
        shadow="Victimization",
        gift="Freedom",
        victim_pattern="Feeling trapped",
        inversion_protocol="Move from Victimization to Freedom"
    )
    
    report = engine.generate_glitch_report(glitch)
    print(f"Mocked Report:\n{report}")
    
    assert "explanation" in report
    explanation = report["explanation"]
    assert "Victimization" in explanation
    assert "Grandparent" in explanation
    assert "defrag_protocol" in report
    print("Mocked LLM test SUCCESS")

if __name__ == "__main__":
    try:
        test_narrative_fallback()
        test_narrative_critical_fallback()
        test_narrative_llm_mock()
        print("\nAll narrative tests passed.")
    except Exception as e:
        print(f"\nTests failed: {e}")
        sys.exit(1)

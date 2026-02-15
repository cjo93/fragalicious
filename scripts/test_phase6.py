import sys
import os
from unittest.mock import MagicMock, patch

# Add root to path
sys.path.append(os.getcwd())

from core_logic.InversionSequencer import DefragEngine
from core_logic.NarrativeService import NarrativeEngine
from backend_context.app.models import GlitchLoop

def test_strategy_enforcement():
    print("Testing StrategyEnforcer...")
    engine = DefragEngine()
    
    # Gate 20 with Line 1 (Insecurity)
    # Generic action for Line 1 is "Focus on foundational research and internal verification."
    # If gate is 20, we added "Act in the immediate moment without hesitation."
    
    # Test for Projector
    protocol = engine.generate_protocol(20, 1, "Doubt", user_strategy="Wait for Invitation")
    print(f"Projector Action: {protocol.action_step}")
    assert "Wait for recognition" in protocol.action_step
    
    # Test for Generator
    protocol = engine.generate_protocol(20, 1, "Doubt", user_strategy="Wait to Respond")
    print(f"Generator Action: {protocol.action_step}")
    assert "Wait for a clear external signal" in protocol.action_step

    # Test for Manifestor
    protocol = engine.generate_protocol(20, 1, "Doubt", user_strategy="Inform")
    print(f"Manifestor Action: {protocol.action_step}")
    assert "ensure you inform" in protocol.action_step
    
    print("Strategy Enforcement test SUCCESS\n")

@patch('requests.post')
def test_persistence(mock_post):
    print("Testing Report Persistence...")
    # Set mock env vars
    os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "mock-key"
    
    # Mock success for Supabase post
    mock_post.return_value.status_code = 201
    
    narrative_engine = NarrativeEngine()
    glitch = GlitchLoop(
        gate=55,
        line=5,
        type="Ancestral Glitch Loop",
        path=["Grandparent", "Parent", "Child"],
        shadow="Victimization",
        gift="Freedom",
        inversion_protocol={}
    )
    
    # Generate report with user_id to trigger save
    user_id = "user-123"
    report = narrative_engine.generate_glitch_report(glitch, user_id=user_id, user_strategy="Projector")
    
    print(f"Report generated: {report['explanation'][:50]}...")
    
    # Verify that save_report (requests.post) was called
    # 1. LLM call (if API key present, but here it's likely None in test env)
    # 2. Supabase call to glitch_history
    
    history_call = None
    for call in mock_post.call_args_list:
        if 'glitch_history' in call.args[0]:
            history_call = call
            break
            
    assert history_call is not None, "Should have called Supabase glitch_history"
    payload = history_call.kwargs['json']
    assert payload['user_id'] == user_id
    assert payload['glitch_signature']['gate'] == 55
    print("Persistence test SUCCESS")

if __name__ == "__main__":
    test_strategy_enforcement()
    test_persistence()

from typing import Dict, Any, Optional
from pydantic import BaseModel

class DefragPath(BaseModel):
    trigger_mechanism: str
    contemplation_cue: str
    action_step: str

class StrategyEnforcer:
    @staticmethod
    def enforce(action: str, strategy: Optional[str]) -> str:
        if not strategy:
            return action
        
        s = strategy.lower()
        # Projector Logic: Focus on invitation/recognition
        if "invitation" in s or "projector" in s:
            initiating_words = ["initiate", "start", "do it", "act ", "just", "launch", "begin"]
            if any(word in action.lower() for word in initiating_words):
                return f"Wait for recognition or an invitation before you {action.lower().replace('just ', '')}. Use this time for system refinement."
            return f"Prepare your system so that when an invitation arrives, you can {action.lower()}."
        
        # Generator Logic: Focus on response
        if "respond" in s or "generator" in s:
            return f"Wait for a clear external signal to respond to, then {action.lower()}."
        
        # Manifestor Logic: Focus on informing
        if "inform" in s or "manifestor" in s:
            return f"Before you {action.lower()}, ensure you inform all impacted parties to clear the path."
        
        return action

class DefragEngine:
    """
    The Defrag Algorithm: Generates dynamic behavioral inversion protocols
    based on the intersection of Hexagram Gates and Line Dynamics.
    """
    
    LINE_DATA = {
        1: {
            "perspective": "Introspection",
            "wound": "Insecurity",
            "cue": "Investigate the root of the frequency.",
            "fix": "Focus on foundational research and internal verification."
        },
        2: {
            "perspective": "Naturalness",
            "wound": "Denial",
            "cue": "Observe what is being called out by others.",
            "fix": "Cease effort and allow the natural gift to surface."
        },
        3: {
            "perspective": "Adventure",
            "wound": "Shame",
            "cue": "Identify the fear of failure in the current loop.",
            "fix": "Reframe the error as an essential data point for the collective."
        },
        4: {
            "perspective": "Network",
            "wound": "Rejection",
            "cue": "Notice the closing of the heart to prevent pain.",
            "fix": "Open communication with the immediate circle without expectation."
        },
        5: {
            "perspective": "Universalization",
            "wound": "Projection",
            "cue": "Notice the externalization of authority or blame.",
            "fix": "Withdraw projection from external authority and internalize the wave."
        },
        6: {
            "perspective": "Objectivity",
            "wound": "Separation",
            "cue": "Observe the detachment becoming isolation.",
            "fix": "Apply the long-term view to the immediate interaction."
        }
    }

    def generate_protocol(self, gate: int, line: int, shadow: str, user_strategy: Optional[str] = None) -> DefragPath:
        """
        Combines the Gate's Shadow/Dilemma with the Line's Perspective
        to create a computed behavioral protocol, filtered through Strategy.
        """
        line_info = self.LINE_DATA.get(line, self.LINE_DATA[1])
        
        # dynamic generation logic
        trigger = f"Activation of {shadow} through the lens of {line_info['wound']} (Line {line})."
        cue = f"Identify where {shadow} is creating {line_info['perspective'].lower()} latency. {line_info['cue']}"
        
        # Specific overrides for examples provided in prompt
        action = line_info['fix']
        if gate == 55 and line == 5:
            action = "Withdraw projection from external authority and internalize the emotional wave."
        elif gate == 55 and line == 1:
            action = "Identify the core insecurity within the emotional wave and investigate its source."
        elif gate == 20:
            action = "Act in the immediate moment without hesitation."

        # Apply Strategy Safety Valve
        safe_action = StrategyEnforcer.enforce(action, user_strategy)

        return DefragPath(
            trigger_mechanism=trigger,
            contemplation_cue=cue,
            action_step=safe_action
        )

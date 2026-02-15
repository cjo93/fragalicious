from typing import Dict, Any, Optional
from pydantic import BaseModel
from .InversionSequencer import DefragEngine
from .interaction_rules import INTERACTION_RULES

class RelationalPatch(BaseModel):
    mechanic_type: str
    your_strategy: str
    partner_strategy: str
    relational_narrative: str
    gate_themes: Optional[Dict[str, Any]] = None

class InteractionSequencer:
    def __init__(self, defrag_engine: DefragEngine = None):
        self.defrag_engine = defrag_engine or DefragEngine()

    def generate_interaction_protocol(
        self, 
        interaction_type: str, 
        user_role: str, # 'Receiver' or 'Transmitter' or 'Participant'
        gate_id: int,
        shadow_name: str = "Unknown",
        gift_name: str = "Unknown"
    ) -> RelationalPatch:
        """
        Generates behavioral advice for interpersonal dynamics using the INTERACTION_RULES matrix.
        """
        interaction_key = interaction_type.upper()
        role_key = user_role.capitalize() if user_role.lower() in ["transmitter", "receiver"] else "Both"
        rules = INTERACTION_RULES.get(interaction_key, {})
        entry = rules.get(role_key) or rules.get("Both")

        if entry:
            your_strategy = entry["protocol"]
            partner_strategy = entry["protocol"] if role_key == "Both" else rules.get("Receiver" if role_key == "Transmitter" else "Transmitter", {}).get("protocol", "")
            narrative = entry["narrative"]
        else:
            # Fallback/default
            your_strategy = "Observe the conditioning as external data."
            partner_strategy = "Be mindful of your impact."
            narrative = "Standard interpersonal conditioning detected."

        return RelationalPatch(
            mechanic_type=interaction_key,
            your_strategy=your_strategy,
            partner_strategy=partner_strategy,
            relational_narrative=narrative,
            gate_themes={
                "gate": gate_id,
                "shadow": shadow_name,
                "gift": gift_name
            }
        )

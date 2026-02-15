import os
from typing import Dict, Any
import requests
from backend_context.app.models import GlitchLoop
from core_logic.InversionSequencer import DefragEngine

class NarrativeEngine:
    def __init__(self, defrag_engine: DefragEngine = None):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
        self.standard_template_path = "data/prompts/glitch_explanation.txt"
        self.critical_template_path = "data/prompts/core_wound_reset.txt"
        self.defrag_engine = defrag_engine or DefragEngine()

    def _load_template(self, severity: str) -> str:
        path = self.critical_template_path if severity == "CRITICAL" else self.standard_template_path
        if not os.path.exists(path):
            if severity == "CRITICAL":
                return "CRITICAL LOOP: {root_ancestor} passed {shadow_name}. Manifestation: {victim_pattern}. Trigger: {trigger_mechanism}. Action: {action_step}"
            return "Ancestor: {ancestor_role}, Pattern: {shadow_name}, Manifestation: {victim_pattern}, Resolution: {gift_name}"
        with open(path, "r") as f:
            return f.read()

    def generate_glitch_report(self, glitch_data: GlitchLoop, user_id: str = None, user_strategy: str = None) -> Dict[str, Any]:
        """
        Generates a clear English explanation and structured protocol for a detected glitch loop.
        """
        severity = getattr(glitch_data, 'severity', 'NORMAL')
        template = self._load_template(severity)
        
        # Generate the specific protocol using DefragEngine, passing strategy
        protocol = self.defrag_engine.generate_protocol(
            glitch_data.gate, 
            glitch_data.line or 1, 
            glitch_data.shadow,
            user_strategy=user_strategy
        )
        
        # Extract variables for the template
        ancestor_role = glitch_data.path[0] if glitch_data.path else "Ancestor"
        root_ancestor = glitch_data.path[0] if glitch_data.path else "Origin Node"
        
        if severity == "CRITICAL":
            prompt = template.format(
                root_ancestor=root_ancestor,
                shadow_name=glitch_data.shadow,
                victim_pattern=glitch_data.victim_pattern or "N/A",
                trigger_mechanism=protocol.trigger_mechanism,
                contemplation_cue=protocol.contemplation_cue,
                action_step=protocol.action_step
            )
        else:
            prompt = template.format(
                ancestor_role=ancestor_role,
                shadow_name=glitch_data.shadow,
                victim_pattern=glitch_data.victim_pattern or "N/A",
                gift_name=glitch_data.gift
            )

        explanation = ""
        if not self.api_key:
            # Fallback if no API key is provided
            if severity == "CRITICAL":
                explanation = f"LINEAGE CORE WOUND: This {glitch_data.shadow} pattern originated with your {root_ancestor}. " \
                              f"It is a foundational OS constraint, not a personal failing. " \
                              f"To reset this loop: {protocol.action_step}"
            else:
                explanation = f"The Pattern: {glitch_data.shadow} passed from {ancestor_role}.\n" \
                              f"How it Affects You: {glitch_data.victim_pattern}\n" \
                              f"The Shift: Focus on {glitch_data.gift} to resolve this cycle."
        else:
            try:
                response = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are a helpful analyst of human dynamics."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 400
                    },
                    timeout=15
                )
                response.raise_for_status()
                result = response.json()
                explanation = result["choices"][0]["message"]["content"].strip()
            except Exception as e:
                print(f"Error calling LLM: {e}")
                # Fallback
                if severity == "CRITICAL":
                    explanation = f"LINEAGE CORE WOUND: This {glitch_data.shadow} pattern originated with your {root_ancestor}. Action: {protocol.action_step}"
                else:
                    explanation = f"The Pattern: {glitch_data.shadow} passed from {ancestor_role}. The Shift: Focus on {glitch_data.gift}."

        report = {
            "explanation": explanation,
            "defrag_protocol": protocol.model_dump(),
            "severity_level": severity
        }

        # Auto-log if user_id is provided
        if user_id:
            signature = {
                "gate": glitch_data.gate,
                "line": glitch_data.line,
                "ancestor": ancestor_role
            }
            self.save_report(user_id, signature, report)

        return report

    def save_report(self, user_id: str, signature: Dict[str, Any], report: Dict[str, Any]):
        """
        Persists the generated report to Supabase glitch_history.
        """
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not supabase_url or not supabase_key:
            return

        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "user_id": user_id,
            "glitch_signature": signature,
            "report_content": report,
            "status": "Active"
        }
        
        try:
            requests.post(
                f"{supabase_url}/rest/v1/glitch_history",
                headers=headers,
                json=payload
            )
        except Exception as e:
            print(f"Failed to save glitch history: {e}")

    def _load_weather_template(self) -> str:
        path = "data/prompts/daily_weather.txt"
        if not os.path.exists(path):
            return (
                "You are the 'Runtime Environment Monitor' for the DEFRAG system. "
                "Explain the current planetary transits (The Weather) to the user. "
                "Input: {user_strategy}, {user_authority}, {active_transits}, {impact_description}. "
                "Rules: 1. State this is external/temporary. 2. Warn not to act on it. 3. If a channel is completed, frame as 'Temporary Feature Unlock.' 4. Remind to return to strategy/authority. "
                "Tone: Objective, transient, protective. Length: <150 words."
            )
        with open(path, "r") as f:
            return f.read()

    def generate_weather_report(self, transit_report, user_strategy="Unknown", user_authority="Unknown", user_chart=None) -> str:
        """
        Generates a meteorologist-style weather report for the user's current transits.
        """
        template = self._load_weather_template()
        # Map active transits and temporary definitions to impact description
        active_gates = [str(t.get("gate")) for t in getattr(transit_report, "active_transits", [])]
        active_transits = ", ".join(active_gates) if active_gates else "None"
        impact_descs = []
        # Example: "Transit Sun in Gate 61 is defining your Open Head Center."
        for t in getattr(transit_report, "active_transits", []):
            planet = t.get("planet", "?")
            gate = t.get("gate", "?")
            impact_descs.append(f"Transit {planet} in Gate {gate}")
        for td in getattr(transit_report, "temporary_definitions", []):
            ch = td.get("channel", ("?", "?"))
            impact_descs.append(f"Temporary Channel Completion: {ch[0]}-{ch[1]}")
        impact_description = "; ".join(impact_descs) if impact_descs else "No significant transits."
        # Check for undefined Solar Plexus and emotional transit
        red_flag = ""
        if user_chart:
            # Assume user_chart is a ChartData instance
            # Solar Plexus gates: 6, 22, 30, 36, 37, 49, 55, 59
            solar_plexus_gates = {6, 22, 30, 36, 37, 49, 55, 59}
            user_gates = set()
            for field in user_chart.model_fields:
                pos = getattr(user_chart, field)
                if hasattr(pos, "gate"):
                    user_gates.add(pos.gate)
            undefined_sp = not any(g in user_gates for g in solar_plexus_gates)
            transit_sp = any(t.get("gate") in solar_plexus_gates for t in getattr(transit_report, "active_transits", []))
            if undefined_sp and transit_sp:
                red_flag = "\n[Red Flag] Do not make truth claims today; you are processing the collective's emotion."
        # Fill template
        narrative = template.format(
            user_strategy=user_strategy,
            user_authority=user_authority,
            active_transits=active_transits,
            impact_description=impact_description
        )
        if red_flag:
            narrative += red_flag
        return narrative


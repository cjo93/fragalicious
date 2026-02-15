import os
import requests
from typing import List, Dict, Any, Optional, Set
from .RelationshipDebugger import ChartComparator, InteractionType
from .CalculationEngine import ChartData
from .InversionSequencer import DefragEngine

class AncestralPatternFinder:
    def __init__(self):
        self.comparator = ChartComparator()
        self.defrag_engine = DefragEngine()
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        } if self.supabase_key else {}

    def _get_node(self, node_id: str) -> Optional[Dict[str, Any]]:
        if not self.supabase_url: return None
        try:
            res = requests.get(
                f"{self.supabase_url}/rest/v1/family_nodes?id=eq.{node_id}", 
                headers=self.headers
            )
            data = res.json()
            return data[0] if data else None
        except:
            return None

    def _get_parents(self, node_id: str) -> List[Dict[str, Any]]:
        if not self.supabase_url: return []
        try:
            # In our schema, edges represent connections. 
            # We assume source_node_id is the parent and target_node_id is the child.
            res = requests.get(
                f"{self.supabase_url}/rest/v1/family_edges?target_node_id=eq.{node_id}", 
                headers=self.headers
            )
            edges = res.json()
            parents = []
            for edge in edges:
                parent_node = self._get_node(edge['source_node_id'])
                if parent_node:
                    parents.append(parent_node)
            return parents
        except:
            return []

    def _get_gene_key_data(self, gate_number: int) -> Optional[Dict[str, Any]]:
        if not self.supabase_url: return None
        try:
            # hd_gates maps to gene_keys via gene_key_id
            # For simplicity, we assume gate_number == gene_key_number
            res = requests.get(
                f"{self.supabase_url}/rest/v1/gene_keys?key_number=eq.{gate_number}", 
                headers=self.headers
            )
            data = res.json()
            return data[0] if data else None
        except:
            return None

    def find_recursive_loops(self, start_node_id: str) -> List[Dict[str, Any]]:
        """
        Traverses the family tree upwards from start_node_id to find recursive conditioning loops
        and compounded ancestral patterns.
        """
        start_node = self._get_node(start_node_id)
        if not start_node or not start_node.get('mechanics_cache'):
            return []

        subject_chart = ChartData.model_validate(start_node['mechanics_cache'])
        subject_gates_map = self.comparator._get_active_gates_with_lines(subject_chart)
        subject_gates = set(subject_gates_map.keys())
        
        loops = []
        
        # 1. Get Parents
        parents = self._get_parents(start_node_id)
        
        for parent in parents:
            if not parent.get('mechanics_cache'): continue
            parent_chart = ChartData.model_validate(parent['mechanics_cache'])
            parent_gates_map = self.comparator._get_active_gates_with_lines(parent_chart)
            parent_gates = set(parent_gates_map.keys())
            
            # Let's check Grandparents
            grandparents = self._get_parents(parent['id'])
            
            for gparent in grandparents:
                if not gparent.get('mechanics_cache'): continue
                gparent_chart = ChartData.model_validate(gparent['mechanics_cache'])
                gparent_gates_map = self.comparator._get_active_gates_with_lines(gparent_chart)
                gparent_gates = set(gparent_gates_map.keys())
                
                # Check for recursive definition (Conditioning Source in 2+ generations)
                common_defined_ancestors = parent_gates.intersection(gparent_gates)
                
                for gate in common_defined_ancestors:
                    gk_data = self._get_gene_key_data(gate)
                    shadow = gk_data.get('shadow') if gk_data else "Unknown"
                    
                    # Scenario A: Ancestral Glitch Loop (Open in subject, defined in ancestors)
                    if gate not in subject_gates:
                        line = parent_gates_map[gate] # Use parent's line as the primary conditioning influence
                        protocol = self.defrag_engine.generate_protocol(gate, line, shadow)
                        
                        loops.append({
                            "gate": gate,
                            "line": line,
                            "type": "Ancestral Glitch Loop",
                            "severity": "NORMAL",
                            "path": [gparent['label'], parent['label'], start_node['label']],
                            "shadow": shadow,
                            "gift": gk_data.get('gift') if gk_data else "Unknown",
                            "victim_pattern": gk_data.get('victim_pattern') if gk_data else "Unknown",
                            "inversion_protocol": protocol.model_dump()
                        })
                    
                    # Scenario B: Lineage Core Wound (Defined in ALL 3 generations)
                    elif gate in subject_gates and gate in parent_gates and gate in gparent_gates:
                        line = subject_gates_map[gate]
                        protocol = self.defrag_engine.generate_protocol(gate, line, shadow)
                        
                        loops.append({
                            "gate": gate,
                            "line": line,
                            "type": "Lineage Core Wound",
                            "severity": "CRITICAL",
                            "tags": ["System Reset Required"],
                            "path": [gparent['label'], parent['label'], start_node['label']],
                            "shadow": shadow,
                            "gift": gk_data.get('gift') if gk_data else "Unknown",
                            "victim_pattern": gk_data.get('victim_pattern') if gk_data else "Unknown",
                            "inversion_protocol": protocol.model_dump()
                        })
                        
        return loops

import os
import json
import requests
import sys

# Add current directory and backend_context to path to import models
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend_context'))

try:
    from app.models import SeedData
except ImportError:
    from backend_context.app.models import SeedData

def bulk_import():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.")
        return

    json_path = os.path.join(os.getcwd(), 'data/full_gene_keys.json')
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, 'r') as f:
        raw_data = json.load(f)
        try:
            data = SeedData(**raw_data)
            print(f"Validation SUCCESS: {len(data.keys)} keys loaded.")
        except Exception as e:
            print(f"Validation FAILED: {e}")
            return

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # Prepare data for gene_keys table
    gene_keys_payload = []
    for entry in data.keys:
        gene_keys_payload.append({
            "key_number": entry.gate_number,
            "shadow": entry.shadow,
            "gift": entry.gift,
            "siddhi": entry.siddhi,
            "victim_pattern": entry.victim_pattern,
            "programming_partner": entry.programming_partner,
            "codon_group": entry.codon_group,
            "line_data": {k: v.model_dump() for k, v in entry.line_data.items()} if entry.line_data else None
        })

    print(f"Importing {len(gene_keys_payload)} gene_keys...")
    gk_res = requests.post(
        f"{supabase_url}/rest/v1/gene_keys",
        headers=headers,
        json=gene_keys_payload
    )
    if gk_res.status_code not in [200, 201]:
        print(f"Error importing gene_keys: {gk_res.status_code} - {gk_res.text}")
    else:
        print("Successfully imported gene_keys.")

    # Prepare data for hd_gates table
    hd_gates_payload = []
    for entry in data.keys:
        hd_gates_payload.append({
            "gate_number": entry.gate_number,
            "name": entry.gate_name,
            "center": entry.center,
            "circuit": entry.circuit,
            "gene_key_id": entry.gate_number
        })

    print(f"Importing {len(hd_gates_payload)} hd_gates...")
    hd_res = requests.post(
        f"{supabase_url}/rest/v1/hd_gates",
        headers=headers,
        json=hd_gates_payload
    )
    if hd_res.status_code not in [200, 201]:
        print(f"Error importing hd_gates: {hd_res.status_code} - {hd_res.text}")
    else:
        print("Successfully imported hd_gates.")

if __name__ == "__main__":
    bulk_import()

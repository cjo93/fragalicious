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
    # Fallback if the above fails due to directory structure
    from backend_context.app.models import SeedData

def seed_data():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use service role for upserting

    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.")
        print("Example:")
        print("export SUPABASE_URL=https://your-project.supabase.co")
        print("export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key")
        return

    json_path = os.path.join(os.getcwd(), 'data/seed_data.json')
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, 'r') as f:
        raw_data = json.load(f)
        data = SeedData(**raw_data)

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # Upsert Gene Keys
    gene_keys_data = []
    for entry in data.keys:
        gene_keys_data.append({
            "key_number": entry.gate_number,
            "shadow": entry.shadow,
            "gift": entry.gift,
            "siddhi": entry.siddhi,
            "victim_pattern": entry.victim_pattern,
            "programming_partner": entry.programming_partner,
            "codon_group": entry.codon_group
        })

    print(f"Seeding {len(gene_keys_data)} gene_keys...")
    gk_response = requests.post(
        f"{supabase_url}/rest/v1/gene_keys",
        headers=headers,
        json=gene_keys_data
    )
    if gk_response.status_code not in [200, 201]:
        print(f"Error seeding gene_keys: {gk_response.status_code} - {gk_response.text}")
    else:
        print(f"Successfully seeded gene_keys.")

    # Upsert HD Gates
    hd_gates_data = []
    for entry in data.keys:
        hd_gates_data.append({
            "gate_number": entry.gate_number,
            "name": entry.gate_name,
            "center": entry.center,
            "circuit": entry.circuit,
            "gene_key_id": entry.gate_number
        })

    print(f"Seeding {len(hd_gates_data)} hd_gates...")
    hd_response = requests.post(
        f"{supabase_url}/rest/v1/hd_gates",
        headers=headers,
        json=hd_gates_data
    )
    if hd_response.status_code not in [200, 201]:
        print(f"Error seeding hd_gates: {hd_response.status_code} - {hd_response.text}")
    else:
        print(f"Successfully seeded hd_gates.")

if __name__ == "__main__":
    seed_data()

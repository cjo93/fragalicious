import os
from dotenv import load_dotenv
load_dotenv()

import requests
from datetime import datetime
from .CalculationEngine import ChartData

def create_user_profile(user_id: str, full_name: str, birth_data: dict, chart_data: ChartData):
    """
    Creates/updates a user profile, saves their natal chart, and initializes their family node.
    
    birth_data should contain:
    - date: YYYY-MM-DD
    - time: HH:MM
    - location_name: string
    - lat: float
    - lon: float
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing")
        return None

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    # 1. Update Profile (Upsert)
    # Postgrest uses POINT format '(lon,lat)' for Postgres POINT type.
    profile_data = {
        "id": user_id,
        "full_name": full_name,
        "birth_date": f"{birth_data['date']}T{birth_data['time']}:00Z",
        "birth_location_name": birth_data['location_name'],
        "birth_lat_lon": f"({birth_data['lon']},{birth_data['lat']})",
        "subscription_status": "free"
    }
    
    try:
        requests.post(
            f"{supabase_url}/rest/v1/profiles",
            headers={**headers, "Prefer": "resolution=merge-duplicates"},
            json=profile_data
        )
    except Exception as e:
        print(f"Failed to update profile: {e}")

    # 2. Save Natal Chart
    natal_chart_payload = {
        "user_id": user_id,
        "birth_data": birth_data,
        "planetary_positions": chart_data.model_dump(),
        "calculated_at": datetime.utcnow().isoformat()
    }
    try:
        requests.post(
            f"{supabase_url}/rest/v1/natal_charts",
            headers=headers,
            json=natal_chart_payload
        )
    except Exception as e:
        print(f"Failed to save natal chart: {e}")

    # 3. Create Root Family Node (Type: Self)
    family_node_payload = {
        "user_id": user_id,
        "label": "Self",
        "type": "self",
        "mechanics_cache": chart_data.model_dump()
    }
    try:
        node_response = requests.post(
            f"{supabase_url}/rest/v1/family_nodes",
            headers=headers,
            json=family_node_payload
        )
        if node_response.status_code in [200, 201]:
            node_data = node_response.json()
            if node_data:
                return node_data[0]["id"]
    except Exception as e:
        print(f"Failed to create family node: {e}")
    
    return None

def create_family_edge(source_node_id: str, target_node_id: str, relation: str = 'parent'):
    """
    Creates a family edge (relationship) between two nodes in the family_edges table.
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing")
        return None
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    edge_payload = {
        "source": source_node_id,
        "target": target_node_id,
        "relation": relation
    }
    try:
        edge_response = requests.post(
            f"{supabase_url}/rest/v1/family_edges",
            headers=headers,
            json=edge_payload
        )
        if edge_response.status_code in [200, 201]:
            return edge_response.json()
    except Exception as e:
        print(f"Failed to create family edge: {e}")
    return None

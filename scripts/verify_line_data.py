import os
import json
import requests
import sys

# Add current directory and backend_context to path to import models
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend_context'))

def verify_line_data():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.")
        return

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }

    print("Fetching gene_keys from Supabase...")
    response = requests.get(
        f"{supabase_url}/rest/v1/gene_keys?select=key_number,shadow,line_data",
        headers=headers
    )

    if response.status_code != 200:
        print(f"Error fetching gene_keys: {response.status_code} - {response.text}")
        return

    gene_keys = response.json()
    missing_data = []

    for gk in gene_keys:
        key_num = gk['key_number']
        line_data = gk.get('line_data')
        
        if not line_data:
            missing_data.append(key_num)
            continue
            
        # Check if all 6 lines are present
        for i in range(1, 7):
            if str(i) not in line_data:
                missing_data.append(f"{key_num} (Line {i} missing)")

    print(f"\nVerification Report:")
    print(f"Total Gene Keys scanned: {len(gene_keys)}")
    print(f"Keys with missing/incomplete line_data: {len(missing_data)}")
    
    if missing_data:
        print("\nMissing Details:")
        for item in missing_data:
            print(f"- Gate {item}")
    else:
        print("\nAll Gene Keys have complete line_data. System status: OPTIMAL.")

if __name__ == "__main__":
    verify_line_data()

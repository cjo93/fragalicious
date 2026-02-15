"""
Seed the database with real family constellation data for DEFRAG V1.0
Actors: All data loaded from environment variables for privacy.
"""

import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

import uuid
from core_logic.profile_service import create_user_profile, create_family_edge
from core_logic.CalculationEngine import engine
from datetime import datetime
from geopy.geocoders import Nominatim

def safe_dt(date_str, time_str=None):
    if not time_str:
        time_str = '12:00'
    return datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")

def get_lat_lon(city, state):
    geolocator = Nominatim(user_agent="defrag_seed")
    try:
        loc = geolocator.geocode(f"{city}, {state}")
        if loc:
            return loc.latitude, loc.longitude
    except Exception as e:
        print("Geocoding error for city/state")
    return 34.05, -118.25  # Default to LA

# 1. Define actors (all data from environment variables)
# All personal data is loaded from environment variables. No hardcoded names or locations.
actors = [
    {
        'id': 'self',
        'name': os.getenv('SELF_NAME', 'Root User'),
        'date': os.getenv('SELF_BIRTH_DATE', '1990-01-01'),
        'time': os.getenv('SELF_BIRTH_TIME', '12:00'),
        'city': os.getenv('SELF_BIRTH_CITY', 'City'),
        'state': os.getenv('SELF_BIRTH_STATE', 'ST'),
        'role': 'Root',
    },
    {
        'id': 'fred',
        'name': os.getenv('FRED_NAME', 'Ancestor 1'),
        'date': os.getenv('FRED_BIRTH_DATE', '1950-01-01'),
        'time': os.getenv('FRED_BIRTH_TIME', '12:00'),
        'city': os.getenv('FRED_BIRTH_CITY', 'City'),
        'state': os.getenv('FRED_BIRTH_STATE', 'ST'),
        'role': 'Grandfather',
    },
    {
        'id': 'joanne',
        'name': os.getenv('JOANNE_NAME', 'Ancestor 2'),
        'date': os.getenv('JOANNE_BIRTH_DATE', '1950-01-01'),
        'time': os.getenv('JOANNE_BIRTH_TIME', '12:00'),
        'city': os.getenv('JOANNE_BIRTH_CITY', 'City'),
        'state': os.getenv('JOANNE_BIRTH_STATE', 'ST'),
        'role': 'Grandmother',
    },
    {
        'id': 'stacy',
        'name': os.getenv('STACY_NAME', 'Ancestor 3'),
        'date': os.getenv('STACY_BIRTH_DATE', '1960-01-01'),
        'time': os.getenv('STACY_BIRTH_TIME', '12:00'),
        'city': os.getenv('STACY_BIRTH_CITY', 'City'),
        'state': os.getenv('STACY_BIRTH_STATE', 'ST'),
        'role': 'Mother',
    },
    {
        'id': 'troy',
        'name': os.getenv('TROY_NAME', 'Ancestor 4'),
        'date': os.getenv('TROY_BIRTH_DATE', '1960-01-01'),
        'time': os.getenv('TROY_BIRTH_TIME', '12:00'),
        'city': os.getenv('TROY_BIRTH_CITY', 'City'),
        'state': os.getenv('TROY_BIRTH_STATE', 'ST'),
        'role': 'Step-Father',
    },
    {
        'id': 'chris',
        'name': os.getenv('CHRIS_NAME', 'Peer 1'),
        'date': os.getenv('CHRIS_BIRTH_DATE', '1980-01-01'),
        'time': os.getenv('CHRIS_BIRTH_TIME', '12:00'),
        'city': os.getenv('CHRIS_BIRTH_CITY', 'City'),
        'state': os.getenv('CHRIS_BIRTH_STATE', 'ST'),
        'role': 'Collaborator',
    },
    {
        'id': 'erik',
        'name': os.getenv('ERIK_NAME', 'Peer 2'),
        'date': os.getenv('ERIK_BIRTH_DATE', '1980-01-01'),
        'time': os.getenv('ERIK_BIRTH_TIME', '12:00'),
        'city': os.getenv('ERIK_BIRTH_CITY', 'City'),
        'state': os.getenv('ERIK_BIRTH_STATE', 'ST'),
        'role': 'Conflict',
    },
]

# 2. Create profiles and charts
profiles = {}
node_ids = {}
for actor in actors:
    print(f"Seeding {actor['role']}...")  # Generic log, no personal data
    lat, lon = get_lat_lon(actor['city'], actor['state'])
    birth_data = {
        'date': actor['date'],
        'time': actor['time'],
        'location_name': f"{actor['city']}, {actor['state']}",
        'lat': lat,
        'lon': lon
    }
    chart = engine.calculate(actor['date'], actor['time'], lat, lon)
    user_id = str(uuid.uuid4())
    node_id = create_user_profile(user_id, actor['name'], birth_data, chart)
    profiles[actor['id']] = user_id
    node_ids[actor['id']] = node_id

# 3. Create family edges (use node_ids for source/target)
print("Creating family edges...")
create_family_edge(node_ids['fred'], node_ids['stacy'], relation='parent')
create_family_edge(node_ids['joanne'], node_ids['stacy'], relation='parent')
create_family_edge(node_ids['stacy'], node_ids['self'], relation='parent')
create_family_edge(node_ids['troy'], node_ids['self'], relation='step-parent')
create_family_edge(node_ids['chris'], node_ids['self'], relation='peer')
create_family_edge(node_ids['erik'], node_ids['self'], relation='conflict')

print("Seeding complete. Run the dashboard and perform your first audit.")

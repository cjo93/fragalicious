import swisseph as swe
import pytz
from datetime import datetime, timedelta
from timezonefinder import TimezoneFinder
from geopy.geocoders import Nominatim
from pydantic import BaseModel
from typing import List, Dict, Tuple, Optional
import os
import math

# Configure Swiss Ephemeris
# If no path is set, it looks in standard locations.
# We set it to the project's ephe directory if it exists, otherwise standard.
EPHE_PATH = os.getenv("SE_EPHE_PATH", os.path.join(os.getcwd(), "ephe"))
if os.path.exists(EPHE_PATH):
    swe.set_ephe_path(EPHE_PATH)

class PlanetPosition(BaseModel):
    name: str
    longitude: float
    gate: int
    line: int
    zodiac_sign: str

class ChartData(BaseModel):
    sun: PlanetPosition
    earth: PlanetPosition
    moon: PlanetPosition
    north_node: PlanetPosition
    south_node: PlanetPosition
    mercury: PlanetPosition
    venus: PlanetPosition
    mars: PlanetPosition
    jupiter: PlanetPosition
    saturn: PlanetPosition
    uranus: PlanetPosition
    neptune: PlanetPosition
    pluto: PlanetPosition

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# HD Wheel Order (Standard RAV Wheel starting from Gate 41 at Aquarius)
HD_GATES_ORDER = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24,
    2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4,
    29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34,
    9, 5, 26, 11, 10, 58, 38, 54, 61, 60
]

def get_zodiac(longitude: float) -> str:
    idx = int(longitude / 30)
    return ZODIAC_SIGNS[idx % 12]

def get_hd_coords(longitude: float) -> Tuple[int, int]:
    """
    Returns (Gate, Line).
    Reference: Gate 41 start = 302.25 degrees.
    """
    # Normalize to 0-360
    lon = longitude % 360

    # Offset so 0 = Start of Gate 41
    # Gate 41.1 starts at 302° 15' (302.25°).
    adjusted_lon = (lon - 302.25) % 360

    # Each gate is 5.625 degrees (360 / 64)
    gate_idx_float = adjusted_lon / 5.625
    gate_idx = int(gate_idx_float)

    if gate_idx >= 64: gate_idx = 0

    gate = HD_GATES_ORDER[gate_idx]

    # Each line is 1/6th of a gate (0.9375 degrees)
    gate_fraction = gate_idx_float - gate_idx
    line = int(gate_fraction * 6) + 1 # 1-6

    return gate, line

class CalculationEngine:
    def __init__(self):
        self.tf = TimezoneFinder()
        self.geolocator = Nominatim(user_agent="defrag_app_v1")

    def get_lat_lon(self, location_str: str) -> Tuple[float, float]:
        """Geocodes a location string to (lat, lon)."""
        try:
            loc = self.geolocator.geocode(location_str)
            if loc:
                return loc.latitude, loc.longitude
        except Exception as e:
            print(f"Geocoding error: {e}")
        return 52.52, 13.40 # Fallback to Berlin

    def calculate(self, date_str: str, time_str: str, lat: float, lon: float, time_unknown: bool = False) -> ChartData:
        """
        Accepts date (YYYY-MM-DD), time (HH:MM), lat, lon.
        If time_unknown is True, defaults to 12:00 PM and marks fast points as unreliable.
        """
        if time_unknown:
            time_str = "12:00"
        # 1. Determine Timezone
        tz_name = self.tf.timezone_at(lng=lon, lat=lat)
        if not tz_name:
            tz_name = 'UTC'
        local_tz = pytz.timezone(tz_name)
        # 2. Local Datetime
        dt_local = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        dt_localized = local_tz.localize(dt_local)
        # 3. Convert to UTC
        dt_utc = dt_localized.astimezone(pytz.UTC)
        # 4. Julian Day
        jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day,
                        dt_utc.hour + dt_utc.minute/60.0 + dt_utc.second/3600.0)
        # 5. Calculate Planets
        planets = {}
        bodies = [
            (swe.SUN, "Sun"), (swe.MOON, "Moon"), (swe.MEAN_NODE, "North Node"),
            (swe.MERCURY, "Mercury"), (swe.VENUS, "Venus"), (swe.MARS, "Mars"),
            (swe.JUPITER, "Jupiter"), (swe.SATURN, "Saturn"), (swe.URANUS, "Uranus"),
            (swe.NEPTUNE, "Neptune"), (swe.PLUTO, "Pluto")
        ]
        for body_id, name in bodies:
            res = swe.calc_ut(jd, body_id)
            longk = res[0][0]
            gate, line = get_hd_coords(longk)
            planets[name.lower().replace(" ", "_")] = PlanetPosition(
                name=name,
                longitude=longk,
                gate=gate,
                line=line,
                zodiac_sign=get_zodiac(longk)
            )
        # 6. Derived Points
        earth_lon = (planets["sun"].longitude + 180) % 360
        e_gate, e_line = get_hd_coords(earth_lon)
        earth = PlanetPosition(name="Earth", longitude=earth_lon, gate=e_gate, line=e_line, zodiac_sign=get_zodiac(earth_lon))
        sn_lon = (planets["north_node"].longitude + 180) % 360
        sn_gate, sn_line = get_hd_coords(sn_lon)
        south_node = PlanetPosition(name="South Node", longitude=sn_lon, gate=sn_gate, line=sn_line, zodiac_sign=get_zodiac(sn_lon))
        # If time is unknown, mark Moon as unreliable
        if time_unknown:
            planets["moon"] = PlanetPosition(name="Moon", longitude=-1, gate=-1, line=-1, zodiac_sign="N/A")
        return ChartData(
            sun=planets["sun"],
            earth=earth,
            moon=planets["moon"],
            north_node=planets["north_node"],
            south_node=south_node,
            mercury=planets["mercury"],
            venus=planets["venus"],
            mars=planets["mars"],
            jupiter=planets["jupiter"],
            saturn=planets["saturn"],
            uranus=planets["uranus"],
            neptune=planets["neptune"],
            pluto=planets["pluto"]
        )

# Global instance
engine = CalculationEngine()

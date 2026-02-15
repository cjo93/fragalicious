from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import swisseph as swe
from typing import Optional

app = FastAPI()

class BirthData(BaseModel):
    date: str
    time: Optional[str] = None
    lat: float
    lon: float

@app.post("/api/engine/calculate")
async def calculate_chart(data: BirthData):
    try:
        # THE NOON STABLE PROTOCOL
        is_noon_stable = False
        if not data.time:
            data.time = "12:00"
            is_noon_stable = True
        # [Insert Swiss Ephemeris Logic Here]
        # ... calculation ...
        # MASKING LOGIC
        response = {
            "sun": "calculated_sun_gate",
            "earth": "calculated_earth_gate",
            "moon": "UNCERTAIN" if is_noon_stable else "calculated_moon_gate",
            "fidelity": "NOON_STABLE" if is_noon_stable else "EXACT"
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- NEW: Minimal lineage endpoint for dashboard unblock ---
class Node(BaseModel):
    id: str
    label: str

class Edge(BaseModel):
    id: str
    source: str
    target: str

@app.get("/v1/analyze/lineage/{root_id}")
async def get_lineage(root_id: str):
    print("DEBUG: Serving updated get_lineage endpoint - Feb 15, 2026")
    # Return nodes/edges with 'data' property for React Flow
    return {
        "nodes": [
            {
                "id": "1",
                "type": "default",
                "position": {"x": 250, "y": 150},
                "data": {
                    "id": "1",
                    "type": "NODE",
                    "name": "You (Guide)",
                    "avatar_seed": "Chad",
                    "mechanics": {
                        "engine": "LUNAR",
                        "authority": "SPLENIC",
                        "profile": "5/1",
                        "strategy": "Wait"
                    },
                    "shadow": "BITTERNESS"
                }
            },
            {
                "id": "2",
                "type": "default",
                "position": {"x": 450, "y": 150},
                "data": {
                    "id": "2",
                    "type": "NODE",
                    "name": "Mother",
                    "avatar_seed": "Stacy",
                    "mechanics": {
                        "engine": "SOLAR",
                        "authority": "SACRAL",
                        "profile": "2/4",
                        "strategy": "Respond"
                    },
                    "shadow": "FRUSTRATION"
                }
            }
        ],
        "edges": [
            {
                "id": "e1-2",
                "source": "1",
                "target": "2",
                "data": {
                    "id": "e1-2",
                    "type": "EDGE",
                    "source": "1",
                    "target": "2",
                    "relationship": "Parent",
                    "bowen": {"dynamic": "FUSION", "intensity": 8},
                    "friction_point": "Sacral Overload",
                    "recommended_script_id": "boundary_script"
                },
                "animated": True,
                "style": {"stroke": "#D4AF37", "strokeWidth": 4, "opacity": 0.9}
            }
        ]
    }

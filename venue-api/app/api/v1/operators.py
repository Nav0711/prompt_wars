from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime
from app.core.twin import venue_twin

router = APIRouter()

class Incident(BaseModel):
    id: str
    zone: str
    type: str
    description: str
    severity: str
    status: str
    time: str

# Mock incident DB
incidents = [
    { "id": "INC-042", "zone": "Gate B", "type": "Bottleneck", "description": "Throughput exceeding 85% capacity.", "severity": "high", "status": "active", "time": "18:42" },
]

@app_router := APIRouter() # Renamed to avoid name clash if needed, but router is standard

@router.get("/incidents", response_model=List[Incident])
async def get_incidents():
    return incidents

@router.post("/dispatch/{incident_id}")
async def dispatch_staff(incident_id: str, team: str):
    # Search for incident and update status
    for inc in incidents:
        if inc["id"] == incident_id:
            inc["status"] = "dispatched"
            return {"status": "success", "message": f"Team {team} dispatched to {inc['zone']}"}
    return {"status": "error", "message": "Incident not found"}

@router.get("/heatmap")
async def get_heatmap():
    return venue_twin.get_full_state()["zones"]

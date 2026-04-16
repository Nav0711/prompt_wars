from fastapi import APIRouter
from typing import Optional
from app.core.twin import venue_twin

router = APIRouter()

@router.get("/waits")
async def get_all_waits():
    """
    Returns live wait times for all concession stands.
    """
    return venue_twin.get_full_state()["stands"]

@router.get("/waits/{stand_id}")
async def get_stand_wait(stand_id: str):
    state = venue_twin.get_full_state()
    for stand in state["stands"]:
        if stand["id"] == stand_id:
            return stand
    return {"error": "Stand not found"}

@router.get("/navigation/nearest/{poi_type}")
async def get_nearest_poi(poi_type: str, current_section: Optional[str] = None):
    # In a full system, this would use PostGIS for spatial queries.
    # For the prototype, we return the optimized mock response.
    return {
        "destination": f"{poi_type.capitalize()} (Section 204)",
        "distance": "120m",
        "predicted_time": "3m",
        "route_status": "clear"
    }

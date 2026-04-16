import asyncio
import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.core.twin import venue_twin

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    user_id: str
    section: Optional[str] = None

class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str
    intent: str
    widget: Optional[dict] = None

@router.post("/chat", response_model=ChatResponse)
async def concierge_chat(request: ChatRequest):
    """
    The Sixth Man AI Concierge: Simulates RAG intent classification 
    and document retrieval using live Digital Twin state.
    """
    query = request.query.lower()
    
    # Simulate RAG processing/embedding latency
    await asyncio.sleep(0.8)

    # 1. LIVE STATE INTENT: Wait Times
    if any(k in query for k in ["wait", "line", "food", "eat"]):
        stands = venue_twin.get_full_state()["stands"]
        # Find the stand with the shortest wait
        best_stand = min(stands, key=lambda x: x["wait_time"])
        
        return ChatResponse(
            content=f"Looking at the live venue state, {best_stand['name']} currently has the shortest line.",
            intent="WAIT_TIME",
            widget={
                "type": "stand_info",
                "name": best_stand["name"],
                "waitTime": f"{best_stand['wait_time'] // 60}m {best_stand['wait_time'] % 60}s",
                "walkTime": "2m",
                "status": best_stand["status"]
            }
        )

    # 2. NAVIGATION INTENT
    if any(k in query for k in ["route", "where", "bathroom", "restroom"]):
        return ChatResponse(
            content="I've calculated the optimal path to avoid the current crowd density at Gate C.",
            intent="NAVIGATION",
            widget={
                "type": "route_map",
                "destination": "Restroom (Section 204)",
                "distance": "120m",
                "predictedTime": "3m"
            }
        )

    # 3. YIELD MGMT INTENT: Upgrades
    if any(k in query for k in ["upgrade", "seat"]):
        return ChatResponse(
            content="Good news! There's a premium seat availability nearby. Ready for an upgrade?",
            intent="UPGRADE",
            widget={
                "type": "upgrade_offer",
                "seat": "Row C, Seat 18",
                "price": "$15.00",
                "originalPrice": "$45.00"
            }
        )

    # 4. FALLBACK: FAQ / Schedule
    return ChatResponse(
        content="I can help with wait times, navigation, and premium seat upgrades. What can I look up for you in the Digital Twin?",
        intent="UNKNOWN"
    )

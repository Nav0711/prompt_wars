import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.twin import venue_twin
from app.api.v1 import operators, attendees, concierge

app = FastAPI(
    title="SmartVenue AI API",
    description="High-performance Digital Twin back-end for venue operations.",
    version="1.0.0"
)

# Enable CORS for the frontend dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    # Start the background simulation loop
    asyncio.create_task(venue_twin.simulate_updates())
    # Start the broadcast loop
    asyncio.create_task(broadcast_state())

async def broadcast_state():
    """
    State Broadcaster: Pushes the current Digital Twin state to all 
    connected operators via WebSockets at 1Hz.
    """
    while True:
        state = venue_twin.get_full_state()
        await manager.broadcast(state)
        await asyncio.sleep(1.0) 

@app.websocket("/ws/twin")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive
            data = await websocket.receive_text()
            # Handle incoming client commands if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Include API Routers
app.include_router(operators.router, prefix="/api/v1/operators", tags=["operators"])
app.include_router(attendees.router, prefix="/api/v1/attendees", tags=["fans"])
app.include_router(concierge.router, prefix="/api/v1/concierge", tags=["ai"])

@app.get("/")
async def root():
    return {"status": "SmartVenue AI Backend Running", "engine": "Digital Twin v1.0"}

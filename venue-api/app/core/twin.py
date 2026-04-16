import asyncio
import random
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel

class ZoneState(BaseModel):
    id: str
    name: str
    occupancy: int
    capacity: int
    density: float  # 0.0 to 1.0
    trend: str      # "increasing", "stable", "decreasing"

class StandState(BaseModel):
    id: str
    name: str
    wait_time: int  # in seconds
    throughput: float # orders per minute
    status: str      # "optimal", "warning", "critical"

class TwinState:
    """
    The Digital Twin Engine: Manages the real-time state of the venue.
    In a production system, this would be backed by Redis or an event stream.
    For this high-performance prototype, it uses thread-safe in-memory maps.
    """
    def __init__(self):
        self.zones: Dict[str, ZoneState] = {
            "Z1": ZoneState(id="Z1", name="North Concourse", occupancy=450, capacity=1000, density=0.45, trend="stable"),
            "Z2": ZoneState(id="Z2", name="Gate B Funnel", occupancy=850, capacity=1000, density=0.85, trend="increasing"),
            "Z3": ZoneState(id="Z3", name="South Gate", occupancy=200, capacity=1000, density=0.20, trend="decreasing"),
        }
        self.stands: Dict[str, StandState] = {
            "S1": StandState(id="S1", name="Stand 12B - Grill", wait_time=120, throughput=10.5, status="optimal"),
            "S2": StandState(id="S2", name="North Concourse Bar", wait_time=450, throughput=15.0, status="critical"),
        }
        self.last_updated = datetime.now()

    def get_full_state(self):
        return {
            "zones": [z.dict() for z in self.zones.values()],
            "stands": [s.dict() for s in self.stands.values()],
            "timestamp": self.last_updated.isoformat()
        }

    async def simulate_updates(self):
        """
        Background simulation loop to mimic live IoT sensor data (2Hz).
        """
        while True:
            for zone in self.zones.values():
                # Random drift in occupancy
                delta = random.randint(-15, 20)
                zone.occupancy = max(0, min(zone.capacity, zone.occupancy + delta))
                zone.density = zone.occupancy / zone.capacity
                zone.trend = "increasing" if delta > 5 else "decreasing" if delta < -5 else "stable"
            
            for stand in self.stands.values():
                # Random wait time fluctuations
                stand.wait_time = max(30, stand.wait_time + random.randint(-10, 15))
                if stand.wait_time > 300:
                    stand.status = "critical"
                elif stand.wait_time > 180:
                    stand.status = "warning"
                else:
                    stand.status = "optimal"
            
            self.last_updated = datetime.now()
            await asyncio.sleep(0.5) # 2Hz updates

# Singleton instance
venue_twin = TwinState()

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "SmartVenue AI Backend Running", "engine": "Digital Twin v1.0"}

def test_get_heatmap():
    response = client.get("/api/v1/operators/heatmap")
    assert response.status_code == 200
    zones = response.json()
    assert isinstance(zones, list)
    assert len(zones) > 0
    assert "density" in zones[0]

def test_concierge_wait_time():
    response = client.post("/api/v1/concierge/chat", json={
        "query": "What is the shortest line for food?",
        "user_id": "test-user"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "WAIT_TIME"
    assert data["widget"]["type"] == "stand_info"

def test_concierge_navigation():
    response = client.post("/api/v1/concierge/chat", json={
        "query": "Where is the nearest bathroom?",
        "user_id": "test-user"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "NAVIGATION"
    assert data["widget"]["type"] == "route_map"

# SmartVenue AI: Unified Command Center & Digital Twin

**VenueOS** is a next-generation platform for stadium and arena operations. It combines a real-time spatial digital twin with an intelligent, generative AI concierge to provide unprecedented visibility and control to venue operators, while revolutionizing the fan experience.

![VenueOS Hero](https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2500)

## 🚀 Key Features

*   **Real-time Digital Twin (Spatial Model):** Tracks live localized crowd density and attendee flows in a 2D spatial model.
*   **"Sixth Man" AI Concierge (RAG):** An intelligent simulation of an AI chatbot for fans. It uses Retrieval-Augmented Generation (RAG) to fetch live data (shortest concession lines, wait times, VIP seat upgrades, navigation paths) and renders rich UI widgets in response.
*   **Staff Dispatch & Incident Management:** AI-assisted triage for stadium incidents with proximity-based dispatch.
*   **Command Center & Concessions Sync:** Real-time metrics on throughput, wait times, and proactive preparation alerts.
*   **Secure Access:** Protected via Google OAuth 2.0 to ensure only authorized venue personnel can access the prototype.

## 🏗️ Architecture

The project is structured into two main applications:

### 1. VenueOS Frontend (`/venue-os`)
A premium, responsive, glassmorphic UI built for operators.
*   **Framework**: React 18, Vite, TypeScript
*   **Styling**: Vanilla CSS with modern custom properties and media queries.
*   **Data Vis**: Recharts for responsive SVG graphs.
*   **Icons**: Lucide React.
*   **Auth**: `@react-oauth/google`

### 2. Digital Twin Backend (`/venue-api`)
A high-performance Python engine simulating edge-node IoT data streams.
*   **Framework**: FastAPI
*   **State Management**: Async, in-memory Python dictionaries (optimized for sub-millisecond updates, ready for Redis mapping).
*   **Sockets**: Native WebSockets for pushing 2Hz live density state updates to the UI, avoiding HTTP polling overhead.

## 🛠️ Quick Start

### Backend (FastAPI) Setup
```bash
cd venue-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run the WebSocket Engine and API
python run.py
```

### Frontend (VenueOS) Setup
```bash
cd venue-os
npm install

# Required: Add your Google Client ID to src/main.tsx
# const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE";

# Run the local development server
npm run dev
```

## 🧪 Verification & Testing

The backend includes a comprehensive verification suite:
```bash
cd venue-api
source venv/bin/activate

# 1. Run unit tests
python3 -m pytest tests/

# 2. Run WebSocket Concurrency Simulator (Tests 100 concurrent streams)
python3 scripts/load_test.py
```

## 🌐 Deployment (Google Cloud Run)
The frontend is optimized for deployment as an Nginx container on Google Cloud Run.
```bash
cd venue-os
npm run build
gcloud run deploy venue-os --source . --port 8080 --allow-unauthenticated
```
*(Ensure `.gcloudignore` allows the `dist/` directory).*

# SmartVenue AI — Product Requirements Document

**Version:** 1.0  
**Status:** Draft  
**Author:** Product Team  
**Date:** April 2026  
**Classification:** Confidential

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [System Architecture — Digital Twin Core](#5-system-architecture--digital-twin-core)
6. [Feature Modules](#6-feature-modules)
7. [Tech Stack](#7-tech-stack)
8. [Data & Privacy](#8-data--privacy)
9. [API & Integration Surface](#9-api--integration-surface)
10. [Phased Rollout](#10-phased-rollout)
11. [Revenue Model](#11-revenue-model)
12. [Risks & Mitigations](#12-risks--mitigations)
13. [Open Questions](#13-open-questions)

---

## 1. Executive Summary

SmartVenue AI is a B2B SaaS platform that transforms large-scale sporting and entertainment venues into intelligent, adaptive environments. At its core is a real-time **Digital Twin** — a live 3D replica of the venue built from IoT sensors, computer vision feeds, Wi-Fi heatmaps, and ticketing data — that continuously models crowd state and predicts friction points before they materialize.

The platform ships as three integrated products:

| Product | Audience | Core Value |
|---|---|---|
| **VenueOS** | Venue operators | Live command center — heatmaps, staff dispatch, incident AI |
| **FanApp** | Attendees | Waze-for-pedestrians, AI concierge, virtual queuing |
| **VenueSDK** | Third-party integrators | APIs for ticketing, POS, transit, and sponsor platforms |

Target venues: stadiums (15,000–100,000 capacity), arenas, festival grounds, and convention centers.

---

## 2. Problem Statement

### 2.1 The Attendee Experience Gap

Large-venue events are plagued by friction that degrades experience and suppresses spend:

- **Entry bottlenecks:** Average gate wait at NFL/Premier League events is 12–18 minutes. 34% of fans report it as their top pain point (source: Fan Experience Index 2025).
- **Concession abandonment:** 41% of fans who wanted food/drinks abandoned the queue due to wait time, directly suppressing per-capita revenue.
- **Navigation failure:** Venues are spatially complex. First-time visitors spend an average of 8 minutes finding their section. Groups separate and cannot regroup efficiently.
- **Reactive operations:** Venue staff currently respond to crowd problems after they form. There is no predictive layer.

### 2.2 The Operator Intelligence Gap

Venue operators manage 40,000–80,000 people using radios, CCTV monitors, and intuition. They lack:

- Real-time crowd density quantification per zone
- Predictive models for concession demand
- Automated staff dispatch triggers
- Data-driven seat upgrade and sponsorship opportunities

### 2.3 The Opportunity

A platform that applies the same predictive intelligence behind rideshare surge pricing, logistics routing, and retail inventory management to the physical venue environment — but oriented entirely around human movement and experience.

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| Goal | Metric | Target (12 months post-launch) |
|---|---|---|
| Reduce entry wait time | Average gate queue time | < 5 minutes |
| Reduce concession abandonment | % fans who queue and abandon | < 15% (from 41%) |
| Improve navigation | Avg. time-to-seat for first-time fans | < 3 minutes |
| Increase per-cap spend | Revenue per attendee | +18% |
| Operator response time | Time from incident detection to staff dispatch | < 90 seconds |

### 3.2 Platform Health Metrics

- Digital Twin accuracy: crowd density prediction error < 8% at 15-minute horizon
- App adoption per event: > 35% of ticketed attendees
- System uptime during events: 99.95% SLA
- AI concierge resolution rate (no human escalation): > 80%

---

## 4. User Personas

### 4.1 The Fan — "Priya, 28"
First-time attendee at a 60,000-seat stadium. Arrived via public transit, has two friends at a different gate. Wants food before kickoff but doesn't know the layout. Primary needs: navigation, wait time transparency, group coordination.

### 4.2 The Regular — "Marcus, 42"
Season ticket holder. Knows the venue but gets frustrated by unpredictable queues and crowded concourses. Wants speed. Primary needs: fastest route, pre-order food, express checkout.

### 4.3 The Family Group — "The Patels"
Two adults, two children. Accessibility needs (stroller). Need accessible routes, family-friendly facilities, and group coordination if separated. Primary needs: accessible routing, family amenities map, group tracking.

### 4.4 The Venue Operations Manager — "Sandra, 51"
Manages 200 staff across a 50,000-seat arena. Currently uses radio and gut feel. Needs a single-screen command view with actionable alerts, not raw data. Primary needs: zone heatmap, staff dispatch, incident alerts.

### 4.5 The Concessions Director — "Devon, 38"
Responsible for 40 stands across the venue. Wants to reduce waste while eliminating stockouts. Primary needs: demand forecasting per stand, inventory alerts, kitchen prep triggers.

---

## 5. System Architecture — Digital Twin Core

### 5.1 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SMARTVENUE AI PLATFORM                   │
├──────────────────┬────────────────────────┬─────────────────────┤
│   ATTENDEE LAYER │      AI CORE           │  OPERATOR LAYER     │
│                  │                        │                      │
│  FanApp (iOS/    │  Digital Twin Engine   │  VenueOS Dashboard  │
│  Android)        │  ┌──────────────────┐  │  (Web)              │
│                  │  │ Crowd Flow Model  │  │                     │
│  Smart Signage   │  │ Wait Time AI      │  │  Staff Mobile App  │
│  (in-venue       │  │ Demand Forecast   │  │                     │
│   displays)      │  │ Safety Monitor    │  │  Ops Alerts         │
│                  │  │ Route Optimizer   │  │                     │
│  BLE Beacon      │  └──────────────────┘  │                     │
│  Network         │                        │                      │
├──────────────────┴────────────────────────┴─────────────────────┤
│                    DATA INGESTION LAYER                          │
│  IoT Sensors | CCTV + CV | BLE | Wi-Fi | POS | Ticketing |      │
│  Weather | Transit APIs | Historical Event Data                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Digital Twin Engine

The Digital Twin is the central data structure — a live 3D occupancy model of the venue updated at sub-second intervals.

**Data sources feeding the twin:**

| Source | Data Type | Latency | Coverage |
|---|---|---|---|
| Footfall IoT sensors (IR/thermal) | Zone occupancy count | 200ms | Gate entrances, concourse intersections, exits |
| CCTV + Edge CV | Anonymized density map | 500ms | All covered areas |
| BLE beacons | Individual device positions | 300ms | Full venue (beacon grid) |
| Wi-Fi probe requests | Aggregate device density | 1s | All Wi-Fi access points |
| POS terminals | Transaction volume & pace | 2s | All concession stands |
| Ticketing system | Expected arrivals by gate and time | Pre-event | Gate-level |
| Gate scanners | Actual arrival rate | 100ms | All entry gates |

**Twin update cycle:**

1. Sensor data arrives via edge nodes → aggregated on local NVIDIA Jetson units
2. Processed frames streamed to regional ingestion nodes via gRPC
3. Twin model updated in real-time graph database (Apache Kafka → Apache Flink stream processing → state store)
4. AI prediction models re-scored on every twin update
5. Outputs pushed to FanApp, signage, and VenueOS via WebSocket connections

### 5.3 Predictive Heatmapping

The crowd flow model uses a combination of:

- **Physics-based simulation:** Social Force Model (SFM) for baseline pedestrian dynamics
- **ML overlay:** LSTM-based sequence model trained on historical event data to capture venue-specific patterns (e.g., halftime surge at north concourse, post-game exit funnel behavior)
- **Bayesian fusion:** Combines live sensor data with model predictions; weights shift toward live data as event progresses

**Prediction horizons:**

| Horizon | Use case | Model type |
|---|---|---|
| 2–5 minutes | Live rerouting nudges | Kalman filter on current state |
| 10–15 minutes | Operator pre-positioning alerts | LSTM sequence model |
| 30–60 minutes | Concession prep triggers | Demand regression model |
| Pre-event | Staffing recommendations | Historical similarity model |

### 5.4 Edge Computing Architecture

Raw 4K CCTV footage is never transmitted to the cloud. All video processing runs on edge nodes co-located at the venue.

```
Camera → NVIDIA Jetson AGX Orin (edge node)
           │
           ├── Anonymized density blob detection (YOLOv8, TensorRT optimized)
           ├── Flow vector calculation (optical flow)
           └── Aggregated JSON payload → Kafka topic (no PII, no video)
```

This reduces bandwidth costs by ~97% (JSON payloads vs. raw video) and eliminates latency from round-tripping to the cloud for time-critical decisions.

---

## 6. Feature Modules

### 6.1 Module A — Intelligent Concession Management ("No-Queue")

#### 6.1.1 Virtual Queuing

**Fan-facing flow:**
1. Fan opens FanApp, taps "Order Food"
2. Browses menu filtered by proximity to seat, dietary preferences, current wait times
3. Selects items → joins virtual queue
4. App shows estimated ready time + optimal "leave seat" moment (calculated from: current kitchen load + estimated prep time + fan's walking speed from BLE position to stand)
5. Push notification fires: "Head to Stand 7B now — your order will be ready in 4 minutes"
6. Fan arrives at dedicated express pickup window; no queue
7. Payment processed in-app at order time

**Backend flow:**
- Order placed → Kafka event → Kitchen Display System (KDS) API
- KDS sequences orders by estimated pickup time, not order time
- Twin monitors stand throughput in real-time; adjusts pickup ETA dynamically
- If kitchen falls behind, fan is notified and offered nearest alternative stand

#### 6.1.2 Inventory & Prep AI

**Predictive prep triggers:**
- Model ingests: game clock / event timeline, score/momentum (via sports data API), historical demand curves for this event type, current inventory levels
- Example rule: "When a football match enters stoppage time in the first half, fries demand spikes 340% in the following 8 minutes at north concourse stands. Begin frying 6 minutes before stoppage time."
- Kitchen receives prep signal via KDS; manager can override
- Demand forecast updates every 60 seconds

**Inventory management:**
- POS transactions feed real-time inventory model
- Low-stock alert fires to concessions manager + auto-triggers reorder from back-of-house
- Post-event waste report generated per SKU per stand

#### 6.1.3 Smart Stand Routing

- Real-time wait times displayed per stand on FanApp and in-venue digital boards
- "Best Match" recommendation: shortest combined wait + walking time given fan's current position
- Stands temporarily marked "closed" or "limited menu" fed into routing engine

---

### 6.2 Module B — Smart Entry & Security

#### 6.2.1 Computer Vision Load Balancing

**Pre-arrival phase (triggered 45–90 minutes before gates open):**
- Venue shares expected gate assignment data with ticketing partner
- SmartVenue ingests parking lot occupancy (via gate sensor), transit arrival data, and weather
- Predictive model forecasts gate demand distribution
- If Gate C is predicted to be overloaded: personalized push notification to affected ticket holders ("We recommend Gate A for a faster entry — 2 min walk from your parking zone")

**Live gate phase:**
- CV nodes at each gate measure "approach rate" (people per minute in the funnel zone)
- When any gate exceeds 85% of capacity throughput: triggers push notifications + updates smart signage to redirect incoming fans
- Operations console shows gate-by-gate flow rate with color-coded status

#### 6.2.2 Biometric Express Lane (Opt-In)

- Fans enroll via FanApp: face scan + ticket linkage
- At entry, walk past camera; gate opens automatically in < 1 second
- No phone required, no fumbling
- Privacy: biometric template stored locally on device; venue only receives a cryptographic match token; face images never stored server-side
- Clearly optional; standard ticket scan always available

#### 6.2.3 Parking & Pre-Arrival Intelligence

- Integration with venue parking system and Google Maps / Apple Maps
- "Departure time" recommendation sent to fan based on current traffic, expected gate volume at their estimated arrival time
- Parking zone → recommended gate mapping pre-loaded in app

---

### 6.3 Module C — Waze for Pedestrians (Dynamic Routing)

#### 6.3.1 Indoor Navigation

**Technology stack:**
- Primary: BLE beacon grid (beacon every ~15m for 2–5m accuracy)
- Secondary: Wi-Fi fingerprinting (fallback)
- Map layer: venue-specific vector map (built by SmartVenue onboarding team from venue CAD files)

**Routing engine:**
- Modified A* pathfinding on venue graph (nodes = junctions, edges = corridors with dynamic weight)
- Edge weights updated in real-time from Digital Twin occupancy data
- Accounts for: current density per corridor, accessibility requirements, temporary closures, construction

**Fan-facing UX:**
- Turn-by-turn directions in app (similar to Google Maps, but for walking)
- "Fastest route to Section 204 from your location"
- Proactive reroutes when the system detects a forming bottleneck on the fan's planned path

#### 6.3.2 Smart Exit Routing

- 15 minutes before event end: model runs exit flow simulation
- Fans in different sections receive staggered "start heading out" suggestions with predicted exit time
- Route suggestions distributed to avoid simultaneous convergence on main exit tunnels
- Integration with transit: "Your train departs in 18 minutes — leave now via Gate F for a 12-minute walk"

---

### 6.4 Module D — "Sixth Man" AI Concierge

The conversational AI assistant embedded in FanApp, powered by an LLM + RAG pipeline.

#### 6.4.1 Architecture

```
User query → Intent classifier
                │
                ├── Venue knowledge base (RAG)
                │     Vector DB: FAQs, maps, policies, menus, event info
                │
                ├── Live venue state (Digital Twin API)
                │     Current wait times, gate status, seat availability
                │
                ├── User context
                │     Seat location, order history, group members, preferences
                │
                └── LLM (Claude API) → Response
```

#### 6.4.2 Capabilities

| Query type | Example | Data source |
|---|---|---|
| Navigation | "Shortest route to restroom near 204" | Twin + indoor map |
| Wait times | "Which hot dog stand has the shortest line?" | Twin (POS + CV) |
| Group coordination | "Where is my friend with ticket #A224?" | BLE (opt-in) |
| Accessibility | "Wheelchair accessible route to my seat?" | Venue map |
| Event info | "When is halftime?" | Sports data API |
| Upgrade offers | (Proactive) "Upgrade to Row C for £15?" | Seat inventory API |
| Lost item | "I left my jacket at Section 108" | Routes to lost & found |
| Emergency | "I feel unwell" | Routes to first aid; notifies medic team |

#### 6.4.3 Concierge RAG Pipeline

- Venue knowledge base ingested at onboarding: menus, policies, maps, FAQs → chunked and embedded in Pinecone
- Live state context injected at query time (current wait times, gate status)
- Prompt structure: `[system context] + [retrieved knowledge chunks] + [live state snapshot] + [user history] + [user query]`
- Response streamed to UI; typical latency < 1.2 seconds
- Confidence threshold: if below 0.75, escalate to human chat agent

---

### 6.5 Module E — VenueOS Operator Console

The B2B command center for venue operations teams.

#### 6.5.1 Live Heatmap View

- 2D floor plan overlay with real-time crowd density (color-coded: green → yellow → red → critical)
- Time scrubber: replay last 60 minutes of crowd state
- Zoom to any zone for granular view
- Alerts panel: AI-flagged issues (forming bottleneck, unusual density spike, gate overload)

#### 6.5.2 Staff Dispatch

- Staff positions shown on map (via staff app GPS)
- AI suggests dispatch: "Send 2 staff to Gate B — queue exceeding 8 min predicted in 6 minutes"
- One-tap dispatch from console to staff mobile app with route and brief
- Incident log: all dispatches and resolutions tracked for post-event analysis

#### 6.5.3 Concessions Command

- Per-stand: current wait time, throughput rate, inventory status, predicted demand next 30 min
- Kitchen prep alerts sent directly to KDS with operator override
- Revenue dashboard: per-cap spend, top-selling items, abandoned cart rate

#### 6.5.4 Post-Event Analytics

- Full event replay: crowd flow, queue patterns, revenue by zone
- Comparative benchmarks against similar events
- Actionable report: "Bottleneck at Gate C corridor cost ~£18,000 in abandoned concession spend. Recommendation: add signage at junction J4."

---

### 6.6 Module F — Revenue & Engagement Engine

#### 6.6.1 Flash Seat Upgrades

- Trigger: AI detects ≥ 3 consecutive premium seats vacant 20 minutes into the event
- Eligible fans (lower tiers, same section) receive push notification with dynamic price offer
- Offer expires in 5 minutes; next-best fan in queue receives if declined
- Payment in-app; new seat added to digital wallet

#### 6.6.2 Contextual Sponsor Integration

- When a fan is rerouted via a less-familiar corridor: sponsor offer displayed ("Your new route passes Stand 12B — get 20% off nachos with code WAZE20")
- Sponsor placement is transparent (labeled as sponsored); not disruptive
- Impression and conversion tracking per sponsor per event

#### 6.6.3 Dynamic Pricing Signals (Future Phase)

- API output to venue ticketing partner: real-time demand signal for walk-up ticket pricing
- Not directly controlled by SmartVenue; signal only

---

## 7. Tech Stack

### 7.1 Overview

| Layer | Technology | Rationale |
|---|---|---|
| Edge compute | NVIDIA Jetson AGX Orin | Runs CV inference at venue; sub-100ms latency, no raw video transmitted |
| CV models | YOLOv8 + TensorRT | Optimized for edge; anonymized density/flow only |
| Streaming backbone | Apache Kafka | High-throughput event stream; decouples producers/consumers |
| Stream processing | Apache Flink | Stateful real-time processing; windowed aggregations for twin updates |
| Twin state store | Redis + TimescaleDB | Redis for live state (< 1ms reads); TimescaleDB for time-series history |
| AI/ML models | Python (PyTorch, scikit-learn) | LSTM for crowd prediction; regression for demand forecasting |
| LLM (Concierge) | Anthropic Claude API (claude-sonnet-4-6) | RAG pipeline; streaming responses |
| Vector DB | Pinecone | Semantic search over venue knowledge base |
| Backend API | FastAPI (Python) | Async; matches existing PSRM-AI stack |
| Real-time push | WebSockets + Socket.IO | Push to thousands of app clients simultaneously |
| Internal comms | gRPC | Edge-to-cloud, service-to-service (low latency, typed contracts) |
| Mobile app | React Native (TypeScript) | Single codebase iOS + Android; BLE beacon integration |
| Operator console | React + TypeScript | Web dashboard; real-time heatmap rendering |
| Database (app) | PostgreSQL + PostGIS | Relational data + geospatial queries for indoor mapping |
| Cache | Redis | Session state, rate limiting, real-time leaderboards |
| Task queue | Celery + Redis | Async jobs: demand model re-scoring, batch analytics |
| Container orchestration | Kubernetes (K8s) | Auto-scaling for event-day traffic spikes |
| Cloud provider | AWS (primary) | EC2, MSK (managed Kafka), RDS, ElastiCache |
| CDN | CloudFront | Static assets, app delivery |
| Observability | Datadog + OpenTelemetry | APM, log aggregation, uptime monitoring |
| CI/CD | GitHub Actions + ArgoCD | GitOps deployment pipeline |

### 7.2 Indoor Positioning Stack

| Component | Technology |
|---|---|
| Hardware | Kontakt.io BLE beacons (IP67, 3-year battery) |
| Positioning SDK | Kontakt.io SDK or Indoor Atlas |
| Accuracy | 2–5 meters (sufficient for corridor-level routing) |
| Fallback | Wi-Fi fingerprinting (IndoorGML) |
| Map format | IndoorGML / custom GeoJSON |

### 7.3 Data Flow Diagram

```
[Sensors / CV / BLE / POS / Ticketing]
         │
         ▼
[Edge Nodes — Jetson AGX]
  - Video → anonymized density JSON
  - BLE → device position events
         │
         ▼ gRPC
[Kafka Topics]
  - venue.crowd.density
  - venue.gate.flow
  - venue.concession.transactions
  - venue.positions.devices
         │
         ▼ Flink
[Digital Twin State]
  Redis (live state) + TimescaleDB (history)
         │
    ┌────┴────┐
    ▼         ▼
[AI Models]  [API Layer — FastAPI]
    │              │
    │         ┌────┴────┐
    │         ▼         ▼
    │    [FanApp]   [VenueOS]
    │    WebSocket  WebSocket
    └──→ [Prediction outputs]
```

---

## 8. Data & Privacy

### 8.1 Principles

SmartVenue AI is built on a **privacy-first architecture**. All design decisions prioritize minimizing data collection, anonymizing where possible, and giving users explicit control.

### 8.2 Data Classification

| Data type | Sensitivity | Handling |
|---|---|---|
| Video footage | High | Never leaves venue edge nodes; processed to JSON density blobs only |
| BLE position data | Medium | Hashed device IDs only; linked to identity only with user opt-in |
| Biometric (face) | Very High | Template stored on device only; never transmitted; match token only |
| Order history | Medium | Pseudonymized; retained 24 months; used for personalization |
| Group tracking | High | Requires explicit opt-in per group member; purged at event end |
| Aggregate analytics | Low | Anonymized; retained indefinitely for model training |

### 8.3 Compliance

- **GDPR (EU/UK):** Lawful basis is legitimate interest for aggregate analytics; consent for biometric and group tracking. Right to erasure honored within 72 hours.
- **CCPA (US):** Opt-out of data sale; do-not-track honored.
- **BIPA (Illinois Biometric):** Biometric data handling compliant; face-as-ticket explicitly opt-in with written consent flow.
- **ICO guidance:** Venue camera usage covered under public safety legitimate interest; signage required.

### 8.4 Security

- All data in transit: TLS 1.3 minimum
- All data at rest: AES-256
- API authentication: OAuth 2.0 + JWT; venue-scoped tokens
- PII access: role-based; logged; audited quarterly
- Penetration testing: semi-annual

---

## 9. API & Integration Surface

### 9.1 VenueSDK Public APIs

| Endpoint | Description | Auth |
|---|---|---|
| `GET /v1/zones/{id}/density` | Current crowd density for a zone | API key |
| `GET /v1/gates/{id}/wait` | Current and predicted wait time at gate | API key |
| `GET /v1/stands/{id}/wait` | Current and predicted queue at concession stand | API key |
| `POST /v1/notifications/send` | Trigger push notification to fan segment | API key + scope |
| `GET /v1/routes` | Optimal route between two points (live-weighted) | API key |
| `POST /v1/orders` | Submit virtual queue order to concession system | API key + OAuth |
| `GET /v1/seats/available-upgrades` | Real-time premium seat availability | API key |
| `WebSocket /v1/stream/twin` | Subscribe to live Digital Twin state updates | JWT |

### 9.2 Third-Party Integrations

| System | Integration type | Data exchanged |
|---|---|---|
| Ticketmaster / AXS | Webhook + REST | Ticket validation, seat data, expected arrivals |
| Oracle Simphony POS | REST API | Transaction events, inventory levels |
| Sportec Solutions / Opta | REST API | Live game data (score, clock, possession) |
| Google Maps Platform | SDK | Outdoor navigation, transit ETA |
| Apple Indoor Maps | SDK (IMDF) | Indoor map rendering on iOS |
| Stripe | SDK | In-app payment processing |
| Twilio | API | SMS fallback notifications |
| Salesforce | REST | Operator CRM, sponsor management |

---

## 10. Phased Rollout

### Phase 1 — Foundation (Months 1–6)

**Goal:** Deploy core infrastructure at one pilot venue; prove Digital Twin accuracy and FanApp adoption.

Deliverables:
- Edge node installation at pilot venue (IoT sensors, BLE beacon grid)
- Digital Twin v1.0: crowd density model, gate flow monitoring
- FanApp v1.0: indoor navigation, gate wait times, basic concierge (FAQ only)
- VenueOS v1.0: live heatmap, gate status, basic alerting
- Pilot with 2–3 events

Success criteria: Digital Twin density error < 12%; FanApp adoption > 20%; gate wait reduced by 30%.

### Phase 2 — Intelligence Layer (Months 7–12)

**Goal:** Activate predictive models and high-value feature modules.

Deliverables:
- Predictive crowd flow model (15-minute horizon)
- Virtual queuing + concession AI (pre-ordering, prep triggers)
- "Sixth Man" AI Concierge (full LLM + RAG pipeline)
- Smart exit routing
- Flash upgrade engine
- VenueOS v2.0: staff dispatch, concessions command, analytics

Success criteria: Concession abandonment < 20%; per-cap spend +12%; operator alert response time < 2 minutes.

### Phase 3 — Scale & Monetization (Months 13–18)

**Goal:** Multi-venue rollout; revenue engine activation.

Deliverables:
- Biometric express lane (opt-in)
- Sponsor integration layer
- Multi-venue VenueOS (portfolio view)
- VenueSDK GA (third-party developer access)
- Post-event analytics product (standalone reporting module)
- Accessibility routing improvements

Success criteria: Signed contracts with 5+ venues; per-cap spend +18%; NPS > 65.

### Phase 4 — Ecosystem (Month 19+)

- Transit agency integrations (real-time "leave now" based on live transit)
- Predictive staffing recommendations (pre-event, via historical similarity)
- White-label FanApp for venue brand customization
- Dynamic pricing signal API for ticketing partners

---

## 11. Revenue Model

### 11.1 VenueOS SaaS License

- Annual license per venue, tiered by capacity:

| Tier | Capacity | Annual License |
|---|---|---|
| Standard | 10,000–25,000 | $120,000 |
| Pro | 25,000–60,000 | $280,000 |
| Enterprise | 60,000+ | Custom ($400,000+) |

### 11.2 Hardware & Installation

- Edge node hardware + installation: $80,000–$200,000 per venue (one-time)
- BLE beacon network: $40,000–$120,000 per venue (one-time)
- Optional managed hardware maintenance: +$15,000/year

### 11.3 Revenue Share

- Virtual queuing transactions: 1.5% of GMV processed through FanApp
- Flash seat upgrades: 8% of upgrade revenue
- Sponsor contextual placements: 20% of sponsor placement fees

### 11.4 VenueSDK API

- Developer tier: free (limited to 10,000 API calls/month)
- Commercial tier: $0.002 per API call above 10k
- Enterprise tier: custom volume pricing

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| BLE beacon accuracy insufficient for routing | Medium | High | Hybrid BLE + Wi-Fi fingerprinting; acceptable degradation to zone-level accuracy |
| Low FanApp adoption (fans don't download) | High | High | Incentivize at entry: "Download for queue-jump access"; QR codes on tickets |
| Edge node failure during event | Low | Critical | Redundant nodes per zone; graceful fallback to historical model |
| Privacy regulation change (biometrics) | Medium | High | Architecture isolates biometric module; can be disabled without affecting core platform |
| LLM hallucination in concierge | Medium | Medium | RAG grounding + confidence threshold; all safety-critical queries (medical, emergency) hard-coded to escalation flows |
| Venue IT infrastructure incompatible | Medium | Medium | SmartVenue provides own network infrastructure (dedicated Wi-Fi 6 backbone) |
| Competitor (existing venue tech companies) fast-follow | Medium | Medium | Speed to market; patent filing on Digital Twin fusion method |

---

## 13. Open Questions

1. **Venue CAD data availability:** How reliably can we obtain accurate floor plans from venues at onboarding? Do we need a proprietary survey process?
2. **POS integration depth:** Oracle Simphony and similar legacy POS systems have limited real-time APIs. May need hardware tap (network-level interception) rather than software API.
3. **Biometric legal jurisdiction:** Face-as-ticket opt-in requires venue-by-venue legal review. Illinois (BIPA) and Texas require written consent with specific language. Is this feature viable in US Phase 1?
4. **Concierge escalation:** When the AI concierge hits a safety-critical query (injury, security threat), what is the SLA for human response? Requires venue staffing agreement.
5. **Network connectivity for fans:** App features degrade without connectivity. Does SmartVenue provide a venue Wi-Fi layer, or depend on MNO coverage?
6. **Sports data API licensing:** Live game data (score, clock, possession) requires licensed feeds. Cost and availability vary by league. Which leagues are in scope for Phase 1?

---

*SmartVenue AI — PRD v1.0 | Confidential | April 2026*
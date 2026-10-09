# 🏔️ TravelMate Nepal — Travel Companion Matching Platform

> **Find compatible travel companions for Himalayan treks and cultural explorations across Nepal.**  
> Built according to the **TravelMate Software Requirements Specification (SRS Version 1.0)**.

---

## 📖 Overview

**TravelMate Nepal** connects solo travelers, trekkers, and small groups exploring Nepal. Through an **8-factor weighted compatibility matching engine**, the platform eliminates travel style mismatches while providing collaborative workspaces (live chat, split expense management, day-by-day itineraries, packing lists, and interactive topographic route maps) and verified safety infrastructure.

---

## ✨ Key Features (SRS v1.0 Compliance)

- **🔐 Authentication & Session Persistence (FR-1)**
  - JWT token authentication with auto-refresh interceptors and resilient connection fallback.
- **👤 Profile & 8-Factor Travel Preferences (FR-2)**
  - Manage bio, verified status, and preferences across: Travel Styles, Interests, NPR Budget, Nepal Destinations, Transport Mode, Accommodation, Duration, and Languages.
- **📍 Nepal Destination Catalog (FR-3)**
  - Curated trekking circuits (Annapurna, Everest, Upper Mustang, Langtang) and cultural hubs with GPS coordinates, seasons, and difficulty ratings.
- **🚀 Trip Management & Lifecycle State Machine (FR-4)**
  - Create trips with Nepal destination presets, search/filter, and full organizer lifecycle control (`open` → `ongoing` → `completed` / `cancelled`).
- **🎯 8-Factor Weighted Compatibility Matching (FR-5)**
  - Weighted algorithm computing true mutual compatibility:
    $$\text{Score} = 25\% \cdot D + 15\% \cdot T + 15\% \cdot B + 15\% \cdot S + 10\% \cdot P + 10\% \cdot I + 5\% \cdot A + 5\% \cdot M$$
- **👥 Membership & Join Requests (FR-6)**
  - Join request submission, organizer approve/reject controls, member capacity caps, and member departure flows.
- **🏕️ Collaborative Trip Workspace (FR-7)**
  - **🗺️ Interactive Map (FR-7)**: Multi-layer Leaflet visualization (OpenStreetMap, Esri Topo, and Satellite Imagery).
  - **💬 Group Chat (FR-7.1)**: Companion messenger card with timestamping and member tags.
  - **💰 Shared Expenses & Settlements (FR-7.2)**: Fair split tracking, debt ledger, category breakdowns, and printable PDF settlement statements.
  - **📅 Day-by-Day Itinerary (FR-7.3)**: Interactive timeline and organizer day plan creator.
  - **🎒 Himalayan Packing Checklist (FR-7.3)**: Checklist for permits (TIMS/ACAP), alpine layers, AMS medicine, and custom gear.
- **⭐ Peer Review & Reputation System (FR-8)**
  - 1–5 star ratings and reviews verified upon trip completion, displayed on companion profile dossiers.
- **🔔 Notification Center (FR-9)**
  - In-app notification popover with unread counters and instant read tracking.
- **🛡️ Trust, Safety & Emergency Directory (FR-10)**
  - In-app Safety Center with 24/7 Nepal SOS hotlines (Tourist Police `1144`, HRA `+977-1-4440292`, Police `100`), altitude sickness (AMS) protocols, and moderation reporting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.13, Django 6.1, Django REST Framework, SimpleJWT, PostgreSQL |
| **Frontend** | React 19, Vite, Leaflet Maps, Vanilla CSS (Modern Design System Tokens) |
| **DevOps** | Environment configuration via `.env`, CORS Headers, Proxy Resiliency |

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & **npm**
- **PostgreSQL** (running locally or via Docker)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations & check system
python manage.py migrate
python manage.py check

# Start development server
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📂 Project Architecture

```
TravelMate/
├── backend/
│   ├── apps/
│   │   ├── accounts/         # User auth, profiles, and preferences
│   │   ├── destinations/     # Nepal destinations catalog
│   │   ├── trips/            # Trip CRUD, memberships, and itineraries
│   │   ├── matching/         # 8-Factor compatibility engine
│   │   ├── chat/             # Group workspace messaging
│   │   ├── expenses/         # Shared expense splitting and settlements
│   │   ├── reviews/          # Companion peer reviews and ratings
│   │   ├── moderation/       # User reports and trust & safety
│   │   └── notifications/    # In-app notifications
│   ├── config/               # Django settings and routing
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/           # Curated Nepal destination & UI imagery
│   │   ├── components/       # UI, Map, Trip, Chat, Expenses, Reviews, Safety
│   │   ├── pages/            # Home, ExploreTrips, MatchesPage, TripDetailPage, ProfilePage
│   │   ├── services/         # Axios API clients
│   │   ├── App.jsx           # Master route orchestrator
│   │   └── index.css         # Glassmorphism design tokens
│   └── package.json
├── .gitignore
└── README.md
```

---

## 📜 License & Compliance

Developed strictly under the specifications of **TravelMate SRS Version 1.0**. All currency displays and calculations are standardized to **Nepalese Rupees (NPR)**.

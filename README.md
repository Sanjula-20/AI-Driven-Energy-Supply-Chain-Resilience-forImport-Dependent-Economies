# EnergyShield AI

**AI-Powered Energy Supply Chain Resilience & Risk Intelligence**

A decision-support platform prototype for monitoring and reasoning about
risks to India's crude oil import supply chain: geopolitical events,
shipping corridor disruption, supplier risk, strategic reserve health, and
scenario-based "what if" planning.

> **This is the V1 / foundation build.** It intentionally uses transparent,
> rule-based logic and seeded demo data instead of live feeds or ML models,
> so the architecture is easy to extend feature-by-feature. See
> [Current Limitations](#current-limitations) and
> [Planned Future AI Features](#planned-future-ai-features).

---

## Table of contents

1. [Project overview](#project-overview)
2. [Problem statement](#problem-statement)
3. [Solution overview](#solution-overview)
4. [Architecture](#architecture)
5. [Features](#features)
6. [Technology stack](#technology-stack)
7. [Project structure](#project-structure)
8. [Database setup](#database-setup)
9. [Environment variables](#environment-variables)
10. [Installation steps](#installation-steps)
11. [How to run the frontend](#how-to-run-the-frontend)
12. [How to run the backend](#how-to-run-the-backend)
13. [API documentation](#api-documentation)
14. [Demo data explanation](#demo-data-explanation)
15. [Current limitations](#current-limitations)
16. [Planned future AI features](#planned-future-ai-features)
17. [Quick start commands](#quick-start-commands)

---

## Project overview

EnergyShield AI is a full-stack command-center application built for a
hackathon around the problem statement *"AI-Driven Energy Supply Chain
Resilience for Import-Dependent Economies."* It gives an analyst a single
place to see India's overall energy supply risk, drill into the corridors
and suppliers driving that risk, review recent geopolitical events, check
strategic reserve coverage, simulate disruption scenarios, and see
rule-based recommendations and alerts.

## Problem statement

> AI-Driven Energy Supply Chain Resilience for Import-Dependent Economies —
> build an AI-powered decision-support platform for India that monitors
> geopolitical and logistics risks affecting crude oil imports, models
> disruption scenarios, evaluates suppliers and shipping corridors,
> optimizes strategic reserves, and generates procurement/rerouting
> recommendations.

## Solution overview

EnergyShield AI addresses this with:

- A **transparent weighted risk engine** that scores overall energy supply
  risk from five components (geopolitical, shipping, supplier, price
  volatility, reserve).
- A **command-center dashboard** surfacing the composite score, corridor
  risk, supplier risk, price, supply-at-risk, reserve coverage, alerts, and
  recent events at a glance.
- A **supply chain map** plotting suppliers, India, Indian ports, and the
  four monitored shipping corridors.
- A **scenario simulator** ("What If?") for rule-based disruption modeling
  (e.g. a Strait of Hormuz closure), covering supply loss, price impact,
  and reserve requirements.
- A **rule-based recommendation and alert engine** that reacts to corridor,
  supplier, and reserve thresholds.

Every V1 calculation is intentionally simple and explainable — the point of
this foundation commit is a clean, working substrate that later commits can
extend with real data feeds and ML, without having to rearchitect anything.

## Architecture

```
┌─────────────────────┐      REST/JSON       ┌──────────────────────┐      Mongoose      ┌─────────────┐
│   React + Vite SPA   │ ───────────────────▶ │  Node.js + Express   │ ─────────────────▶ │   MongoDB   │
│  (frontend/)          │ ◀─────────────────── │  API (backend/)      │ ◀───────────────── │             │
└─────────────────────┘     JWT-authenticated  └──────────────────────┘                    └─────────────┘
                                                        │
                                                        ├─ controllers/  (HTTP layer)
                                                        ├─ services/     (business logic: risk engine,
                                                        │                 recommendation engine, alert
                                                        │                 engine, scenario simulator)
                                                        ├─ models/       (Mongoose schemas)
                                                        └─ middleware/   (JWT auth, role guard, error handler)
```

The risk, recommendation, alert, and scenario logic all live in
`backend/services/` as plain functions with no Express dependency — this is
what lets a future commit swap in an ML model or a live data feed behind
the same function signature without touching a single controller or route.

## Features

1. **Authentication** — JWT login, roles `ADMIN` / `ANALYST` / `VIEWER`,
   protected frontend routes and backend endpoints.
2. **Main Dashboard** — Energy Resilience Command Center: overall risk,
   Hormuz/Red Sea corridor risk, supplier risk, crude price, supply at
   risk, reserve level & coverage, active alerts, recent events.
3. **Supply Chain Map** — suppliers, India, Indian ports, and the four
   corridors plotted on a stylized command-board projection.
4. **Supplier Management** — capacity, price, risk, reliability, status
   for five demo suppliers (Saudi Arabia, UAE, Iraq, Russia, US).
5. **Shipping Corridor Monitoring** — Hormuz, Red Sea, Arabian Sea, Cape of
   Good Hope, each with risk score/level, dependency, status, disruption
   probability, and alternative-route availability.
6. **Geopolitical Events** — demo intelligence feed with severity, region,
   affected corridor/suppliers.
7. **Strategic Reserve Dashboard** — capacity, current level, daily
   consumption, coverage days, status, recommended drawdown.
8. **Risk Engine** — reusable weighted model:
   `Overall = 30% Geopolitical + 25% Shipping + 20% Supplier + 15% Price Volatility + 10% Reserve`,
   classified LOW (0–30) / MEDIUM (31–60) / HIGH (61–80) / CRITICAL (81–100).
9. **Scenario Simulator** — "What If?" panel (scenario type, duration,
   severity) with rule-based supply loss, price impact, reserve
   requirement, and recommended action. Seeded with a Strait of Hormuz
   Closure scenario plus two others.
10. **Recommendations** — rule-based procurement/routing/reserve/supplier
    guidance, explicitly labeled `RULE_BASED`.
11. **Alerts** — INFO / WARNING / HIGH / CRITICAL, derived from corridor,
    reserve, and overall-risk thresholds.
12. **REST API** — see [API documentation](#api-documentation).
13. **Database models** — User, Supplier, Corridor, GeopoliticalEvent,
    ReserveStatus, RiskScore, Scenario, Recommendation, Alert.
14. **Seed script** — realistic demo data so the app works immediately.

## Technology stack

**Frontend:** React 18, Vite 5, React Router 6, Recharts (radar chart),
custom SVG for the map/gauges, plain CSS with design tokens (no framework
lock-in), Axios.

**Backend:** Node.js, Express 4, Mongoose 8, JSON Web Tokens (`jsonwebtoken`),
`bcryptjs` for password hashing, `cors`, `morgan`, `dotenv`.

**Database:** MongoDB (local or Atlas).

## Project structure

```
energyshield-ai/
├── backend/
│   ├── config/
│   │   ├── db.js                # Mongo connection
│   │   └── constants.js         # risk weights, bands, thresholds
│   ├── controllers/              # HTTP request handlers
│   ├── middleware/
│   │   ├── auth.js               # JWT verify + role guard
│   │   └── errorHandler.js
│   ├── models/                   # Mongoose schemas (9 models)
│   ├── routes/                   # Express routers, one per resource
│   ├── services/
│   │   ├── riskEngine.service.js
│   │   ├── recommendation.service.js
│   │   ├── alert.service.js
│   │   └── scenario.service.js
│   ├── seed/
│   │   └── seed.js               # demo data seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/client.js         # Axios instance + JWT interceptor
    │   ├── components/           # AppShell, Panel, RiskRing, Badge, ...
    │   ├── context/AuthContext.jsx
    │   ├── pages/                # Dashboard, Map, Suppliers, Corridors, ...
    │   ├── styles/global.css     # design tokens
    │   ├── utils/                # risk helpers, useApiData hook
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## Database setup

1. Install MongoDB locally, **or** create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI`:
   - Local: `mongodb://127.0.0.1:27017/energyshield`
   - Atlas: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/energyshield`
3. Run the seed script (see below) to create collections and demo data.

## Environment variables

**`backend/.env`** (copy from `backend/.env.example`):

| Variable | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for signing JWTs — **never commit a real value** |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `8h` |
| `CLIENT_ORIGIN` | Frontend origin for CORS, e.g. `http://localhost:5173` |
| `SEED_ADMIN_PASSWORD` / `SEED_ANALYST_PASSWORD` / `SEED_VIEWER_PASSWORD` | Passwords used only by the seed script to create demo accounts |

**`frontend/.env`** (copy from `frontend/.env.example`):

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

## Installation steps

```bash
# 1. Backend
cd backend
cp .env.example .env
# edit .env: set MONGO_URI and a real JWT_SECRET
npm install

# 2. Frontend
cd ../frontend
cp .env.example .env
npm install
```

## How to run the backend

```bash
cd backend
npm run seed   # populates MongoDB with demo data (run once, or whenever you want to reset)
npm run dev    # starts the API on http://localhost:5000 with nodemon
# or: npm start
```

## How to run the frontend

```bash
cd frontend
npm run dev    # starts Vite dev server on http://localhost:5173
```

Then open `http://localhost:5173` and log in with one of the seeded demo
accounts (see [Demo data explanation](#demo-data-explanation)).

## API documentation

All routes below (except `/api/auth/login` and `/api/health`) require
`Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Log in with email + password, returns JWT + user |
| `GET` | `/api/auth/me` | Get the current authenticated user |
| `GET` | `/api/dashboard` | Aggregated Command Center data |
| `GET` | `/api/risk` | Compute risk on demand (`?price=85` optional) |
| `GET` | `/api/risk/history` | Last 20 stored risk snapshots |
| `GET` | `/api/suppliers` | List all suppliers |
| `GET` | `/api/suppliers/:id` | Get one supplier |
| `GET` | `/api/corridors` | List all corridors |
| `GET` | `/api/corridors/:code` | Get one corridor by code (e.g. `HORMUZ`) |
| `GET` | `/api/events` | List geopolitical events |
| `GET` | `/api/reserves` | Current strategic reserve status |
| `GET` | `/api/scenarios` | List simulate-able scenarios |
| `POST` | `/api/scenarios/simulate` | Run a scenario (`ADMIN`/`ANALYST` only) — body: `{ scenarioKey, durationDays, severity }` |
| `GET` | `/api/recommendations` | Current rule-based recommendations |
| `GET` | `/api/alerts` | Current active alerts |
| `GET` | `/api/health` | Health check (no auth) |

## Demo data explanation

Every seeded document is flagged `isDemoData: true`, and the frontend shows
a **"Demo data"** badge on every page. Nothing in this build reads from a
live news feed, AIS/shipping feed, or a real market data provider — prices,
events, corridor risk, and supplier risk are all illustrative figures
chosen to make the risk engine and simulator produce realistic-looking,
explainable output. **The system never claims to use live geopolitical or
shipping data.**

Seeded demo accounts (passwords come from your `backend/.env`):

| Role | Email |
|---|---|
| ADMIN | `admin@energyshield.ai` |
| ANALYST | `analyst@energyshield.ai` |
| VIEWER | `viewer@energyshield.ai` |

## Current limitations

- No live data integrations (news, AIS/shipping, market prices) — all data
  is seeded/demo.
- Risk scoring, recommendations, and alerts are rule-based, not ML-based.
- The scenario simulator uses simple linear scaling by severity/duration,
  not a probabilistic or optimization model.
- The supply chain map uses a stylized custom projection, not a full
  geographic basemap.
- No real-time push/streaming of alerts (data refreshes on page load).
- No automated tests included in this V1 foundation commit.

## Planned future AI features

The codebase is structured so each of these can be added independently,
mostly inside `backend/services/`, without breaking existing controllers or
routes:

- Real-time geopolitical news intelligence ingestion
- NLP-based event extraction from news/text sources
- Shipping/AIS-based corridor risk intelligence
- ML-based disruption probability prediction
- Advanced (probabilistic/Monte Carlo) scenario simulation
- Procurement optimization (linear/mixed-integer programming)
- Strategic reserve optimization
- AI-generated (LLM-based) recommendations, alongside the existing rule-based ones
- Real-time alerting via webhooks/websockets
- Supply-chain digital twin
- Live data integrations (news APIs, shipping APIs, commodity price feeds)

## Quick start commands

```bash
# Backend
cd backend
cp .env.example .env        # then edit MONGO_URI and JWT_SECRET
npm install
npm run seed
npm run dev                 # http://localhost:5000

# Frontend (in a second terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

### What's working in V1

Log in, view the Command Center with a live-computed composite risk score,
drill into corridors/suppliers/events/reserves, plot the supply chain map,
run the "What If?" simulator against three seeded scenarios, and review
rule-based recommendations and alerts — all backed by a real MongoDB
database, a real JWT-authenticated REST API, and a clean, extensible
service-layer architecture ready for AI upgrades in later commits.

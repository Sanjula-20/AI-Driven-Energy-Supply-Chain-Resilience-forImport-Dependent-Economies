# EnergyShield AI

## AI-Driven Energy Supply-Chain Resilience for Import-Dependent Economies

EnergyShield AI is an AI-powered energy resilience decision-support platform designed to help analyze, simulate, and respond to energy supply-chain risks for import-dependent economies such as India.

The system combines geopolitical intelligence, energy market data, shipping corridor risk, supplier exposure, strategic reserves, risk scoring, scenario simulation, recommendations, and alerts into one unified platform.

---

## 🚀 Project Overview

EnergyShield AI follows an end-to-end energy resilience workflow:

Geopolitical Event
        ↓
Risk Detection
        ↓
Shipping Corridor Risk
        ↓
Supply Disruption Prediction
        ↓
Scenario Simulation
        ↓
Strategic Reserve Analysis
        ↓
Procurement / Mitigation Recommendations
        ↓
Risk Alerts
        ↓
Decision Support

The system helps decision-makers understand:

- What geopolitical events are occurring?
- Which energy corridors are affected?
- Which suppliers are exposed?
- How much supply may be at risk?
- How much strategic reserve coverage remains?
- What happens under different disruption scenarios?
- What mitigation actions should be considered?
- Why was a particular risk score or recommendation generated?

---

# ✨ Key Features

## 1. Energy Market Intelligence

EnergyShield AI integrates external energy-market information using the U.S. Energy Information Administration (EIA) API.

Features include:

- Current energy market information
- Historical market data
- Crude oil price information
- Price movement analysis
- Historical price charts
- Market-data timestamps
- Live EIA data
- Demo/fallback data when the external API is unavailable

The EIA API key is stored securely in the backend `.env` file and is never exposed to the frontend.

---

## 2. Geopolitical Risk Intelligence

The platform stores and analyzes geopolitical events that may affect energy supply.

Supported severity levels:

- INFO
- WARNING
- HIGH
- CRITICAL

Recent geopolitical events contribute to the overall geopolitical risk score.

---

## 3. Shipping & Corridor Risk Intelligence

EnergyShield AI monitors important energy shipping corridors including:

- Strait of Hormuz
- Red Sea
- Arabian Sea
- Cape of Good Hope

Corridor risk is combined with energy supply dependency to calculate shipping-related risk.

---

## 4. Supplier Risk Analysis

The supplier module evaluates:

- Supplier risk
- Supply capacity
- Supplier reliability
- Dependency
- Exposure

Supplier capacity and reliability influence the overall supplier risk score.

---

## 5. Energy Resilience Command Center

The main dashboard provides a centralized view of India's energy resilience posture.

The dashboard displays:

- Overall energy risk score
- Overall risk level
- Crude oil price
- Estimated supply at risk
- Strategic reserve coverage
- Active alerts
- Strait of Hormuz risk
- Red Sea risk
- Supplier risk
- Recent geopolitical events
- Weighted risk components
- Risk history

---

## 6. Risk Engine

EnergyShield AI currently uses a transparent weighted risk model.

The overall risk score is calculated using:

| Risk Component | Weight |
|---|---:|
| Geopolitical Risk | 30% |
| Shipping Risk | 25% |
| Supplier Risk | 20% |
| Price Volatility | 15% |
| Strategic Reserve | 10% |
| **Total** | **100%** |

This makes the risk engine transparent and explainable.

### Geopolitical Risk

Recent geopolitical events are weighted according to severity:

| Severity | Weight |
|---|---:|
| INFO | 10 |
| WARNING | 35 |
| HIGH | 70 |
| CRITICAL | 95 |

### Shipping Risk

Shipping risk uses supply-dependency-weighted corridor risk.

A corridor carrying a larger percentage of energy imports therefore has a greater effect on overall shipping risk.

### Supplier Risk

Supplier risk considers:

- Supply capacity
- Supplier risk score
- Supplier reliability

### Price Volatility Risk

Price risk is estimated from crude oil price deviation relative to a reference price.

### Strategic Reserve Risk

Reserve risk is based on estimated strategic reserve coverage days.

Higher reserve coverage results in lower reserve-related risk.

---

# 7. Scenario Simulator

EnergyShield AI includes a What-If Scenario Simulator.

Possible scenarios include:

- Strait of Hormuz disruption
- Red Sea disruption
- Supplier disruption
- Sanctions
- Energy price spikes
- Major supply interruptions

The simulator helps estimate changes in:

- Supply availability
- Energy risk
- Reserve pressure
- Procurement requirements
- Overall resilience

---

# 8. Recommendations

The recommendation module provides decision-support recommendations based on the current energy risk posture.

Recommendations can consider:

- Supplier exposure
- Corridor risk
- Supply availability
- Strategic reserve levels
- Current risk
- Scenario results

EnergyShield AI is a decision-support system and does not autonomously execute procurement decisions.

---

# 9. Real-Time Risk Alerts

The alert system monitors important risk conditions.

Supported alert severity levels:

- INFO
- WARNING
- HIGH
- CRITICAL

The alert service also prevents unchanged alerts from being repeatedly duplicated.

---

# 10. Supply Chain Digital View

The Supply Chain Map provides a visual representation of the energy supply chain.

The architecture can be viewed as:

Suppliers
    ↓
Shipping Corridors
    ↓
Indian Ports
    ↓
Energy Infrastructure

This helps visualize how disruptions in important corridors can affect India's energy supply chain.

---

# 11. Risk History

EnergyShield AI stores risk snapshots for historical analysis.

Risk history can be used to understand how the energy resilience posture changes over time.

---

# 12. Authentication & Security

The application uses JWT-based authentication.

Security features include:

- User registration
- User login
- Password hashing using bcrypt
- JWT authentication
- Protected API routes
- Authentication middleware
- Automatic JWT handling
- Invalid/expired token handling
- CORS protection
- Environment-based secrets

Sensitive credentials must remain inside `.env` files.

Never commit:

.env
API keys
MongoDB credentials
JWT secrets
Passwords

---

# 🛠️ Technology Stack

## Frontend

- React 18
- Vite
- React Router
- Axios
- Recharts
- JavaScript
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- CORS
- Morgan
- Nodemon

## External Data

- U.S. Energy Information Administration (EIA) API

---

# 📁 Project Structure

AI-Driven-Energy-Supply-Chain-Resilience-forImport-Dependent-Economies/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   │   ├── alert.service.js
│   │   ├── market.service.js
│   │   ├── recommendation.service.js
│   │   ├── riskEngine.service.js
│   │   └── scenario.service.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── package.json
├── .gitignore
└── README.md

---

# ⚙️ Prerequisites

Install the following before running the project:

- Node.js 18 or later
- npm
- MongoDB
- Git

Check Node.js:

    node --version

Check npm:

    npm --version

Check Git:

    git --version

---

# 📥 Clone the Repository

Clone the GitHub repository:

    git clone https://github.com/Sanjula-20/AI-Driven-Energy-Supply-Chain-Resilience-forImport-Dependent-Economies.git

Enter the project directory:

    cd AI-Driven-Energy-Supply-Chain-Resilience-forImport-Dependent-Economies

---

# 📦 Install Dependencies

The project contains separate frontend and backend applications.

## Backend Installation

Open a terminal:

    cd backend
    npm install

## Frontend Installation

Open another terminal:

    cd frontend
    npm install

---

# 🔐 Backend Environment Configuration

Inside the `backend` folder create:

    .env

Example configuration:

    PORT=5000
    NODE_ENV=development

    MONGO_URI=mongodb://127.0.0.1:27017/energyshield

    JWT_SECRET=replace_with_a_long_random_secret
    JWT_EXPIRES_IN=8h

    CLIENT_ORIGIN=http://localhost:5173

    EIA_API_KEY=your_eia_api_key

Replace `your_eia_api_key` with your actual EIA API key.

IMPORTANT:

Never commit the real `.env` file to GitHub.

---

# 🌐 Frontend Environment Configuration

Inside the `frontend` folder create:

    .env

Add:

    VITE_API_BASE_URL=http://localhost:5000/api

---

# 🍃 MongoDB Setup

EnergyShield AI can run using a local MongoDB instance.

Default database connection:

    mongodb://127.0.0.1:27017/energyshield

Make sure MongoDB is running before starting the backend.

---

# 🌱 Seed Demo Data

The project includes a seed script that creates demo data.

Open a terminal:

    cd backend

Run:

    npm run seed

The seed script creates demo:

- Users
- Suppliers
- Corridors
- Geopolitical events
- Strategic reserve status
- Scenarios
- Initial risk information

After successful seeding, the terminal displays the demo account information.

The passwords are controlled using:

    SEED_ADMIN_PASSWORD
    SEED_ANALYST_PASSWORD
    SEED_VIEWER_PASSWORD

inside the backend environment configuration.

---

# ▶️ RUNNING THE PROJECT

You should normally keep TWO terminals open:

## Terminal 1 — Backend

Open PowerShell / Command Prompt:

    cd C:\Users\Sowndarya\AI-Driven-Energy-Supply-Chain-Resilience-forImport-Dependent-Economies\backend

Then run:

    npm run dev

Expected output:

    [db] MongoDB connected: 127.0.0.1/energyshield
    [server] EnergyShield AI backend running on http://localhost:5000

Backend URL:

    http://localhost:5000

Backend health check:

    http://localhost:5000/api/health

---

## Terminal 2 — Frontend

Open another PowerShell / Command Prompt.

Run:

    cd C:\Users\Sowndarya\AI-Driven-Energy-Supply-Chain-Resilience-forImport-Dependent-Economies\frontend

Then:

    npm run dev

The frontend normally starts at:

    http://localhost:5173

Open the URL in your browser.

---

# 🖥️ Quick Start

After installing dependencies and configuring MongoDB:

### Terminal 1

    cd backend
    npm run seed
    npm run dev

### Terminal 2

    cd frontend
    npm run dev

Then open:

    http://localhost:5173

---

# 🌐 API ENDPOINTS

All backend APIs are available under:

    /api

## Health Check

    GET /api/health

## Authentication

    POST /api/auth/login

## Dashboard

    GET /api/dashboard

## Risk History

    GET /api/risk/history

## Suppliers

    /api/suppliers

## Corridors

    /api/corridors

## Geopolitical Events

    /api/events

## Strategic Reserves

    /api/reserves

## Risk

    /api/risk

## Scenarios

    /api/scenarios

## Recommendations

    /api/recommendations

## Alerts

    /api/alerts

Protected endpoints require JWT authentication.

---

# 🧪 Testing the Application

After starting both servers:

1. Open `http://localhost:5173`
2. Login using a seeded demo account
3. Open the Dashboard
4. Verify the overall risk score
5. Verify supplier information
6. Verify corridor information
7. Open Geopolitical Events
8. Open Strategic Reserves
9. Run a scenario
10. Check Recommendations
11. Check Alerts
12. Check the Supply Chain Map
13. Verify Energy Market Intelligence
14. Verify that EIA data is displayed when available
15. Verify fallback/demo data when external API access is unavailable

---

# 📊 Application Modules

| Module | Purpose |
|---|---|
| Login | User authentication |
| Dashboard | Overall energy resilience monitoring |
| Energy Market Intelligence | Energy market and crude oil information |
| Supply Chain Map | Energy supply-chain visualization |
| Suppliers | Supplier risk analysis |
| Corridors | Shipping corridor risk |
| Events | Geopolitical risk intelligence |
| Reserves | Strategic reserve monitoring |
| Scenarios | What-If disruption simulation |
| Recommendations | Risk mitigation decision support |
| Alerts | Energy risk alerts |
| Risk History | Historical risk tracking |

---

# 🏆 Hackathon Demonstration Flow

The strongest demonstration flow is:

## Step 1 — Login

Login to EnergyShield AI.

## Step 2 — Dashboard

Show the overall energy resilience risk.

Explain the five risk components:

- Geopolitical
- Shipping
- Supplier
- Price Volatility
- Strategic Reserve

## Step 3 — Energy Market Intelligence

Show current/fallback energy market information.

Demonstrate:

- Current price
- Historical data
- Price changes
- Market-data timestamp

## Step 4 — Geopolitical Event

Show a geopolitical event and its severity.

Explain how the event affects geopolitical risk.

## Step 5 — Shipping Corridor

Show the Strait of Hormuz or Red Sea corridor.

Explain how corridor disruption affects India's energy supply.

## Step 6 — Supplier Risk

Show supplier capacity, risk, and reliability.

## Step 7 — Scenario Simulator

Run a disruption scenario such as:

    Strait of Hormuz Disruption

Show how the scenario affects:

- Supply
- Risk
- Reserves
- Overall resilience

## Step 8 — Strategic Reserves

Show current reserve coverage.

Explain how reserve availability affects resilience.

## Step 9 — Recommendations

Show the system-generated recommendations.

Explain that the recommendations are decision support rather than autonomous procurement.

## Step 10 — Alerts

Show the resulting energy risk alerts.

---

# 🔄 END-TO-END SYSTEM FLOW

The complete EnergyShield AI workflow is:

    Geopolitical Event
            ↓
    Geopolitical Risk
            ↓
    Corridor Risk
            ↓
    Supplier Exposure
            ↓
    Supply Disruption Risk
            ↓
    Scenario Simulation
            ↓
    Strategic Reserve Analysis
            ↓
    Mitigation Recommendations
            ↓
    Risk Alerts
            ↓
    Decision Support

---

# 💡 Why EnergyShield AI?

Traditional energy monitoring systems often treat geopolitics, suppliers, shipping routes, market prices, and strategic reserves as separate datasets.

EnergyShield AI connects these factors into one decision-support platform.

For example:

    Geopolitical Conflict
            ↓
    Shipping Corridor Risk
            ↓
    Supplier Disruption
            ↓
    Supply Shortfall
            ↓
    Reserve Pressure
            ↓
    Overall Energy Risk
            ↓
    Recommended Mitigation

This provides decision-makers with a unified view of energy resilience.

---

# 🏭 Example Use Case

Consider a hypothetical disruption in the Strait of Hormuz.

EnergyShield AI can analyze:

1. Geopolitical severity
2. Corridor dependency
3. Supplier exposure
4. Potential supply loss
5. Crude oil market impact
6. Strategic reserve coverage
7. Scenario impact
8. Risk level
9. Recommended mitigation actions
10. Resulting alerts

This creates a complete energy resilience decision-support workflow.

---

# 🔒 Security Considerations

The project follows these security practices:

- API keys are stored in environment variables
- JWT secrets are stored in environment variables
- MongoDB credentials are stored in environment variables
- `.env` files are excluded from Git
- Backend API keys are never exposed to the frontend
- Protected routes require authentication
- Passwords are hashed before storage
- Invalid authentication tokens are rejected

Before pushing to GitHub, always verify:

    git status

Make sure no `.env` file or secret credential is staged.

---

# 🏗️ Production Build

To create a production frontend build:

    cd frontend
    npm run build

To preview the production build:

    npm run preview

---

# 🧪 Validation

The project has been validated for:

- MongoDB connectivity
- Database seeding
- Authentication
- Protected APIs
- Dashboard
- Risk calculation
- Risk history
- EIA API integration
- EIA fallback behavior
- Supply Chain Map
- Supplier module
- Corridor module
- Geopolitical Events
- Strategic Reserves
- Scenario Simulator
- Recommendations
- Alerts
- Duplicate alert prevention
- Frontend startup
- Frontend production build
- Environment variable protection

---

# 🔮 Future Enhancements

Potential future improvements include:

- Machine-learning-based supply disruption prediction
- Advanced geopolitical NLP
- Automated news ingestion
- Real-time vessel tracking
- Advanced procurement optimization
- Strategic reserve optimization
- Energy demand forecasting
- Time-series oil price forecasting
- Multi-country resilience comparison
- Advanced anomaly detection
- Cloud deployment
- Real-time notification services
- Advanced digital-twin simulation
- Explainable AI evidence generation

---

# 🎯 Project Objective

The objective of EnergyShield AI is to transform fragmented energy-risk information into actionable decision support.

The platform helps answer:

- What is happening?
- Where is the risk?
- Which suppliers are affected?
- Which corridors are vulnerable?
- How much supply is at risk?
- How much reserve coverage remains?
- What happens under a disruption?
- What mitigation strategies should be considered?

---

# 👥 Team

EnergyShield AI was developed as a hackathon project focused on AI-driven energy supply-chain resilience for import-dependent economies.

---

# 📌 Project Status

Project: EnergyShield AI

Domain: Energy Supply Chain Resilience

Application Type: Full-Stack Web Application

Frontend: React + Vite

Backend: Node.js + Express

Database: MongoDB

External Market Data: EIA API

Authentication: JWT

Status: Hackathon Ready 🚀

---

# EnergyShield AI

## Monitor. Analyze. Simulate. Respond.

### AI-driven energy supply-chain resilience for import-dependent economies.

# EnergyShield AI

## AI-Driven Energy Supply Chain Resilience for Import-Dependent Economies

EnergyShield AI is an AI-powered energy supply-chain resilience and decision-support platform designed to help monitor, analyze, and respond to energy supply risks in import-dependent economies such as India.

The platform brings together geopolitical events, critical shipping corridors, supplier dependencies, crude oil market intelligence, strategic reserves, risk scoring, scenario simulation, recommendations, and real-time alerts into a unified Energy Resilience Command Center.

---

## 🚀 Project Overview

Global energy supply chains are vulnerable to geopolitical conflicts, shipping corridor disruptions, supplier dependencies, crude oil price fluctuations, sanctions, and changes in strategic reserves.

EnergyShield AI provides a centralized platform to understand these risks and evaluate their potential impact.

The system follows the workflow:

Geopolitical Event
        ↓
Risk Detection
        ↓
Affected Energy Corridor
        ↓
Supply Disruption Risk
        ↓
Scenario Simulation
        ↓
Alternative Supply Analysis
        ↓
Strategic Reserve Analysis
        ↓
Recommendations
        ↓
Decision Support

The platform is designed as a decision-support system. It does not autonomously execute procurement or other real-world operational decisions.

---

# ✨ Key Features

## 1. Energy Resilience Command Center

The main dashboard provides a consolidated view of India's energy supply-chain risk.

It displays:

- Overall energy supply risk score
- Overall risk level
- Geopolitical risk
- Shipping risk
- Supplier risk
- Price volatility risk
- Strategic reserve risk
- Crude oil price
- Estimated supply at risk
- Strategic reserve coverage
- Active alerts
- Strait of Hormuz risk
- Red Sea corridor risk
- Recent geopolitical events
- Risk component visualization

The dashboard acts as the primary command center for monitoring the energy resilience posture.

---

## 2. Real-Time Energy & Oil Market Intelligence

EnergyShield AI integrates with the U.S. Energy Information Administration (EIA) API for energy market intelligence.

The market intelligence module provides:

- Current crude oil market information
- Historical market data
- Price monitoring
- Price changes
- Price volatility analysis
- Historical chart data
- Latest update timestamp
- Live data status
- Demo/fallback data when the external API is unavailable

The EIA API key is stored in the backend `.env` file and is never exposed in frontend source code.

### Live Data Flow

EIA API
   ↓
Backend Market Service
   ↓
Market Data Processing
   ↓
Dashboard
   ↓
Risk Engine

### Fallback

If the EIA service is unavailable:

EIA API unavailable
        ↓
Fallback/demo market data
        ↓
Application continues operating

This prevents external API failures from breaking the complete application.

---

## 3. Explainable Risk Engine

EnergyShield AI uses a transparent weighted risk model.

The overall risk score combines five major components:

| Component | Weight |
|---|---:|
| Geopolitical Risk | 30% |
| Shipping Risk | 25% |
| Supplier Risk | 20% |
| Price Volatility Risk | 15% |
| Strategic Reserve Risk | 10% |

### Risk Formula

Overall Risk =

0.30 × Geopolitical Risk

+ 0.25 × Shipping Risk

+ 0.20 × Supplier Risk

+ 0.15 × Price Volatility Risk

+ 0.10 × Reserve Risk

Each component produces a score between 0 and 100.

The transparent structure allows users to understand why the overall risk score changes.

---

## 4. Geopolitical Risk Intelligence

The Events module tracks geopolitical events that may affect energy supply.

Events include:

- Event title
- Region
- Date
- Severity
- Related energy risk

Supported severity levels:

- INFO
- WARNING
- HIGH
- CRITICAL

Recent geopolitical events contribute to the geopolitical component of the overall risk engine.

Higher-severity events have a greater influence on the risk calculation.

---

## 5. Shipping Corridor Risk Intelligence

EnergyShield AI monitors important energy transportation corridors.

Currently monitored corridors include:

- Strait of Hormuz
- Red Sea Corridor

Each corridor contains information such as:

- Corridor name
- Corridor code
- Current status
- Risk score
- Risk level
- Supply dependency percentage

Shipping risk is calculated using dependency-weighted corridor risk.

This means that corridors carrying a larger share of energy imports have a greater impact on the overall shipping risk.

---

## 6. Supplier Risk Analysis

The Suppliers module analyzes energy supplier exposure.

Supplier risk considers:

- Supply capacity
- Supplier risk score
- Reliability score
- Supply contribution

The risk engine uses a capacity-weighted supplier calculation.

Suppliers with larger supply capacity have a greater influence on the overall supplier risk.

Reliability is also considered when calculating adjusted supplier risk.

---

## 7. Strategic Reserve Monitoring

The Reserves module monitors strategic energy reserves.

It provides information such as:

- Current reserve level
- Total reserve capacity
- Daily consumption
- Reserve coverage
- Reserve status

### Reserve Coverage

Reserve coverage is calculated using:

Coverage Days = Current Reserve Level / Daily Consumption

Lower coverage results in higher reserve risk.

This allows decision-makers to understand how long available strategic reserves could support consumption under the current assumptions.

---

## 8. What-If Scenario Simulator

The Scenarios module allows users to simulate hypothetical energy disruptions.

Example scenarios include:

- Strait of Hormuz disruption
- Red Sea disruption
- Supplier disruption
- Geopolitical escalation
- Oil price shock
- Supply reduction
- Reserve stress

The simulator helps estimate potential consequences such as:

- Supply impact
- Risk changes
- Reserve impact
- Procurement requirements
- Overall resilience impact

This enables users to compare possible situations before making decisions.

---

## 9. Risk-Based Recommendations

The Recommendations module provides decision-support recommendations based on the current energy risk environment.

Recommendations can address:

- Supplier diversification
- Supply disruption mitigation
- Strategic reserve management
- Corridor risk
- Energy supply exposure
- Risk reduction

The recommendation logic is implemented as a separate backend service so it can be extended with more advanced optimization and machine-learning approaches in the future.

---

## 10. Real-Time Risk Alerts

The Alerts module identifies important changes in the energy risk environment.

Alerts can be generated for conditions involving:

- Overall risk
- Geopolitical risk
- Shipping corridor risk
- Supplier risk
- Crude oil price
- Price volatility
- Strategic reserves
- Supply exposure

Supported alert severity levels:

- INFO
- WARNING
- HIGH
- CRITICAL

The alert service also prevents repeated unchanged dashboard refreshes from continuously creating duplicate alerts.

---

## 11. Energy Supply Chain Digital Twin / Map

The Supply Chain Map provides a visual representation of the energy supply chain.

It connects the major components of the energy system, including:

- Suppliers
- Shipping corridors
- Indian energy infrastructure
- Supply dependencies
- Risk exposure

The map provides a visual way to understand where disruptions may propagate through the supply chain.

---

## 12. Risk History

Risk calculations are persisted as historical snapshots.

This enables:

- Risk trend monitoring
- Historical analysis
- Auditability
- Future forecasting
- Comparison of risk over time

The backend exposes risk history through the API.

---

# 🧠 Intelligent Decision-Support Workflow

EnergyShield AI connects all major modules into one decision-support pipeline.

```text
                GEOPOLITICAL EVENTS
                       │
                       ▼
                GEOPOLITICAL RISK
                       │
                       ▼
              SHIPPING CORRIDOR RISK
                       │
                       ▼
                SUPPLIER EXPOSURE
                       │
                       ▼
              OIL MARKET CONDITIONS
                       │
                       ▼
                RESERVE POSITION
                       │
                       ▼
                 RISK ENGINE
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          ALERTS    SIMULATOR  HISTORY
                       │
                       ▼
                RECOMMENDATIONS
                       │
                       ▼
                DECISION SUPPORT

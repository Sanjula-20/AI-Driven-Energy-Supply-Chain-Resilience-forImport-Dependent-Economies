/**
 * EnergyShield AI - Database Seed Script
 * ---------------------------------------
 * Populates MongoDB with realistic DEMO data so the app works immediately
 * after setup. Every document is flagged isDemoData: true. Run with:
 *   npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Corridor = require('../models/Corridor');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');
const ReserveStatus = require('../models/ReserveStatus');
const Scenario = require('../models/Scenario');
const Recommendation = require('../models/Recommendation');
const Alert = require('../models/Alert');
const RiskScore = require('../models/RiskScore');

const { generateRecommendations } = require('../services/recommendation.service');
const { refreshAlerts } = require('../services/alert.service');
const { computeAndStoreRisk } = require('../services/riskEngine.service');

async function seedUsers() {
  const users = [
    {
      name: 'Aditi Sharma',
      email: 'admin@energyshield.ai',
      role: 'ADMIN',
      password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    },
    {
      name: 'Rahul Nair',
      email: 'analyst@energyshield.ai',
      role: 'ANALYST',
      password: process.env.SEED_ANALYST_PASSWORD || 'Analyst@12345',
    },
    {
      name: 'Priya Menon',
      email: 'viewer@energyshield.ai',
      role: 'VIEWER',
      password: process.env.SEED_VIEWER_PASSWORD || 'Viewer@12345',
    },
  ];

  for (const u of users) {
    const passwordHash = await User.hashPassword(u.password);
    await User.create({ name: u.name, email: u.email, role: u.role, passwordHash });
  }
  console.log(`[seed] Created ${users.length} demo users.`);
}

async function seedSuppliers() {
  const suppliers = [
    {
      name: 'Saudi Aramco',
      country: 'Saudi Arabia',
      countryCode: 'SA',
      coordinates: { lat: 24.7136, lng: 46.6753 },
      supplyCapacityKbpd: 1180,
      estimatedPriceUsdPerBarrel: 83.5,
      riskScore: 42,
      reliabilityScore: 88,
      status: 'ACTIVE',
      primaryCorridor: 'HORMUZ',
    },
    {
      name: 'ADNOC',
      country: 'United Arab Emirates',
      countryCode: 'AE',
      coordinates: { lat: 24.4539, lng: 54.3773 },
      supplyCapacityKbpd: 730,
      estimatedPriceUsdPerBarrel: 84.0,
      riskScore: 38,
      reliabilityScore: 90,
      status: 'ACTIVE',
      primaryCorridor: 'HORMUZ',
    },
    {
      name: 'Basra Oil Company',
      country: 'Iraq',
      countryCode: 'IQ',
      coordinates: { lat: 33.3152, lng: 44.3661 },
      supplyCapacityKbpd: 960,
      estimatedPriceUsdPerBarrel: 81.0,
      riskScore: 64,
      reliabilityScore: 66,
      status: 'ACTIVE',
      primaryCorridor: 'HORMUZ',
    },
    {
      name: 'Rosneft',
      country: 'Russia',
      countryCode: 'RU',
      coordinates: { lat: 55.7558, lng: 37.6173 },
      supplyCapacityKbpd: 1650,
      estimatedPriceUsdPerBarrel: 68.5,
      riskScore: 71,
      reliabilityScore: 58,
      status: 'ACTIVE',
      primaryCorridor: 'CAPE_OF_GOOD_HOPE',
    },
    {
      name: 'ExxonMobil (Gulf Coast)',
      country: 'United States',
      countryCode: 'US',
      coordinates: { lat: 29.7604, lng: -95.3698 },
      supplyCapacityKbpd: 540,
      estimatedPriceUsdPerBarrel: 86.0,
      riskScore: 22,
      reliabilityScore: 95,
      status: 'ACTIVE',
      primaryCorridor: 'CAPE_OF_GOOD_HOPE',
    },
  ];

  await Supplier.insertMany(suppliers);
  console.log(`[seed] Created ${suppliers.length} demo suppliers.`);
}

async function seedCorridors() {
  const corridors = [
    {
      code: 'HORMUZ',
      name: 'Strait of Hormuz',
      riskScore: 68,
      riskLevel: 'HIGH',
      supplyDependencyPercent: 42,
      currentStatus: 'CONGESTED',
      disruptionProbabilityPercent: 34,
      alternativeRouteAvailable: false,
      path: [
        { lat: 26.5, lng: 56.3 },
        { lat: 26.6, lng: 56.5 },
        { lat: 26.9, lng: 56.8 },
      ],
    },
    {
      code: 'RED_SEA',
      name: 'Red Sea / Bab-el-Mandeb',
      riskScore: 74,
      riskLevel: 'HIGH',
      supplyDependencyPercent: 18,
      currentStatus: 'RESTRICTED',
      disruptionProbabilityPercent: 47,
      alternativeRouteAvailable: true,
      path: [
        { lat: 12.6, lng: 43.4 },
        { lat: 15.5, lng: 41.8 },
        { lat: 20.0, lng: 38.5 },
      ],
    },
    {
      code: 'ARABIAN_SEA',
      name: 'Arabian Sea',
      riskScore: 31,
      riskLevel: 'MEDIUM',
      supplyDependencyPercent: 25,
      currentStatus: 'NORMAL',
      disruptionProbabilityPercent: 12,
      alternativeRouteAvailable: true,
      path: [
        { lat: 20.0, lng: 63.0 },
        { lat: 18.5, lng: 68.0 },
        { lat: 19.0, lng: 72.8 },
      ],
    },
    {
      code: 'CAPE_OF_GOOD_HOPE',
      name: 'Cape of Good Hope',
      riskScore: 19,
      riskLevel: 'LOW',
      supplyDependencyPercent: 15,
      currentStatus: 'NORMAL',
      disruptionProbabilityPercent: 6,
      alternativeRouteAvailable: false,
      path: [
        { lat: -34.4, lng: 18.5 },
        { lat: -30.0, lng: 30.0 },
        { lat: -10.0, lng: 55.0 },
      ],
    },
  ];

  await Corridor.insertMany(corridors);
  console.log(`[seed] Created ${corridors.length} demo corridors.`);
}

async function seedEvents() {
  const now = Date.now();
  const daysAgo = (n) => new Date(now - n * 24 * 60 * 60 * 1000);

  const events = [
    {
      title: 'Naval patrol tensions reported near Strait of Hormuz',
      region: 'Persian Gulf',
      date: daysAgo(2),
      severity: 'HIGH',
      affectedCorridor: 'HORMUZ',
      affectedSuppliers: ['Saudi Aramco', 'ADNOC', 'Basra Oil Company'],
      description:
        'DEMO DATA: Simulated report of increased naval activity and inspection delays near the Strait of Hormuz, raising transit risk for tankers.',
    },
    {
      title: 'Vessel rerouting continues around Bab-el-Mandeb',
      region: 'Red Sea',
      date: daysAgo(5),
      severity: 'CRITICAL',
      affectedCorridor: 'RED_SEA',
      affectedSuppliers: ['Rosneft'],
      description:
        'DEMO DATA: Simulated escalation causing continued rerouting of tankers away from the Red Sea toward the Cape of Good Hope, adding transit time.',
    },
    {
      title: 'OPEC+ signals possible production adjustment',
      region: 'Global',
      date: daysAgo(9),
      severity: 'WARNING',
      affectedCorridor: null,
      affectedSuppliers: ['Saudi Aramco', 'ADNOC'],
      description:
        'DEMO DATA: Simulated OPEC+ commentary hinting at a review of production quotas at the next scheduled meeting.',
    },
    {
      title: 'Sanctions review affecting Russian crude exports',
      region: 'Eastern Europe',
      date: daysAgo(14),
      severity: 'WARNING',
      affectedCorridor: 'CAPE_OF_GOOD_HOPE',
      affectedSuppliers: ['Rosneft'],
      description:
        'DEMO DATA: Simulated update on an ongoing sanctions review that could affect shadow-fleet tanker capacity.',
    },
    {
      title: 'Port congestion easing at Jamnagar and Paradip',
      region: 'India',
      date: daysAgo(20),
      severity: 'INFO',
      affectedCorridor: 'ARABIAN_SEA',
      affectedSuppliers: [],
      description:
        'DEMO DATA: Simulated report showing improved berth availability at major Indian import terminals.',
    },
  ];

  await GeopoliticalEvent.insertMany(events);
  console.log(`[seed] Created ${events.length} demo geopolitical events.`);
}

async function seedReserve() {
  const reserve = {
    totalReserveCapacityMbbl: 39.0, // approx India SPR scale, demo figure
    currentReserveLevelMbbl: 27.5,
    dailyConsumptionMbbl: 0.62,
    recommendedDrawdownMbblPerDay: 0.05,
    status: 'CAUTION',
  };
  await ReserveStatus.create(reserve);
  console.log('[seed] Created demo reserve status.');
}

async function seedScenarios() {
  const scenarios = [
    {
      key: 'HORMUZ_CLOSURE',
      name: 'Strait of Hormuz Closure',
      description:
        'DEMO SCENARIO: Simulates a partial-to-full closure of the Strait of Hormuz, the corridor carrying the largest share of India\'s crude imports.',
      affectedCorridor: 'HORMUZ',
      affectedSuppliers: ['Saudi Aramco', 'ADNOC', 'Basra Oil Company'],
      baseSupplyLossPercentPerSeverity: 6,
      basePriceImpactPercentPerSeverity: 8,
    },
    {
      key: 'RED_SEA_ESCALATION',
      name: 'Red Sea Escalation',
      description:
        'DEMO SCENARIO: Simulates a further escalation in the Red Sea forcing sustained rerouting via the Cape of Good Hope.',
      affectedCorridor: 'RED_SEA',
      affectedSuppliers: ['Rosneft'],
      baseSupplyLossPercentPerSeverity: 3,
      basePriceImpactPercentPerSeverity: 4,
    },
    {
      key: 'SUPPLIER_OUTAGE',
      name: 'Major Supplier Production Outage',
      description:
        'DEMO SCENARIO: Simulates an unplanned production outage at a major supplier, independent of any shipping corridor.',
      affectedCorridor: null,
      affectedSuppliers: ['Basra Oil Company'],
      baseSupplyLossPercentPerSeverity: 4,
      basePriceImpactPercentPerSeverity: 5,
    },
  ];

  await Scenario.insertMany(scenarios);
  console.log(`[seed] Created ${scenarios.length} demo scenarios.`);
}

async function run() {
  await connectDB();

  console.log('[seed] Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Supplier.deleteMany({}),
    Corridor.deleteMany({}),
    GeopoliticalEvent.deleteMany({}),
    ReserveStatus.deleteMany({}),
    Scenario.deleteMany({}),
    Recommendation.deleteMany({}),
    Alert.deleteMany({}),
    RiskScore.deleteMany({}),
  ]);

  await seedUsers();
  await seedSuppliers();
  await seedCorridors();
  await seedEvents();
  await seedReserve();
  await seedScenarios();

  console.log('[seed] Computing initial risk score, alerts, and recommendations...');
  const risk = await computeAndStoreRisk({ crudeOilPriceUsdPerBarrel: 85 });
  await refreshAlerts(risk);
  await generateRecommendations();

  console.log('[seed] Done. Demo accounts:');
  console.log('        ADMIN   -> admin@energyshield.ai   / (see .env SEED_ADMIN_PASSWORD)');
  console.log('        ANALYST -> analyst@energyshield.ai / (see .env SEED_ANALYST_PASSWORD)');
  console.log('        VIEWER  -> viewer@energyshield.ai  / (see .env SEED_VIEWER_PASSWORD)');

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});

const { RISK_WEIGHTS, RISK_BANDS } = require('../config/constants');
const Corridor = require('../models/Corridor');
const Supplier = require('../models/Supplier');
const ReserveStatus = require('../models/ReserveStatus');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');
const RiskScore = require('../models/RiskScore');

/**
 * EnergyShield V1 Risk Engine
 * ---------------------------
 * A transparent, rule-based weighted model. Every component score is 0-100
 * and derived directly from stored data (corridors, suppliers, reserves,
 * recent events) - no black-box logic, so it's fully explainable in a demo.
 *
 * Overall Risk = 30% Geopolitical + 25% Shipping + 20% Supplier
 *              + 15% Price Volatility + 10% Reserve
 *
 * This function is intentionally isolated from Express (no req/res) so a
 * future commit can swap its internals for an ML model without touching
 * any controller or route.
 */

function classify(score) {
  const band = RISK_BANDS.find((b) => score >= b.min && score <= b.max);
  return band ? band.level : 'CRITICAL';
}

async function computeGeopoliticalRisk() {
  // Average severity of events in the last 30 days, weighted toward HIGH/CRITICAL.
  const severityWeight = { INFO: 10, WARNING: 35, HIGH: 70, CRITICAL: 95 };
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const events = await GeopoliticalEvent.find({ date: { $gte: since } }).lean();

  if (events.length === 0) return 20; // baseline low risk when no recent events

  const total = events.reduce((sum, e) => sum + (severityWeight[e.severity] || 30), 0);
  return Math.min(100, Math.round(total / events.length));
}

async function computeShippingRisk() {
  const corridors = await Corridor.find().lean();
  if (corridors.length === 0) return 0;

  // Dependency-weighted average of corridor risk scores - a corridor that
  // carries more of India's imports moves the shipping risk more.
  const totalDependency = corridors.reduce((s, c) => s + c.supplyDependencyPercent, 0) || 1;
  const weighted = corridors.reduce(
    (s, c) => s + c.riskScore * (c.supplyDependencyPercent / totalDependency),
    0
  );
  return Math.round(weighted);
}

async function computeSupplierRisk() {
  const suppliers = await Supplier.find().lean();
  if (suppliers.length === 0) return 0;

  // Capacity-weighted average risk, inverse-adjusted slightly by reliability.
  const totalCapacity = suppliers.reduce((s, sup) => s + sup.supplyCapacityKbpd, 0) || 1;
  const weighted = suppliers.reduce((s, sup) => {
    const reliabilityPenalty = (100 - sup.reliabilityScore) * 0.2;
    const adjusted = Math.min(100, sup.riskScore + reliabilityPenalty);
    return s + adjusted * (sup.supplyCapacityKbpd / totalCapacity);
  }, 0);
  return Math.round(weighted);
}

async function computePriceVolatilityRisk(currentPrice, referencePrice = 82) {
  // Simple deviation-from-reference model for V1 demo purposes.
  const deviationPercent = Math.abs((currentPrice - referencePrice) / referencePrice) * 100;
  return Math.min(100, Math.round(deviationPercent * 4));
}

async function computeReserveRisk() {
  const reserve = await ReserveStatus.findOne().sort({ createdAt: -1 }).lean();
  if (!reserve) return 50;

  const coverageDays = reserve.dailyConsumptionMbbl
    ? reserve.currentReserveLevelMbbl / reserve.dailyConsumptionMbbl
    : 0;

  // Fewer coverage days -> higher risk. 60+ days is treated as comfortable.
  const risk = Math.max(0, Math.min(100, Math.round(100 - (coverageDays / 60) * 100)));
  return risk;
}

async function computeOverallRisk({ crudeOilPriceUsdPerBarrel = 85 } = {}) {
  const [geopolitical, shipping, supplier, priceVolatility, reserve] = await Promise.all([
    computeGeopoliticalRisk(),
    computeShippingRisk(),
    computeSupplierRisk(),
    computePriceVolatilityRisk(crudeOilPriceUsdPerBarrel),
    computeReserveRisk(),
  ]);

  const overallScore = Math.round(
    geopolitical * RISK_WEIGHTS.geopolitical +
      shipping * RISK_WEIGHTS.shipping +
      supplier * RISK_WEIGHTS.supplier +
      priceVolatility * RISK_WEIGHTS.priceVolatility +
      reserve * RISK_WEIGHTS.reserve
  );

  const suppliers = await Supplier.find().lean();
  const totalCapacity = suppliers.reduce((s, sup) => s + sup.supplyCapacityKbpd, 0);
  const estimatedSupplyAtRiskKbpd = Math.round(totalCapacity * (overallScore / 100) * 0.4);

  return {
    overallScore,
    overallLevel: classify(overallScore),
    components: { geopolitical, shipping, supplier, priceVolatility, reserve },
    crudeOilPriceUsdPerBarrel,
    estimatedSupplyAtRiskKbpd,
  };
}

/** Computes the current risk and persists a snapshot for history/audit. */
async function computeAndStoreRisk(options) {
  const result = await computeOverallRisk(options);
  const saved = await RiskScore.create(result);
  return saved.toObject();
}

module.exports = {
  classify,
  computeGeopoliticalRisk,
  computeShippingRisk,
  computeSupplierRisk,
  computePriceVolatilityRisk,
  computeReserveRisk,
  computeOverallRisk,
  computeAndStoreRisk,
};

const { RESERVE_COVERAGE_THRESHOLD_DAYS } = require('../config/constants');
const Corridor = require('../models/Corridor');
const Supplier = require('../models/Supplier');
const ReserveStatus = require('../models/ReserveStatus');
const Recommendation = require('../models/Recommendation');

/**
 * V1 rule-based recommendation generator. Reads live corridor/supplier/reserve
 * data and produces a fresh set of recommendations each time it's called.
 * Clearly labeled RULE_BASED so a future AI_GENERATED path can plug in
 * alongside it without breaking the API contract.
 */
async function generateRecommendations() {
  const recommendations = [];

  const corridors = await Corridor.find().lean();
  const hormuz = corridors.find((c) => c.code === 'HORMUZ');
  if (hormuz && hormuz.riskScore >= 61) {
    recommendations.push({
      title: 'Shift procurement toward alternative suppliers',
      description:
        `Strait of Hormuz risk is ${hormuz.riskLevel} (${hormuz.riskScore}/100). ` +
        'Reduce dependency by increasing allocation to suppliers not reliant on this corridor.',
      priority: hormuz.riskScore >= 81 ? 'CRITICAL' : 'HIGH',
      category: 'PROCUREMENT',
      triggeredBy: `Hormuz corridor risk score = ${hormuz.riskScore}`,
    });
  }

  const redSea = corridors.find((c) => c.code === 'RED_SEA');
  if (redSea && redSea.riskScore >= 61) {
    recommendations.push({
      title: 'Evaluate Cape of Good Hope rerouting',
      description:
        `Red Sea corridor risk is ${redSea.riskLevel} (${redSea.riskScore}/100). ` +
        'Assess rerouting via Cape of Good Hope despite longer transit time.',
      priority: redSea.riskScore >= 81 ? 'CRITICAL' : 'HIGH',
      category: 'ROUTING',
      triggeredBy: `Red Sea corridor risk score = ${redSea.riskScore}`,
    });
  }

  const reserve = await ReserveStatus.findOne().sort({ createdAt: -1 }).lean();
  if (reserve) {
    const coverageDays = reserve.dailyConsumptionMbbl
      ? reserve.currentReserveLevelMbbl / reserve.dailyConsumptionMbbl
      : 0;
    if (coverageDays < RESERVE_COVERAGE_THRESHOLD_DAYS) {
      recommendations.push({
        title: 'Adopt cautious reserve management',
        description:
          `Strategic reserve coverage is ${coverageDays.toFixed(1)} days, below the ` +
          `${RESERVE_COVERAGE_THRESHOLD_DAYS}-day threshold. Slow non-essential drawdown and ` +
          'prioritize replenishment.',
        priority: coverageDays < 25 ? 'CRITICAL' : 'MEDIUM',
        category: 'RESERVE',
        triggeredBy: `Reserve coverage = ${coverageDays.toFixed(1)} days`,
      });
    }
  }

  const suppliers = await Supplier.find().lean();
  const highRiskSuppliers = suppliers.filter((s) => s.riskScore >= 61);
  if (highRiskSuppliers.length > 0) {
    recommendations.push({
      title: 'Diversify procurement across suppliers',
      description:
        `${highRiskSuppliers.length} supplier(s) currently carry HIGH or CRITICAL risk ` +
        `(${highRiskSuppliers.map((s) => s.name).join(', ')}). Increase the share sourced ` +
        'from lower-risk, higher-reliability suppliers.',
      priority: 'MEDIUM',
      category: 'SUPPLIER',
      triggeredBy: `${highRiskSuppliers.length} supplier(s) with risk score >= 61`,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Maintain current procurement strategy',
      description: 'All monitored corridors, suppliers, and reserves are within normal thresholds.',
      priority: 'LOW',
      category: 'PROCUREMENT',
      triggeredBy: 'No thresholds breached',
    });
  }

  // Replace the active set so the panel always reflects the latest computation.
  await Recommendation.updateMany({ isActive: true }, { $set: { isActive: false } });
  const created = await Recommendation.insertMany(
    recommendations.map((r) => ({ ...r, generationMethod: 'RULE_BASED', isActive: true }))
  );

  return created;
}

module.exports = { generateRecommendations };

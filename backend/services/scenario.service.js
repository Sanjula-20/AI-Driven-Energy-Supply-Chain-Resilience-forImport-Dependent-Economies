const Scenario = require('../models/Scenario');
const Corridor = require('../models/Corridor');
const Supplier = require('../models/Supplier');

/**
 * V1 "What If?" simulator. Transparent rule-based math: base impact figures
 * from the Scenario document, scaled linearly by severity (1-5) and duration
 * (days). No ML - this is intentionally simple and explainable, structured
 * so a future commit can swap in a probabilistic/ML model behind the same
 * simulate(key, duration, severity) signature.
 */
async function simulateScenario({ scenarioKey, durationDays, severity }) {
  const scenario = await Scenario.findOne({ key: scenarioKey }).lean();
  if (!scenario) {
    const err = new Error(`Unknown scenario key: ${scenarioKey}`);
    err.statusCode = 404;
    throw err;
  }

  const clampedSeverity = Math.min(5, Math.max(1, Number(severity) || 1));
  const clampedDuration = Math.min(90, Math.max(1, Number(durationDays) || 1));

  const durationFactor = 1 + Math.log10(clampedDuration + 1) * 0.5; // diminishing effect over time

  const supplyLossPercent = Math.min(
    100,
    Math.round(scenario.baseSupplyLossPercentPerSeverity * clampedSeverity * durationFactor * 10) / 10
  );
  const priceImpactPercent = Math.min(
    200,
    Math.round(scenario.basePriceImpactPercentPerSeverity * clampedSeverity * durationFactor * 10) / 10
  );

  const suppliers = await Supplier.find().lean();
  const totalCapacity = suppliers.reduce((s, sup) => s + sup.supplyCapacityKbpd, 0);
  const estimatedSupplyLossKbpd = Math.round(totalCapacity * (supplyLossPercent / 100));

  // Reserve requirement: how much strategic reserve (million barrels) is
  // needed to cover the lost supply for the scenario duration.
  const reserveRequirementMbbl = Math.round(((estimatedSupplyLossKbpd * 1000) / 1_000_000) * clampedDuration * 10) / 10;

  const affectedCorridor = scenario.affectedCorridor
    ? await Corridor.findOne({ code: scenario.affectedCorridor }).lean()
    : null;

  let recommendedAction = 'Monitor the situation; no immediate action required.';
  if (supplyLossPercent >= 40) {
    recommendedAction =
      'Activate strategic reserve drawdown and immediately diversify procurement toward unaffected suppliers and corridors.';
  } else if (supplyLossPercent >= 15) {
    recommendedAction =
      'Increase procurement from alternative suppliers and pre-position reserve drawdown plans.';
  }

  return {
    scenario: {
      key: scenario.key,
      name: scenario.name,
      description: scenario.description,
    },
    inputs: { durationDays: clampedDuration, severity: clampedSeverity },
    results: {
      estimatedSupplyLossPercent: supplyLossPercent,
      estimatedSupplyLossKbpd,
      estimatedPriceImpactPercent: priceImpactPercent,
      reserveRequirementMbbl,
      affectedSuppliers: scenario.affectedSuppliers,
      affectedCorridors: affectedCorridor ? [affectedCorridor.name] : [],
      recommendedAction,
    },
    isDemoCalculation: true,
  };
}

module.exports = { simulateScenario };

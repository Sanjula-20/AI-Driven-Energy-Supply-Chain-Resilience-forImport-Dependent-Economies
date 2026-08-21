const { asyncHandler } = require('../middleware/errorHandler');
const Scenario = require('../models/Scenario');
const { simulateScenario } = require('../services/scenario.service');

// GET /api/scenarios
const getScenarios = asyncHandler(async (req, res) => {
  const scenarios = await Scenario.find().lean();
  res.json({ count: scenarios.length, scenarios, isDemoData: true });
});

// POST /api/scenarios/simulate
// body: { scenarioKey, durationDays, severity }
const postSimulateScenario = asyncHandler(async (req, res) => {
  const { scenarioKey, durationDays, severity } = req.body;
  if (!scenarioKey) {
    res.status(400);
    throw new Error('scenarioKey is required.');
  }
  const result = await simulateScenario({ scenarioKey, durationDays, severity });
  res.json(result);
});

module.exports = { getScenarios, postSimulateScenario };

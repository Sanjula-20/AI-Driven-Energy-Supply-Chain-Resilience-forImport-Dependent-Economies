const { asyncHandler } = require('../middleware/errorHandler');
const riskEngine = require('../services/riskEngine.service');

// GET /api/risk
const getRisk = asyncHandler(async (req, res) => {
  const price = req.query.price ? Number(req.query.price) : 85;
  const result = await riskEngine.computeOverallRisk({ crudeOilPriceUsdPerBarrel: price });
  res.json({ ...result, isDemoCalculation: true });
});

module.exports = { getRisk };

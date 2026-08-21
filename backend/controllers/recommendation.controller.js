const { asyncHandler } = require('../middleware/errorHandler');
const { generateRecommendations } = require('../services/recommendation.service');

// GET /api/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await generateRecommendations();
  const active = recommendations.filter((r) => r.isActive);
  res.json({
    count: active.length,
    recommendations: active,
    generationMethod: 'RULE_BASED',
    isDemoData: true,
  });
});

module.exports = { getRecommendations };

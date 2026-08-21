const { asyncHandler } = require('../middleware/errorHandler');
const Corridor = require('../models/Corridor');

// GET /api/corridors
const getCorridors = asyncHandler(async (req, res) => {
  const corridors = await Corridor.find().sort({ riskScore: -1 }).lean();
  res.json({ count: corridors.length, corridors, isDemoData: true });
});

// GET /api/corridors/:code
const getCorridorByCode = asyncHandler(async (req, res) => {
  const corridor = await Corridor.findOne({ code: req.params.code.toUpperCase() }).lean();
  if (!corridor) {
    res.status(404);
    throw new Error('Corridor not found.');
  }
  res.json({ corridor });
});

module.exports = { getCorridors, getCorridorByCode };

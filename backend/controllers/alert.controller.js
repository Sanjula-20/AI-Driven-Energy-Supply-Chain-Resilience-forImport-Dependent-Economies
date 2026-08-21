const { asyncHandler } = require('../middleware/errorHandler');
const Alert = require('../models/Alert');

// GET /api/alerts
const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  res.json({ count: alerts.length, alerts, isDemoData: true });
});

module.exports = { getAlerts };

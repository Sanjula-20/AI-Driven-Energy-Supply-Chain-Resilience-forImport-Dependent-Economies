const { asyncHandler } = require('../middleware/errorHandler');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');

// GET /api/events
const getEvents = asyncHandler(async (req, res) => {
  const events = await GeopoliticalEvent.find().sort({ date: -1 }).lean();
  res.json({ count: events.length, events, isDemoData: true });
});

module.exports = { getEvents };

const { asyncHandler } = require('../middleware/errorHandler');
const ReserveStatus = require('../models/ReserveStatus');
const { RESERVE_COVERAGE_THRESHOLD_DAYS } = require('../config/constants');

// GET /api/reserves
const getReserveStatus = asyncHandler(async (req, res) => {
  const reserve = await ReserveStatus.findOne().sort({ createdAt: -1 }).lean();
  if (!reserve) {
    res.status(404);
    throw new Error('No reserve data found. Run the seed script.');
  }

  const availableCrudeMbbl = reserve.currentReserveLevelMbbl;
  const coverageDays = reserve.dailyConsumptionMbbl
    ? Math.round((reserve.currentReserveLevelMbbl / reserve.dailyConsumptionMbbl) * 10) / 10
    : 0;

  res.json({
    totalReserveCapacityMbbl: reserve.totalReserveCapacityMbbl,
    currentReserveLevelMbbl: reserve.currentReserveLevelMbbl,
    availableCrudeMbbl,
    dailyConsumptionMbbl: reserve.dailyConsumptionMbbl,
    estimatedCoverageDays: coverageDays,
    status: reserve.status,
    coverageThresholdDays: RESERVE_COVERAGE_THRESHOLD_DAYS,
    recommendedDrawdownMbblPerDay: reserve.recommendedDrawdownMbblPerDay,
    isDemoData: true,
  });
});

module.exports = { getReserveStatus };

const { asyncHandler } = require('../middleware/errorHandler');
const Corridor = require('../models/Corridor');
const ReserveStatus = require('../models/ReserveStatus');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');
const Alert = require('../models/Alert');
const RiskScore = require('../models/RiskScore');
const riskEngine = require('../services/riskEngine.service');
const alertService = require('../services/alert.service');
const { getEnergyMarketData } = require('../services/market.service');
// GET /api/dashboard
// Aggregates everything the Command Center needs into one call.
const getDashboard = asyncHandler(async (req, res) => {
  const market = await getEnergyMarketData();
  const latestPrice = market.brent.price;

  const risk = await riskEngine.computeAndStoreRisk({
    crudeOilPriceUsdPerBarrel: latestPrice,
  });
  await alertService.refreshAlerts(risk);

  const [hormuz, redSea, reserve, activeAlerts, recentEvents] = await Promise.all([
    Corridor.findOne({ code: 'HORMUZ' }).lean(),
    Corridor.findOne({ code: 'RED_SEA' }).lean(),
    ReserveStatus.findOne().sort({ createdAt: -1 }).lean(),
    Alert.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
    GeopoliticalEvent.find().sort({ date: -1 }).limit(5).lean(),
  ]);

  const coverageDays = reserve && reserve.dailyConsumptionMbbl
    ? Math.round((reserve.currentReserveLevelMbbl / reserve.dailyConsumptionMbbl) * 10) / 10
    : null;

  res.json({
    overallRisk: { score: risk.overallScore, level: risk.overallLevel, components: risk.components },
    hormuzCorridorRisk: hormuz
      ? { score: hormuz.riskScore, level: hormuz.riskLevel, status: hormuz.currentStatus }
      : null,
    redSeaCorridorRisk: redSea
      ? { score: redSea.riskScore, level: redSea.riskLevel, status: redSea.currentStatus }
      : null,
    supplierRisk: risk.components.supplier,
    crudeOilPriceUsdPerBarrel: risk.crudeOilPriceUsdPerBarrel,
    market,
    estimatedSupplyAtRiskKbpd: risk.estimatedSupplyAtRiskKbpd,
    strategicReserve: reserve
      ? {
          currentLevelMbbl: reserve.currentReserveLevelMbbl,
          totalCapacityMbbl: reserve.totalReserveCapacityMbbl,
          coverageDays,
          status: reserve.status,
        }
      : null,
    activeAlerts,
    recentEvents,
    isDemoData: !market.isLive,
  });
});

// GET /api/risk (also exposes history)
const getRiskHistory = asyncHandler(async (req, res) => {
  const history = await RiskScore.find().sort({ createdAt: -1 }).limit(20).lean();
  res.json({ latest: history[0] || null, history: history.reverse() });
});

module.exports = { getDashboard, getRiskHistory };

const Corridor = require('../models/Corridor');
const ReserveStatus = require('../models/ReserveStatus');
const Alert = require('../models/Alert');
const { RESERVE_COVERAGE_THRESHOLD_DAYS } = require('../config/constants');

/**
 * Derives active alerts from current corridor and reserve state.
 * V1 is rule-based; a future commit can add a real-time ingestion path
 * that writes Alert documents directly from news/AIS feeds.
 */
async function refreshAlerts(riskResult) {
  const alerts = [];

  const corridors = await Corridor.find().lean();
  corridors.forEach((c) => {
    if (c.riskScore >= 81) {
      alerts.push({
        title: `${c.name} at CRITICAL risk`,
        message: `${c.name} risk score is ${c.riskScore}/100 (${c.currentStatus}). Disruption probability ${c.disruptionProbabilityPercent}%.`,
        severity: 'CRITICAL',
        source: 'CORRIDOR',
      });
    } else if (c.riskScore >= 61) {
      alerts.push({
        title: `${c.name} at HIGH risk`,
        message: `${c.name} risk score is ${c.riskScore}/100 (${c.currentStatus}).`,
        severity: 'HIGH',
        source: 'CORRIDOR',
      });
    }
  });

  const reserve = await ReserveStatus.findOne().sort({ createdAt: -1 }).lean();
  if (reserve) {
    const coverageDays = reserve.dailyConsumptionMbbl
      ? reserve.currentReserveLevelMbbl / reserve.dailyConsumptionMbbl
      : 0;
    if (coverageDays < RESERVE_COVERAGE_THRESHOLD_DAYS) {
      alerts.push({
        title: 'Strategic reserve coverage below threshold',
        message: `Coverage is ${coverageDays.toFixed(1)} days, below the ${RESERVE_COVERAGE_THRESHOLD_DAYS}-day threshold.`,
        severity: coverageDays < 25 ? 'CRITICAL' : 'WARNING',
        source: 'RESERVE',
      });
    }
  }

  if (riskResult && riskResult.overallLevel === 'CRITICAL') {
    alerts.push({
      title: 'Overall energy supply risk is CRITICAL',
      message: `Composite risk score is ${riskResult.overallScore}/100.`,
      severity: 'CRITICAL',
      source: 'RISK_ENGINE',
    });
  } else if (riskResult && riskResult.overallLevel === 'HIGH') {
    alerts.push({
      title: 'Overall energy supply risk is HIGH',
      message: `Composite risk score is ${riskResult.overallScore}/100.`,
      severity: 'HIGH',
      source: 'RISK_ENGINE',
    });
  }

  await Alert.updateMany({ isActive: true }, { $set: { isActive: false } });
  if (alerts.length > 0) {
    return Alert.insertMany(alerts.map((a) => ({ ...a, isActive: true })));
  }
  return [];
}

module.exports = { refreshAlerts };

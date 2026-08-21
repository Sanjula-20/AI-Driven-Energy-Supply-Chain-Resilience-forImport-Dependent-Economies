// Central place for tunable business rules.
// Keeping these here (instead of scattered magic numbers) is what lets
// future commits swap the rule-based logic for ML without hunting through files.

module.exports = {
  ROLES: ['ADMIN', 'ANALYST', 'VIEWER'],

  // Overall Risk = 30% Geopolitical + 25% Shipping + 20% Supplier + 15% Price Volatility + 10% Reserve
  RISK_WEIGHTS: {
    geopolitical: 0.30,
    shipping: 0.25,
    supplier: 0.20,
    priceVolatility: 0.15,
    reserve: 0.10,
  },

  RISK_BANDS: [
    { level: 'LOW', min: 0, max: 30 },
    { level: 'MEDIUM', min: 31, max: 60 },
    { level: 'HIGH', min: 61, max: 80 },
    { level: 'CRITICAL', min: 81, max: 100 },
  ],

  ALERT_SEVERITIES: ['INFO', 'WARNING', 'HIGH', 'CRITICAL'],

  RESERVE_COVERAGE_THRESHOLD_DAYS: 45, // below this, reserve status becomes cautionary

  CORRIDOR_CODES: ['HORMUZ', 'RED_SEA', 'ARABIAN_SEA', 'CAPE_OF_GOOD_HOPE'],
};

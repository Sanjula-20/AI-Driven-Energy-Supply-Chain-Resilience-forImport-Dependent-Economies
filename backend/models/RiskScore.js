const mongoose = require('mongoose');

// Snapshot of a computed risk score, stored so the dashboard has history
// and so the risk engine's output is auditable (useful once ML replaces it).
const RiskScoreSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, min: 0, max: 100, required: true },
    overallLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    components: {
      geopolitical: { type: Number, required: true },
      shipping: { type: Number, required: true },
      supplier: { type: Number, required: true },
      priceVolatility: { type: Number, required: true },
      reserve: { type: Number, required: true },
    },
    crudeOilPriceUsdPerBarrel: { type: Number, required: true },
    estimatedSupplyAtRiskKbpd: { type: Number, required: true },
    computedAt: { type: Date, default: Date.now },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RiskScore', RiskScoreSchema);

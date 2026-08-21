const mongoose = require('mongoose');

// A catalog entry for a simulate-able scenario (e.g. "Strait of Hormuz Closure").
const ScenarioSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // machine key, e.g. HORMUZ_CLOSURE
    name: { type: String, required: true },
    description: { type: String, required: true },
    affectedCorridor: { type: String }, // corridor code
    affectedSuppliers: [{ type: String }],
    baseSupplyLossPercentPerSeverity: { type: Number, required: true }, // multiplied by severity (1-5)
    basePriceImpactPercentPerSeverity: { type: Number, required: true },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scenario', ScenarioSchema);

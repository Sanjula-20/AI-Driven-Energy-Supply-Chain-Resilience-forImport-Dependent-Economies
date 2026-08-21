const mongoose = require('mongoose');
const { ALERT_SEVERITIES } = require('../config/constants');

const AlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ALERT_SEVERITIES, required: true },
    source: { type: String, default: 'RISK_ENGINE' }, // RISK_ENGINE, CORRIDOR, RESERVE, EVENT
    isActive: { type: Boolean, default: true },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', AlertSchema);

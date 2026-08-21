const mongoose = require('mongoose');
const { ALERT_SEVERITIES } = require('../config/constants');

const GeopoliticalEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    region: { type: String, required: true },
    date: { type: Date, required: true },
    severity: { type: String, enum: ALERT_SEVERITIES, required: true },
    affectedCorridor: { type: String }, // corridor code
    affectedSuppliers: [{ type: String }], // supplier names
    description: { type: String, required: true },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GeopoliticalEvent', GeopoliticalEventSchema);

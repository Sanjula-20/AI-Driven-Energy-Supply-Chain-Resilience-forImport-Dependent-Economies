const mongoose = require('mongoose');

const CorridorSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // HORMUZ, RED_SEA, ...
    name: { type: String, required: true },
    riskScore: { type: Number, min: 0, max: 100, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    supplyDependencyPercent: { type: Number, required: true }, // % of India's crude imports flowing through it
    currentStatus: {
      type: String,
      enum: ['NORMAL', 'CONGESTED', 'RESTRICTED', 'CLOSED'],
      default: 'NORMAL',
    },
    disruptionProbabilityPercent: { type: Number, min: 0, max: 100, required: true },
    alternativeRouteAvailable: { type: Boolean, default: false },
    path: [
      {
        lat: Number,
        lng: Number,
      },
    ], // rough polyline for the map, demo geography
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Corridor', CorridorSchema);

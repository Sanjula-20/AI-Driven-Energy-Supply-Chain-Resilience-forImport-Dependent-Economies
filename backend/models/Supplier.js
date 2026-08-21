const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true }, // ISO2, used for map markers
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    supplyCapacityKbpd: { type: Number, required: true }, // thousand barrels per day
    estimatedPriceUsdPerBarrel: { type: Number, required: true },
    riskScore: { type: Number, min: 0, max: 100, required: true },
    reliabilityScore: { type: Number, min: 0, max: 100, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'REDUCED', 'SUSPENDED'],
      default: 'ACTIVE',
    },
    primaryCorridor: { type: String }, // corridor code this supplier ships through
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', SupplierSchema);

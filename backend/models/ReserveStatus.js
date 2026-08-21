const mongoose = require('mongoose');

const ReserveStatusSchema = new mongoose.Schema(
  {
    totalReserveCapacityMbbl: { type: Number, required: true }, // million barrels
    currentReserveLevelMbbl: { type: Number, required: true },
    dailyConsumptionMbbl: { type: Number, required: true },
    recommendedDrawdownMbblPerDay: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['HEALTHY', 'CAUTION', 'CRITICAL'],
      default: 'HEALTHY',
    },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReserveStatus', ReserveStatusSchema);

const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    category: {
      type: String,
      enum: ['PROCUREMENT', 'RESERVE', 'ROUTING', 'SUPPLIER'],
      required: true,
    },
    triggeredBy: { type: String, required: true }, // human-readable rule that fired
    generationMethod: { type: String, default: 'RULE_BASED' }, // vs 'AI_GENERATED' in future commits
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recommendation', RecommendationSchema);

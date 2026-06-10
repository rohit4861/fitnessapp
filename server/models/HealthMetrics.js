const mongoose = require('mongoose');

const healthMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  steps: { type: Number, default: 0 },
  heartRate: {
    resting: Number,
    average: Number,
    max: Number,
    min: Number
  },
  calories: {
    consumed: Number,
    burned: Number,
    goal: Number,
    net: Number
  },
  sleep: {
    duration: Number,
    quality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
    deepSleep: Number,
    lightSleep: Number,
    remSleep: Number,
    awakeTime: Number,
    bedTime: String,
    wakeTime: String
  },
  weight: Number,
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  waterIntake: Number
}, { timestamps: true });

// Compound index for efficient queries
healthMetricsSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('HealthMetrics', healthMetricsSchema);

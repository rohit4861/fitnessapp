const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  muscleGroup: {
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'full_body', 'cardio']
  },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 12 },
  duration: Number, // seconds for timed exercises
  restTime: { type: Number, default: 60 },
  instructions: [String],
  calories: Number,
  imageUrl: String,
  videoUrl: String
});

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'custom'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: { type: Number, required: true }, // minutes
  caloriesBurned: Number,
  exercises: [exerciseSchema],
  imageUrl: String,
  isAIGenerated: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const workoutSessionSchema = new mongoose.Schema({
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: Date,
  duration: Number,
  caloriesBurned: Number,
  exercisesCompleted: [{
    exerciseId: String,
    exerciseName: String,
    setsCompleted: Number,
    repsCompleted: [Number],
    weight: Number,
    formScore: Number
  }],
  heartRateAvg: Number,
  heartRateMax: Number,
  feedback: {
    difficulty: { type: Number, min: 1, max: 5 },
    enjoyment: { type: Number, min: 1, max: 5 },
    notes: String
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  }
}, { timestamps: true });

const workoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  goal: String,
  durationWeeks: { type: Number, required: true },
  workoutsPerWeek: { type: Number, required: true },
  schedule: [{
    week: Number,
    days: [{
      day: String,
      workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
      isRestDay: Boolean
    }]
  }],
  isActive: { type: Boolean, default: true },
  aiRecommendation: String
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);
const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);
const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = { Workout, WorkoutSession, WorkoutPlan };

const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { Workout, WorkoutSession, WorkoutPlan } = require('../models/Workout');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const { type, difficulty } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const workouts = await Workout.find(filter).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error: error.message });
  }
});

// Get today's recommended workout
router.get('/today', async (req, res) => {
  try {
    const user = req.user;
    // Simple recommendation based on fitness level
    const workout = await Workout.findOne({ difficulty: user.fitnessLevel });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today workout', error: error.message });
  }
});

// Get recommended workouts
router.get('/recommended', async (req, res) => {
  try {
    const user = req.user;
    const workouts = await Workout.find({ difficulty: user.fitnessLevel }).limit(5);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
});

// Get workout by ID
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout', error: error.message });
  }
});

// Get exercise library
router.get('/exercises', async (req, res) => {
  try {
    const { muscleGroup } = req.query;
    const filter = {};
    if (muscleGroup) filter['exercises.muscleGroup'] = muscleGroup;

    const workouts = await Workout.find(filter);
    const exercises = workouts.flatMap(w => w.exercises);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises', error: error.message });
  }
});

// Workout Plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
});

router.get('/plans/active', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.user._id, isActive: true });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active plan', error: error.message });
  }
});

router.post('/plans/generate', async (req, res) => {
  try {
    const { goal, daysPerWeek, duration, equipment, focusAreas, planWeeks } = req.body;

    // AI-based plan generation logic
    const plan = new WorkoutPlan({
      userId: req.user._id,
      name: `AI ${goal} Plan`,
      description: `Personalized ${planWeeks}-week ${goal} plan`,
      goal,
      durationWeeks: planWeeks,
      workoutsPerWeek: daysPerWeek,
      isActive: true,
      aiRecommendation: `Based on your profile and ${goal} goal, this plan optimizes your training.`
    });

    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error generating plan', error: error.message });
  }
});

// Workout Sessions
router.post('/sessions/start', async (req, res) => {
  try {
    const { workoutId } = req.body;
    const session = new WorkoutSession({
      workoutId,
      userId: req.user._id,
      startTime: new Date(),
      status: 'in_progress'
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error starting session', error: error.message });
  }
});

router.put('/sessions/:id/complete', async (req, res) => {
  try {
    const session = await WorkoutSession.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        endTime: new Date(),
        status: 'completed'
      },
      { new: true }
    );
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error completing session', error: error.message });
  }
});

router.get('/sessions/history', async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user._id })
      .sort({ startTime: -1 })
      .limit(50)
      .populate('workoutId');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

module.exports = router;

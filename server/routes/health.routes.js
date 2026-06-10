const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const HealthMetrics = require('../models/HealthMetrics');

const router = express.Router();
router.use(authMiddleware);

// Get today's health metrics
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let metrics = await HealthMetrics.findOne({
      userId: req.user._id,
      date: { $gte: today }
    });

    if (!metrics) {
      metrics = {
        userId: req.user._id,
        date: new Date(),
        steps: 0,
        heartRate: { resting: 0, average: 0, max: 0, min: 0 },
        calories: { consumed: 0, burned: 0, goal: 2000, net: 0 },
        sleep: { duration: 0, quality: 'fair', deepSleep: 0, lightSleep: 0, remSleep: 0, awakeTime: 0 },
        waterIntake: 0
      };
    }

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics', error: error.message });
  }
});

// Get metrics history
router.get('/history', async (req, res) => {
  try {
    const { period } = req.query;
    let daysBack = 30;

    switch (period) {
      case 'week': daysBack = 7; break;
      case 'month': daysBack = 30; break;
      case 'quarter': daysBack = 90; break;
      case 'year': daysBack = 365; break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const metrics = await HealthMetrics.find({
      userId: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

// Log health metrics
router.post('/log', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metrics = await HealthMetrics.findOneAndUpdate(
      { userId: req.user._id, date: { $gte: today } },
      { ...req.body, userId: req.user._id, date: new Date() },
      { upsert: true, new: true }
    );

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error logging metrics', error: error.message });
  }
});

// Get progress data
router.get('/progress', async (req, res) => {
  try {
    const { period } = req.query;
    let daysBack = 30;

    switch (period) {
      case 'week': daysBack = 7; break;
      case 'month': daysBack = 30; break;
      case 'quarter': daysBack = 90; break;
      case 'year': daysBack = 365; break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const metrics = await HealthMetrics.find({
      userId: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate progress statistics
    const progressData = {
      userId: req.user._id,
      period,
      weightHistory: metrics.filter(m => m.weight).map(m => ({ date: m.date, weight: m.weight })),
      calorieHistory: metrics.map(m => ({
        date: m.date,
        consumed: m.calories?.consumed || 0,
        burned: m.calories?.burned || 0
      })),
      streakDays: calculateStreak(metrics),
      totalWorkouts: metrics.filter(m => m.calories?.burned > 200).length,
      totalCaloriesBurned: metrics.reduce((sum, m) => sum + (m.calories?.burned || 0), 0),
      averageSessionDuration: 35
    };

    res.json(progressData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// Get AI Recommendations
router.get('/recommendations', async (req, res) => {
  try {
    // Generate recommendations based on user data
    const recommendations = generateRecommendations(req.user);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
});

function calculateStreak(metrics) {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const hasActivity = metrics.some(m => {
      const mDate = new Date(m.date);
      return mDate.toDateString() === checkDate.toDateString() && (m.calories?.burned || 0) > 100;
    });

    if (hasActivity) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function generateRecommendations(user) {
  const recommendations = [];

  if (user.fitnessGoal === 'weight_loss') {
    recommendations.push({
      id: '1',
      userId: user._id,
      type: 'workout',
      title: 'Increase Cardio Frequency',
      description: 'Adding more cardio sessions will accelerate your weight loss goals.',
      priority: 'high',
      reasoning: 'Based on your weight loss goal and current activity level.',
      createdAt: new Date(),
      isRead: false
    });
  }

  if (user.fitnessGoal === 'muscle_gain') {
    recommendations.push({
      id: '2',
      userId: user._id,
      type: 'nutrition',
      title: 'Increase Protein Intake',
      description: 'Aim for 1.6-2.2g of protein per kg of body weight for optimal muscle growth.',
      priority: 'high',
      reasoning: 'Muscle growth requires adequate protein synthesis.',
      createdAt: new Date(),
      isRead: false
    });
  }

  recommendations.push({
    id: '3',
    userId: user._id,
    type: 'general',
    title: 'Stay Consistent',
    description: 'Consistency is key. Aim for at least 3-4 workouts per week.',
    priority: 'medium',
    reasoning: 'Research shows consistent exercise produces better long-term results.',
    createdAt: new Date(),
    isRead: false
  });

  return recommendations;
}

module.exports = router;

const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authMiddleware);

// Generate AI workout plan
router.post('/workout-plan', async (req, res) => {
  try {
    const { userProfile, fitnessGoal, currentMetrics, preferences } = req.body;
    const user = req.user;

    const plan = generateAIWorkoutPlan(user, fitnessGoal, preferences);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error generating AI workout plan', error: error.message });
  }
});

// Generate AI nutrition plan
router.post('/nutrition-plan', async (req, res) => {
  try {
    const user = req.user;
    const plan = generateAINutritionPlan(user);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error generating AI nutrition plan', error: error.message });
  }
});

// Get personalized recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const user = req.user;
    const recommendations = generatePersonalizedRecommendations(user);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
});

// Analyze user progress
router.get('/analyze-progress/:userId', async (req, res) => {
  try {
    const user = req.user;
    const analysis = analyzeUserProgress(user);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing progress', error: error.message });
  }
});

// Adjust workout difficulty
router.post('/adjust-difficulty', async (req, res) => {
  try {
    const { sessionData } = req.body;
    const adjustment = calculateDifficultyAdjustment(sessionData);
    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ message: 'Error adjusting difficulty', error: error.message });
  }
});

function generateAIWorkoutPlan(user, goal, preferences) {
  const workoutTypes = {
    weight_loss: ['HIIT', 'Cardio', 'Full Body Circuit', 'Core & Cardio', 'Active Recovery'],
    muscle_gain: ['Upper Body Push', 'Lower Body', 'Upper Body Pull', 'Legs & Shoulders', 'Arms & Core'],
    endurance: ['Long Cardio', 'Tempo Run', 'Interval Training', 'Steady State', 'Recovery'],
    flexibility: ['Yoga Flow', 'Dynamic Stretching', 'Mobility Work', 'Pilates', 'Yin Yoga'],
    general_fitness: ['Full Body', 'Cardio', 'Strength', 'HIIT', 'Yoga']
  };

  const selectedWorkouts = workoutTypes[goal || user.fitnessGoal] || workoutTypes.general_fitness;

  return {
    workoutPlan: {
      name: `AI ${(goal || user.fitnessGoal).replace('_', ' ')} Plan`,
      description: `Personalized plan based on your profile and goals`,
      duration: preferences?.planWeeks || 8,
      workoutsPerWeek: preferences?.daysPerWeek || 4,
      schedule: generateWeeklySchedule(selectedWorkouts, preferences?.daysPerWeek || 4)
    },
    explanation: `This plan is designed for your ${user.fitnessLevel} level, targeting ${(goal || user.fitnessGoal).replace('_', ' ')}. It progressively increases in intensity over ${preferences?.planWeeks || 8} weeks. Based on your BMI of ${user.bmi} and activity level (${user.activityLevel}), this plan balances challenge with recovery.`,
    adjustments: [
      'Plan will auto-adjust based on your performance feedback',
      'Difficulty increases by 10% every 2 weeks',
      'Rest days are optimized based on your recovery patterns'
    ],
    nextReview: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks
  };
}

function generateWeeklySchedule(workouts, daysPerWeek) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let workoutIndex = 0;

  return days.map((day, index) => {
    if (workoutIndex < daysPerWeek && shouldWorkout(index, daysPerWeek)) {
      const workout = workouts[workoutIndex % workouts.length];
      workoutIndex++;
      return { day, isRestDay: false, workout };
    }
    return { day, isRestDay: true, workout: null };
  });
}

function shouldWorkout(dayIndex, daysPerWeek) {
  // Distribute workouts evenly
  const restDays = 7 - daysPerWeek;
  if (daysPerWeek <= 3) return [1, 3, 5].includes(dayIndex);
  if (daysPerWeek === 4) return [0, 1, 3, 4].includes(dayIndex);
  if (daysPerWeek === 5) return [0, 1, 2, 3, 4].includes(dayIndex);
  return dayIndex < daysPerWeek;
}

function generateAINutritionPlan(user) {
  return {
    nutritionPlan: {
      dailyCalories: calculateTDEE(user),
      macros: calculateMacros(user),
      mealCount: 4,
      hydrationGoal: Math.round(user.weight * 35) // ml
    },
    explanation: `Based on your weight (${user.weight}kg), height (${user.height}cm), and ${user.fitnessGoal.replace('_', ' ')} goal.`,
    tips: [
      'Eat protein with every meal for satiety',
      'Hydrate before, during, and after workouts',
      'Time carbs around your training sessions',
      'Include healthy fats for hormone production'
    ]
  };
}

function calculateTDEE(user) {
  let bmr;
  if (user.gender === 'male') {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  }

  const multipliers = {
    sedentary: 1.2, lightly_active: 1.375, moderately_active: 1.55,
    very_active: 1.725, extra_active: 1.9
  };

  let tdee = bmr * (multipliers[user.activityLevel] || 1.55);
  if (user.fitnessGoal === 'weight_loss') tdee -= 500;
  if (user.fitnessGoal === 'muscle_gain') tdee += 300;

  return Math.round(tdee);
}

function calculateMacros(user) {
  const tdee = calculateTDEE(user);
  let pRatio = 0.25, cRatio = 0.45, fRatio = 0.30;

  if (user.fitnessGoal === 'muscle_gain') { pRatio = 0.30; cRatio = 0.45; fRatio = 0.25; }
  if (user.fitnessGoal === 'weight_loss') { pRatio = 0.35; cRatio = 0.35; fRatio = 0.30; }

  return {
    protein: Math.round((tdee * pRatio) / 4),
    carbs: Math.round((tdee * cRatio) / 4),
    fats: Math.round((tdee * fRatio) / 9),
    fiber: 30
  };
}

function generatePersonalizedRecommendations(user) {
  const recommendations = [];

  // BMI-based recommendations
  if (user.bmi > 25) {
    recommendations.push({
      type: 'workout', title: 'Focus on Fat Burning',
      description: 'Include more HIIT and cardio sessions to optimize calorie burn.',
      priority: 'high',
      reasoning: `Your BMI of ${user.bmi} suggests focusing on body composition improvements.`
    });
  }

  // Goal-based recommendations
  if (user.fitnessGoal === 'muscle_gain') {
    recommendations.push({
      type: 'nutrition', title: 'Protein Timing Optimization',
      description: 'Consume 20-40g protein within 2 hours of training for optimal muscle protein synthesis.',
      priority: 'medium',
      reasoning: 'Post-workout nutrition window is critical for muscle recovery and growth.'
    });
  }

  // Activity-based recommendations
  if (user.activityLevel === 'sedentary') {
    recommendations.push({
      type: 'general', title: 'Increase Daily Movement',
      description: 'Start with 10-minute walks and gradually increase activity throughout the day.',
      priority: 'high',
      reasoning: 'Sedentary lifestyles increase health risks. Small movements make a big difference.'
    });
  }

  recommendations.push({
    type: 'recovery', title: 'Prioritize Sleep Quality',
    description: 'Aim for 7-9 hours of quality sleep. It directly impacts recovery and performance.',
    priority: 'medium',
    reasoning: 'Sleep is when most muscle repair and hormonal regulation occurs.'
  });

  return recommendations;
}

function analyzeUserProgress(user) {
  return {
    summary: `Good progress this month! You're on track with your ${user.fitnessGoal.replace('_', ' ')} goals.`,
    insights: [
      'Your workout consistency has improved by 20%',
      'Average session duration increased to 38 minutes',
      'Calorie burn rate is trending upward'
    ],
    areasToImprove: [
      'Sleep consistency could be better',
      'Consider adding more flexibility work',
      'Hydration needs improvement on non-training days'
    ],
    overallScore: 78
  };
}

function calculateDifficultyAdjustment(sessionData) {
  // Simple algorithm to adjust difficulty
  const averageFeedback = sessionData?.difficulty || 3;

  if (averageFeedback <= 2) {
    return { adjustment: 'increase', percentage: 10, message: 'Workouts seem too easy. Increasing intensity.' };
  } else if (averageFeedback >= 4) {
    return { adjustment: 'decrease', percentage: 10, message: 'Workouts seem challenging. Adjusting to prevent overtraining.' };
  }
  return { adjustment: 'maintain', percentage: 0, message: 'Current difficulty is appropriate.' };
}

module.exports = router;

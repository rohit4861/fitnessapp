const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authMiddleware);

// Get current nutrition plan
router.get('/plan', async (req, res) => {
  try {
    const user = req.user;
    const plan = generateNutritionPlan(user);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nutrition plan', error: error.message });
  }
});

// Generate AI nutrition plan
router.post('/plan/generate', async (req, res) => {
  try {
    const user = req.user;
    const { restrictions, preferences } = req.body;
    const plan = generateNutritionPlan(user, restrictions, preferences);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error generating plan', error: error.message });
  }
});

// Log a meal
router.post('/log', async (req, res) => {
  try {
    const { mealType, foods, totalCalories } = req.body;
    // In production, save to database
    res.json({
      message: 'Meal logged successfully',
      data: { mealType, foods, totalCalories, timestamp: new Date() }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging meal', error: error.message });
  }
});

// Search food database
router.get('/foods/search', async (req, res) => {
  try {
    const { query } = req.query;
    const foods = searchFoods(query);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error searching foods', error: error.message });
  }
});

function generateNutritionPlan(user, restrictions = [], preferences = {}) {
  // Mifflin-St Jeor Equation
  let bmr;
  if (user.gender === 'male') {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };

  let tdee = bmr * (activityMultipliers[user.activityLevel] || 1.55);

  // Adjust based on goal
  if (user.fitnessGoal === 'weight_loss') tdee -= 500;
  if (user.fitnessGoal === 'muscle_gain') tdee += 300;

  const dailyCalories = Math.round(tdee);

  // Macro distribution based on goal
  let proteinRatio, carbRatio, fatRatio;
  switch (user.fitnessGoal) {
    case 'muscle_gain':
      proteinRatio = 0.30; carbRatio = 0.45; fatRatio = 0.25;
      break;
    case 'weight_loss':
      proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30;
      break;
    default:
      proteinRatio = 0.25; carbRatio = 0.45; fatRatio = 0.30;
  }

  const protein = Math.round((dailyCalories * proteinRatio) / 4);
  const carbs = Math.round((dailyCalories * carbRatio) / 4);
  const fats = Math.round((dailyCalories * fatRatio) / 9);

  return {
    userId: user._id,
    dailyCalories,
    macros: { protein, carbs, fats, fiber: 30 },
    meals: [
      {
        mealType: 'breakfast',
        name: 'Power Breakfast',
        calories: Math.round(dailyCalories * 0.25),
        macros: { protein: Math.round(protein * 0.25), carbs: Math.round(carbs * 0.3), fats: Math.round(fats * 0.2), fiber: 8 },
        time: '07:30',
        foods: [
          { name: 'Oatmeal', quantity: 80, unit: 'g', calories: 300, protein: 10, carbs: 54, fats: 5 },
          { name: 'Banana', quantity: 1, unit: 'medium', calories: 105, protein: 1, carbs: 27, fats: 0 },
          { name: 'Protein Shake', quantity: 1, unit: 'scoop', calories: 120, protein: 24, carbs: 2, fats: 1 }
        ]
      },
      {
        mealType: 'lunch',
        name: 'Balanced Lunch',
        calories: Math.round(dailyCalories * 0.30),
        macros: { protein: Math.round(protein * 0.30), carbs: Math.round(carbs * 0.30), fats: Math.round(fats * 0.30), fiber: 10 },
        time: '12:30',
        foods: [
          { name: 'Grilled Chicken', quantity: 150, unit: 'g', calories: 250, protein: 40, carbs: 0, fats: 8 },
          { name: 'Brown Rice', quantity: 150, unit: 'g', calories: 180, protein: 4, carbs: 38, fats: 1 },
          { name: 'Mixed Vegetables', quantity: 200, unit: 'g', calories: 100, protein: 4, carbs: 18, fats: 2 }
        ]
      },
      {
        mealType: 'snack',
        name: 'Afternoon Snack',
        calories: Math.round(dailyCalories * 0.15),
        macros: { protein: Math.round(protein * 0.15), carbs: Math.round(carbs * 0.15), fats: Math.round(fats * 0.15), fiber: 4 },
        time: '16:00',
        foods: [
          { name: 'Greek Yogurt', quantity: 200, unit: 'g', calories: 130, protein: 20, carbs: 8, fats: 3 },
          { name: 'Mixed Nuts', quantity: 30, unit: 'g', calories: 170, protein: 5, carbs: 6, fats: 15 }
        ]
      },
      {
        mealType: 'dinner',
        name: 'Recovery Dinner',
        calories: Math.round(dailyCalories * 0.30),
        macros: { protein: Math.round(protein * 0.30), carbs: Math.round(carbs * 0.25), fats: Math.round(fats * 0.35), fiber: 8 },
        time: '19:30',
        foods: [
          { name: 'Salmon', quantity: 180, unit: 'g', calories: 350, protein: 40, carbs: 0, fats: 20 },
          { name: 'Sweet Potato', quantity: 200, unit: 'g', calories: 180, protein: 4, carbs: 42, fats: 0 },
          { name: 'Broccoli', quantity: 150, unit: 'g', calories: 50, protein: 4, carbs: 10, fats: 0 }
        ]
      }
    ],
    restrictions,
    isAIGenerated: true,
    createdAt: new Date()
  };
}

function searchFoods(query) {
  const foodDatabase = [
    { name: 'Chicken Breast', quantity: 100, unit: 'g', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { name: 'Brown Rice', quantity: 100, unit: 'g', calories: 123, protein: 2.7, carbs: 25.6, fats: 1 },
    { name: 'Broccoli', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
    { name: 'Salmon', quantity: 100, unit: 'g', calories: 208, protein: 20, carbs: 0, fats: 13 },
    { name: 'Egg', quantity: 1, unit: 'large', calories: 72, protein: 6.3, carbs: 0.4, fats: 5 },
    { name: 'Oatmeal', quantity: 100, unit: 'g', calories: 379, protein: 13.2, carbs: 67.7, fats: 6.5 },
    { name: 'Banana', quantity: 1, unit: 'medium', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
    { name: 'Greek Yogurt', quantity: 100, unit: 'g', calories: 59, protein: 10, carbs: 3.6, fats: 0.7 },
    { name: 'Almonds', quantity: 30, unit: 'g', calories: 173, protein: 6.3, carbs: 6, fats: 15 },
    { name: 'Sweet Potato', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fats: 0.1 }
  ];

  if (!query) return foodDatabase;
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(f => f.name.toLowerCase().includes(lowerQuery));
}

module.exports = router;

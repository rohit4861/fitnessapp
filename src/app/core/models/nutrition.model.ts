export interface NutritionPlan {
  id: string;
  userId: string;
  dailyCalories: number;
  macros: MacroNutrients;
  meals: MealPlan[];
  restrictions: string[];
  isAIGenerated: boolean;
  createdAt: Date;
}

export interface MacroNutrients {
  protein: number; // in grams
  carbs: number;
  fats: number;
  fiber: number;
}

export interface MealPlan {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  macros: MacroNutrients;
  foods: FoodItem[];
  time?: string;
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyNutritionLog {
  id: string;
  userId: string;
  date: Date;
  meals: MealLog[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  waterIntake: number; // in ml
}

export interface MealLog {
  mealType: string;
  foods: FoodItem[];
  totalCalories: number;
  time: Date;
}

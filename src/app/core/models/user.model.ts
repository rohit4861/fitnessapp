export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoal: FitnessGoal;
  healthConditions: string[];
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness';

export interface UserProfile {
  user: User;
  dailyCalorieGoal: number;
  dailyWaterGoal: number; // in ml
  weeklyWorkoutGoal: number;
  targetWeight?: number;
}

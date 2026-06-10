export interface HealthMetrics {
  id: string;
  userId: string;
  date: Date;
  steps: number;
  heartRate: HeartRateData;
  calories: CalorieData;
  sleep: SleepData;
  weight?: number;
  bloodPressure?: BloodPressure;
  waterIntake: number;
}

export interface HeartRateData {
  resting: number;
  average: number;
  max: number;
  min: number;
}

export interface CalorieData {
  consumed: number;
  burned: number;
  goal: number;
  net: number;
}

export interface SleepData {
  duration: number; // in hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awakeTime: number;
  bedTime?: string;
  wakeTime?: string;
}

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface ProgressData {
  userId: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  weightHistory: { date: Date; weight: number }[];
  workoutFrequency: { date: Date; count: number }[];
  calorieHistory: { date: Date; consumed: number; burned: number }[];
  strengthProgress: { exercise: string; date: Date; maxWeight: number }[];
  bmiHistory: { date: Date; bmi: number }[];
  streakDays: number;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageSessionDuration: number;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'general';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  reasoning: string;
  createdAt: Date;
  isRead: boolean;
}

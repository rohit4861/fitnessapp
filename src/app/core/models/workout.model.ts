export interface Workout {
  id: string;
  name: string;
  description: string;
  type: WorkoutType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  caloriesBurned: number;
  exercises: Exercise[];
  imageUrl?: string;
  isAIGenerated: boolean;
  createdAt: Date;
}

export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'yoga' | 'custom';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  duration?: number; // in seconds for timed exercises
  restTime: number; // in seconds
  imageUrl?: string;
  videoUrl?: string;
  instructions: string[];
  calories: number;
}

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'core' | 'full_body' | 'cardio';

export interface WorkoutSession {
  id: string;
  workoutId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  caloriesBurned: number;
  exercisesCompleted: ExerciseLog[];
  heartRateAvg?: number;
  heartRateMax?: number;
  feedback?: WorkoutFeedback;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  setsCompleted: number;
  repsCompleted: number[];
  weight?: number;
  duration?: number;
  formScore?: number; // 0-100 from posture detection
}

export interface WorkoutFeedback {
  difficulty: 1 | 2 | 3 | 4 | 5;
  enjoyment: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  goal: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  schedule: WeeklySchedule[];
  isActive: boolean;
  createdAt: Date;
  aiRecommendation?: string;
}

export interface WeeklySchedule {
  week: number;
  days: DaySchedule[];
}

export interface DaySchedule {
  day: string;
  workout?: Workout;
  isRestDay: boolean;
}

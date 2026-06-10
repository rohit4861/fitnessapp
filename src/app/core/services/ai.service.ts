import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User, UserProfile } from '../models/user.model';
import { WorkoutPlan } from '../models/workout.model';
import { NutritionPlan } from '../models/nutrition.model';
import { AIRecommendation } from '../models/health.model';

export interface AIAnalysisRequest {
  userId: string;
  userProfile: Partial<User>;
  fitnessGoal: string;
  currentMetrics: any;
  workoutHistory: any[];
  preferences: any;
}

export interface AIWorkoutResponse {
  workoutPlan: WorkoutPlan;
  explanation: string;
  adjustments: string[];
  nextReview: Date;
}

export interface AINutritionResponse {
  nutritionPlan: NutritionPlan;
  explanation: string;
  tips: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  generateWorkoutPlan(request: AIAnalysisRequest): Observable<AIWorkoutResponse> {
    return this.http.post<AIWorkoutResponse>(`${this.apiUrl}/workout-plan`, request);
  }

  generateNutritionPlan(request: AIAnalysisRequest): Observable<AINutritionResponse> {
    return this.http.post<AINutritionResponse>(`${this.apiUrl}/nutrition-plan`, request);
  }

  getPersonalizedRecommendations(userId: string): Observable<AIRecommendation[]> {
    return this.http.get<AIRecommendation[]>(`${this.apiUrl}/recommendations/${userId}`);
  }

  analyzeProgress(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/analyze-progress/${userId}`);
  }

  adjustWorkoutDifficulty(sessionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/adjust-difficulty`, sessionData);
  }

  // BMI Calculator
  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  // Calorie Calculator (Mifflin-St Jeor Equation)
  calculateDailyCalories(weight: number, height: number, age: number, gender: string, activityLevel: string): number {
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers: Record<string, number> = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'extra_active': 1.9
    };

    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  }

  // Heart Rate Zones
  calculateHeartRateZones(age: number): { zone: string; min: number; max: number; description: string }[] {
    const maxHR = 220 - age;
    return [
      { zone: 'Zone 1 - Recovery', min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6), description: 'Very light activity, warm-up' },
      { zone: 'Zone 2 - Fat Burn', min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7), description: 'Light activity, fat burning' },
      { zone: 'Zone 3 - Cardio', min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8), description: 'Moderate activity, aerobic' },
      { zone: 'Zone 4 - Threshold', min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9), description: 'Hard activity, anaerobic' },
      { zone: 'Zone 5 - Maximum', min: Math.round(maxHR * 0.9), max: maxHR, description: 'Maximum effort, peak performance' }
    ];
  }

  // Generate workout recommendation based on user data
  getLocalRecommendation(user: User, recentWorkouts: any[]): string {
    const recommendations: string[] = [];

    if (user.fitnessGoal === 'weight_loss') {
      recommendations.push('Focus on HIIT and cardio workouts to maximize calorie burn.');
      recommendations.push('Aim for a caloric deficit of 500 calories per day.');
    } else if (user.fitnessGoal === 'muscle_gain') {
      recommendations.push('Prioritize strength training with progressive overload.');
      recommendations.push('Ensure adequate protein intake (1.6-2.2g per kg body weight).');
    } else if (user.fitnessGoal === 'endurance') {
      recommendations.push('Gradually increase cardio duration and intensity.');
      recommendations.push('Include long steady-state and interval training sessions.');
    }

    if (recentWorkouts.length === 0) {
      recommendations.push('Start with 3 workouts per week and gradually increase.');
    } else if (recentWorkouts.length >= 6) {
      recommendations.push('Great consistency! Consider adding a deload week soon.');
    }

    return recommendations.join(' ');
  }
}

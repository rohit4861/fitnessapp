import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HealthMetrics, ProgressData, AIRecommendation } from '../models/health.model';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private apiUrl = `${environment.apiUrl}/health`;

  constructor(private http: HttpClient) {}

  getTodayMetrics(): Observable<HealthMetrics> {
    return this.http.get<HealthMetrics>(`${this.apiUrl}/today`);
  }

  getMetricsHistory(period: string): Observable<HealthMetrics[]> {
    return this.http.get<HealthMetrics[]>(`${this.apiUrl}/history`, { params: { period } });
  }

  logMetrics(data: Partial<HealthMetrics>): Observable<HealthMetrics> {
    return this.http.post<HealthMetrics>(`${this.apiUrl}/log`, data);
  }

  getProgressData(period: string): Observable<ProgressData> {
    return this.http.get<ProgressData>(`${this.apiUrl}/progress`, { params: { period } });
  }

  getAIRecommendations(): Observable<AIRecommendation[]> {
    return this.http.get<AIRecommendation[]>(`${this.apiUrl}/recommendations`);
  }

  markRecommendationRead(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/recommendations/${id}/read`, {});
  }

  // Mock data for development
  getMockTodayMetrics(): HealthMetrics {
    return {
      id: '1',
      userId: 'user1',
      date: new Date(),
      steps: 8432,
      heartRate: {
        resting: 62,
        average: 78,
        max: 145,
        min: 55
      },
      calories: {
        consumed: 1850,
        burned: 2200,
        goal: 2000,
        net: -350
      },
      sleep: {
        duration: 7.5,
        quality: 'good',
        deepSleep: 1.8,
        lightSleep: 3.5,
        remSleep: 1.7,
        awakeTime: 0.5,
        bedTime: '23:00',
        wakeTime: '06:30'
      },
      weight: 75.2,
      waterIntake: 2100
    };
  }

  getMockProgressData(): ProgressData {
    const today = new Date();
    return {
      userId: 'user1',
      period: 'month',
      weightHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(today.getTime() - (29 - i) * 86400000),
        weight: 76 - (i * 0.03) + (Math.random() * 0.3 - 0.15)
      })),
      workoutFrequency: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(today.getTime() - (29 - i) * 86400000),
        count: Math.random() > 0.3 ? 1 : 0
      })),
      calorieHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(today.getTime() - (29 - i) * 86400000),
        consumed: 1800 + Math.floor(Math.random() * 400),
        burned: 2000 + Math.floor(Math.random() * 500)
      })),
      strengthProgress: [
        { exercise: 'Bench Press', date: new Date(), maxWeight: 80 },
        { exercise: 'Squat', date: new Date(), maxWeight: 100 },
        { exercise: 'Deadlift', date: new Date(), maxWeight: 120 }
      ],
      bmiHistory: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(today.getTime() - (11 - i) * 30 * 86400000),
        bmi: 24.5 - (i * 0.1)
      })),
      streakDays: 12,
      totalWorkouts: 45,
      totalCaloriesBurned: 32500,
      averageSessionDuration: 38
    };
  }

  getMockRecommendations(): AIRecommendation[] {
    return [
      {
        id: '1',
        userId: 'user1',
        type: 'workout',
        title: 'Increase Cardio Frequency',
        description: 'Based on your heart rate data and fitness goals, adding one more cardio session per week would improve your endurance significantly.',
        priority: 'high',
        reasoning: 'Your resting heart rate has been stable. Adding cardio can lower it by 5-10 bpm over the next month.',
        createdAt: new Date(),
        isRead: false
      },
      {
        id: '2',
        userId: 'user1',
        type: 'nutrition',
        title: 'Increase Protein Intake',
        description: 'Your protein intake is below the recommended amount for muscle recovery. Aim for 1.6g per kg of body weight.',
        priority: 'medium',
        reasoning: 'You are doing strength training 3x/week. Current protein intake of 90g should be increased to 120g for optimal muscle growth.',
        createdAt: new Date(),
        isRead: false
      },
      {
        id: '3',
        userId: 'user1',
        type: 'recovery',
        title: 'Rest Day Recommended',
        description: 'You have worked out 5 days consecutively. Taking a rest day will help muscle recovery and prevent overtraining.',
        priority: 'high',
        reasoning: 'Continuous training without rest increases injury risk by 40%. Your performance metrics show slight decline.',
        createdAt: new Date(),
        isRead: true
      },
      {
        id: '4',
        userId: 'user1',
        type: 'general',
        title: 'Sleep Quality Improvement',
        description: 'Your sleep duration has decreased this week. Try maintaining a consistent bedtime schedule for better recovery.',
        priority: 'low',
        reasoning: 'Sleep quality directly impacts muscle recovery and cognitive performance. Your avg has dropped from 7.5 to 6.8 hours.',
        createdAt: new Date(),
        isRead: false
      }
    ];
  }
}

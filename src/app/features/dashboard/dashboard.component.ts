import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { HealthService } from '../../core/services/health.service';
import { WorkoutService } from '../../core/services/workout.service';
import { AIService } from '../../core/services/ai.service';
import { User } from '../../core/models/user.model';
import { HealthMetrics, AIRecommendation } from '../../core/models/health.model';
import { Workout } from '../../core/models/workout.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    NgChartsModule
  ],
  template: `
    <div class="dashboard fade-in">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>Welcome back, {{user?.firstName || 'Champ'}}! 👋</h1>
          <p>Here's your fitness overview for today. You're making great progress!</p>
          <div class="streak-badge">
            <mat-icon>local_fire_department</mat-icon>
            <span>7-Day Streak! Keep it up!</span>
          </div>
        </div>
        <div class="quick-actions">
          <button mat-raised-button color="primary" routerLink="/workout" matTooltip="Browse and start a workout">
            <mat-icon>play_arrow</mat-icon> Start Workout
          </button>
          <button mat-raised-button color="accent" routerLink="/posture" matTooltip="Analyze your exercise form with AI">
            <mat-icon>videocam</mat-icon> Posture Check
          </button>
          <button mat-stroked-button routerLink="/nutrition" matTooltip="Plan your meals for today">
            <mat-icon>restaurant</mat-icon> Log Meal
          </button>
        </div>
      </div>

      <!-- Quick Tips -->
      <div class="quick-tips">
        <div class="tip-item">
          <mat-icon>lightbulb</mat-icon>
          <span><strong>Tip:</strong> Start with the recommended workout below, or browse all workouts for more options.</span>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon steps">
            <mat-icon>directions_walk</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{metrics.steps | number}}</span>
            <span class="stat-label">Steps Today</span>
            <mat-progress-bar mode="determinate" [value]="(metrics.steps / 10000) * 100" color="primary"></mat-progress-bar>
            <span class="stat-goal">Goal: 10,000</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon calories">
            <mat-icon>local_fire_department</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{metrics.calories.burned}}</span>
            <span class="stat-label">Calories Burned</span>
            <mat-progress-bar mode="determinate" [value]="(metrics.calories.burned / metrics.calories.goal) * 100" color="warn"></mat-progress-bar>
            <span class="stat-goal">Goal: {{metrics.calories.goal}}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon heart">
            <mat-icon>favorite</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{metrics.heartRate.resting}}</span>
            <span class="stat-label">Resting Heart Rate</span>
            <mat-progress-bar mode="determinate" [value]="75" color="accent"></mat-progress-bar>
            <span class="stat-goal">Avg: {{metrics.heartRate.average}} bpm</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon sleep">
            <mat-icon>bedtime</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{metrics.sleep.duration}}h</span>
            <span class="stat-label">Sleep Duration</span>
            <mat-progress-bar mode="determinate" [value]="(metrics.sleep.duration / 8) * 100" color="primary"></mat-progress-bar>
            <span class="stat-goal">Quality: {{metrics.sleep.quality}}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Weekly Activity Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Weekly Activity</mat-card-title>
            <mat-card-subtitle>Calories burned this week</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [datasets]="weeklyChartData.datasets"
              [labels]="weeklyChartData.labels"
              [options]="weeklyChartOptions"
              [type]="'bar'">
            </canvas>
          </mat-card-content>
        </mat-card>

        <!-- Today's Workout -->
        <mat-card class="workout-card">
          <mat-card-header>
            <mat-card-title>Today's Recommended Workout</mat-card-title>
            <mat-card-subtitle>AI-Generated based on your goals</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="workout-preview" *ngIf="todayWorkout">
              <div class="workout-info">
                <h3>{{todayWorkout.name}}</h3>
                <p>{{todayWorkout.description}}</p>
                <div class="workout-meta">
                  <mat-chip-set>
                    <mat-chip>
                      <mat-icon matChipAvatar>timer</mat-icon>
                      {{todayWorkout.duration}} min
                    </mat-chip>
                    <mat-chip>
                      <mat-icon matChipAvatar>local_fire_department</mat-icon>
                      {{todayWorkout.caloriesBurned}} cal
                    </mat-chip>
                    <mat-chip>
                      <mat-icon matChipAvatar>signal_cellular_alt</mat-icon>
                      {{todayWorkout.difficulty}}
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </div>
              <div class="workout-exercises">
                <h4>Exercises ({{todayWorkout.exercises.length}})</h4>
                <div class="exercise-list">
                  <div class="exercise-item" *ngFor="let ex of todayWorkout.exercises.slice(0, 4)">
                    <mat-icon>fitness_center</mat-icon>
                    <span>{{ex.name}}</span>
                    <span class="exercise-detail">{{ex.sets}}x{{ex.reps}}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/workout">
              <mat-icon>play_arrow</mat-icon> Start Workout
            </button>
            <button mat-button routerLink="/workout">View All Workouts</button>
          </mat-card-actions>
        </mat-card>

        <!-- AI Recommendations -->
        <mat-card class="recommendations-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>psychology</mat-icon> AI Recommendations
            </mat-card-title>
            <mat-card-subtitle>Personalized insights from your AI coach</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="recommendation-list">
              <div class="recommendation-item" *ngFor="let rec of recommendations"
                   [class.unread]="!rec.isRead"
                   [ngClass]="'priority-' + rec.priority">
                <div class="rec-icon">
                  <mat-icon>{{getRecommendationIcon(rec.type)}}</mat-icon>
                </div>
                <div class="rec-content">
                  <h4>{{rec.title}}</h4>
                  <p>{{rec.description}}</p>
                  <span class="rec-priority">{{rec.priority}} priority</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Body Metrics -->
        <mat-card class="metrics-card">
          <mat-card-header>
            <mat-card-title>Body Metrics</mat-card-title>
            <mat-card-subtitle>Your current health snapshot</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-label">Weight</span>
                <span class="metric-value">{{metrics.weight}} kg</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">BMI</span>
                <span class="metric-value">{{user?.bmi}}</span>
                <span class="metric-category">{{bmiCategory}}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Water Intake</span>
                <span class="metric-value">{{metrics.waterIntake}}ml</span>
                <mat-progress-bar mode="determinate" [value]="(metrics.waterIntake / 3000) * 100"></mat-progress-bar>
              </div>
              <div class="metric-item">
                <span class="metric-label">Streak</span>
                <span class="metric-value streak">🔥 12 days</span>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/progress">View Full Progress</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 24px;
      background: linear-gradient(135deg, #4361ee 0%, #7209b7 100%);
      border-radius: 16px;
      color: white;

      h1 {
        font-size: 1.8rem;
        font-weight: 700;
        color: white;
      }

      p {
        color: rgba(255, 255, 255, 0.85);
        margin-top: 4px;
      }

      .streak-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #ffd166;
        }
      }

      .quick-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
    }

    .quick-tips {
      margin-bottom: 24px;

      .tip-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: #fffbeb;
        border: 1px solid #fde68a;
        border-radius: 10px;
        font-size: 0.9rem;
        color: #92400e;

        mat-icon {
          color: #f59e0b;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      gap: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: white;
          font-size: 28px;
          width: 28px;
          height: 28px;
        }

        &.steps { background: linear-gradient(135deg, #4361ee, #3a86ff); }
        &.calories { background: linear-gradient(135deg, #f72585, #ff6b6b); }
        &.heart { background: linear-gradient(135deg, #ef476f, #ff8ba7); }
        &.sleep { background: linear-gradient(135deg, #7209b7, #a855f7); }
      }

      .stat-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 8px;
        }

        .stat-goal {
          font-size: 0.75rem;
          color: #999;
          margin-top: 4px;
        }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .chart-card, .workout-card, .recommendations-card, .metrics-card {
      border-radius: 16px !important;
      padding: 8px;
    }

    .workout-preview {
      .workout-info {
        h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
        }

        p {
          color: #666;
          margin-bottom: 12px;
        }
      }

      .workout-exercises {
        margin-top: 16px;

        h4 {
          font-size: 0.9rem;
          color: #444;
          margin-bottom: 8px;
        }

        .exercise-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #4361ee;
          }

          span {
            flex: 1;
            font-size: 0.9rem;
          }

          .exercise-detail {
            color: #666;
            font-weight: 500;
            flex: none;
          }
        }
      }
    }

    .recommendation-list {
      .recommendation-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: background 0.2s;

        &:hover {
          background: #f8f9fa;
        }

        &.unread {
          background: #f0f4ff;
        }

        &.priority-high .rec-icon { color: #ef476f; }
        &.priority-medium .rec-icon { color: #ffa726; }
        &.priority-low .rec-icon { color: #66bb6a; }

        .rec-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rec-content {
          flex: 1;

          h4 {
            font-size: 0.95rem;
            margin-bottom: 4px;
          }

          p {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 4px;
          }

          .rec-priority {
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: 500;
            color: #999;
          }
        }
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      .metric-item {
        padding: 16px;
        background: #f8f9fa;
        border-radius: 12px;
        display: flex;
        flex-direction: column;

        .metric-label {
          font-size: 0.8rem;
          color: #666;
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 4px 0;

          &.streak {
            color: #f72585;
          }
        }

        .metric-category {
          font-size: 0.8rem;
          color: #66bb6a;
          font-weight: 500;
        }
      }
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .welcome-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  metrics!: HealthMetrics;
  todayWorkout: Workout | null = null;
  recommendations: AIRecommendation[] = [];
  bmiCategory = '';

  weeklyChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [320, 450, 280, 510, 390, 600, 200],
        label: 'Calories Burned',
        backgroundColor: 'rgba(67, 97, 238, 0.7)',
        borderRadius: 8
      },
      {
        data: [2100, 1900, 2200, 2000, 2300, 1800, 2100],
        label: 'Calories Consumed',
        backgroundColor: 'rgba(247, 37, 133, 0.4)',
        borderRadius: 8
      }
    ]
  };

  weeklyChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(
    private authService: AuthService,
    private healthService: HealthService,
    private workoutService: WorkoutService,
    private aiService: AIService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user();
    this.metrics = this.healthService.getMockTodayMetrics();
    this.recommendations = this.healthService.getMockRecommendations();

    const workouts = this.workoutService.getMockWorkouts();
    this.todayWorkout = workouts[0];

    if (this.user) {
      this.bmiCategory = this.aiService.getBMICategory(this.user.bmi);
    }
  }

  getRecommendationIcon(type: string): string {
    const icons: Record<string, string> = {
      'workout': 'fitness_center',
      'nutrition': 'restaurant',
      'recovery': 'self_improvement',
      'general': 'lightbulb'
    };
    return icons[type] || 'info';
  }
}

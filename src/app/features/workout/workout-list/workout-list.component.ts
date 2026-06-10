import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkoutService } from '../../../core/services/workout.service';
import { Workout, WorkoutType } from '../../../core/models/workout.model';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <div class="workout-page fade-in">
      <div class="page-header">
        <div>
          <h1>Workouts 💪</h1>
          <p>AI-generated workouts tailored to your fitness goals. Pick one and start!</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/workout/plan">
            <mat-icon>auto_awesome</mat-icon> Generate AI Plan
          </button>
        </div>
      </div>

      <!-- Helpful guide for new users -->
      <div class="user-guide">
        <mat-icon>info</mat-icon>
        <span>Choose a workout type below, then hit <strong>"Start"</strong> to begin. Each exercise includes a video demo!</span>
      </div>

      <!-- Workout Type Tabs -->
      <mat-tab-group (selectedTabChange)="onTabChange($event)" animationDuration="300ms">
        <mat-tab label="All Workouts">
          <div class="workout-grid">
            <div class="workout-card" *ngFor="let workout of filteredWorkouts">
              <div class="workout-image" [style.background]="getWorkoutGradient(workout.type)">
                <mat-icon class="workout-type-icon">{{getTypeIcon(workout.type)}}</mat-icon>
                <span class="ai-badge" *ngIf="workout.isAIGenerated">
                  <mat-icon>auto_awesome</mat-icon> AI
                </span>
              </div>
              <div class="workout-content">
                <h3>{{workout.name}}</h3>
                <p>{{workout.description}}</p>
                <div class="workout-stats">
                  <div class="stat">
                    <mat-icon>timer</mat-icon>
                    <span>{{workout.duration}} min</span>
                  </div>
                  <div class="stat">
                    <mat-icon>local_fire_department</mat-icon>
                    <span>{{workout.caloriesBurned}} cal</span>
                  </div>
                  <div class="stat">
                    <mat-icon>fitness_center</mat-icon>
                    <span>{{workout.exercises.length}} exercises</span>
                  </div>
                </div>
                <div class="workout-footer">
                  <mat-chip-set>
                    <mat-chip [class]="'difficulty-' + workout.difficulty">
                      {{workout.difficulty}}
                    </mat-chip>
                    <mat-chip>{{workout.type}}</mat-chip>
                  </mat-chip-set>
                  <div class="footer-actions">
                    <button mat-icon-button class="video-hint" matTooltip="Watch exercise video demos"
                            (click)="openVideoDemo(workout); $event.stopPropagation()">
                      <mat-icon>ondemand_video</mat-icon>
                    </button>
                    <button mat-raised-button color="primary" [routerLink]="['/workout/session', workout.id]">
                      <mat-icon>play_arrow</mat-icon> Start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Strength"></mat-tab>
        <mat-tab label="Cardio"></mat-tab>
        <mat-tab label="HIIT"></mat-tab>
        <mat-tab label="Yoga"></mat-tab>
        <mat-tab label="Flexibility"></mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .workout-page {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h1 {
        font-size: 1.8rem;
        font-weight: 700;
      }

      p {
        color: #666;
      }
    }

    .workout-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
      padding: 24px 0;
    }

    .user-guide {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: #f0f4ff;
      border: 1px solid #c7d2fe;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #3730a3;
      margin-bottom: 8px;

      mat-icon {
        color: #4361ee;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .workout-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }

      .workout-image {
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .workout-type-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: white;
          opacity: 0.9;
        }

        .ai-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.9);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #7209b7;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .workout-content {
        padding: 20px;

        h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        p {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .workout-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;

          .stat {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.85rem;
            color: #555;

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
              color: #4361ee;
            }
          }
        }

        .workout-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .difficulty-beginner { background-color: #e8f5e9 !important; color: #2e7d32 !important; }
          .difficulty-intermediate { background-color: #fff3e0 !important; color: #e65100 !important; }
          .difficulty-advanced { background-color: #fce4ec !important; color: #c62828 !important; }

          .footer-actions {
            display: flex;
            align-items: center;
            gap: 8px;

            .video-hint {
              color: #ff0000;

              mat-icon {
                font-size: 22px;
                width: 22px;
                height: 22px;
              }
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .workout-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WorkoutListComponent implements OnInit {
  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];
  activeFilter: string = 'all';

  private typeFilters: Record<number, string> = {
    0: 'all', 1: 'strength', 2: 'cardio', 3: 'hiit', 4: 'yoga', 5: 'flexibility'
  };

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workouts = this.workoutService.getMockWorkouts();
    this.filteredWorkouts = this.workouts;
  }

  onTabChange(event: any): void {
    const filter = this.typeFilters[event.index] || 'all';
    if (filter === 'all') {
      this.filteredWorkouts = this.workouts;
    } else {
      this.filteredWorkouts = this.workouts.filter(w => w.type === filter);
    }
  }

  getTypeIcon(type: WorkoutType): string {
    const icons: Record<string, string> = {
      'strength': 'fitness_center',
      'cardio': 'directions_run',
      'hiit': 'flash_on',
      'yoga': 'self_improvement',
      'flexibility': 'accessibility_new',
      'custom': 'tune'
    };
    return icons[type] || 'fitness_center';
  }

  getWorkoutGradient(type: WorkoutType): string {
    const gradients: Record<string, string> = {
      'strength': 'linear-gradient(135deg, #667eea, #764ba2)',
      'cardio': 'linear-gradient(135deg, #f72585, #ff6b6b)',
      'hiit': 'linear-gradient(135deg, #ff9a00, #ffd166)',
      'yoga': 'linear-gradient(135deg, #06d6a0, #1b9aaa)',
      'flexibility': 'linear-gradient(135deg, #4cc9f0, #4361ee)',
      'custom': 'linear-gradient(135deg, #555, #888)'
    };
    return gradients[type] || gradients['custom'];
  }

  openVideoDemo(workout: Workout): void {
    const exerciseWithVideo = workout.exercises.find(ex => ex.videoUrl);
    if (exerciseWithVideo?.videoUrl) {
      window.open(exerciseWithVideo.videoUrl, '_blank');
    }
  }
}

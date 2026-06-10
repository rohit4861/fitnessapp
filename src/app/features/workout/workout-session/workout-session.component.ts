import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { WorkoutService } from '../../../core/services/workout.service';
import { Workout, Exercise } from '../../../core/models/workout.model';

@Component({
  selector: 'app-workout-session',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="session-page fade-in" *ngIf="workout">
      <!-- Session Header -->
      <div class="session-header" [class.active]="isSessionActive">
        <div class="header-info">
          <h1>{{workout.name}}</h1>
          <p>{{workout.description}}</p>
        </div>
        <div class="timer">
          <mat-icon>timer</mat-icon>
          <span class="timer-value">{{formatTime(elapsedTime)}}</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="session-progress">
        <mat-progress-bar mode="determinate" [value]="progressPercent" color="primary"></mat-progress-bar>
        <span class="progress-text">{{currentExerciseIndex + 1}} / {{workout.exercises.length}} exercises</span>
      </div>

      <!-- Current Exercise -->
      <div class="current-exercise" *ngIf="currentExercise && isSessionActive">
        <mat-card class="exercise-card">
          <div class="exercise-header">
            <h2>{{currentExercise.name}}</h2>
            <mat-chip-set>
              <mat-chip>{{currentExercise.muscleGroup}}</mat-chip>
              <mat-chip>{{currentExercise.sets}} sets × {{currentExercise.reps}} reps</mat-chip>
            </mat-chip-set>
          </div>

          <!-- YouTube Demo Video Link -->
          <div class="video-demo" *ngIf="currentExercise.videoUrl">
            <a class="video-link" (click)="openVideo(currentExercise.videoUrl)">
              <mat-icon>play_circle</mat-icon>
              <span>Watch Exercise Demo on YouTube</span>
              <mat-icon class="external-icon">open_in_new</mat-icon>
            </a>
          </div>

          <div class="exercise-body">
            <div class="exercise-visual">
              <div class="exercise-icon-large">
                <mat-icon>fitness_center</mat-icon>
              </div>
              <p class="exercise-description">{{currentExercise.description}}</p>
            </div>

            <div class="exercise-details">
              <h3>Step-by-Step Instructions</h3>
              <ol class="instructions-list">
                <li *ngFor="let instruction of currentExercise.instructions">{{instruction}}</li>
              </ol>

              <div class="sets-tracker">
                <h3>Sets Progress</h3>
                <div class="sets-grid">
                  <div class="set-item" *ngFor="let set of getSetsArray(); let i = index"
                       [class.completed]="i < completedSets"
                       [class.current]="i === completedSets">
                    <span>Set {{i + 1}}</span>
                    <mat-icon *ngIf="i < completedSets">check_circle</mat-icon>
                    <mat-icon *ngIf="i === completedSets">radio_button_unchecked</mat-icon>
                    <mat-icon *ngIf="i > completedSets">circle</mat-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="exercise-actions">
            <button mat-raised-button (click)="completeSet()" color="primary"
                    *ngIf="completedSets < currentExercise.sets">
              <mat-icon>check</mat-icon> Complete Set {{completedSets + 1}}
            </button>
            <button mat-raised-button (click)="nextExercise()" color="accent"
                    *ngIf="completedSets >= currentExercise.sets">
              <mat-icon>skip_next</mat-icon>
              {{isLastExercise ? 'Finish Workout' : 'Next Exercise'}}
            </button>
            <button mat-button (click)="skipExercise()">
              <mat-icon>skip_next</mat-icon> Skip
            </button>
          </div>
        </mat-card>

        <!-- Rest Timer -->
        <div class="rest-timer" *ngIf="isResting">
          <mat-card class="rest-card">
            <mat-icon>self_improvement</mat-icon>
            <h3>Rest Time</h3>
            <span class="rest-countdown">{{restTimeRemaining}}s</span>
            <mat-progress-bar mode="determinate"
              [value]="((currentExercise.restTime - restTimeRemaining) / currentExercise.restTime) * 100">
            </mat-progress-bar>
            <button mat-button (click)="skipRest()">Skip Rest</button>
          </mat-card>
        </div>
      </div>

      <!-- Start / Complete Screen -->
      <div class="session-start" *ngIf="!isSessionActive">
        <mat-card class="start-card" *ngIf="!isCompleted">
          <div class="start-content">
            <mat-icon class="start-icon">play_circle_filled</mat-icon>
            <h2>Ready to Start?</h2>
            <p>{{workout.exercises.length}} exercises · {{workout.duration}} minutes · ~{{workout.caloriesBurned}} calories</p>
            <div class="exercise-preview">
              <h3>Exercise List</h3>
              <div class="preview-item" *ngFor="let ex of workout.exercises; let i = index">
                <span class="preview-number">{{i + 1}}</span>
                <span class="preview-name">{{ex.name}}</span>
                <span class="preview-detail">{{ex.sets}}×{{ex.reps}}</span>
              </div>
            </div>
            <button mat-raised-button color="primary" class="start-btn" (click)="startSession()">
              <mat-icon>play_arrow</mat-icon> Start Workout
            </button>
          </div>
        </mat-card>

        <mat-card class="complete-card" *ngIf="isCompleted">
          <div class="complete-content">
            <mat-icon class="complete-icon">emoji_events</mat-icon>
            <h2>Workout Complete! 🎉</h2>
            <div class="completion-stats">
              <div class="comp-stat">
                <span class="comp-value">{{formatTime(elapsedTime)}}</span>
                <span class="comp-label">Duration</span>
              </div>
              <div class="comp-stat">
                <span class="comp-value">{{workout.caloriesBurned}}</span>
                <span class="comp-label">Calories</span>
              </div>
              <div class="comp-stat">
                <span class="comp-value">{{workout.exercises.length}}</span>
                <span class="comp-label">Exercises</span>
              </div>
            </div>
            <button mat-raised-button color="primary" routerLink="/dashboard">
              <mat-icon>home</mat-icon> Back to Dashboard
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .session-page {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      &.active {
        background: linear-gradient(135deg, #4361ee, #7209b7);
        color: white;

        p { color: rgba(255, 255, 255, 0.8); }
      }

      h1 { font-size: 1.5rem; }
      p { color: #666; margin-top: 4px; }

      .timer {
        display: flex;
        align-items: center;
        gap: 8px;

        .timer-value {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: monospace;
        }
      }
    }

    .session-progress {
      margin-bottom: 24px;

      .progress-text {
        display: block;
        text-align: center;
        margin-top: 8px;
        color: #666;
        font-size: 0.9rem;
      }
    }

    .video-demo {
      margin-bottom: 20px;

      .video-link {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 20px;
        background: linear-gradient(135deg, #ff0000, #cc0000);
        color: white;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2);
        cursor: pointer;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 0, 0, 0.3);
        }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        .external-icon {
          margin-left: auto;
          font-size: 18px;
          width: 18px;
          height: 18px;
          opacity: 0.8;
        }
      }
    }

    .exercise-description {
      color: #555;
      font-size: 0.95rem;
      text-align: center;
      margin-top: 12px;
    }

    .exercise-card {
      border-radius: 16px !important;
      padding: 24px;

      .exercise-header {
        margin-bottom: 20px;

        h2 {
          font-size: 1.4rem;
          margin-bottom: 8px;
        }
      }

      .exercise-body {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 24px;

        .exercise-visual {
          .exercise-icon-large {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4361ee, #7209b7);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;

            mat-icon {
              font-size: 48px;
              width: 48px;
              height: 48px;
              color: white;
            }
          }
        }

        .instructions-list {
          padding-left: 20px;
          margin-bottom: 20px;

          li {
            margin-bottom: 8px;
            color: #555;
          }
        }

        .sets-tracker {
          h3 {
            font-size: 1rem;
            margin-bottom: 12px;
          }

          .sets-grid {
            display: flex;
            gap: 12px;

            .set-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;
              padding: 12px 16px;
              border-radius: 12px;
              background: #f5f5f5;
              font-size: 0.85rem;

              &.completed {
                background: #e8f5e9;
                color: #2e7d32;
              }

              &.current {
                background: #e3f2fd;
                color: #1565c0;
                border: 2px solid #1565c0;
              }

              mat-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
              }
            }
          }
        }
      }

      .exercise-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #eee;
      }
    }

    .rest-timer {
      margin-top: 16px;

      .rest-card {
        text-align: center;
        padding: 32px;
        border-radius: 16px !important;
        background: #f0f4ff;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: #4361ee;
        }

        .rest-countdown {
          display: block;
          font-size: 3rem;
          font-weight: 700;
          color: #4361ee;
          margin: 12px 0;
        }
      }
    }

    .start-card, .complete-card {
      border-radius: 16px !important;
      padding: 32px;
      text-align: center;

      .start-icon, .complete-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #4361ee;
        margin-bottom: 16px;
      }

      .complete-icon {
        color: #06d6a0;
      }

      h2 {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      p {
        color: #666;
        margin-bottom: 24px;
      }

      .exercise-preview {
        text-align: left;
        margin: 24px 0;

        h3 {
          font-size: 1rem;
          margin-bottom: 12px;
        }

        .preview-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;

          .preview-number {
            width: 28px;
            height: 28px;
            background: #4361ee;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            margin-right: 12px;
          }

          .preview-name { flex: 1; }
          .preview-detail { color: #666; font-size: 0.85rem; }
        }
      }

      .start-btn {
        height: 48px;
        font-size: 1rem;
        padding: 0 32px;
      }
    }

    .completion-stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin: 24px 0;

      .comp-stat {
        text-align: center;

        .comp-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #4361ee;
        }

        .comp-label {
          font-size: 0.85rem;
          color: #666;
        }
      }
    }

    @media (max-width: 768px) {
      .exercise-body {
        grid-template-columns: 1fr !important;
      }

      .exercise-visual {
        display: none;
      }
    }
  `]
})
export class WorkoutSessionComponent implements OnInit, OnDestroy {
  workout: Workout | null = null;
  currentExercise: Exercise | null = null;
  currentExerciseIndex = 0;
  completedSets = 0;
  isSessionActive = false;
  isCompleted = false;
  isResting = false;
  elapsedTime = 0;
  restTimeRemaining = 0;
  progressPercent = 0;

  private timerInterval: any;
  private restInterval: any;

  get isLastExercise(): boolean {
    return this.workout ? this.currentExerciseIndex >= this.workout.exercises.length - 1 : false;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const workouts = this.workoutService.getMockWorkouts();
    this.workout = workouts.find(w => w.id === id) || workouts[0];
    if (this.workout) {
      this.currentExercise = this.workout.exercises[0];
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  startSession(): void {
    this.isSessionActive = true;
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
    }, 1000);
  }

  completeSet(): void {
    this.completedSets++;
    if (this.completedSets < (this.currentExercise?.sets || 0)) {
      this.startRest();
    }
  }

  nextExercise(): void {
    if (!this.workout) return;

    if (this.isLastExercise) {
      this.completeSession();
    } else {
      this.currentExerciseIndex++;
      this.currentExercise = this.workout.exercises[this.currentExerciseIndex];
      this.completedSets = 0;
      this.updateProgress();
    }
  }

  skipExercise(): void {
    this.nextExercise();
  }

  private startRest(): void {
    this.isResting = true;
    this.restTimeRemaining = this.currentExercise?.restTime || 30;
    this.restInterval = setInterval(() => {
      this.restTimeRemaining--;
      if (this.restTimeRemaining <= 0) {
        this.skipRest();
      }
    }, 1000);
  }

  skipRest(): void {
    this.isResting = false;
    if (this.restInterval) {
      clearInterval(this.restInterval);
    }
  }

  private completeSession(): void {
    this.isSessionActive = false;
    this.isCompleted = true;
    this.clearTimers();
    this.snackBar.open('Congratulations! Workout completed! 🎉', 'Close', { duration: 5000 });
  }

  private updateProgress(): void {
    if (this.workout) {
      this.progressPercent = ((this.currentExerciseIndex) / this.workout.exercises.length) * 100;
    }
  }

  private clearTimers(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.restInterval) clearInterval(this.restInterval);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getSetsArray(): number[] {
    return Array(this.currentExercise?.sets || 0).fill(0);
  }

  openVideo(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}

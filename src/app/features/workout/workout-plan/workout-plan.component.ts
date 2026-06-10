import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { WorkoutService } from '../../../core/services/workout.service';
import { AIService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-workout-plan',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="plan-page fade-in">
      <div class="page-header">
        <h1><mat-icon>auto_awesome</mat-icon> AI Workout Plan Generator</h1>
        <p>Let our AI create a personalized workout plan based on your goals and preferences</p>
      </div>

      <div class="plan-content">
        <mat-card class="plan-form-card" *ngIf="!generatedPlan">
          <mat-card-content>
            <form [formGroup]="planForm" (ngSubmit)="generatePlan()">
              <h3>Customize Your Plan</h3>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Primary Goal</mat-label>
                <mat-select formControlName="goal">
                  <mat-option value="weight_loss">Weight Loss</mat-option>
                  <mat-option value="muscle_gain">Muscle Building</mat-option>
                  <mat-option value="endurance">Endurance & Stamina</mat-option>
                  <mat-option value="flexibility">Flexibility & Mobility</mat-option>
                  <mat-option value="general_fitness">General Fitness</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Workouts Per Week</mat-label>
                <mat-select formControlName="daysPerWeek">
                  <mat-option [value]="3">3 days</mat-option>
                  <mat-option [value]="4">4 days</mat-option>
                  <mat-option [value]="5">5 days</mat-option>
                  <mat-option [value]="6">6 days</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Session Duration (minutes)</mat-label>
                <mat-select formControlName="duration">
                  <mat-option [value]="20">20 minutes</mat-option>
                  <mat-option [value]="30">30 minutes</mat-option>
                  <mat-option [value]="45">45 minutes</mat-option>
                  <mat-option [value]="60">60 minutes</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Available Equipment</mat-label>
                <mat-select formControlName="equipment" multiple>
                  <mat-option value="none">No Equipment (Bodyweight)</mat-option>
                  <mat-option value="dumbbells">Dumbbells</mat-option>
                  <mat-option value="barbell">Barbell</mat-option>
                  <mat-option value="resistance_bands">Resistance Bands</mat-option>
                  <mat-option value="pull_up_bar">Pull-up Bar</mat-option>
                  <mat-option value="full_gym">Full Gym Access</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Focus Areas</mat-label>
                <mat-select formControlName="focusAreas" multiple>
                  <mat-option value="chest">Chest</mat-option>
                  <mat-option value="back">Back</mat-option>
                  <mat-option value="shoulders">Shoulders</mat-option>
                  <mat-option value="arms">Arms</mat-option>
                  <mat-option value="legs">Legs</mat-option>
                  <mat-option value="core">Core</mat-option>
                  <mat-option value="full_body">Full Body</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Plan Duration</mat-label>
                <mat-select formControlName="planWeeks">
                  <mat-option [value]="4">4 Weeks</mat-option>
                  <mat-option [value]="8">8 Weeks</mat-option>
                  <mat-option [value]="12">12 Weeks</mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-raised-button color="primary" class="generate-btn" type="submit"
                      [disabled]="planForm.invalid || isGenerating">
                <mat-spinner *ngIf="isGenerating" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!isGenerating">auto_awesome</mat-icon>
                <span>{{isGenerating ? 'AI is generating your plan...' : 'Generate AI Plan'}}</span>
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Generated Plan Display -->
        <div class="generated-plan" *ngIf="generatedPlan">
          <mat-card class="plan-summary">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>auto_awesome</mat-icon> Your AI-Generated Workout Plan
              </mat-card-title>
              <mat-card-subtitle>Personalized based on your profile and goals</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="plan-overview">
                <div class="plan-stat">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{generatedPlan.duration}} Weeks</span>
                </div>
                <div class="plan-stat">
                  <mat-icon>repeat</mat-icon>
                  <span>{{generatedPlan.daysPerWeek}} Days/Week</span>
                </div>
                <div class="plan-stat">
                  <mat-icon>timer</mat-icon>
                  <span>{{generatedPlan.sessionDuration}} Min/Session</span>
                </div>
              </div>

              <div class="ai-explanation">
                <mat-icon>psychology</mat-icon>
                <p>{{generatedPlan.explanation}}</p>
              </div>

              <h3>Weekly Schedule</h3>
              <div class="schedule-grid">
                <div class="schedule-day" *ngFor="let day of generatedPlan.schedule"
                     [class.rest-day]="day.isRestDay">
                  <span class="day-name">{{day.day}}</span>
                  <span class="day-workout" *ngIf="!day.isRestDay">{{day.workout}}</span>
                  <span class="day-rest" *ngIf="day.isRestDay">Rest Day</span>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">
                <mat-icon>check</mat-icon> Activate Plan
              </button>
              <button mat-button (click)="generatedPlan = null">
                <mat-icon>refresh</mat-icon> Generate New Plan
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plan-page {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;

      h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.8rem;
        font-weight: 700;

        mat-icon {
          color: #7209b7;
        }
      }

      p {
        color: #666;
        margin-top: 4px;
      }
    }

    .plan-form-card {
      border-radius: 16px !important;
      padding: 16px;

      h3 {
        font-size: 1.2rem;
        margin-bottom: 20px;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 4px;
    }

    .generate-btn {
      width: 100%;
      height: 52px;
      font-size: 1rem;
      margin-top: 16px;
      border-radius: 12px !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .generated-plan {
      .plan-summary {
        border-radius: 16px !important;
        padding: 16px;
      }

      .plan-overview {
        display: flex;
        gap: 24px;
        margin: 16px 0;

        .plan-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;

          mat-icon {
            color: #4361ee;
          }
        }
      }

      .ai-explanation {
        display: flex;
        gap: 12px;
        background: #f0f4ff;
        padding: 16px;
        border-radius: 12px;
        margin: 16px 0;

        mat-icon {
          color: #7209b7;
          flex-shrink: 0;
        }

        p {
          margin: 0;
          color: #444;
          font-size: 0.9rem;
          line-height: 1.5;
        }
      }

      .schedule-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        margin-top: 16px;

        .schedule-day {
          text-align: center;
          padding: 12px 8px;
          border-radius: 12px;
          background: #f8f9fa;

          &.rest-day {
            background: #e8f5e9;
          }

          .day-name {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 4px;
          }

          .day-workout {
            font-size: 0.7rem;
            color: #4361ee;
            font-weight: 500;
          }

          .day-rest {
            font-size: 0.7rem;
            color: #2e7d32;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .schedule-grid {
        grid-template-columns: repeat(4, 1fr) !important;
      }

      .plan-overview {
        flex-direction: column;
        gap: 8px !important;
      }
    }
  `]
})
export class WorkoutPlanComponent {
  planForm: FormGroup;
  isGenerating = false;
  generatedPlan: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private workoutService: WorkoutService,
    private aiService: AIService
  ) {
    this.planForm = this.fb.group({
      goal: ['', Validators.required],
      daysPerWeek: [4, Validators.required],
      duration: [30, Validators.required],
      equipment: [['none'], Validators.required],
      focusAreas: [['full_body'], Validators.required],
      planWeeks: [4, Validators.required]
    });
  }

  generatePlan(): void {
    if (this.planForm.invalid) return;
    this.isGenerating = true;

    // Simulate AI plan generation
    setTimeout(() => {
      const formValues = this.planForm.value;
      this.generatedPlan = {
        duration: formValues.planWeeks,
        daysPerWeek: formValues.daysPerWeek,
        sessionDuration: formValues.duration,
        explanation: `Based on your ${formValues.goal.replace('_', ' ')} goal, ${this.authService.user()?.fitnessLevel} fitness level, and available equipment, I've designed a ${formValues.planWeeks}-week progressive plan. The plan focuses on ${formValues.focusAreas.join(', ')} with ${formValues.daysPerWeek} training days and proper recovery periods. Each session is optimized for ${formValues.duration} minutes to maximize results within your time constraints.`,
        schedule: this.generateSchedule(formValues)
      };
      this.isGenerating = false;
    }, 3000);
  }

  private generateSchedule(formValues: any): any[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const workoutTypes: Record<string, string[]> = {
      'muscle_gain': ['Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs', 'Full Body'],
      'weight_loss': ['HIIT', 'Cardio', 'Full Body', 'Core & Cardio', 'Interval Training'],
      'endurance': ['Long Cardio', 'Interval', 'Steady State', 'Tempo', 'Recovery Run'],
      'flexibility': ['Yoga Flow', 'Dynamic Stretch', 'Mobility', 'Yin Yoga', 'Pilates'],
      'general_fitness': ['Full Body', 'Cardio', 'Strength', 'HIIT', 'Yoga']
    };

    const workouts = workoutTypes[formValues.goal] || workoutTypes['general_fitness'];
    let workoutIndex = 0;

    return days.map((day, index) => {
      const isRestDay = workoutIndex >= formValues.daysPerWeek ||
                       (formValues.daysPerWeek <= 5 && (index === 6 || (index === 3 && formValues.daysPerWeek <= 4)));

      if (isRestDay) {
        return { day, isRestDay: true, workout: null };
      } else {
        const workout = workouts[workoutIndex % workouts.length];
        workoutIndex++;
        return { day, isRestDay: false, workout };
      }
    });
  }
}

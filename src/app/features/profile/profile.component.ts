import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';
import { AIService } from '../../core/services/ai.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="profile-page fade-in">
      <div class="page-header">
        <h1><mat-icon>person</mat-icon> My Profile</h1>
        <p>Manage your personal information and fitness preferences</p>
      </div>

      <div class="profile-content">
        <!-- Profile Header -->
        <mat-card class="profile-header-card">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <mat-icon>person</mat-icon>
            </div>
            <div class="profile-name">
              <h2>{{user?.firstName}} {{user?.lastName}}</h2>
              <p>{{user?.email}}</p>
              <mat-chip-set>
                <mat-chip color="primary">{{user?.fitnessLevel}}</mat-chip>
                <mat-chip>{{user?.fitnessGoal?.replace('_', ' ')}}</mat-chip>
              </mat-chip-set>
            </div>
          </div>
          <div class="profile-stats">
            <div class="pstat">
              <span class="pstat-value">{{user?.bmi}}</span>
              <span class="pstat-label">BMI</span>
            </div>
            <div class="pstat">
              <span class="pstat-value">{{dailyCalories}}</span>
              <span class="pstat-label">Daily Cal</span>
            </div>
            <div class="pstat">
              <span class="pstat-value">{{user?.weight}} kg</span>
              <span class="pstat-label">Weight</span>
            </div>
            <div class="pstat">
              <span class="pstat-value">{{user?.height}} cm</span>
              <span class="pstat-label">Height</span>
            </div>
          </div>
        </mat-card>

        <!-- Edit Form -->
        <mat-card class="edit-card">
          <mat-card-header>
            <mat-card-title>Personal Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Age</mat-label>
                  <input matInput formControlName="age" type="number">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Gender</mat-label>
                  <mat-select formControlName="gender">
                    <mat-option value="male">Male</mat-option>
                    <mat-option value="female">Female</mat-option>
                    <mat-option value="other">Other</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Height (cm)</mat-label>
                  <input matInput formControlName="height" type="number">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Weight (kg)</mat-label>
                  <input matInput formControlName="weight" type="number">
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>

              <h3 class="section-title">Fitness Settings</h3>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Fitness Level</mat-label>
                  <mat-select formControlName="fitnessLevel">
                    <mat-option value="beginner">Beginner</mat-option>
                    <mat-option value="intermediate">Intermediate</mat-option>
                    <mat-option value="advanced">Advanced</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Fitness Goal</mat-label>
                  <mat-select formControlName="fitnessGoal">
                    <mat-option value="weight_loss">Weight Loss</mat-option>
                    <mat-option value="muscle_gain">Muscle Gain</mat-option>
                    <mat-option value="endurance">Endurance</mat-option>
                    <mat-option value="flexibility">Flexibility</mat-option>
                    <mat-option value="general_fitness">General Fitness</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Activity Level</mat-label>
                <mat-select formControlName="activityLevel">
                  <mat-option value="sedentary">Sedentary</mat-option>
                  <mat-option value="lightly_active">Lightly Active</mat-option>
                  <mat-option value="moderately_active">Moderately Active</mat-option>
                  <mat-option value="very_active">Very Active</mat-option>
                  <mat-option value="extra_active">Extra Active</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid">
                  <mat-icon>save</mat-icon> Save Changes
                </button>
                <button mat-button type="button" (click)="resetForm()">
                  <mat-icon>undo</mat-icon> Reset
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Heart Rate Zones -->
        <mat-card class="zones-card">
          <mat-card-header>
            <mat-card-title>Your Heart Rate Zones</mat-card-title>
            <mat-card-subtitle>Based on your age ({{user?.age}} years)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="zones-list">
              <div class="zone-item" *ngFor="let zone of heartRateZones; let i = index"
                   [style.borderLeftColor]="zoneColors[i]">
                <div class="zone-info">
                  <span class="zone-name">{{zone.zone}}</span>
                  <span class="zone-desc">{{zone.description}}</span>
                </div>
                <div class="zone-range">
                  <span>{{zone.min}} - {{zone.max}} bpm</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
      h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.8rem;
        font-weight: 700;
        mat-icon { color: #4361ee; }
      }
      p { color: #666; }
    }

    .profile-header-card {
      border-radius: 16px !important;
      padding: 24px;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #4361ee, #7209b7);
      color: white;

      .profile-avatar {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;

        .avatar-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 40px;
            width: 40px;
            height: 40px;
          }
        }

        .profile-name {
          h2 { margin: 0; font-size: 1.5rem; }
          p { opacity: 0.8; margin: 4px 0 8px; }
        }
      }

      .profile-stats {
        display: flex;
        gap: 32px;

        .pstat {
          text-align: center;

          .pstat-value {
            display: block;
            font-size: 1.3rem;
            font-weight: 700;
          }
          .pstat-label {
            font-size: 0.8rem;
            opacity: 0.8;
          }
        }
      }
    }

    .edit-card, .zones-card {
      border-radius: 16px !important;
      margin-bottom: 24px;
      padding: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;

      mat-form-field { flex: 1; }
    }

    .full-width { width: 100%; }

    .section-title {
      margin: 20px 0 16px;
      font-size: 1.1rem;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .zones-list {
      .zone-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 16px;
        margin-bottom: 8px;
        border-left: 4px solid;
        border-radius: 8px;
        background: #f8f9fa;

        .zone-info {
          .zone-name {
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .zone-desc {
            font-size: 0.8rem;
            color: #666;
          }
        }

        .zone-range {
          font-weight: 600;
          color: #4361ee;
        }
      }
    }

    @media (max-width: 600px) {
      .form-row { flex-direction: column; gap: 0; }
      .profile-stats { flex-wrap: wrap; gap: 16px; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  dailyCalories = 0;
  heartRateZones: any[] = [];
  zoneColors = ['#4cc9f0', '#06d6a0', '#ffd166', '#ff6b6b', '#ef476f'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private aiService: AIService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user();
    this.initForm();
    this.calculateMetrics();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.user?.firstName || '', Validators.required],
      lastName: [this.user?.lastName || '', Validators.required],
      age: [this.user?.age || '', [Validators.required, Validators.min(13)]],
      gender: [this.user?.gender || '', Validators.required],
      height: [this.user?.height || '', [Validators.required, Validators.min(100)]],
      weight: [this.user?.weight || '', [Validators.required, Validators.min(30)]],
      fitnessLevel: [this.user?.fitnessLevel || '', Validators.required],
      fitnessGoal: [this.user?.fitnessGoal || '', Validators.required],
      activityLevel: [this.user?.activityLevel || '', Validators.required]
    });
  }

  private calculateMetrics(): void {
    if (this.user) {
      this.dailyCalories = this.aiService.calculateDailyCalories(
        this.user.weight, this.user.height, this.user.age,
        this.user.gender, this.user.activityLevel
      );
      this.heartRateZones = this.aiService.calculateHeartRateZones(this.user.age);
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const formValues = this.profileForm.value;
    const updatedUser: User = {
      ...this.user!,
      ...formValues,
      bmi: this.aiService.calculateBMI(formValues.weight, formValues.height),
      updatedAt: new Date()
    };

    this.authService.updateUser(updatedUser);
    this.user = updatedUser;
    this.calculateMetrics();
    this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
  }

  resetForm(): void {
    this.initForm();
  }
}

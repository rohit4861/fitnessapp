import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { AIService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <div class="register-content">
        <div class="register-header">
          <mat-icon class="logo-icon">fitness_center</mat-icon>
          <h1>Create Your Account</h1>
          <p>Start your personalized AI fitness journey</p>
        </div>

        <mat-card class="register-card">
          <mat-card-content>
            <mat-stepper [linear]="true" #stepper>
              <!-- Step 1: Account Info -->
              <mat-step [stepControl]="accountForm">
                <ng-template matStepLabel>Account</ng-template>
                <form [formGroup]="accountForm">
                  <h3>Account Information</h3>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>First Name</mat-label>
                      <input matInput formControlName="firstName" placeholder="John">
                      <mat-error *ngIf="accountForm.get('firstName')?.hasError('required')">Required</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Last Name</mat-label>
                      <input matInput formControlName="lastName" placeholder="Doe">
                      <mat-error *ngIf="accountForm.get('lastName')?.hasError('required')">Required</mat-error>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email" placeholder="john@example.com">
                    <mat-icon matSuffix>email</mat-icon>
                    <mat-error *ngIf="accountForm.get('email')?.hasError('required')">Required</mat-error>
                    <mat-error *ngIf="accountForm.get('email')?.hasError('email')">Invalid email</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Password</mat-label>
                    <input matInput formControlName="password" type="password" placeholder="Min 6 characters">
                    <mat-error *ngIf="accountForm.get('password')?.hasError('required')">Required</mat-error>
                    <mat-error *ngIf="accountForm.get('password')?.hasError('minlength')">Min 6 characters</mat-error>
                  </mat-form-field>

                  <div class="step-actions">
                    <button mat-raised-button color="primary" matStepperNext [disabled]="accountForm.invalid">Next</button>
                  </div>
                </form>
              </mat-step>

              <!-- Step 2: Physical Info -->
              <mat-step [stepControl]="physicalForm">
                <ng-template matStepLabel>Physical</ng-template>
                <form [formGroup]="physicalForm">
                  <h3>Physical Information</h3>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Age</mat-label>
                      <input matInput formControlName="age" type="number" placeholder="28">
                      <mat-error *ngIf="physicalForm.get('age')?.hasError('required')">Required</mat-error>
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
                      <input matInput formControlName="height" type="number" placeholder="178">
                      <mat-error *ngIf="physicalForm.get('height')?.hasError('required')">Required</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Weight (kg)</mat-label>
                      <input matInput formControlName="weight" type="number" placeholder="75">
                      <mat-error *ngIf="physicalForm.get('weight')?.hasError('required')">Required</mat-error>
                    </mat-form-field>
                  </div>

                  <div class="bmi-display" *ngIf="calculatedBMI">
                    <p>Your BMI: <strong>{{calculatedBMI}}</strong> ({{bmiCategory}})</p>
                  </div>

                  <div class="step-actions">
                    <button mat-button matStepperPrevious>Back</button>
                    <button mat-raised-button color="primary" matStepperNext [disabled]="physicalForm.invalid">Next</button>
                  </div>
                </form>
              </mat-step>

              <!-- Step 3: Fitness Goals -->
              <mat-step [stepControl]="fitnessForm">
                <ng-template matStepLabel>Goals</ng-template>
                <form [formGroup]="fitnessForm">
                  <h3>Fitness Goals</h3>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Fitness Level</mat-label>
                    <mat-select formControlName="fitnessLevel">
                      <mat-option value="beginner">Beginner</mat-option>
                      <mat-option value="intermediate">Intermediate</mat-option>
                      <mat-option value="advanced">Advanced</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Primary Fitness Goal</mat-label>
                    <mat-select formControlName="fitnessGoal">
                      <mat-option value="weight_loss">Weight Loss</mat-option>
                      <mat-option value="muscle_gain">Muscle Gain</mat-option>
                      <mat-option value="endurance">Endurance</mat-option>
                      <mat-option value="flexibility">Flexibility</mat-option>
                      <mat-option value="general_fitness">General Fitness</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Activity Level</mat-label>
                    <mat-select formControlName="activityLevel">
                      <mat-option value="sedentary">Sedentary (little or no exercise)</mat-option>
                      <mat-option value="lightly_active">Lightly Active (1-3 days/week)</mat-option>
                      <mat-option value="moderately_active">Moderately Active (3-5 days/week)</mat-option>
                      <mat-option value="very_active">Very Active (6-7 days/week)</mat-option>
                      <mat-option value="extra_active">Extra Active (athlete)</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Target Weight (kg) - Optional</mat-label>
                    <input matInput formControlName="targetWeight" type="number" placeholder="70">
                  </mat-form-field>

                  <div class="step-actions">
                    <button mat-button matStepperPrevious>Back</button>
                    <button mat-raised-button color="primary" (click)="onSubmit()"
                            [disabled]="fitnessForm.invalid || isLoading">
                      <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                      <span *ngIf="!isLoading">Create Account</span>
                    </button>
                  </div>
                </form>
              </mat-step>
            </mat-stepper>

            <div class="auth-footer">
              <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }

    .register-content {
      width: 100%;
      max-width: 650px;
    }

    .register-header {
      text-align: center;
      color: white;
      margin-bottom: 24px;

      .logo-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }

      h1 {
        font-size: 1.8rem;
        font-weight: 700;
      }

      p {
        opacity: 0.9;
      }
    }

    .register-card {
      border-radius: 16px !important;
      padding: 24px;

      h3 {
        font-size: 1.2rem;
        margin-bottom: 16px;
        color: #333;
      }
    }

    .form-row {
      display: flex;
      gap: 16px;

      mat-form-field {
        flex: 1;
      }
    }

    .full-width {
      width: 100%;
    }

    .bmi-display {
      background: #e8f5e9;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;

      p {
        margin: 0;
        color: #2e7d32;
      }
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;

      a {
        color: #4361ee;
        font-weight: 500;
      }
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  accountForm: FormGroup;
  physicalForm: FormGroup;
  fitnessForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  calculatedBMI: number | null = null;
  bmiCategory = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private aiService: AIService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.physicalForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(13), Validators.max(100)]],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]]
    });

    this.fitnessForm = this.fb.group({
      fitnessLevel: ['', Validators.required],
      fitnessGoal: ['', Validators.required],
      activityLevel: ['', Validators.required],
      targetWeight: ['']
    });

    // Calculate BMI when height or weight changes
    this.physicalForm.valueChanges.subscribe(values => {
      if (values.height && values.weight) {
        this.calculatedBMI = this.aiService.calculateBMI(values.weight, values.height);
        this.bmiCategory = this.aiService.getBMICategory(this.calculatedBMI);
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid || this.physicalForm.invalid || this.fitnessForm.invalid) return;

    this.isLoading = true;

    const formData = {
      ...this.accountForm.value,
      ...this.physicalForm.value,
      ...this.fitnessForm.value
    };

    // Simulate registration
    setTimeout(() => {
      const mockUser = {
        id: 'user_' + Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        bmi: this.calculatedBMI || 0,
        fitnessLevel: formData.fitnessLevel,
        fitnessGoal: formData.fitnessGoal,
        healthConditions: [],
        activityLevel: formData.activityLevel,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.authService.updateUser(mockUser);
      localStorage.setItem('fitness_auth_token', 'demo-token-' + Date.now());
      this.isLoading = false;
      this.snackBar.open('Account created successfully! Welcome aboard! 🎉', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    }, 2000);
  }
}

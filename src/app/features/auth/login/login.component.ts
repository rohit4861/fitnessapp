import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <mat-icon class="logo-icon">fitness_center</mat-icon>
            <h1>AI Fitness Coach</h1>
          </div>
          <p class="subtitle">Your Personal AI-Powered Fitness Journey</p>
        </div>

        <mat-card class="login-card">
          <mat-card-content>
            <h2>Welcome Back</h2>
            <p class="login-subtitle">Sign in to continue your fitness journey</p>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="Enter your email">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="Enter your password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
              </mat-form-field>

              <button mat-raised-button color="primary" class="submit-btn" type="submit"
                      [disabled]="loginForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <span *ngIf="!isLoading">Sign In</span>
              </button>
            </form>

            <div class="auth-footer">
              <p>Don't have an account? <a routerLink="/auth/register">Sign Up</a></p>
            </div>

            <!-- Quick Demo Access -->
            <div class="demo-section">
              <div class="divider-text"><span>or</span></div>
              <button mat-stroked-button color="accent" class="demo-btn" (click)="onDemoLogin()" [disabled]="isLoading">
                <mat-icon>rocket_launch</mat-icon>
                <span>Try Demo - No Sign Up Needed</span>
              </button>
              <p class="demo-hint">Explore all features instantly with sample data</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="auth-features">
        <div class="feature-item" *ngFor="let feature of features">
          <mat-icon>{{feature.icon}}</mat-icon>
          <h3>{{feature.title}}</h3>
          <p>{{feature.description}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
    }

    .auth-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      max-width: 500px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
      color: white;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 8px;

        .logo-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
        }

        h1 {
          font-size: 1.8rem;
          font-weight: 700;
        }
      }

      .subtitle {
        opacity: 0.9;
        font-size: 1rem;
      }
    }

    .login-card {
      width: 100%;
      padding: 32px;
      border-radius: 16px !important;

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .login-subtitle {
        color: #666;
        margin-bottom: 24px;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      margin-top: 16px;
      border-radius: 8px !important;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;

      a {
        color: #4361ee;
        font-weight: 500;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .demo-section {
      margin-top: 24px;

      .divider-text {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        &::before, &::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e0e0e0;
        }

        span {
          padding: 0 12px;
          color: #999;
          font-size: 0.85rem;
        }
      }

      .demo-btn {
        width: 100%;
        height: 44px;
        font-size: 0.95rem;
        border-radius: 8px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .demo-hint {
        text-align: center;
        font-size: 0.8rem;
        color: #999;
        margin-top: 8px;
      }
    }

    .auth-features {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
      gap: 32px;

      .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        color: white;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          opacity: 0.9;
        }

        h3 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        p {
          opacity: 0.8;
          font-size: 0.9rem;
        }
      }
    }

    @media (max-width: 768px) {
      .auth-container {
        flex-direction: column;
      }

      .auth-features {
        display: none;
      }

      .auth-card {
        max-width: 100%;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  features = [
    { icon: 'psychology', title: 'AI-Powered Coaching', description: 'Personalized workout plans that adapt to your progress' },
    { icon: 'videocam', title: 'Posture Detection', description: 'Real-time exercise form analysis using computer vision' },
    { icon: 'restaurant', title: 'Smart Nutrition', description: 'Customized meal plans based on your fitness goals' },
    { icon: 'trending_up', title: 'Progress Tracking', description: 'Comprehensive health metrics and performance analytics' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.demoLogin(this.loginForm.value.email);
  }

  onDemoLogin(): void {
    this.demoLogin('demo@aifitness.com');
  }

  private demoLogin(email: string): void {
    this.isLoading = true;

    // For demo purposes, simulate login
    setTimeout(() => {
      const mockUser = {
        id: 'user1',
        email: email,
        firstName: 'Alex',
        lastName: 'Johnson',
        age: 28,
        gender: 'male' as const,
        height: 178,
        weight: 75,
        bmi: 23.7,
        fitnessLevel: 'intermediate' as const,
        fitnessGoal: 'muscle_gain' as const,
        healthConditions: [],
        activityLevel: 'moderately_active' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.authService.updateUser(mockUser);
      localStorage.setItem('fitness_auth_token', 'demo-token-' + Date.now());
      this.isLoading = false;
      this.snackBar.open('Welcome to AI Fitness Coach! 💪 Let\'s get started!', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
}

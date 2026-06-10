import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { HealthService } from '../../core/services/health.service';
import { ProgressData } from '../../core/models/health.model';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgChartsModule
  ],
  template: `
    <div class="progress-page fade-in">
      <div class="page-header">
        <div>
          <h1><mat-icon>trending_up</mat-icon> Progress Tracking</h1>
          <p>Monitor your fitness journey with AI-powered analytics</p>
        </div>
        <mat-form-field appearance="outline" class="period-select">
          <mat-label>Period</mat-label>
          <mat-select [(value)]="selectedPeriod" (selectionChange)="onPeriodChange()">
            <mat-option value="week">This Week</mat-option>
            <mat-option value="month">This Month</mat-option>
            <mat-option value="quarter">3 Months</mat-option>
            <mat-option value="year">This Year</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Summary Stats -->
      <div class="summary-grid">
        <div class="summary-card streak">
          <mat-icon>local_fire_department</mat-icon>
          <div class="summary-info">
            <span class="summary-value">{{progressData.streakDays}}</span>
            <span class="summary-label">Day Streak</span>
          </div>
        </div>
        <div class="summary-card workouts">
          <mat-icon>fitness_center</mat-icon>
          <div class="summary-info">
            <span class="summary-value">{{progressData.totalWorkouts}}</span>
            <span class="summary-label">Total Workouts</span>
          </div>
        </div>
        <div class="summary-card calories">
          <mat-icon>whatshot</mat-icon>
          <div class="summary-info">
            <span class="summary-value">{{(progressData.totalCaloriesBurned / 1000).toFixed(1)}}k</span>
            <span class="summary-label">Calories Burned</span>
          </div>
        </div>
        <div class="summary-card duration">
          <mat-icon>timer</mat-icon>
          <div class="summary-info">
            <span class="summary-value">{{progressData.averageSessionDuration}}</span>
            <span class="summary-label">Avg Duration (min)</span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <!-- Weight Progress -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Weight Progress</mat-card-title>
            <mat-card-subtitle>Track your weight over time</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [datasets]="weightChartData.datasets"
              [labels]="weightChartData.labels"
              [options]="lineChartOptions"
              [type]="'line'">
            </canvas>
          </mat-card-content>
        </mat-card>

        <!-- Calorie Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Calorie Balance</mat-card-title>
            <mat-card-subtitle>Consumed vs Burned</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [datasets]="calorieChartData.datasets"
              [labels]="calorieChartData.labels"
              [options]="lineChartOptions"
              [type]="'line'">
            </canvas>
          </mat-card-content>
        </mat-card>

        <!-- Workout Frequency -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Workout Frequency</mat-card-title>
            <mat-card-subtitle>Sessions per week</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [datasets]="frequencyChartData.datasets"
              [labels]="frequencyChartData.labels"
              [options]="barChartOptions"
              [type]="'bar'">
            </canvas>
          </mat-card-content>
        </mat-card>

        <!-- BMI History -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>BMI Trend</mat-card-title>
            <mat-card-subtitle>Body Mass Index over time</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [datasets]="bmiChartData.datasets"
              [labels]="bmiChartData.labels"
              [options]="lineChartOptions"
              [type]="'line'">
            </canvas>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Strength Progress -->
      <mat-card class="strength-card">
        <mat-card-header>
          <mat-card-title>Strength Progress</mat-card-title>
          <mat-card-subtitle>Max weight lifted for key exercises</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="strength-grid">
            <div class="strength-item" *ngFor="let item of progressData.strengthProgress">
              <div class="strength-exercise">
                <mat-icon>fitness_center</mat-icon>
                <span>{{item.exercise}}</span>
              </div>
              <div class="strength-value">
                <span class="weight">{{item.maxWeight}} kg</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .progress-page {
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
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.8rem;
        font-weight: 700;
        mat-icon { color: #06d6a0; }
      }
      p { color: #666; }

      .period-select {
        width: 150px;
      }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .summary-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      &.streak mat-icon { color: #f72585; }
      &.workouts mat-icon { color: #4361ee; }
      &.calories mat-icon { color: #ff6b6b; }
      &.duration mat-icon { color: #06d6a0; }

      .summary-info {
        .summary-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .summary-label {
          font-size: 0.85rem;
          color: #666;
        }
      }
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .chart-card {
      border-radius: 16px !important;
      padding: 8px;
    }

    .strength-card {
      border-radius: 16px !important;
    }

    .strength-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;

      .strength-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 12px;

        .strength-exercise {
          display: flex;
          align-items: center;
          gap: 8px;

          mat-icon {
            color: #4361ee;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        .weight {
          font-size: 1.2rem;
          font-weight: 700;
          color: #4361ee;
        }
      }
    }

    @media (max-width: 1024px) {
      .charts-grid { grid-template-columns: 1fr; }
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .summary-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProgressComponent implements OnInit {
  selectedPeriod = 'month';
  progressData!: ProgressData;

  weightChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  calorieChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  frequencyChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  bmiChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      y: { beginAtZero: false },
      x: { grid: { display: false } }
    },
    elements: {
      line: { tension: 0.4 }
    }
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      y: { beginAtZero: true },
      x: { grid: { display: false } }
    }
  };

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.progressData = this.healthService.getMockProgressData();
    this.buildCharts();
  }

  onPeriodChange(): void {
    this.progressData = this.healthService.getMockProgressData();
    this.buildCharts();
  }

  private buildCharts(): void {
    // Weight Chart
    const weightLabels = this.progressData.weightHistory.map((_, i) => `Day ${i + 1}`);
    this.weightChartData = {
      labels: weightLabels.filter((_, i) => i % 3 === 0),
      datasets: [{
        data: this.progressData.weightHistory.filter((_, i) => i % 3 === 0).map(w => parseFloat(w.weight.toFixed(1))),
        label: 'Weight (kg)',
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#4361ee'
      }]
    };

    // Calorie Chart
    const calLabels = this.progressData.calorieHistory.map((_, i) => `Day ${i + 1}`);
    this.calorieChartData = {
      labels: calLabels.filter((_, i) => i % 3 === 0),
      datasets: [
        {
          data: this.progressData.calorieHistory.filter((_, i) => i % 3 === 0).map(c => c.consumed),
          label: 'Consumed',
          borderColor: '#f72585',
          backgroundColor: 'rgba(247, 37, 133, 0.1)',
          fill: true
        },
        {
          data: this.progressData.calorieHistory.filter((_, i) => i % 3 === 0).map(c => c.burned),
          label: 'Burned',
          borderColor: '#06d6a0',
          backgroundColor: 'rgba(6, 214, 160, 0.1)',
          fill: true
        }
      ]
    };

    // Frequency Chart
    this.frequencyChartData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        data: [4, 5, 3, 5],
        label: 'Workouts',
        backgroundColor: 'rgba(67, 97, 238, 0.7)',
        borderRadius: 8
      }]
    };

    // BMI Chart
    this.bmiChartData = {
      labels: this.progressData.bmiHistory.map((_, i) => `Month ${i + 1}`),
      datasets: [{
        data: this.progressData.bmiHistory.map(b => b.bmi),
        label: 'BMI',
        borderColor: '#7209b7',
        backgroundColor: 'rgba(114, 9, 183, 0.1)',
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#7209b7'
      }]
    };
  }
}

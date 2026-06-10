import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { NutritionService } from '../../core/services/nutrition.service';
import { NutritionPlan, MealPlan } from '../../core/models/nutrition.model';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatExpansionModule
  ],
  template: `
    <div class="nutrition-page fade-in">
      <div class="page-header">
        <div>
          <h1><mat-icon>restaurant</mat-icon> AI Nutrition Planner</h1>
          <p>Personalized meal plans optimized for your fitness goals</p>
        </div>
        <button mat-raised-button color="primary">
          <mat-icon>auto_awesome</mat-icon> Regenerate Plan
        </button>
      </div>

      <!-- Nutrition Overview -->
      <div class="nutrition-overview">
        <mat-card class="overview-card">
          <div class="macro-summary">
            <div class="calorie-ring">
              <div class="ring-inner">
                <span class="cal-value">{{plan.dailyCalories}}</span>
                <span class="cal-label">kcal/day</span>
              </div>
            </div>
            <div class="macros-breakdown">
              <div class="macro-item protein">
                <div class="macro-header">
                  <span class="macro-name">Protein</span>
                  <span class="macro-value">{{plan.macros.protein}}g</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="(plan.macros.protein / plan.dailyCalories * 400)" color="primary"></mat-progress-bar>
              </div>
              <div class="macro-item carbs">
                <div class="macro-header">
                  <span class="macro-name">Carbs</span>
                  <span class="macro-value">{{plan.macros.carbs}}g</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="(plan.macros.carbs / plan.dailyCalories * 400)" color="accent"></mat-progress-bar>
              </div>
              <div class="macro-item fats">
                <div class="macro-header">
                  <span class="macro-name">Fats</span>
                  <span class="macro-value">{{plan.macros.fats}}g</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="(plan.macros.fats / plan.dailyCalories * 900)" color="warn"></mat-progress-bar>
              </div>
              <div class="macro-item fiber">
                <div class="macro-header">
                  <span class="macro-name">Fiber</span>
                  <span class="macro-value">{{plan.macros.fiber}}g</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="(plan.macros.fiber / 40) * 100"></mat-progress-bar>
              </div>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Meal Plans -->
      <div class="meals-section">
        <h2>Daily Meal Plan</h2>
        <div class="meals-grid">
          <mat-card class="meal-card" *ngFor="let meal of plan.meals">
            <div class="meal-header" [ngClass]="'meal-' + meal.mealType">
              <div class="meal-icon">
                <mat-icon>{{getMealIcon(meal.mealType)}}</mat-icon>
              </div>
              <div class="meal-info">
                <h3>{{meal.name}}</h3>
                <span class="meal-type">{{meal.mealType | titlecase}} · {{meal.time}}</span>
              </div>
              <div class="meal-calories">
                <span>{{meal.calories}}</span>
                <small>kcal</small>
              </div>
            </div>

            <div class="meal-content">
              <div class="meal-macros">
                <span class="macro-pill protein">P: {{meal.macros.protein}}g</span>
                <span class="macro-pill carbs">C: {{meal.macros.carbs}}g</span>
                <span class="macro-pill fats">F: {{meal.macros.fats}}g</span>
              </div>

              <mat-expansion-panel class="foods-panel">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>list</mat-icon> Food Items ({{meal.foods.length}})
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <div class="food-list">
                  <div class="food-item" *ngFor="let food of meal.foods">
                    <div class="food-info">
                      <span class="food-name">{{food.name}}</span>
                      <span class="food-quantity">{{food.quantity}} {{food.unit}}</span>
                    </div>
                    <div class="food-macros">
                      <span>{{food.calories}} cal</span>
                    </div>
                  </div>
                </div>
              </mat-expansion-panel>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- AI Tips -->
      <mat-card class="tips-card">
        <mat-card-header>
          <mat-card-title><mat-icon>lightbulb</mat-icon> AI Nutrition Tips</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="tips-grid">
            <div class="tip-item" *ngFor="let tip of nutritionTips">
              <mat-icon>{{tip.icon}}</mat-icon>
              <div>
                <h4>{{tip.title}}</h4>
                <p>{{tip.description}}</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .nutrition-page {
      padding: 24px;
      max-width: 1200px;
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
    }

    .overview-card {
      border-radius: 16px !important;
      padding: 24px;
      margin-bottom: 32px;
    }

    .macro-summary {
      display: flex;
      align-items: center;
      gap: 48px;

      .calorie-ring {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: linear-gradient(135deg, #06d6a0, #4361ee);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .ring-inner {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .cal-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a1a2e;
          }
          .cal-label {
            font-size: 0.75rem;
            color: #666;
          }
        }
      }

      .macros-breakdown {
        flex: 1;

        .macro-item {
          margin-bottom: 16px;

          .macro-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;

            .macro-name {
              font-size: 0.9rem;
              color: #555;
            }
            .macro-value {
              font-weight: 600;
            }
          }
        }
      }
    }

    .meals-section {
      margin-bottom: 32px;

      h2 {
        font-size: 1.3rem;
        margin-bottom: 16px;
      }
    }

    .meals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .meal-card {
      border-radius: 16px !important;
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .meal-header {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 12px;

        &.meal-breakfast { background: linear-gradient(135deg, #ffd166, #ffb347); }
        &.meal-lunch { background: linear-gradient(135deg, #06d6a0, #1b9aaa); }
        &.meal-snack { background: linear-gradient(135deg, #a855f7, #7c3aed); }
        &.meal-dinner { background: linear-gradient(135deg, #4361ee, #3a0ca3); }

        .meal-icon {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          mat-icon { color: white; }
        }

        .meal-info {
          flex: 1;
          h3 { color: white; font-size: 1rem; margin: 0; }
          .meal-type { color: rgba(255, 255, 255, 0.8); font-size: 0.8rem; }
        }

        .meal-calories {
          text-align: center;
          color: white;
          span { display: block; font-size: 1.3rem; font-weight: 700; }
          small { font-size: 0.7rem; opacity: 0.8; }
        }
      }

      .meal-content {
        padding: 16px;

        .meal-macros {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;

          .macro-pill {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;

            &.protein { background: #e3f2fd; color: #1565c0; }
            &.carbs { background: #fff3e0; color: #e65100; }
            &.fats { background: #fce4ec; color: #c62828; }
          }
        }
      }
    }

    .foods-panel {
      box-shadow: none !important;
      border: 1px solid #eee;
      border-radius: 8px !important;
    }

    .food-list {
      .food-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child { border: none; }

        .food-info {
          .food-name { display: block; font-weight: 500; font-size: 0.9rem; }
          .food-quantity { font-size: 0.8rem; color: #666; }
        }

        .food-macros {
          font-size: 0.85rem;
          color: #4361ee;
          font-weight: 500;
        }
      }
    }

    .tips-card {
      border-radius: 16px !important;

      .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;

        .tip-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background: #f8f9fa;

          mat-icon {
            color: #ffd166;
            flex-shrink: 0;
          }

          h4 { font-size: 0.9rem; margin-bottom: 4px; }
          p { font-size: 0.8rem; color: #666; margin: 0; }
        }
      }
    }

    @media (max-width: 768px) {
      .macro-summary {
        flex-direction: column;
        gap: 24px;
      }

      .meals-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NutritionComponent implements OnInit {
  plan!: NutritionPlan;

  nutritionTips = [
    { icon: 'water_drop', title: 'Stay Hydrated', description: 'Drink at least 3L of water daily. Hydration aids muscle recovery and metabolism.' },
    { icon: 'schedule', title: 'Meal Timing', description: 'Eat protein within 30 min post-workout for optimal muscle protein synthesis.' },
    { icon: 'restaurant', title: 'Portion Control', description: 'Use the plate method: 1/2 vegetables, 1/4 protein, 1/4 carbs.' },
    { icon: 'local_grocery_store', title: 'Whole Foods', description: 'Focus on unprocessed foods. They provide more nutrients per calorie.' }
  ];

  constructor(private nutritionService: NutritionService) {}

  ngOnInit(): void {
    this.plan = this.nutritionService.getMockNutritionPlan();
  }

  getMealIcon(type: string): string {
    const icons: Record<string, string> = {
      'breakfast': 'wb_sunny',
      'lunch': 'light_mode',
      'snack': 'coffee',
      'dinner': 'nights_stay'
    };
    return icons[type] || 'restaurant';
  }
}

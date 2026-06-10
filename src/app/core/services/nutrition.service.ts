import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { NutritionPlan, DailyNutritionLog, MealPlan, FoodItem } from '../models/nutrition.model';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  private apiUrl = `${environment.apiUrl}/nutrition`;

  constructor(private http: HttpClient) {}

  getCurrentPlan(): Observable<NutritionPlan> {
    return this.http.get<NutritionPlan>(`${this.apiUrl}/plan`);
  }

  generateAIPlan(preferences: any): Observable<NutritionPlan> {
    return this.http.post<NutritionPlan>(`${this.apiUrl}/plan/generate`, preferences);
  }

  logMeal(data: any): Observable<DailyNutritionLog> {
    return this.http.post<DailyNutritionLog>(`${this.apiUrl}/log`, data);
  }

  getDailyLog(date: string): Observable<DailyNutritionLog> {
    return this.http.get<DailyNutritionLog>(`${this.apiUrl}/log/${date}`);
  }

  searchFood(query: string): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(`${this.apiUrl}/foods/search`, { params: { query } });
  }

  // Mock data for development
  getMockNutritionPlan(): NutritionPlan {
    return {
      id: '1',
      userId: 'user1',
      dailyCalories: 2200,
      macros: { protein: 165, carbs: 220, fats: 73, fiber: 30 },
      restrictions: [],
      isAIGenerated: true,
      createdAt: new Date(),
      meals: [
        {
          mealType: 'breakfast',
          name: 'Power Breakfast',
          calories: 550,
          macros: { protein: 35, carbs: 60, fats: 18, fiber: 8 },
          time: '07:30',
          foods: [
            { name: 'Oatmeal', quantity: 80, unit: 'g', calories: 300, protein: 10, carbs: 54, fats: 5 },
            { name: 'Banana', quantity: 1, unit: 'medium', calories: 105, protein: 1, carbs: 27, fats: 0 },
            { name: 'Whey Protein', quantity: 30, unit: 'g', calories: 120, protein: 24, carbs: 2, fats: 1 },
            { name: 'Almonds', quantity: 10, unit: 'pieces', calories: 70, protein: 3, carbs: 2, fats: 6 }
          ]
        },
        {
          mealType: 'lunch',
          name: 'Balanced Lunch',
          calories: 650,
          macros: { protein: 45, carbs: 65, fats: 22, fiber: 10 },
          time: '12:30',
          foods: [
            { name: 'Grilled Chicken Breast', quantity: 150, unit: 'g', calories: 250, protein: 40, carbs: 0, fats: 8 },
            { name: 'Brown Rice', quantity: 150, unit: 'g', calories: 180, protein: 4, carbs: 38, fats: 1 },
            { name: 'Mixed Vegetables', quantity: 200, unit: 'g', calories: 100, protein: 4, carbs: 18, fats: 2 },
            { name: 'Olive Oil', quantity: 1, unit: 'tbsp', calories: 120, protein: 0, carbs: 0, fats: 14 }
          ]
        },
        {
          mealType: 'snack',
          name: 'Afternoon Snack',
          calories: 300,
          macros: { protein: 25, carbs: 30, fats: 10, fiber: 4 },
          time: '16:00',
          foods: [
            { name: 'Greek Yogurt', quantity: 200, unit: 'g', calories: 130, protein: 20, carbs: 8, fats: 3 },
            { name: 'Mixed Berries', quantity: 100, unit: 'g', calories: 60, protein: 1, carbs: 14, fats: 0 },
            { name: 'Granola', quantity: 30, unit: 'g', calories: 140, protein: 4, carbs: 20, fats: 5 }
          ]
        },
        {
          mealType: 'dinner',
          name: 'Recovery Dinner',
          calories: 700,
          macros: { protein: 60, carbs: 65, fats: 23, fiber: 8 },
          time: '19:30',
          foods: [
            { name: 'Salmon Fillet', quantity: 180, unit: 'g', calories: 350, protein: 40, carbs: 0, fats: 20 },
            { name: 'Sweet Potato', quantity: 200, unit: 'g', calories: 180, protein: 4, carbs: 42, fats: 0 },
            { name: 'Steamed Broccoli', quantity: 150, unit: 'g', calories: 50, protein: 4, carbs: 10, fats: 0 },
            { name: 'Quinoa', quantity: 100, unit: 'g', calories: 120, protein: 12, carbs: 21, fats: 2 }
          ]
        }
      ]
    };
  }
}

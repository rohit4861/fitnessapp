import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'workout',
    loadChildren: () => import('./features/workout/workout.routes').then(m => m.WORKOUT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'posture',
    loadComponent: () => import('./features/posture-detection/posture-detection.component').then(m => m.PostureDetectionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'nutrition',
    loadComponent: () => import('./features/nutrition/nutrition.component').then(m => m.NutritionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'progress',
    loadComponent: () => import('./features/progress/progress.component').then(m => m.ProgressComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

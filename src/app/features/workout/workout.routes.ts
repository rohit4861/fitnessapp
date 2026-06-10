import { Routes } from '@angular/router';

export const WORKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./workout-list/workout-list.component').then(m => m.WorkoutListComponent)
  },
  {
    path: 'plan',
    loadComponent: () => import('./workout-plan/workout-plan.component').then(m => m.WorkoutPlanComponent)
  },
  {
    path: 'session/:id',
    loadComponent: () => import('./workout-session/workout-session.component').then(m => m.WorkoutSessionComponent)
  }
];

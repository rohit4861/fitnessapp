import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <!-- Sidebar -->
      <mat-sidenav #sidenav mode="side" opened class="sidebar">
        <div class="sidebar-header">
          <mat-icon class="logo-icon">fitness_center</mat-icon>
          <span class="app-name">AI Fitness Coach</span>
        </div>

        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link"
             matTooltip="Your fitness overview" matTooltipPosition="right">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
            <span matListItemLine class="nav-hint">Overview & Stats</span>
          </a>
          <a mat-list-item routerLink="/workout" routerLinkActive="active-link"
             matTooltip="Browse & start workouts" matTooltipPosition="right">
            <mat-icon matListItemIcon>fitness_center</mat-icon>
            <span matListItemTitle>Workouts</span>
            <span matListItemLine class="nav-hint">Plans & Exercises</span>
          </a>
          <a mat-list-item routerLink="/posture" routerLinkActive="active-link"
             matTooltip="Check your form with AI" matTooltipPosition="right">
            <mat-icon matListItemIcon>videocam</mat-icon>
            <span matListItemTitle>Posture AI</span>
            <span matListItemLine class="nav-hint">Form Analysis</span>
          </a>
          <a mat-list-item routerLink="/nutrition" routerLinkActive="active-link"
             matTooltip="Meal plans & calorie tracking" matTooltipPosition="right">
            <mat-icon matListItemIcon>restaurant</mat-icon>
            <span matListItemTitle>Nutrition</span>
            <span matListItemLine class="nav-hint">Meals & Diet</span>
          </a>
          <a mat-list-item routerLink="/progress" routerLinkActive="active-link"
             matTooltip="Track your fitness journey" matTooltipPosition="right">
            <mat-icon matListItemIcon>trending_up</mat-icon>
            <span matListItemTitle>Progress</span>
            <span matListItemLine class="nav-hint">Charts & History</span>
          </a>
          <a mat-list-item routerLink="/profile" routerLinkActive="active-link"
             matTooltip="Your profile settings" matTooltipPosition="right">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>Profile</span>
            <span matListItemLine class="nav-hint">Settings & Goals</span>
          </a>
        </mat-nav-list>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="user-details">
              <span class="user-name">{{authService.user()?.firstName || 'User'}}</span>
              <span class="user-level">{{authService.user()?.fitnessLevel || 'Getting Started'}}</span>
            </div>
          </div>
          <div class="motivation-text">Keep pushing! You're doing great 🔥</div>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="main-content">
        <!-- Top Bar -->
        <mat-toolbar class="top-bar">
          <button mat-icon-button (click)="sidenav.toggle()" class="menu-btn">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="spacer"></span>

          <button mat-icon-button matBadge="3" matBadgeColor="accent" matBadgeSize="small">
            <mat-icon>notifications</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item routerLink="/progress">
              <mat-icon>bar_chart</mat-icon>
              <span>My Progress</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="authService.logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Page Content -->
        <div class="page-content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
    }

    .sidebar {
      width: 260px;
      background: #1a1a2e;
      border: none;

      .sidebar-header {
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .logo-icon {
          color: #4361ee;
          font-size: 32px;
          width: 32px;
          height: 32px;
        }

        .app-name {
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
        }
      }

      .nav-list {
        padding: 16px 12px;

        a {
          border-radius: 10px;
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.7);
          height: 56px;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(67, 97, 238, 0.1);
            color: white;
            transform: translateX(4px);
          }

          &.active-link {
            background: rgba(67, 97, 238, 0.2);
            color: #4361ee;

            mat-icon {
              color: #4361ee;
            }
          }

          mat-icon {
            color: rgba(255, 255, 255, 0.5);
            margin-right: 12px;
          }

          .nav-hint {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.4);
          }
        }
      }

      .sidebar-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(67, 97, 238, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;

            mat-icon {
              color: #4361ee;
              font-size: 20px;
              width: 20px;
              height: 20px;
            }
          }

          .user-details {
            .user-name {
              display: block;
              color: white;
              font-size: 0.9rem;
              font-weight: 500;
            }
            .user-level {
              font-size: 0.75rem;
              color: rgba(255, 255, 255, 0.5);
              text-transform: capitalize;
            }
          }
        }

        .motivation-text {
          margin-top: 12px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          padding: 8px;
          background: rgba(67, 97, 238, 0.1);
          border-radius: 8px;
        }
      }
    }

    .main-content {
      background: #f5f5fa;
    }

    .top-bar {
      background: white;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      height: 60px;
      position: sticky;
      top: 0;
      z-index: 100;

      .menu-btn {
        display: none;
      }

      .spacer {
        flex: 1;
      }
    }

    .page-content {
      min-height: calc(100vh - 60px);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 240px;
      }

      .top-bar .menu-btn {
        display: block;
      }
    }
  `]
})
export class MainLayoutComponent {
  constructor(public authService: AuthService) {}
}

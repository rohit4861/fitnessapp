import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { PostureService } from '../../core/services/posture.service';
import { Keypoint, PostureFeedback } from '../../core/models/posture.model';

@Component({
  selector: 'app-posture-detection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="posture-page fade-in">
      <div class="page-header">
        <div>
          <h1><mat-icon>videocam</mat-icon> AI Posture Detection</h1>
          <p>Real-time exercise form analysis using computer vision</p>
        </div>
      </div>

      <!-- Step-by-step instructions for new users -->
      <div class="how-to-use" *ngIf="!isCameraActive">
        <h2>How to Use</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Select Exercise</h4>
              <p>Choose the exercise you want to practice from the dropdown below</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Start Camera</h4>
              <p>Allow camera access — position yourself 6-8 feet away so your full body is visible</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Begin Exercise</h4>
              <p>Click "Start Exercise" and the AI will track your form and count reps automatically</p>
            </div>
          </div>
        </div>
      </div>

      <div class="posture-content">
        <!-- Camera & Canvas Section -->
        <div class="camera-section">
          <mat-card class="camera-card">
            <div class="camera-container">
              <video #videoElement autoplay playsinline [hidden]="!isCameraActive"></video>
              <canvas #canvasElement [hidden]="!isCameraActive"></canvas>
              <div class="camera-placeholder" *ngIf="!isCameraActive">
                <div class="placeholder-content">
                  <mat-icon>person_outline</mat-icon>
                  <h3>Camera Preview</h3>
                  <p>Your camera feed will appear here</p>
                  <div class="permission-note">
                    <mat-icon>lock</mat-icon>
                    <span>Camera access required — your video stays on your device only</span>
                  </div>
                </div>
              </div>

              <!-- Position Guide Overlay -->
              <div class="position-guide" *ngIf="isCameraActive && !isExercising">
                <div class="body-outline"></div>
                <p class="guide-text">Position your full body inside the frame</p>
              </div>

              <!-- Overlay for feedback -->
              <div class="feedback-overlay" *ngIf="isCameraActive && isExercising">
                <div class="form-score-display" [class.good]="postureService.score() >= 70"
                     [class.warning]="postureService.score() >= 40 && postureService.score() < 70"
                     [class.poor]="postureService.score() < 40">
                  <span class="score-value">{{postureService.score()}}</span>
                  <span class="score-label">Form Score</span>
                </div>
                <div class="rep-counter">
                  <span class="rep-value">{{postureService.reps()}}</span>
                  <span class="rep-label">Reps</span>
                </div>
              </div>

              <!-- Status indicator -->
              <div class="status-indicator" *ngIf="isCameraActive">
                <span class="status-dot" [class.recording]="isExercising"></span>
                <span>{{isExercising ? 'Analyzing...' : 'Ready'}}</span>
              </div>
            </div>

            <div class="camera-controls">
              <mat-form-field appearance="outline" class="exercise-select">
                <mat-label>Select Exercise</mat-label>
                <mat-select [(value)]="selectedExercise">
                  <mat-option *ngFor="let ex of availableExercises" [value]="ex">
                    {{formatExerciseName(ex)}}
                  </mat-option>
                </mat-select>
                <mat-hint>Pick the exercise you'll perform</mat-hint>
              </mat-form-field>

              <div class="control-buttons">
                <button mat-raised-button color="primary" (click)="startCamera()" *ngIf="!isCameraActive"
                        class="action-btn">
                  <mat-icon>videocam</mat-icon> Start Camera
                </button>
                <button mat-raised-button color="warn" (click)="stopCamera()" *ngIf="isCameraActive && !isExercising"
                        class="action-btn">
                  <mat-icon>videocam_off</mat-icon> Stop Camera
                </button>
                <button mat-raised-button color="accent" (click)="startExercise()" *ngIf="isCameraActive && !isExercising"
                        class="action-btn start-exercise-btn">
                  <mat-icon>play_arrow</mat-icon> Start Exercise
                </button>
                <button mat-raised-button color="warn" (click)="stopExercise()" *ngIf="isExercising"
                        class="action-btn">
                  <mat-icon>stop</mat-icon> Stop Exercise
                </button>
                <button mat-stroked-button (click)="postureService.resetCounters()" *ngIf="isExercising">
                  <mat-icon>restart_alt</mat-icon> Reset
                </button>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Feedback Panel -->
        <div class="feedback-section">
          <!-- Real-time Feedback -->
          <mat-card class="feedback-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>psychology</mat-icon> AI Form Feedback
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="feedback-list" *ngIf="currentFeedback.length > 0; else noFeedback">
                <div class="feedback-item" *ngFor="let fb of currentFeedback"
                     [ngClass]="'severity-' + fb.severity">
                  <mat-icon>{{getFeedbackIcon(fb.type)}}</mat-icon>
                  <div class="feedback-text">
                    <span class="feedback-message">{{fb.message}}</span>
                    <span class="feedback-body-part">{{fb.bodyPart}}</span>
                  </div>
                </div>
              </div>
              <ng-template #noFeedback>
                <div class="no-feedback">
                  <mat-icon>{{isExercising ? 'check_circle' : 'info'}}</mat-icon>
                  <p *ngIf="isExercising">Great form! Keep it up! 💪</p>
                  <p *ngIf="!isExercising && isCameraActive">Click "Start Exercise" when you're ready</p>
                  <p *ngIf="!isCameraActive">Start camera to receive AI form feedback</p>
                </div>
              </ng-template>
            </mat-card-content>
          </mat-card>

          <!-- Stats Card -->
          <mat-card class="stats-card">
            <mat-card-header>
              <mat-card-title>Session Stats</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="session-stats">
                <div class="stat-row">
                  <span class="stat-label">Exercise</span>
                  <span class="stat-value">{{formatExerciseName(selectedExercise)}}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Repetitions</span>
                  <span class="stat-value highlight">{{postureService.reps()}}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Form Score</span>
                  <span class="stat-value" [class.score-good]="postureService.score() >= 70"
                        [class.score-warn]="postureService.score() >= 40 && postureService.score() < 70"
                        [class.score-bad]="postureService.score() < 40">{{postureService.score()}}%</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Duration</span>
                  <span class="stat-value">{{formatTime(exerciseDuration)}}</span>
                </div>
              </div>

              <div class="form-score-bar">
                <label>Overall Form Quality</label>
                <mat-progress-bar mode="determinate" [value]="postureService.score()"
                  [color]="postureService.score() >= 70 ? 'primary' : postureService.score() >= 40 ? 'accent' : 'warn'">
                </mat-progress-bar>
                <div class="score-legend">
                  <span class="legend-good">70-100: Great</span>
                  <span class="legend-warn">40-69: Needs Work</span>
                  <span class="legend-bad">0-39: Poor Form</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Exercise Guide -->
          <mat-card class="guide-card">
            <mat-card-header>
              <mat-card-title><mat-icon>school</mat-icon> Exercise Guide</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="guide-content">
                <h4>{{formatExerciseName(selectedExercise)}} — Key Points</h4>
                <div class="guide-tips">
                  <div class="tip" *ngFor="let tip of getExerciseTips(); let i = index">
                    <span class="tip-number">{{i + 1}}</span>
                    <span>{{tip}}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .posture-page {
      padding: 24px;
      max-width: 1400px;
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

    /* How to use section */
    .how-to-use {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

      h2 {
        font-size: 1.2rem;
        margin-bottom: 16px;
        color: #333;
      }

      .steps {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;

        .step {
          display: flex;
          gap: 12px;
          align-items: flex-start;

          .step-number {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #4361ee, #7209b7);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            flex-shrink: 0;
          }

          .step-content {
            h4 {
              font-size: 0.95rem;
              margin-bottom: 4px;
              color: #333;
            }
            p {
              font-size: 0.85rem;
              color: #666;
              line-height: 1.4;
            }
          }
        }
      }
    }

    .posture-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .camera-card {
      border-radius: 16px !important;
      overflow: hidden;

      .camera-container {
        position: relative;
        background: #1a1a2e;
        min-height: 480px;
        display: flex;
        align-items: center;
        justify-content: center;

        video, canvas {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
        }

        .camera-placeholder {
          text-align: center;
          color: #888;

          .placeholder-content {
            mat-icon {
              font-size: 80px;
              width: 80px;
              height: 80px;
              color: rgba(255, 255, 255, 0.2);
            }

            h3 {
              color: rgba(255, 255, 255, 0.7);
              margin: 12px 0 4px;
            }

            p {
              color: rgba(255, 255, 255, 0.5);
              font-size: 0.9rem;
            }

            .permission-note {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              margin-top: 16px;
              padding: 8px 16px;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 8px;
              font-size: 0.8rem;
              color: rgba(255, 255, 255, 0.4);

              mat-icon {
                font-size: 14px;
                width: 14px;
                height: 14px;
                color: rgba(255, 255, 255, 0.4);
              }
            }
          }
        }

        .position-guide {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          pointer-events: none;

          .body-outline {
            width: 150px;
            height: 350px;
            border: 2px dashed rgba(67, 97, 238, 0.6);
            border-radius: 75px 75px 40px 40px;
            animation: pulse-outline 2s ease-in-out infinite;
          }

          .guide-text {
            color: white;
            margin-top: 12px;
            font-size: 0.85rem;
            background: rgba(0, 0, 0, 0.6);
            padding: 6px 14px;
            border-radius: 20px;
          }
        }

        .feedback-overlay {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;

          .form-score-display, .rep-counter {
            background: rgba(0, 0, 0, 0.75);
            padding: 12px 20px;
            border-radius: 12px;
            text-align: center;
            backdrop-filter: blur(8px);

            span {
              display: block;
              color: white;
            }

            .score-value, .rep-value {
              font-size: 2rem;
              font-weight: 700;
            }

            .score-label, .rep-label {
              font-size: 0.75rem;
              opacity: 0.8;
            }
          }

          .form-score-display {
            &.good .score-value { color: #06d6a0; }
            &.warning .score-value { color: #ffd166; }
            &.poor .score-value { color: #ef476f; }
          }
        }

        .status-indicator {
          position: absolute;
          bottom: 16px;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.7);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: white;

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #06d6a0;

            &.recording {
              background: #ef476f;
              animation: blink 1s ease-in-out infinite;
            }
          }
        }
      }

      .camera-controls {
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        .exercise-select {
          min-width: 200px;
          margin-bottom: -20px;
        }

        .control-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          .action-btn {
            height: 40px;
          }

          .start-exercise-btn {
            animation: gentle-pulse 2s ease-in-out infinite;
          }
        }
      }
    }

    .feedback-card, .stats-card, .guide-card {
      border-radius: 16px !important;
      margin-bottom: 16px;
    }

    .feedback-list {
      .feedback-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: all 0.3s ease;

        &.severity-high {
          background: #fce4ec;
          border-left: 3px solid #c62828;
          mat-icon { color: #c62828; }
        }

        &.severity-medium {
          background: #fff3e0;
          border-left: 3px solid #e65100;
          mat-icon { color: #e65100; }
        }

        &.severity-low {
          background: #e8f5e9;
          border-left: 3px solid #2e7d32;
          mat-icon { color: #2e7d32; }
        }

        .feedback-text {
          .feedback-message {
            display: block;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .feedback-body-part {
            font-size: 0.8rem;
            color: #666;
            text-transform: capitalize;
          }
        }
      }
    }

    .no-feedback {
      text-align: center;
      padding: 24px;
      color: #666;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #06d6a0;
      }
    }

    .session-stats {
      .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;

        .stat-label { color: #666; }
        .stat-value {
          font-weight: 600;
          &.highlight { color: #4361ee; font-size: 1.1rem; }
          &.score-good { color: #2e7d32; }
          &.score-warn { color: #e65100; }
          &.score-bad { color: #c62828; }
        }
      }
    }

    .form-score-bar {
      margin-top: 16px;

      label {
        display: block;
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 8px;
      }

      .score-legend {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 0.7rem;

        .legend-good { color: #2e7d32; }
        .legend-warn { color: #e65100; }
        .legend-bad { color: #c62828; }
      }
    }

    .guide-content {
      h4 {
        margin-bottom: 12px;
        color: #333;
      }

      .guide-tips {
        .tip {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 10px;

          .tip-number {
            width: 22px;
            height: 22px;
            background: #4361ee;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: 700;
            flex-shrink: 0;
          }

          span {
            font-size: 0.9rem;
            color: #555;
            line-height: 1.4;
          }
        }
      }
    }

    @keyframes pulse-outline {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes gentle-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(156, 39, 176, 0); }
    }

    @media (max-width: 1024px) {
      .posture-content {
        grid-template-columns: 1fr;
      }

      .how-to-use .steps {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PostureDetectionComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  isCameraActive = false;
  isExercising = false;
  selectedExercise = 'squat';
  availableExercises: string[] = [];
  currentFeedback: PostureFeedback[] = [];
  exerciseDuration = 0;

  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private durationInterval: any;
  private poseDetector: any = null;

  constructor(
    public postureService: PostureService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.availableExercises = this.postureService.getAvailableExercises();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.stopExercise();
  }

  async startCamera(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.isCameraActive = true;
      await this.initPoseDetection();
      this.snackBar.open('Camera ready! Select an exercise and click "Start Exercise" to begin.', 'Got it', { duration: 4000 });
    } catch (error) {
      this.snackBar.open('Camera access denied. Please allow camera permission in your browser settings.', 'Close', { duration: 5000 });
      console.error('Camera error:', error);
    }
  }

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.isCameraActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  startExercise(): void {
    if (!this.selectedExercise) {
      this.snackBar.open('Please select an exercise first', 'Close', { duration: 3000 });
      return;
    }
    this.isExercising = true;
    this.exerciseDuration = 0;
    this.postureService.startExercise();
    this.startDetectionLoop();
    this.durationInterval = setInterval(() => {
      this.exerciseDuration++;
    }, 1000);
    this.snackBar.open(`Started: ${this.formatExerciseName(this.selectedExercise)}. Position yourself in frame.`, 'Close', { duration: 3000 });
  }

  stopExercise(): void {
    this.isExercising = false;
    const result = this.postureService.stopExercise();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
    }
    this.currentFeedback = [];
  }

  private async initPoseDetection(): Promise<void> {
    // In production, initialize TensorFlow.js and MediaPipe Pose here
    // For demo, we'll simulate pose detection
    console.log('Pose detection model initialized (simulated)');
  }

  private startDetectionLoop(): void {
    let lastTime = 0;
    const FPS_INTERVAL = 100; // ~10fps for detection

    const detect = (timestamp: number) => {
      if (!this.isExercising) return;

      if (timestamp - lastTime >= FPS_INTERVAL) {
        lastTime = timestamp;

        // Simulate pose detection with keypoints
        const mockKeypoints = this.generateMockKeypoints();
        this.currentFeedback = this.postureService.analyzeFrame(mockKeypoints, this.selectedExercise);

        // Draw skeleton on canvas
        this.drawSkeleton(mockKeypoints);
      }

      this.animationFrameId = requestAnimationFrame(detect);
    };

    this.animationFrameId = requestAnimationFrame(detect);
  }

  private generateMockKeypoints(): Keypoint[] {
    // Simulate realistic movement based on selected exercise
    const time = Date.now() / 1000;
    const cyclePos = Math.sin(time * 1.2); // Smooth up/down motion cycle
    const normalizedCycle = (cyclePos + 1) / 2; // 0 to 1 range

    // Base body position (centered in 640x480 frame)
    const centerX = 320;
    const shoulderWidth = 80;

    let keypoints: Keypoint[];

    if (this.selectedExercise === 'squat' || this.selectedExercise === 'lunge') {
      // Squat/Lunge: knees bend, hips drop
      const hipDrop = normalizedCycle * 60;
      const kneeBend = normalizedCycle * 50;
      keypoints = [
        { name: 'left_shoulder', x: centerX - shoulderWidth/2, y: 130 + hipDrop * 0.3, confidence: 0.95 },
        { name: 'right_shoulder', x: centerX + shoulderWidth/2, y: 130 + hipDrop * 0.3, confidence: 0.95 },
        { name: 'left_elbow', x: centerX - shoulderWidth/2 - 20, y: 200 + hipDrop * 0.3, confidence: 0.9 },
        { name: 'right_elbow', x: centerX + shoulderWidth/2 + 20, y: 200 + hipDrop * 0.3, confidence: 0.9 },
        { name: 'left_wrist', x: centerX - shoulderWidth/2 - 10, y: 260 + hipDrop * 0.2, confidence: 0.88 },
        { name: 'right_wrist', x: centerX + shoulderWidth/2 + 10, y: 260 + hipDrop * 0.2, confidence: 0.88 },
        { name: 'left_hip', x: centerX - 40, y: 270 + hipDrop, confidence: 0.92 },
        { name: 'right_hip', x: centerX + 40, y: 270 + hipDrop, confidence: 0.92 },
        { name: 'left_knee', x: centerX - 50 - kneeBend * 0.3, y: 350 + hipDrop * 0.5, confidence: 0.9 },
        { name: 'right_knee', x: centerX + 50 + kneeBend * 0.3, y: 350 + hipDrop * 0.5, confidence: 0.9 },
        { name: 'left_ankle', x: centerX - 50, y: 440, confidence: 0.88 },
        { name: 'right_ankle', x: centerX + 50, y: 440, confidence: 0.88 }
      ];
    } else if (this.selectedExercise === 'pushup') {
      // Pushup: elbows bend
      const elbowBend = normalizedCycle * 70;
      keypoints = [
        { name: 'left_shoulder', x: centerX - 60, y: 200 + elbowBend * 0.5, confidence: 0.95 },
        { name: 'right_shoulder', x: centerX + 60, y: 200 + elbowBend * 0.5, confidence: 0.95 },
        { name: 'left_elbow', x: centerX - 80, y: 250 + elbowBend, confidence: 0.92 },
        { name: 'right_elbow', x: centerX + 80, y: 250 + elbowBend, confidence: 0.92 },
        { name: 'left_wrist', x: centerX - 70, y: 320, confidence: 0.9 },
        { name: 'right_wrist', x: centerX + 70, y: 320, confidence: 0.9 },
        { name: 'left_hip', x: centerX - 40, y: 300 + elbowBend * 0.3, confidence: 0.88 },
        { name: 'right_hip', x: centerX + 40, y: 300 + elbowBend * 0.3, confidence: 0.88 },
        { name: 'left_knee', x: centerX - 40, y: 380, confidence: 0.85 },
        { name: 'right_knee', x: centerX + 40, y: 380, confidence: 0.85 },
        { name: 'left_ankle', x: centerX - 35, y: 440, confidence: 0.82 },
        { name: 'right_ankle', x: centerX + 35, y: 440, confidence: 0.82 }
      ];
    } else {
      // Bicep curl / Shoulder press: arm movement
      const armBend = normalizedCycle * 80;
      keypoints = [
        { name: 'left_shoulder', x: centerX - shoulderWidth/2, y: 150, confidence: 0.95 },
        { name: 'right_shoulder', x: centerX + shoulderWidth/2, y: 150, confidence: 0.95 },
        { name: 'left_elbow', x: centerX - shoulderWidth/2 - 10, y: 220, confidence: 0.92 },
        { name: 'right_elbow', x: centerX + shoulderWidth/2 + 10, y: 220, confidence: 0.92 },
        { name: 'left_wrist', x: centerX - shoulderWidth/2 - 5, y: 300 - armBend, confidence: 0.9 },
        { name: 'right_wrist', x: centerX + shoulderWidth/2 + 5, y: 300 - armBend, confidence: 0.9 },
        { name: 'left_hip', x: centerX - 40, y: 300, confidence: 0.92 },
        { name: 'right_hip', x: centerX + 40, y: 300, confidence: 0.92 },
        { name: 'left_knee', x: centerX - 40, y: 380, confidence: 0.88 },
        { name: 'right_knee', x: centerX + 40, y: 380, confidence: 0.88 },
        { name: 'left_ankle', x: centerX - 40, y: 450, confidence: 0.85 },
        { name: 'right_ankle', x: centerX + 40, y: 450, confidence: 0.85 }
      ];
    }

    return keypoints;
  }

  private drawSkeleton(keypoints: Keypoint[]): void {
    if (!this.canvasElement) return;

    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw skeleton connections first (behind keypoints)
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle']
    ];

    // Use color based on form score
    const score = this.postureService.score();
    const lineColor = score >= 70 ? '#06d6a0' : score >= 40 ? '#ffd166' : '#ef476f';

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = lineColor;
    ctx.shadowBlur = 6;

    connections.forEach(([start, end]) => {
      const startPoint = keypoints.find(k => k.name === start);
      const endPoint = keypoints.find(k => k.name === end);
      if (startPoint && endPoint && startPoint.confidence > 0.3 && endPoint.confidence > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;

    // Draw keypoints
    keypoints.forEach(kp => {
      if (kp.confidence > 0.3) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 7, 0, 2 * Math.PI);
        ctx.fillStyle = lineColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  formatExerciseName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getFeedbackIcon(type: string): string {
    const icons: Record<string, string> = {
      'correction': 'error_outline',
      'warning': 'warning',
      'praise': 'thumb_up'
    };
    return icons[type] || 'info';
  }

  getExerciseTips(): string[] {
    const tips: Record<string, string[]> = {
      'squat': [
        'Keep your feet shoulder-width apart',
        'Push your hips back as if sitting in a chair',
        'Keep your knees aligned with your toes',
        'Maintain a straight back throughout the movement',
        'Go as low as your mobility allows'
      ],
      'pushup': [
        'Keep your body in a straight line from head to heels',
        'Place hands slightly wider than shoulder-width',
        'Lower your chest to the ground, not your hips',
        'Keep elbows at 45-degree angle',
        'Fully extend arms at the top'
      ],
      'bicep_curl': [
        'Keep elbows close to your body',
        'Only move your forearms, not upper arms',
        'Control the weight on the way down',
        'Full range of motion from extended to fully curled',
        'Avoid swinging or using momentum'
      ],
      'shoulder_press': [
        'Start with weights at shoulder height',
        'Press straight up overhead',
        'Keep core tight and avoid arching back',
        'Lower to just below ear level',
        'Exhale on the press, inhale on the lower'
      ],
      'lunge': [
        'Step forward with a large stride',
        'Lower until both knees are at 90 degrees',
        'Keep front knee behind toes',
        'Maintain upright torso',
        'Push through front heel to stand up'
      ]
    };
    return tips[this.selectedExercise] || ['Select an exercise to see tips'];
  }
}

import { Injectable, signal } from '@angular/core';
import { PostureAnalysis, Keypoint, JointAngle, PostureFeedback, ExerciseDetectionConfig } from '../models/posture.model';

@Injectable({
  providedIn: 'root'
})
export class PostureService {
  private repCount = signal(0);
  private formScore = signal(0);
  private isExercising = signal(false);
  private currentFeedback = signal<PostureFeedback[]>([]);

  readonly reps = this.repCount.asReadonly();
  readonly score = this.formScore.asReadonly();
  readonly exercising = this.isExercising.asReadonly();
  readonly feedback = this.currentFeedback.asReadonly();

  private lastPosition: 'up' | 'down' | 'neutral' = 'neutral';
  private angleHistory: number[] = [];

  // Exercise configurations for posture detection
  private exerciseConfigs: Record<string, ExerciseDetectionConfig> = {
    'squat': {
      exerciseName: 'Squat',
      keypointsRequired: ['left_hip', 'left_knee', 'left_ankle', 'right_hip', 'right_knee', 'right_ankle'],
      angleThresholds: [
        { joint: 'left_knee', upAngle: 170, downAngle: 90, tolerance: 15 },
        { joint: 'right_knee', upAngle: 170, downAngle: 90, tolerance: 15 }
      ],
      repDetection: { startPosition: 'up', endPosition: 'down', minAngle: 80, maxAngle: 170 }
    },
    'pushup': {
      exerciseName: 'Push-up',
      keypointsRequired: ['left_shoulder', 'left_elbow', 'left_wrist', 'right_shoulder', 'right_elbow', 'right_wrist'],
      angleThresholds: [
        { joint: 'left_elbow', upAngle: 170, downAngle: 90, tolerance: 15 },
        { joint: 'right_elbow', upAngle: 170, downAngle: 90, tolerance: 15 }
      ],
      repDetection: { startPosition: 'up', endPosition: 'down', minAngle: 70, maxAngle: 170 }
    },
    'bicep_curl': {
      exerciseName: 'Bicep Curl',
      keypointsRequired: ['left_shoulder', 'left_elbow', 'left_wrist', 'right_shoulder', 'right_elbow', 'right_wrist'],
      angleThresholds: [
        { joint: 'left_elbow', upAngle: 160, downAngle: 40, tolerance: 15 },
        { joint: 'right_elbow', upAngle: 160, downAngle: 40, tolerance: 15 }
      ],
      repDetection: { startPosition: 'down', endPosition: 'up', minAngle: 30, maxAngle: 160 }
    },
    'shoulder_press': {
      exerciseName: 'Shoulder Press',
      keypointsRequired: ['left_shoulder', 'left_elbow', 'left_wrist', 'right_shoulder', 'right_elbow', 'right_wrist'],
      angleThresholds: [
        { joint: 'left_elbow', upAngle: 170, downAngle: 90, tolerance: 15 },
        { joint: 'right_elbow', upAngle: 170, downAngle: 90, tolerance: 15 }
      ],
      repDetection: { startPosition: 'down', endPosition: 'up', minAngle: 80, maxAngle: 170 }
    },
    'lunge': {
      exerciseName: 'Lunge',
      keypointsRequired: ['left_hip', 'left_knee', 'left_ankle', 'right_hip', 'right_knee', 'right_ankle'],
      angleThresholds: [
        { joint: 'left_knee', upAngle: 170, downAngle: 90, tolerance: 15 },
        { joint: 'right_knee', upAngle: 170, downAngle: 90, tolerance: 15 }
      ],
      repDetection: { startPosition: 'up', endPosition: 'down', minAngle: 80, maxAngle: 170 }
    }
  };

  getExerciseConfig(exercise: string): ExerciseDetectionConfig | undefined {
    return this.exerciseConfigs[exercise];
  }

  getAvailableExercises(): string[] {
    return Object.keys(this.exerciseConfigs);
  }

  startExercise(): void {
    this.repCount.set(0);
    this.formScore.set(100);
    this.isExercising.set(true);
    this.currentFeedback.set([]);
    this.lastPosition = 'neutral';
    this.angleHistory = [];
  }

  stopExercise(): PostureAnalysis {
    this.isExercising.set(false);
    return {
      timestamp: new Date(),
      exercise: '',
      keypoints: [],
      angles: [],
      formScore: this.formScore(),
      feedback: this.currentFeedback(),
      repCount: this.repCount(),
      isCorrectForm: this.formScore() >= 70
    };
  }

  calculateAngle(pointA: Keypoint, pointB: Keypoint, pointC: Keypoint): number {
    const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
                    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }

  analyzeFrame(keypoints: Keypoint[], exercise: string): PostureFeedback[] {
    const config = this.exerciseConfigs[exercise];
    if (!config) return [];

    const feedbacks: PostureFeedback[] = [];
    const angles: number[] = [];

    // Calculate joint angles
    for (const threshold of config.angleThresholds) {
      const angle = this.getJointAngle(keypoints, threshold.joint);
      if (angle !== null) {
        angles.push(angle);

        // Check rep counting
        this.detectRep(angle, config);

        // Provide form feedback
        const formFeedback = this.evaluateForm(angle, threshold, exercise);
        if (formFeedback) {
          feedbacks.push(formFeedback);
        }
      }
    }

    // Update form score
    if (feedbacks.length === 0) {
      this.formScore.update(score => Math.min(100, score + 1));
    } else {
      const deduction = feedbacks.filter(f => f.severity === 'high').length * 5 +
                        feedbacks.filter(f => f.severity === 'medium').length * 2;
      this.formScore.update(score => Math.max(0, score - deduction));
    }

    this.currentFeedback.set(feedbacks);
    return feedbacks;
  }

  private getJointAngle(keypoints: Keypoint[], joint: string): number | null {
    const jointMappings: Record<string, [string, string, string]> = {
      'left_elbow': ['left_shoulder', 'left_elbow', 'left_wrist'],
      'right_elbow': ['right_shoulder', 'right_elbow', 'right_wrist'],
      'left_knee': ['left_hip', 'left_knee', 'left_ankle'],
      'right_knee': ['right_hip', 'right_knee', 'right_ankle'],
      'left_shoulder': ['left_elbow', 'left_shoulder', 'left_hip'],
      'right_shoulder': ['right_elbow', 'right_shoulder', 'right_hip'],
      'left_hip': ['left_shoulder', 'left_hip', 'left_knee'],
      'right_hip': ['right_shoulder', 'right_hip', 'right_knee']
    };

    const mapping = jointMappings[joint];
    if (!mapping) return null;

    const [nameA, nameB, nameC] = mapping;
    const pointA = keypoints.find(k => k.name === nameA);
    const pointB = keypoints.find(k => k.name === nameB);
    const pointC = keypoints.find(k => k.name === nameC);

    if (!pointA || !pointB || !pointC) return null;
    if (pointA.confidence < 0.3 || pointB.confidence < 0.3 || pointC.confidence < 0.3) return null;

    return this.calculateAngle(pointA, pointB, pointC);
  }

  private detectRep(angle: number, config: ExerciseDetectionConfig): void {
    const { minAngle, maxAngle } = config.repDetection;
    const threshold = (maxAngle - minAngle) * 0.3;

    if (angle <= minAngle + threshold && this.lastPosition !== 'down') {
      this.lastPosition = 'down';
    } else if (angle >= maxAngle - threshold && this.lastPosition === 'down') {
      this.lastPosition = 'up';
      this.repCount.update(count => count + 1);
    }
  }

  private evaluateForm(angle: number, threshold: any, exercise: string): PostureFeedback | null {
    const { upAngle, downAngle, tolerance, joint } = threshold;

    // Check if the angle is way off from expected range
    if (angle < downAngle - tolerance * 2) {
      return {
        type: 'correction',
        message: `Your ${joint.replace('_', ' ')} is bending too much. Control the movement.`,
        bodyPart: joint,
        severity: 'high'
      };
    }

    if (angle > upAngle + tolerance) {
      return {
        type: 'warning',
        message: `Extend your ${joint.replace('_', ' ')} more for full range of motion.`,
        bodyPart: joint,
        severity: 'medium'
      };
    }

    return null;
  }

  resetCounters(): void {
    this.repCount.set(0);
    this.formScore.set(100);
    this.currentFeedback.set([]);
    this.lastPosition = 'neutral';
  }
}

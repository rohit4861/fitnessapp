export interface PostureAnalysis {
  timestamp: Date;
  exercise: string;
  keypoints: Keypoint[];
  angles: JointAngle[];
  formScore: number; // 0-100
  feedback: PostureFeedback[];
  repCount: number;
  isCorrectForm: boolean;
}

export interface Keypoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

export interface JointAngle {
  joint: string;
  angle: number;
  idealAngleMin: number;
  idealAngleMax: number;
  isWithinRange: boolean;
}

export interface PostureFeedback {
  type: 'correction' | 'warning' | 'praise';
  message: string;
  bodyPart: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ExerciseDetectionConfig {
  exerciseName: string;
  keypointsRequired: string[];
  angleThresholds: {
    joint: string;
    upAngle: number;
    downAngle: number;
    tolerance: number;
  }[];
  repDetection: {
    startPosition: string;
    endPosition: string;
    minAngle: number;
    maxAngle: number;
  };
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@environments/environment';
import { Workout, WorkoutPlan, WorkoutSession, Exercise, WorkoutType } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = `${environment.apiUrl}/workouts`;

  constructor(private http: HttpClient) {}

  getWorkoutPlans(): Observable<WorkoutPlan[]> {
    return this.http.get<WorkoutPlan[]>(`${this.apiUrl}/plans`);
  }

  getActivePlan(): Observable<WorkoutPlan | null> {
    return this.http.get<WorkoutPlan | null>(`${this.apiUrl}/plans/active`);
  }

  generateAIPlan(preferences: any): Observable<WorkoutPlan> {
    return this.http.post<WorkoutPlan>(`${this.apiUrl}/plans/generate`, preferences);
  }

  getWorkouts(type?: WorkoutType): Observable<Workout[]> {
    if (type) {
      return this.http.get<Workout[]>(this.apiUrl, { params: { type } });
    }
    return this.http.get<Workout[]>(this.apiUrl);
  }

  getWorkoutById(id: string): Observable<Workout> {
    return this.http.get<Workout>(`${this.apiUrl}/${id}`);
  }

  startSession(workoutId: string): Observable<WorkoutSession> {
    return this.http.post<WorkoutSession>(`${this.apiUrl}/sessions/start`, { workoutId });
  }

  completeSession(sessionId: string, data: Partial<WorkoutSession>): Observable<WorkoutSession> {
    return this.http.put<WorkoutSession>(`${this.apiUrl}/sessions/${sessionId}/complete`, data);
  }

  getSessionHistory(): Observable<WorkoutSession[]> {
    return this.http.get<WorkoutSession[]>(`${this.apiUrl}/sessions/history`);
  }

  getTodayWorkout(): Observable<Workout | null> {
    return this.http.get<Workout | null>(`${this.apiUrl}/today`);
  }

  getRecommendedWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.apiUrl}/recommended`);
  }

  getExerciseLibrary(muscleGroup?: string): Observable<Exercise[]> {
    if (muscleGroup) {
      return this.http.get<Exercise[]>(`${this.apiUrl}/exercises`, { params: { muscleGroup } });
    }
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercises`);
  }

  // Mock data for development
  getMockWorkouts(): Workout[] {
    return [
      {
        id: '1',
        name: 'Full Body HIIT',
        description: 'High-intensity interval training targeting all muscle groups',
        type: 'hiit',
        difficulty: 'intermediate',
        duration: 30,
        caloriesBurned: 350,
        exercises: this.getMockExercises('hiit'),
        imageUrl: 'assets/images/hiit-workout.jpg',
        isAIGenerated: true,
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Upper Body Strength',
        description: 'Build upper body strength with compound movements',
        type: 'strength',
        difficulty: 'intermediate',
        duration: 45,
        caloriesBurned: 280,
        exercises: this.getMockExercises('strength'),
        imageUrl: 'assets/images/strength-workout.jpg',
        isAIGenerated: true,
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Morning Yoga Flow',
        description: 'Gentle yoga routine for flexibility and mindfulness',
        type: 'yoga',
        difficulty: 'beginner',
        duration: 20,
        caloriesBurned: 120,
        exercises: this.getMockExercises('yoga'),
        imageUrl: 'assets/images/yoga-workout.jpg',
        isAIGenerated: false,
        createdAt: new Date()
      },
      {
        id: '4',
        name: 'Cardio Blast',
        description: 'Heart-pumping cardio session for endurance',
        type: 'cardio',
        difficulty: 'advanced',
        duration: 40,
        caloriesBurned: 450,
        exercises: this.getMockExercises('cardio'),
        imageUrl: 'assets/images/cardio-workout.jpg',
        isAIGenerated: true,
        createdAt: new Date()
      },
      {
        id: '5',
        name: 'Core & Abs Burner',
        description: 'Targeted core workout for a stronger midsection',
        type: 'strength',
        difficulty: 'intermediate',
        duration: 25,
        caloriesBurned: 200,
        exercises: this.getMockExercises('core'),
        imageUrl: 'assets/images/core-workout.jpg',
        isAIGenerated: true,
        createdAt: new Date()
      }
    ];
  }

  private getMockExercises(type: string): Exercise[] {
    const exerciseMap: Record<string, Exercise[]> = {
      hiit: [
        { id: 'e1', name: 'Burpees', description: 'Full body explosive movement that builds strength and cardio endurance', muscleGroup: 'full_body', sets: 3, reps: 12, restTime: 30, instructions: ['Start in standing position with feet shoulder-width apart', 'Drop hands to floor and kick feet back to plank', 'Perform a push-up', 'Jump feet forward and explode upward with arms overhead'], calories: 50, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU' },
        { id: 'e2', name: 'Mountain Climbers', description: 'Dynamic core and cardio exercise that targets abs and hip flexors', muscleGroup: 'core', sets: 3, reps: 20, restTime: 20, instructions: ['Start in high plank position with arms straight', 'Drive right knee toward chest', 'Quickly switch legs, driving left knee forward', 'Keep hips level and core tight throughout'], calories: 35, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
        { id: 'e3', name: 'Jump Squats', description: 'Explosive plyometric exercise targeting quads, glutes, and calves', muscleGroup: 'legs', sets: 3, reps: 15, restTime: 30, instructions: ['Stand with feet shoulder-width apart', 'Lower into a squat position (thighs parallel to floor)', 'Explode upward, jumping as high as possible', 'Land softly on balls of feet and immediately lower into next squat'], calories: 45, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=A-cFYWvaHr0' },
        { id: 'e4', name: 'High Knees', description: 'Cardio exercise that improves coordination and burns calories fast', muscleGroup: 'cardio', sets: 3, reps: 30, restTime: 20, instructions: ['Stand tall with feet hip-width apart', 'Drive right knee up to chest height', 'Quickly switch to left knee', 'Pump arms in sync with legs, maintain fast pace'], calories: 30, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=D0gzFxMbJjk' }
      ],
      strength: [
        { id: 'e5', name: 'Push-ups', description: 'Classic compound exercise targeting chest, triceps, and shoulders', muscleGroup: 'chest', sets: 4, reps: 15, restTime: 60, instructions: ['Place hands slightly wider than shoulder-width on floor', 'Keep body in a straight line from head to heels', 'Lower chest until it nearly touches the floor', 'Push back up to starting position, fully extending arms'], calories: 30, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { id: 'e6', name: 'Dumbbell Rows', description: 'Excellent back exercise for building width and thickness', muscleGroup: 'back', sets: 4, reps: 12, restTime: 60, instructions: ['Place one knee and hand on a bench for support', 'Hold dumbbell in free hand with arm extended', 'Pull the weight up toward your hip, squeezing shoulder blade', 'Lower the weight slowly with control'], calories: 35, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo' },
        { id: 'e7', name: 'Shoulder Press', description: 'Overhead pressing movement for strong, defined shoulders', muscleGroup: 'shoulders', sets: 3, reps: 12, restTime: 60, instructions: ['Hold dumbbells at shoulder height, palms facing forward', 'Press weights straight up overhead until arms are extended', 'Pause briefly at the top', 'Lower weights back to shoulder level with control'], calories: 25, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
        { id: 'e8', name: 'Bicep Curls', description: 'Isolation exercise for building arm size and strength', muscleGroup: 'biceps', sets: 3, reps: 12, restTime: 45, instructions: ['Stand with dumbbells at sides, palms facing forward', 'Curl weights up by bending elbows, keeping upper arms stationary', 'Squeeze biceps at the top', 'Lower slowly to starting position (3 seconds down)'], calories: 20, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' }
      ],
      yoga: [
        { id: 'e9', name: 'Sun Salutation', description: 'A flowing sequence of poses that warms up the entire body', muscleGroup: 'full_body', sets: 1, reps: 5, duration: 120, restTime: 15, instructions: ['Begin in Mountain Pose, hands at heart center', 'Inhale and reach arms overhead', 'Exhale, fold forward touching toes', 'Step back to plank, lower to floor, then rise to Cobra', 'Push back to Downward Dog, then step forward and rise'], calories: 25, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=73sjOu0g58M' },
        { id: 'e10', name: 'Warrior II Pose', description: 'Powerful standing pose building leg strength and focus', muscleGroup: 'legs', sets: 1, reps: 1, duration: 60, restTime: 10, instructions: ['Step feet wide apart (about 4 feet)', 'Turn right foot out 90 degrees', 'Bend right knee over ankle', 'Extend arms parallel to floor, gaze over front hand', 'Hold for 30-60 seconds each side'], calories: 15, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=QMr0JqKBmgE' },
        { id: 'e11', name: 'Downward Dog', description: 'Foundational pose that stretches hamstrings, calves, and shoulders', muscleGroup: 'full_body', sets: 1, reps: 1, duration: 45, restTime: 10, instructions: ['Start on hands and knees', 'Tuck toes and lift hips high toward ceiling', 'Press hands firmly into mat, fingers spread wide', 'Create inverted V shape with body', 'Pedal feet to stretch calves'], calories: 10, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=EC7RGJ975iM' }
      ],
      cardio: [
        { id: 'e12', name: 'Running in Place', description: 'Simple but effective cardio that elevates heart rate quickly', muscleGroup: 'cardio', sets: 3, reps: 1, duration: 120, restTime: 30, instructions: ['Stand tall with good posture', 'Begin jogging in place, lifting knees to hip height', 'Pump arms naturally as if sprinting', 'Gradually increase speed for more intensity'], calories: 60, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=ZijVfOlHlKI' },
        { id: 'e13', name: 'Jumping Jacks', description: 'Classic cardio exercise that works the entire body', muscleGroup: 'full_body', sets: 4, reps: 30, restTime: 20, instructions: ['Stand with feet together and arms at sides', 'Jump feet out wide while raising arms overhead', 'Jump feet back together while lowering arms', 'Maintain a steady rhythm and land softly'], calories: 40, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8' },
        { id: 'e14', name: 'Box Jumps', description: 'Plyometric exercise building explosive power and athleticism', muscleGroup: 'legs', sets: 3, reps: 10, restTime: 45, instructions: ['Stand facing a sturdy box or platform', 'Bend knees and swing arms back for momentum', 'Jump explosively, landing softly on top of the box', 'Stand fully upright, then step back down carefully'], calories: 50, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=NBY9-kTuHEk' }
      ],
      core: [
        { id: 'e15', name: 'Plank Hold', description: 'Isometric core exercise that strengthens the entire midsection', muscleGroup: 'core', sets: 3, reps: 1, duration: 60, restTime: 30, instructions: ['Start in forearm plank with elbows under shoulders', 'Keep body in a perfectly straight line', 'Engage abs by pulling belly button toward spine', 'Breathe steadily and hold position without sagging hips'], calories: 20, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
        { id: 'e16', name: 'Bicycle Crunches', description: 'Dynamic exercise targeting obliques and entire abdominal wall', muscleGroup: 'core', sets: 3, reps: 20, restTime: 30, instructions: ['Lie on back with hands behind head', 'Lift shoulders off the ground', 'Bring right elbow toward left knee while extending right leg', 'Alternate sides in a pedaling motion with control'], calories: 25, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8' },
        { id: 'e17', name: 'Leg Raises', description: 'Effective lower abs exercise for a flat, strong midsection', muscleGroup: 'core', sets: 3, reps: 15, restTime: 30, instructions: ['Lie flat on back with hands under hips for support', 'Keep legs straight and together', 'Raise legs to 90 degrees using only your abs', 'Lower legs slowly (3-4 seconds) without touching the floor'], calories: 20, imageUrl: '', videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI' }
      ]
    };
    return exerciseMap[type] || exerciseMap['hiit'];
  }
}

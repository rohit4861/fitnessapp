# Cloud-Based AI Personal Fitness Coach
## Personalized Workout and Health Monitoring System

### Project Overview
A comprehensive cloud-based AI fitness coaching platform built with Angular 17 and Node.js that provides personalized workout plans, real-time posture detection using computer vision, intelligent nutrition planning, and health monitoring with AI-driven recommendations.

---

### Features

#### 1. **AI-Powered Workout Planning**
- Personalized workout generation based on user profile (age, BMI, fitness level, goals)
- Dynamic difficulty adjustment using machine learning
- Progressive overload tracking
- Exercise library with detailed instructions

#### 2. **Computer Vision Posture Detection**
- Real-time exercise form analysis using TensorFlow.js & MediaPipe
- Joint angle calculation and validation
- Automatic rep counting
- Form score (0-100) with corrective feedback
- Supported exercises: Squats, Push-ups, Bicep Curls, Shoulder Press, Lunges

#### 3. **Smart Nutrition Planning**
- AI-generated meal plans based on fitness goals and TDEE calculation
- Macro nutrient optimization (Protein, Carbs, Fats, Fiber)
- Food database with calorie tracking
- Meal logging and daily intake monitoring

#### 4. **Health Monitoring Dashboard**
- Steps, heart rate, calories, sleep tracking
- Real-time health metrics visualization
- BMI calculation and tracking
- Water intake monitoring

#### 5. **Progress Analytics**
- Weight trend analysis with charts
- Workout frequency tracking
- Calorie balance visualization
- Strength progress monitoring
- AI-powered progress insights

#### 6. **AI Recommendations Engine**
- Personalized fitness advice based on user data
- Recovery recommendations
- Nutrition optimization tips
- Activity level suggestions

---

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17 (Standalone Components) |
| UI Framework | Angular Material |
| Charts | Chart.js + ng2-charts |
| Computer Vision | TensorFlow.js, MediaPipe Pose |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Security | Helmet, CORS, Rate Limiting, bcrypt |
| AI/ML | TensorFlow.js (client-side), Custom algorithms (server-side) |

---

### Project Structure

```
ai-fitness-coach/
├── src/                          # Angular Frontend
│   ├── app/
│   │   ├── core/                 # Core services, models, guards
│   │   │   ├── models/           # TypeScript interfaces
│   │   │   ├── services/         # Auth, Workout, Health, AI, Posture services
│   │   │   ├── guards/           # Route guards
│   │   │   └── interceptors/     # HTTP interceptors
│   │   ├── features/             # Feature modules
│   │   │   ├── auth/             # Login & Registration
│   │   │   ├── dashboard/        # Main dashboard
│   │   │   ├── workout/          # Workout management
│   │   │   ├── posture-detection/# CV-based posture analysis
│   │   │   ├── nutrition/        # Diet & meal planning
│   │   │   ├── progress/         # Analytics & tracking
│   │   │   └── profile/          # User profile management
│   │   └── layouts/              # App layout components
│   ├── environments/             # Environment configs
│   └── styles.scss               # Global styles
├── server/                       # Node.js Backend
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # Express routes
│   ├── middleware/               # Auth middleware
│   └── server.js                 # Express app
├── angular.json                  # Angular CLI config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

### Installation & Setup

#### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Angular CLI (`npm install -g @angular/cli`)

#### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

#### 2. Configure Environment

```bash
# Copy environment file
cp server/.env.example server/.env

# Edit .env with your MongoDB URI and JWT secret
```

#### 3. Run the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Frontend (http://localhost:4200)
npm start

# Backend (http://localhost:3000)
npm run server
```

---

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/today` | Get today's workout |
| POST | `/api/workouts/plans/generate` | AI generate workout plan |
| POST | `/api/workouts/sessions/start` | Start workout session |
| GET | `/api/health/today` | Get today's metrics |
| GET | `/api/health/progress` | Get progress data |
| GET | `/api/health/recommendations` | AI recommendations |
| GET | `/api/nutrition/plan` | Get nutrition plan |
| POST | `/api/nutrition/plan/generate` | AI nutrition plan |
| POST | `/api/ai/workout-plan` | Generate AI workout |
| GET | `/api/ai/recommendations/:id` | Personalized recommendations |

---

### AI/ML Algorithms Used

1. **BMI Calculation**: Standard BMI formula with categorization
2. **TDEE Calculator**: Mifflin-St Jeor Equation with activity multipliers
3. **Heart Rate Zones**: Karvonen formula (220 - age)
4. **Posture Detection**: MediaPipe Pose with custom angle analysis
5. **Rep Counting**: State machine based on joint angle thresholds
6. **Recommendation Engine**: Rule-based + user data analysis
7. **Difficulty Adjustment**: Feedback-driven progressive overload

---

### Security Features
- JWT-based authentication with secure token handling
- Password hashing with bcrypt (12 salt rounds)
- HTTP security headers via Helmet
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- Route guards for protected pages

---

### Screenshots (Features)

1. **Dashboard** - Health metrics overview, AI recommendations, workout preview
2. **Workout Planner** - AI-generated plans with customization
3. **Posture Detection** - Real-time camera-based form analysis
4. **Nutrition** - Meal plans with macro tracking
5. **Progress** - Charts and analytics
6. **Profile** - Personal info and heart rate zones

---

### Future Enhancements
- Wearable device integration (Fitbit, Apple Watch)
- Social features (challenges, leaderboards)
- Video exercise library
- Advanced ML model for progressive overload optimization
- Voice-guided workouts
- Multi-language support

---

### Team
- **Project Title**: Cloud-Based AI Personal Fitness Coach for Personalized Workout and Health Monitoring
- **Technology**: Angular 17, Node.js, MongoDB, TensorFlow.js, Chart.js
- **Type**: Major Project (Full-Stack AI Application)

---

### License
This project is developed for academic purposes.

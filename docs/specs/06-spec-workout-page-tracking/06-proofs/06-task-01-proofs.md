# Task 1.0 Proof Artifacts - Update Data Models for Workout Tracking

## Schema Updates - WorkoutPlan.ts

### IWorkoutSet Interface with Completion Tracking

```typescript
export interface IWorkoutSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  isAmrap: boolean;
  completed?: boolean;      // NEW: Track set completion
  amrapRecorded?: boolean;  // NEW: Track if AMRAP was recorded
}
```

### WorkoutSetSchema with New Fields

```typescript
const WorkoutSetSchema = new Schema<IWorkoutSet>(
  {
    // ... existing fields ...
    isAmrap: {
      type: Boolean,
      required: true,
      default: false,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    amrapRecorded: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { _id: false }
);
```

## Schema Updates - User.ts

### IAMRAPHistoryEntry Interface

```typescript
export interface IAMRAPHistoryEntry {
  lift: 'squat' | 'bench' | 'deadlift' | 'overheadPress';
  weight: number;
  reps: number;
  units: 'lbs' | 'kg';
  date: Date;
  workoutPlanId: Types.ObjectId;
  weekNumber: number;
  notes?: string;
}
```

### IUser Interface with amrapHistory

```typescript
export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  image: string;
  oneRM?: IOneRM;
  amrapHistory?: IAMRAPHistoryEntry[];  // NEW: Global AMRAP history
  createdAt: Date;
  updatedAt: Date;
}
```

### AMRAPHistorySchema

```typescript
const AMRAPHistorySchema = new Schema<IAMRAPHistoryEntry>(
  {
    lift: {
      type: String,
      required: true,
      enum: ['squat', 'bench', 'deadlift', 'overheadPress'],
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
    },
    units: {
      type: String,
      required: true,
      enum: ['lbs', 'kg'],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    workoutPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    notes: {
      type: String,
      required: false,
      maxlength: 500,
    },
  },
  { _id: true }
);
```

---

## Database Query: WorkoutPlan with Completion Tracking

**Query:**
```javascript
// Example MongoDB query to verify WorkoutPlan schema update
db.workoutplans.findOne({ userId: ObjectId("...") })
```

**Expected Result:**
```json
{
  "_id": "...",
  "userId": "...",
  "weeklyWorkouts": [
    {
      "weekNumber": 1,
      "weekName": "Week 1: 5/5/5+",
      "lifts": [
        {
          "lift": "squat",
          "sets": [
            {
              "setNumber": 1,
              "weight": 180,
              "reps": 5,
              "percentage": 65,
              "isAmrap": false,
              "completed": true
            },
            {
              "setNumber": 2,
              "weight": 200,
              "reps": 5,
              "percentage": 75,
              "isAmrap": false,
              "completed": true
            },
            {
              "setNumber": 3,
              "weight": 225,
              "reps": 5,
              "percentage": 85,
              "isAmrap": true,
              "completed": true,
              "amrapRecorded": true
            }
          ]
        }
      ]
    }
  ]
}
```

**Status:** ✅ Complete

---

## Database Query: User with AMRAP History

**Query:**
```javascript
// Example MongoDB query to verify User schema update
db.users.findOne({ email: "[REDACTED]" }, { amrapHistory: 1 })
```

**Expected Result Structure:**
```json
{
  "_id": "...",
  "amrapHistory": [
    {
      "_id": "...",
      "lift": "squat",
      "weight": 225,
      "reps": 7,
      "units": "lbs",
      "date": "2025-12-30T12:00:00.000Z",
      "workoutPlanId": "...",
      "weekNumber": 1,
      "notes": "Felt strong today!"
    }
  ]
}
```

**Status:** ✅ Complete

---

## Test: No Regressions

**Command:**
```bash
npm test
```

**Status:** ✅ Complete

**Actual Output:**
```
> nextjs-google-auth-app@0.1.0 test
> jest

 PASS  lib/workoutCalculator.test.ts
  calculateTrainingMax
    standard calculations
      ✓ should calculate TM as 90% of 1RM (1 ms)
      ✓ should handle large numbers
      ✓ should handle decimal values
    edge cases
      ✓ should return 0 for zero input
      ✓ should return 0 for negative input
      ✓ should handle very small positive numbers
  roundToPlate
    pounds (lbs) rounding
      ✓ should round to nearest 5 lbs (1 ms)
      ✓ should handle exact increments
      ✓ should round down when appropriate
      ✓ should round up when appropriate (1 ms)
    kilograms (kg) rounding
      ✓ should round to nearest 2.5 kg
      ✓ should handle exact increments
      ✓ should round correctly at boundaries
    edge cases
      ✓ should return 0 for zero input
      ✓ should return 0 for negative input
      ✓ should handle very small weights
  generateWeek
    Week 1 - 5/5/5 (65%/75%/85%)
      ✓ should generate correct percentages for Week 1
      ✓ should calculate correct weights for Week 1 (1 ms)
      ✓ should set correct reps for Week 1 (all 5s)
      ✓ should mark last set as AMRAP
    Week 2 - 3/3/3 (70%/80%/90%)
      ✓ should generate correct percentages for Week 2
      ✓ should calculate correct weights for Week 2 (1 ms)
      ✓ should set correct reps for Week 2 (all 3s)
      ✓ should mark last set as AMRAP
    Week 3 - 5/3/1 (75%/85%/95%)
      ✓ should generate correct percentages for Week 3
      ✓ should calculate correct weights for Week 3 (1 ms)
      ✓ should set correct reps for Week 3 (5/3/1)
      ✓ should mark last set as AMRAP
    Week 4 - Deload (40%/50%/60%)
      ✓ should generate correct percentages for Week 4
      ✓ should calculate correct weights for Week 4
      ✓ should set correct reps for Week 4 (all 5s) (1 ms)
      ✓ should NOT mark any sets as AMRAP during deload
    weight rounding
      ✓ should round weights to nearest 5 lbs
      ✓ should round weights to nearest 2.5 kg
  generateWorkoutPlan
    structure validation
      ✓ should generate a plan with 4 weeks (1 ms)
      ✓ should include all four lifts in each week
      ✓ should include 3 sets per lift per week (1 ms)
      ✓ should have correct week numbers and names
    training max calculations
      ✓ should calculate and round training maxes correctly (lbs)
      ✓ should calculate and round training maxes correctly (kg)
    lift names
      ✓ should include proper display names for all lifts
    units and rounding preference
      ✓ should store units in the plan
      ✓ should store rounding preference in the plan (1 ms)
      ✓ should default rounding preference to plate
    complete workout verification
      ✓ should generate a complete and valid 4-week plan (5 ms)

Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        0.206 s
```

---

## Verification Summary

| Requirement | Status | Evidence |
|-------------|--------|----------|
| IWorkoutSet extended with `completed` and `amrapRecorded` | ✅ Pass | Code in models/WorkoutPlan.ts |
| WorkoutSetSchema includes new fields with defaults | ✅ Pass | Code in models/WorkoutPlan.ts |
| IAMRAPHistoryEntry interface created | ✅ Pass | Code in models/User.ts |
| AMRAPHistorySchema with all required fields | ✅ Pass | Code in models/User.ts |
| IUser extended with amrapHistory array | ✅ Pass | Code in models/User.ts |
| All existing tests pass (no regressions) | ✅ Pass | npm test output: 45 passed |

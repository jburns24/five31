# 05-task-02-proofs.md

## Task 2.0: Extend User Model and Create WorkoutPlan Model

### Code: models/User.ts - 1RM Fields Extension

The User model has been extended with the following 1RM fields:

```typescript
// TypeScript interface for 1RM data
export interface IOneRM {
  squat?: number;
  bench?: number;
  deadlift?: number;
  overheadPress?: number;
  units?: 'lbs' | 'kg';
  roundingPreference?: 'plate' | '2.5';
}

// Updated IUser interface
export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  image: string;
  oneRM?: IOneRM;  // New optional 1RM field
  createdAt: Date;
  updatedAt: Date;
}
```

**Schema Validation:**
- All 1RM values: min 1, max 2000
- Units: enum ['lbs', 'kg'], default 'lbs'
- Rounding preference: enum ['plate', '2.5'], default 'plate'

### Code: models/WorkoutPlan.ts - Complete Schema

The WorkoutPlan model includes:

```typescript
export interface IWorkoutPlan extends Document {
  userId: Types.ObjectId;          // Reference to User
  dateCreated: Date;               // Auto-managed via timestamps
  lastUpdated: Date;               // Auto-managed via timestamps
  isArchived: boolean;             // Default false, indexed
  units: 'lbs' | 'kg';
  roundingPreference: 'plate' | '2.5';
  trainingMaxValues: ITrainingMaxValues;
  weeklyWorkouts: IWeek[];         // Array of 4 weeks
}
```

**Nested Schemas:**
- `WorkoutSetSchema`: setNumber, percentage, weight, reps, isAmrap
- `LiftWorkoutSchema`: lift (enum), liftName, trainingMax, sets
- `WeekSchema`: weekNumber (1-4), weekName, lifts
- `TrainingMaxValuesSchema`: squat, bench, deadlift, overheadPress

**Indexes:**
- `userId`: Individual index for user lookups
- `isArchived`: Individual index for filtering
- `{ userId: 1, isArchived: 1 }`: Compound index for efficient active plan queries

### Build Verification

```
> npm run build

  ▲ Next.js 14.2.35
  - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
 ✓ Generating static pages (6/6)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
┌ ○ /                                    137 B          87.5 kB
├ ○ /_not-found                          875 B          88.2 kB
├ ƒ /account                             655 B           103 kB
├ ƒ /api/auth/[...nextauth]              0 B                0 B
└ ○ /api/health                          0 B                0 B
```

### Test Suite Status

```
Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        0.227 s
```

### Verification

- ✅ User model extended with optional oneRM field
- ✅ 1RM sub-schema with validation (min/max bounds, enum types)
- ✅ WorkoutPlan model created with all required fields
- ✅ Nested schemas for sets, lifts, weeks, and training max values
- ✅ Compound index on userId + isArchived for efficient queries
- ✅ Timestamps auto-managed (dateCreated, lastUpdated)
- ✅ Model export pattern prevents Next.js hot reload issues
- ✅ Build passes with no TypeScript errors
- ✅ All existing tests still pass

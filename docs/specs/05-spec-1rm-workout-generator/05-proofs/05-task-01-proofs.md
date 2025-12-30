# 05-task-01-proofs.md

## Task 1.0: Setup Testing Infrastructure and Workout Calculation Engine

### Test Output: npm test Command

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
      ✓ should round to nearest 5 lbs
      ✓ should handle exact increments
      ✓ should round down when appropriate
      ✓ should round up when appropriate
    kilograms (kg) rounding
      ✓ should round to nearest 2.5 kg
      ✓ should handle exact increments
      ✓ should round correctly at boundaries
    edge cases
      ✓ should return 0 for zero input (1 ms)
      ✓ should return 0 for negative input
      ✓ should handle very small weights
  generateWeek
    Week 1 - 5/5/5 (65%/75%/85%)
      ✓ should generate correct percentages for Week 1 (1 ms)
      ✓ should calculate correct weights for Week 1
      ✓ should set correct reps for Week 1 (all 5s)
      ✓ should mark last set as AMRAP
    Week 2 - 3/3/3 (70%/80%/90%)
      ✓ should generate correct percentages for Week 2
      ✓ should calculate correct weights for Week 2
      ✓ should set correct reps for Week 2 (all 3s)
      ✓ should mark last set as AMRAP
    Week 3 - 5/3/1 (75%/85%/95%)
      ✓ should generate correct percentages for Week 3
      ✓ should calculate correct weights for Week 3
      ✓ should set correct reps for Week 3 (5/3/1)
      ✓ should mark last set as AMRAP
    Week 4 - Deload (40%/50%/60%)
      ✓ should generate correct percentages for Week 4
      ✓ should calculate correct weights for Week 4
      ✓ should set correct reps for Week 4 (all 5s)
      ✓ should NOT mark any sets as AMRAP during deload
    weight rounding
      ✓ should round weights to nearest 5 lbs
      ✓ should round weights to nearest 2.5 kg
  generateWorkoutPlan
    structure validation
      ✓ should generate a plan with 4 weeks
      ✓ should include all four lifts in each week (1 ms)
      ✓ should include 3 sets per lift per week
      ✓ should have correct week numbers and names
    training max calculations
      ✓ should calculate and round training maxes correctly (lbs)
      ✓ should calculate and round training maxes correctly (kg)
    lift names
      ✓ should include proper display names for all lifts
    units and rounding preference
      ✓ should store units in the plan
      ✓ should store rounding preference in the plan
      ✓ should default rounding preference to plate
    complete workout verification
      ✓ should generate a complete and valid 4-week plan (7 ms)

Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        0.26 s, estimated 1 s
Ran all test suites.
```

### Code: lib/workoutCalculator.ts Exports

The workout calculator module exports the following functions and types:

**Types:**
- `LiftType` - Union type for the four main lifts
- `Units` - 'lbs' | 'kg'
- `RoundingPreference` - 'plate' | '2.5'
- `OneRMValues` - Interface for 1RM input values
- `TrainingMaxValues` - Interface for calculated TM values
- `WorkoutSet` - Interface for individual set data
- `LiftWorkout` - Interface for lift workout with sets
- `Week` - Interface for weekly workout data
- `WorkoutPlanData` - Interface for complete 4-week plan

**Functions:**
- `calculateTrainingMax(oneRM: number): number` - Returns 90% of 1RM
- `roundToPlate(weight: number, units: Units): number` - Rounds to nearest 5 lbs or 2.5 kg
- `generateWeek(trainingMax: number, weekNumber: 1|2|3|4, units: Units): WorkoutSet[]` - Generates sets for a week
- `generateWorkoutPlan(oneRMs: OneRMValues, units: Units, roundingPreference?: RoundingPreference): WorkoutPlanData` - Generates complete 4-week plan

### Test Categories Summary

| Function | Test Count | Description |
|----------|------------|-------------|
| `calculateTrainingMax()` | 6 | TM = 0.90 × 1RM with edge case handling |
| `roundToPlate()` | 10 | Weight rounding for both lbs (5) and kg (2.5) |
| `generateWeek()` | 14 | Correct percentages for all 4 weeks |
| `generateWorkoutPlan()` | 15 | Complete 4-week plan generation |
| **Total** | **45** | All tests passing |

### Verification

- ✅ Testing framework (Jest) configured with TypeScript support
- ✅ Jest config includes path aliases matching tsconfig.json
- ✅ All calculation functions implemented and tested
- ✅ Training Max calculation accurate (0.90 × 1RM)
- ✅ Weight rounding to smallest plate (5 lbs / 2.5 kg)
- ✅ Correct percentages for all 4 weeks of 5/3/1 program
- ✅ Complete 4-week plan generation with all lifts
- ✅ All 45 tests passing

import {
  findFirstIncompleteWorkout,
  isAllWorkoutsComplete,
  getCompletionProgress,
  hasUnsavedProgress,
  WeeklyWorkout,
  LiftType,
} from './workoutNavigation';
import type { IWorkoutSet } from '@/models/WorkoutPlan';

// Helper to create a set
const createSet = (
  setNumber: number,
  completed = false,
  isAmrap = false,
  amrapRecorded = false
): IWorkoutSet => ({
  setNumber,
  weight: 200,
  reps: 5,
  percentage: 85,
  completed,
  isAmrap,
  amrapRecorded: isAmrap ? amrapRecorded : undefined,
});

// Helper to create a lift
const createLift = (
  lift: LiftType,
  setsComplete: boolean[] = [false, false, false],
  amrapRecorded = false
) => ({
  lift,
  liftName: lift.charAt(0).toUpperCase() + lift.slice(1),
  trainingMax: 225,
  sets: [
    createSet(1, setsComplete[0] || false),
    createSet(2, setsComplete[1] || false),
    createSet(3, setsComplete[2] || false, true, amrapRecorded),
  ] as IWorkoutSet[],
});

// Helper to create a week
const createWeek = (
  weekNumber: number,
  liftCompletions: Record<LiftType, { complete: boolean[]; amrapRecorded: boolean }>
): WeeklyWorkout => ({
  weekNumber,
  weekName: `Week ${weekNumber}`,
  lifts: (['squat', 'bench', 'deadlift', 'overheadPress'] as LiftType[]).map((lift) =>
    createLift(
      lift,
      liftCompletions[lift]?.complete || [false, false, false],
      liftCompletions[lift]?.amrapRecorded || false
    )
  ),
});

describe('workoutNavigation', () => {
  describe('findFirstIncompleteWorkout', () => {
    it('should return first workout when nothing is complete', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [false, false, false], amrapRecorded: false },
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      const result = findFirstIncompleteWorkout(weeks);

      expect(result).toEqual({ weekNumber: 1, lift: 'squat' });
    });

    it('should return bench when squat is fully complete', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: true },
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      const result = findFirstIncompleteWorkout(weeks);

      expect(result).toEqual({ weekNumber: 1, lift: 'bench' });
    });

    it('should return squat even if sets complete but AMRAP not recorded', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: false }, // Sets done but AMRAP not recorded
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      const result = findFirstIncompleteWorkout(weeks);

      expect(result).toEqual({ weekNumber: 1, lift: 'squat' });
    });

    it('should return next week workout when current week complete', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: true },
          bench: { complete: [true, true, true], amrapRecorded: true },
          deadlift: { complete: [true, true, true], amrapRecorded: true },
          overheadPress: { complete: [true, true, true], amrapRecorded: true },
        }),
        createWeek(2, {
          squat: { complete: [false, false, false], amrapRecorded: false },
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      const result = findFirstIncompleteWorkout(weeks);

      expect(result).toEqual({ weekNumber: 2, lift: 'squat' });
    });

    it('should return null when all workouts complete', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: true },
          bench: { complete: [true, true, true], amrapRecorded: true },
          deadlift: { complete: [true, true, true], amrapRecorded: true },
          overheadPress: { complete: [true, true, true], amrapRecorded: true },
        }),
      ];

      const result = findFirstIncompleteWorkout(weeks);

      expect(result).toBeNull();
    });

    it('should not require AMRAP recording for deload week (week 4)', () => {
      const weeks: WeeklyWorkout[] = [
        {
          weekNumber: 4,
          weekName: 'Week 4 - Deload',
          lifts: (['squat', 'bench', 'deadlift', 'overheadPress'] as LiftType[]).map(
            (lift) => ({
              lift,
              liftName: lift,
              trainingMax: 225,
              sets: [
                createSet(1, true),
                createSet(2, true),
                createSet(3, true, false), // Not AMRAP in deload
              ],
            })
          ),
        },
      ];

      const result = findFirstIncompleteWorkout(weeks);

      expect(result).toBeNull();
    });

    it('should handle out-of-order week data correctly', () => {
      const weeks = [
        createWeek(2, {
          squat: { complete: [false, false, false], amrapRecorded: false },
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: true },
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      const result = findFirstIncompleteWorkout(weeks);

      // Should find bench in week 1, not squat in week 2
      expect(result).toEqual({ weekNumber: 1, lift: 'bench' });
    });
  });

  describe('isAllWorkoutsComplete', () => {
    it('should return false when workouts incomplete', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: true },
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      expect(isAllWorkoutsComplete(weeks)).toBe(false);
    });

    it('should return true when all workouts complete', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: true },
          bench: { complete: [true, true, true], amrapRecorded: true },
          deadlift: { complete: [true, true, true], amrapRecorded: true },
          overheadPress: { complete: [true, true, true], amrapRecorded: true },
        }),
      ];

      expect(isAllWorkoutsComplete(weeks)).toBe(true);
    });
  });

  describe('getCompletionProgress', () => {
    it('should count completed workouts correctly', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: true },
          bench: { complete: [true, true, true], amrapRecorded: true },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      const result = getCompletionProgress(weeks);

      expect(result).toEqual({ completed: 2, total: 4 });
    });

    it('should not count workout as complete if AMRAP not recorded', () => {
      const weeks = [
        createWeek(1, {
          squat: { complete: [true, true, true], amrapRecorded: false }, // Sets done but no AMRAP
          bench: { complete: [false, false, false], amrapRecorded: false },
          deadlift: { complete: [false, false, false], amrapRecorded: false },
          overheadPress: { complete: [false, false, false], amrapRecorded: false },
        }),
      ];

      const result = getCompletionProgress(weeks);

      expect(result.completed).toBe(0);
    });

    it('should handle full 4-week plan', () => {
      const fullComplete = { complete: [true, true, true], amrapRecorded: true };
      const weeks = [
        createWeek(1, { squat: fullComplete, bench: fullComplete, deadlift: fullComplete, overheadPress: fullComplete }),
        createWeek(2, { squat: fullComplete, bench: fullComplete, deadlift: fullComplete, overheadPress: fullComplete }),
        createWeek(3, { squat: fullComplete, bench: fullComplete, deadlift: fullComplete, overheadPress: fullComplete }),
        createWeek(4, { squat: fullComplete, bench: fullComplete, deadlift: fullComplete, overheadPress: fullComplete }),
      ];

      const result = getCompletionProgress(weeks);

      expect(result).toEqual({ completed: 16, total: 16 });
    });
  });

  describe('hasUnsavedProgress', () => {
    it('should return false when no sets complete', () => {
      const liftData = {
        sets: [
          createSet(1, false),
          createSet(2, false),
          createSet(3, false, true, false),
        ],
      };

      expect(hasUnsavedProgress(liftData, 1)).toBe(false);
    });

    it('should return true when sets complete but AMRAP not recorded', () => {
      const liftData = {
        sets: [
          createSet(1, true),
          createSet(2, true),
          createSet(3, true, true, false), // Sets done but AMRAP not recorded
        ],
      };

      expect(hasUnsavedProgress(liftData, 1)).toBe(true);
    });

    it('should return false when AMRAP is recorded', () => {
      const liftData = {
        sets: [
          createSet(1, true),
          createSet(2, true),
          createSet(3, true, true, true),
        ],
      };

      expect(hasUnsavedProgress(liftData, 1)).toBe(false);
    });

    it('should return false for deload week regardless of completion', () => {
      const liftData = {
        sets: [
          createSet(1, true),
          createSet(2, true),
          createSet(3, true, false, false),
        ],
      };

      expect(hasUnsavedProgress(liftData, 4)).toBe(false);
    });
  });
});

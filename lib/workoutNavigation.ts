/**
 * Workout Navigation Library
 *
 * Utilities for finding the first incomplete workout and checking completion status.
 * Used for auto-navigating users to their current workout.
 */

import type { IWorkoutSet } from '@/models/WorkoutPlan';

export type LiftType = 'squat' | 'bench' | 'deadlift' | 'overheadPress';

export interface WorkoutLocation {
  weekNumber: number;
  lift: LiftType;
}

export interface WeeklyWorkout {
  weekNumber: number;
  weekName: string;
  lifts: {
    lift: LiftType;
    liftName: string;
    trainingMax: number;
    sets: IWorkoutSet[];
  }[];
}

// Lift order within each week (same for all weeks)
const LIFT_ORDER: LiftType[] = ['squat', 'bench', 'deadlift', 'overheadPress'];

/**
 * Find the first incomplete workout in a workout plan.
 * Iterates through weeks in order, then lifts within each week.
 *
 * @param weeklyWorkouts - Array of weekly workout data
 * @returns The location of the first incomplete workout, or null if all complete
 */
export function findFirstIncompleteWorkout(
  weeklyWorkouts: WeeklyWorkout[]
): WorkoutLocation | null {
  // Sort weeks by week number to ensure correct order
  const sortedWeeks = [...weeklyWorkouts].sort((a, b) => a.weekNumber - b.weekNumber);

  for (const week of sortedWeeks) {
    // Process lifts in the standard order
    for (const liftType of LIFT_ORDER) {
      const liftData = week.lifts.find((l) => l.lift === liftType);

      if (!liftData) continue;

      // Check if any set is incomplete
      const hasIncompleteSet = liftData.sets.some((set) => set.completed !== true);

      if (hasIncompleteSet) {
        return {
          weekNumber: week.weekNumber,
          lift: liftType,
        };
      }

      // Also check if AMRAP is not recorded for non-deload weeks
      if (week.weekNumber !== 4) {
        const amrapSet = liftData.sets.find((s) => s.isAmrap);
        if (amrapSet && amrapSet.amrapRecorded !== true) {
          return {
            weekNumber: week.weekNumber,
            lift: liftType,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Check if all workouts in a plan are complete.
 * A workout is complete when all sets are completed AND the AMRAP is recorded
 * (except for deload weeks which don't have AMRAP).
 *
 * @param weeklyWorkouts - Array of weekly workout data
 * @returns True if all workouts are complete
 */
export function isAllWorkoutsComplete(weeklyWorkouts: WeeklyWorkout[]): boolean {
  return findFirstIncompleteWorkout(weeklyWorkouts) === null;
}

/**
 * Count completed workouts vs total workouts.
 *
 * @param weeklyWorkouts - Array of weekly workout data
 * @returns Object with completed count and total count
 */
export function getCompletionProgress(weeklyWorkouts: WeeklyWorkout[]): {
  completed: number;
  total: number;
} {
  let completed = 0;
  let total = 0;

  for (const week of weeklyWorkouts) {
    for (const liftData of week.lifts) {
      total++;

      // Check if all sets are completed
      const allSetsComplete = liftData.sets.every((set) => set.completed === true);

      // For non-deload weeks, also require AMRAP to be recorded
      if (week.weekNumber === 4) {
        if (allSetsComplete) {
          completed++;
        }
      } else {
        const amrapSet = liftData.sets.find((s) => s.isAmrap);
        if (allSetsComplete && amrapSet?.amrapRecorded === true) {
          completed++;
        }
      }
    }
  }

  return { completed, total };
}

/**
 * Check if a specific workout has unsaved progress.
 * Unsaved progress = some sets completed but AMRAP not yet recorded.
 *
 * @param liftData - The lift data to check
 * @param weekNumber - The week number (4 = deload, no AMRAP)
 * @returns True if there is unsaved progress
 */
export function hasUnsavedProgress(
  liftData: { sets: IWorkoutSet[] },
  weekNumber: number
): boolean {
  // Deload weeks don't have AMRAP requirement
  if (weekNumber === 4) {
    return false;
  }

  const someSetComplete = liftData.sets.some((set) => set.completed === true);
  const amrapSet = liftData.sets.find((s) => s.isAmrap);
  const amrapRecorded = amrapSet?.amrapRecorded === true;

  return someSetComplete && !amrapRecorded;
}

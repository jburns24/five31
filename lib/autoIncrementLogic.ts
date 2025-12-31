/**
 * Auto-Increment Logic Library
 *
 * Handles automatic 1RM progression based on AMRAP performance.
 * Following 5/3/1 methodology:
 * - If target reps are met or exceeded, increase 1RM by 10 lbs (5 kg for upper body)
 * - If target reps are missed, keep current 1RM
 */

export type LiftType = 'squat' | 'bench' | 'deadlift' | 'overheadPress';
export type Units = 'lbs' | 'kg';

export interface AMRAPResult {
  lift: LiftType;
  weekNumber: number;
  reps: number;
  weight: number;
}

export interface OneRMValues {
  squat: number;
  bench: number;
  deadlift: number;
  overheadPress: number;
}

export interface IncrementResult {
  lift: LiftType;
  currentOneRM: number;
  newOneRM: number;
  increased: boolean;
  targetReps: number;
  actualReps: number;
}

// Target reps for each week's AMRAP set
// Week 1: 5+ (85%), Week 2: 3+ (90%), Week 3: 1+ (95%), Week 4: Deload (no AMRAP)
const WEEK_TARGET_REPS: Record<number, number> = {
  1: 5,
  2: 3,
  3: 1,
  4: 5, // Deload doesn't really have AMRAP, but if it did...
};

// Increment amounts by lift type and unit
// Lower body (squat, deadlift): 10 lbs / 5 kg
// Upper body (bench, OHP): 5 lbs / 2.5 kg
const INCREMENT_AMOUNTS: Record<Units, Record<LiftType, number>> = {
  lbs: {
    squat: 10,
    bench: 5,
    deadlift: 10,
    overheadPress: 5,
  },
  kg: {
    squat: 5,
    bench: 2.5,
    deadlift: 5,
    overheadPress: 2.5,
  },
};

/**
 * Get the target reps for a specific week's AMRAP set.
 *
 * @param weekNumber - The week number (1-4)
 * @returns Target reps for that week
 */
export function getTargetReps(weekNumber: number): number {
  return WEEK_TARGET_REPS[weekNumber] || 1;
}

/**
 * Get the increment amount for a specific lift and unit.
 *
 * @param lift - The lift type
 * @param units - The unit system (lbs or kg)
 * @returns The increment amount
 */
export function getIncrementAmount(lift: LiftType, units: Units): number {
  return INCREMENT_AMOUNTS[units][lift];
}

/**
 * Calculate whether to increase 1RM based on AMRAP performance.
 *
 * @param currentOneRM - Current 1RM value
 * @param amrapResult - The AMRAP result from the workout
 * @param units - The unit system being used
 * @returns IncrementResult with new 1RM value and details
 */
export function calculateNewOneRM(
  currentOneRM: number,
  amrapResult: AMRAPResult,
  units: Units
): IncrementResult {
  const targetReps = getTargetReps(amrapResult.weekNumber);
  const metTarget = amrapResult.reps >= targetReps;
  const increment = getIncrementAmount(amrapResult.lift, units);

  return {
    lift: amrapResult.lift,
    currentOneRM,
    newOneRM: metTarget ? currentOneRM + increment : currentOneRM,
    increased: metTarget,
    targetReps,
    actualReps: amrapResult.reps,
  };
}

/**
 * Calculate new 1RM values for all lifts based on cycle AMRAP results.
 * A lift only progresses if ALL AMRAP targets were met during the cycle.
 * If any week's target was missed, the lift does not progress.
 *
 * @param currentValues - Current 1RM values for all lifts
 * @param amrapResults - Array of all AMRAP results from the cycle
 * @param units - The unit system being used
 * @returns Object with new 1RM values for all lifts
 */
export function calculateCycleProgression(
  currentValues: OneRMValues,
  amrapResults: AMRAPResult[],
  units: Units
): {
  newValues: OneRMValues;
  details: IncrementResult[];
} {
  const lifts: LiftType[] = ['squat', 'bench', 'deadlift', 'overheadPress'];
  const details: IncrementResult[] = [];
  const newValues = { ...currentValues };

  for (const lift of lifts) {
    // Get all AMRAP results for this lift from weeks 1-3
    const liftResults = amrapResults.filter(
      (r) => r.lift === lift && r.weekNumber >= 1 && r.weekNumber <= 3
    );

    if (liftResults.length === 0) {
      // No AMRAP recorded for this lift, keep current
      details.push({
        lift,
        currentOneRM: currentValues[lift],
        newOneRM: currentValues[lift],
        increased: false,
        targetReps: 0,
        actualReps: 0,
      });
      continue;
    }

    // Check if ALL targets were met for this lift
    // If ANY week's target was missed, the lift does NOT progress
    let allTargetsMet = true;
    let failedWeek: number | null = null;
    let failedReps = 0;
    let failedTarget = 0;

    for (const result of liftResults) {
      const targetReps = getTargetReps(result.weekNumber);
      if (result.reps < targetReps) {
        allTargetsMet = false;
        failedWeek = result.weekNumber;
        failedReps = result.reps;
        failedTarget = targetReps;
        break; // Found a failure, no need to check further
      }
    }

    if (allTargetsMet) {
      // All targets met - use the most recent result for increment calculation
      const latestResult = liftResults[liftResults.length - 1];
      const incrementResult = calculateNewOneRM(currentValues[lift], latestResult, units);
      details.push(incrementResult);
      newValues[lift] = incrementResult.newOneRM;
    } else {
      // At least one target missed - no progression
      details.push({
        lift,
        currentOneRM: currentValues[lift],
        newOneRM: currentValues[lift],
        increased: false,
        targetReps: failedTarget,
        actualReps: failedReps,
      });
    }
  }

  return { newValues, details };
}

/**
 * Check if the user should progress based on AMRAP performance.
 * Simple check: did they meet the target reps?
 *
 * @param weekNumber - The week number
 * @param actualReps - The actual reps performed
 * @returns True if target was met
 */
export function shouldProgress(weekNumber: number, actualReps: number): boolean {
  const targetReps = getTargetReps(weekNumber);
  return actualReps >= targetReps;
}

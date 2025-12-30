/**
 * Workout Calculator for 5/3/1 Program
 *
 * Implements Jim Wendler's 5/3/1 training methodology with:
 * - Training Max calculation (90% of 1RM)
 * - Weight rounding to available plates
 * - 4-week cycle generation with progressive overload
 */

// Type definitions
export type LiftType = 'squat' | 'bench' | 'deadlift' | 'overheadPress';
export type Units = 'lbs' | 'kg';
export type RoundingPreference = 'plate' | '2.5';

export interface OneRMValues {
  squat: number;
  bench: number;
  deadlift: number;
  overheadPress: number;
}

export interface TrainingMaxValues {
  squat: number;
  bench: number;
  deadlift: number;
  overheadPress: number;
}

export interface WorkoutSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  isAmrap: boolean; // "As Many Reps As Possible" for last set of weeks 1-3
}

export interface LiftWorkout {
  lift: LiftType;
  liftName: string;
  trainingMax: number;
  sets: WorkoutSet[];
}

export interface Week {
  weekNumber: 1 | 2 | 3 | 4;
  weekName: string;
  lifts: LiftWorkout[];
}

export interface WorkoutPlanData {
  trainingMaxValues: TrainingMaxValues;
  units: Units;
  roundingPreference: RoundingPreference;
  weeks: Week[];
}

// Lift display names
const LIFT_NAMES: Record<LiftType, string> = {
  squat: 'Squat',
  bench: 'Bench Press',
  deadlift: 'Deadlift',
  overheadPress: 'Overhead Press',
};

// Week configurations (percentages and reps)
const WEEK_CONFIG: Record<
  1 | 2 | 3 | 4,
  { name: string; sets: Array<{ percentage: number; reps: number }> }
> = {
  1: {
    name: 'Week 1 - 5/5/5',
    sets: [
      { percentage: 65, reps: 5 },
      { percentage: 75, reps: 5 },
      { percentage: 85, reps: 5 }, // AMRAP
    ],
  },
  2: {
    name: 'Week 2 - 3/3/3',
    sets: [
      { percentage: 70, reps: 3 },
      { percentage: 80, reps: 3 },
      { percentage: 90, reps: 3 }, // AMRAP
    ],
  },
  3: {
    name: 'Week 3 - 5/3/1',
    sets: [
      { percentage: 75, reps: 5 },
      { percentage: 85, reps: 3 },
      { percentage: 95, reps: 1 }, // AMRAP
    ],
  },
  4: {
    name: 'Week 4 - Deload',
    sets: [
      { percentage: 40, reps: 5 },
      { percentage: 50, reps: 5 },
      { percentage: 60, reps: 5 },
    ],
  },
};

/**
 * Calculate Training Max (TM) from 1RM
 * Training Max = 90% of One Rep Max
 *
 * @param oneRM - The one rep max value
 * @returns The calculated training max (90% of 1RM)
 */
export function calculateTrainingMax(oneRM: number): number {
  if (oneRM < 0) {
    return 0;
  }
  return oneRM * 0.9;
}

/**
 * Round weight to nearest available plate increment
 *
 * For lbs: Rounds to nearest 5 lbs (standard US gym plates: 2.5 lb per side)
 * For kg: Rounds to nearest 2.5 kg (standard metric plates: 1.25 kg per side)
 *
 * @param weight - The weight to round
 * @param units - The unit system ('lbs' or 'kg')
 * @returns The rounded weight
 */
export function roundToPlate(weight: number, units: Units): number {
  if (weight < 0) {
    return 0;
  }

  // Standard plate increments (2.5 lb or 1.25 kg per side = 5 lb or 2.5 kg total)
  const increment = units === 'lbs' ? 5 : 2.5;

  return Math.round(weight / increment) * increment;
}

/**
 * Generate sets for a specific week of the 5/3/1 program
 *
 * @param trainingMax - The training max for the lift
 * @param weekNumber - The week number (1-4)
 * @param units - The unit system ('lbs' or 'kg')
 * @returns Array of workout sets with calculated weights
 */
export function generateWeek(
  trainingMax: number,
  weekNumber: 1 | 2 | 3 | 4,
  units: Units
): WorkoutSet[] {
  const config = WEEK_CONFIG[weekNumber];

  return config.sets.map((set, index) => {
    const rawWeight = (trainingMax * set.percentage) / 100;
    const roundedWeight = roundToPlate(rawWeight, units);

    return {
      setNumber: index + 1,
      percentage: set.percentage,
      weight: roundedWeight,
      reps: set.reps,
      // Last set of weeks 1-3 is AMRAP, week 4 (deload) has no AMRAP
      isAmrap: weekNumber !== 4 && index === config.sets.length - 1,
    };
  });
}

/**
 * Generate a complete 4-week workout plan for all four main lifts
 *
 * @param oneRMs - Object containing 1RM values for all four lifts
 * @param units - The unit system ('lbs' or 'kg')
 * @param roundingPreference - The rounding preference ('plate' or '2.5')
 * @returns Complete workout plan data with all weeks and lifts
 */
export function generateWorkoutPlan(
  oneRMs: OneRMValues,
  units: Units,
  roundingPreference: RoundingPreference = 'plate'
): WorkoutPlanData {
  // Calculate training maxes for all lifts
  const trainingMaxValues: TrainingMaxValues = {
    squat: roundToPlate(calculateTrainingMax(oneRMs.squat), units),
    bench: roundToPlate(calculateTrainingMax(oneRMs.bench), units),
    deadlift: roundToPlate(calculateTrainingMax(oneRMs.deadlift), units),
    overheadPress: roundToPlate(calculateTrainingMax(oneRMs.overheadPress), units),
  };

  // Generate all four weeks
  const weeks: Week[] = ([1, 2, 3, 4] as const).map((weekNumber) => {
    const lifts: LiftWorkout[] = (
      ['squat', 'bench', 'deadlift', 'overheadPress'] as const
    ).map((lift) => ({
      lift,
      liftName: LIFT_NAMES[lift],
      trainingMax: trainingMaxValues[lift],
      sets: generateWeek(trainingMaxValues[lift], weekNumber, units),
    }));

    return {
      weekNumber,
      weekName: WEEK_CONFIG[weekNumber].name,
      lifts,
    };
  });

  return {
    trainingMaxValues,
    units,
    roundingPreference,
    weeks,
  };
}

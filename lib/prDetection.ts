/**
 * PR (Personal Record) Detection Library
 *
 * Detects two types of PRs:
 * 1. Rep PR: Same or higher weight with more reps
 * 2. 1RM PR: Higher theoretical 1RM than previous best
 */

import { calculateOneRM } from './oneRMCalculation';

export interface AMRAPEntry {
  lift: string;
  weight: number;
  reps: number;
  date: Date;
  notes?: string;
  weekNumber?: number;
}

export interface PRDetails {
  isPR: boolean;
  prType: 'rep' | '1rm' | 'both' | null;
  repPR?: {
    currentReps: number;
    previousReps: number;
    improvement: number;
    previousDate: Date;
    previousNotes?: string;
    weight: number;
  };
  oneRMPR?: {
    current1RM: number;
    previous1RM: number;
    improvement: number;
    previousDate: Date;
  };
}

/**
 * Compare current AMRAP performance against historical records for the same lift
 *
 * @param currentAMRAP - The current AMRAP set just performed
 * @param history - Array of previous AMRAP entries for this lift
 * @returns PRDetails object with PR information
 */
export function detectPR(currentAMRAP: AMRAPEntry, history: AMRAPEntry[]): PRDetails {
  // Filter history to only include entries for the same lift
  const liftHistory = history.filter(
    (entry) => entry.lift.toLowerCase() === currentAMRAP.lift.toLowerCase()
  );

  // No history means this is the first entry - not a PR (yet)
  if (liftHistory.length === 0) {
    return {
      isPR: false,
      prType: null,
    };
  }

  const currentTheoretical1RM = calculateOneRM(currentAMRAP.weight, currentAMRAP.reps);

  // Find best previous rep PR at same or higher weight
  const repPRCandidate = findBestRepPR(currentAMRAP, liftHistory);

  // Find best previous 1RM
  const oneRMPRCandidate = findBest1RMPR(currentAMRAP, currentTheoretical1RM, liftHistory);

  // Determine the PR type(s)
  const hasRepPR = repPRCandidate !== null;
  const has1RMPR = oneRMPRCandidate !== null;

  if (!hasRepPR && !has1RMPR) {
    return {
      isPR: false,
      prType: null,
    };
  }

  let prType: 'rep' | '1rm' | 'both';
  if (hasRepPR && has1RMPR) {
    prType = 'both';
  } else if (hasRepPR) {
    prType = 'rep';
  } else {
    prType = '1rm';
  }

  return {
    isPR: true,
    prType,
    repPR: repPRCandidate || undefined,
    oneRMPR: oneRMPRCandidate || undefined,
  };
}

/**
 * Find the best rep PR - same or higher weight with more reps beaten
 */
function findBestRepPR(
  current: AMRAPEntry,
  history: AMRAPEntry[]
): PRDetails['repPR'] | null {
  // Find entries at the same or higher weight
  const sameOrHigherWeight = history.filter((entry) => entry.weight >= current.weight);

  if (sameOrHigherWeight.length === 0) {
    return null;
  }

  // Find the best previous reps at this weight or higher
  // We want to find entries where current reps beat previous reps
  const beatenEntries = sameOrHigherWeight.filter(
    (entry) => entry.weight === current.weight && current.reps > entry.reps
  );

  if (beatenEntries.length === 0) {
    return null;
  }

  // Find the best entry that was beaten (highest previous reps)
  const bestBeatenEntry = beatenEntries.reduce((best, entry) =>
    entry.reps > best.reps ? entry : best
  );

  return {
    currentReps: current.reps,
    previousReps: bestBeatenEntry.reps,
    improvement: current.reps - bestBeatenEntry.reps,
    previousDate: bestBeatenEntry.date,
    previousNotes: bestBeatenEntry.notes,
    weight: current.weight,
  };
}

/**
 * Find if this is a 1RM PR - higher theoretical 1RM than any previous
 */
function findBest1RMPR(
  current: AMRAPEntry,
  currentTheoretical1RM: number,
  history: AMRAPEntry[]
): PRDetails['oneRMPR'] | null {
  // Calculate theoretical 1RM for all history entries
  const historicalMaxes = history.map((entry) => ({
    theoretical1RM: calculateOneRM(entry.weight, entry.reps),
    date: entry.date,
  }));

  // Find the best previous 1RM
  const bestPrevious = historicalMaxes.reduce((best, entry) =>
    entry.theoretical1RM > best.theoretical1RM ? entry : best
  );

  // Check if current beats the best previous
  if (currentTheoretical1RM <= bestPrevious.theoretical1RM) {
    return null;
  }

  return {
    current1RM: currentTheoretical1RM,
    previous1RM: bestPrevious.theoretical1RM,
    improvement: currentTheoretical1RM - bestPrevious.theoretical1RM,
    previousDate: bestPrevious.date,
  };
}

/**
 * Get the best historical 1RM for a specific lift
 *
 * @param lift - The lift to check
 * @param history - Array of AMRAP entries
 * @returns The best theoretical 1RM or null if no history
 */
export function getBest1RM(lift: string, history: AMRAPEntry[]): number | null {
  const liftHistory = history.filter(
    (entry) => entry.lift.toLowerCase() === lift.toLowerCase()
  );

  if (liftHistory.length === 0) {
    return null;
  }

  const maxEntry = liftHistory.reduce((best, entry) => {
    const entryMax = calculateOneRM(entry.weight, entry.reps);
    const bestMax = calculateOneRM(best.weight, best.reps);
    return entryMax > bestMax ? entry : best;
  });

  return calculateOneRM(maxEntry.weight, maxEntry.reps);
}

/**
 * Get the best rep count for a specific lift at a specific weight
 *
 * @param lift - The lift to check
 * @param weight - The weight to check
 * @param history - Array of AMRAP entries
 * @returns The best rep count or null if no history at this weight
 */
export function getBestRepsAtWeight(
  lift: string,
  weight: number,
  history: AMRAPEntry[]
): number | null {
  const matchingEntries = history.filter(
    (entry) =>
      entry.lift.toLowerCase() === lift.toLowerCase() && entry.weight === weight
  );

  if (matchingEntries.length === 0) {
    return null;
  }

  return Math.max(...matchingEntries.map((entry) => entry.reps));
}

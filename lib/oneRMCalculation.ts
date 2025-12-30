/**
 * 1RM (One Rep Max) Calculation Library
 *
 * Uses the Epley formula to calculate theoretical 1RM:
 * 1RM = weight × (1 + reps/30)
 *
 * This formula is widely used in strength training to estimate
 * the maximum weight a person can lift for one repetition based
 * on the weight and reps performed in a set.
 */

export interface OneRMInput {
  weight: number;
  reps: number;
}

export interface OneRMResult {
  theoretical1RM: number;
  weight: number;
  reps: number;
}

/**
 * Calculate theoretical 1RM using the Epley formula
 *
 * @param weight - The weight lifted
 * @param reps - The number of reps performed
 * @returns The calculated theoretical 1RM, rounded to nearest integer
 *
 * @example
 * calculateOneRM(200, 5) // Returns 233 (200 × (1 + 5/30) = 233.33...)
 */
export function calculateOneRM(weight: number, reps: number): number {
  // If reps is 1, the 1RM is the weight itself
  if (reps === 1) {
    return weight;
  }

  // Epley formula: weight × (1 + reps/30)
  const theoretical1RM = weight * (1 + reps / 30);

  // Round to nearest integer for practical use
  return Math.round(theoretical1RM);
}

/**
 * Calculate theoretical 1RM with full result details
 *
 * @param input - Object containing weight and reps
 * @returns Object with theoretical 1RM and input values
 */
export function calculateOneRMWithDetails(input: OneRMInput): OneRMResult {
  return {
    theoretical1RM: calculateOneRM(input.weight, input.reps),
    weight: input.weight,
    reps: input.reps,
  };
}

/**
 * Calculate the weight needed for a target number of reps based on 1RM
 *
 * Derived from Epley formula: weight = 1RM / (1 + reps/30)
 *
 * @param oneRM - The one rep max
 * @param targetReps - The target number of reps
 * @returns The weight to use for the target reps
 */
export function calculateWeightForReps(oneRM: number, targetReps: number): number {
  if (targetReps === 1) {
    return oneRM;
  }

  const weight = oneRM / (1 + targetReps / 30);
  return Math.round(weight);
}

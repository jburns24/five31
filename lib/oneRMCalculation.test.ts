import { calculateOneRM, calculateOneRMWithDetails, calculateWeightForReps } from './oneRMCalculation';

describe('oneRMCalculation', () => {
  describe('calculateOneRM', () => {
    it('should return the weight itself when reps is 1', () => {
      expect(calculateOneRM(225, 1)).toBe(225);
      expect(calculateOneRM(315, 1)).toBe(315);
      expect(calculateOneRM(100, 1)).toBe(100);
    });

    it('should calculate 1RM correctly using Epley formula for standard cases', () => {
      // 200 × (1 + 5/30) = 200 × 1.1667 = 233.33... ≈ 233
      expect(calculateOneRM(200, 5)).toBe(233);

      // 225 × (1 + 3/30) = 225 × 1.1 = 247.5 ≈ 248
      expect(calculateOneRM(225, 3)).toBe(248);

      // 180 × (1 + 8/30) = 180 × 1.2667 = 228 ≈ 228
      expect(calculateOneRM(180, 8)).toBe(228);
    });

    it('should handle high rep sets', () => {
      // 135 × (1 + 10/30) = 135 × 1.3333 = 180 ≈ 180
      expect(calculateOneRM(135, 10)).toBe(180);

      // 100 × (1 + 15/30) = 100 × 1.5 = 150
      expect(calculateOneRM(100, 15)).toBe(150);

      // 95 × (1 + 20/30) = 95 × 1.6667 = 158.33... ≈ 158
      expect(calculateOneRM(95, 20)).toBe(158);
    });

    it('should handle various weight values', () => {
      // Light weight, 5 reps
      expect(calculateOneRM(45, 5)).toBe(53); // 45 × 1.1667 = 52.5

      // Heavy weight, 5 reps
      expect(calculateOneRM(405, 5)).toBe(473); // 405 × 1.1667 = 472.5

      // Mid weight, 3 reps
      expect(calculateOneRM(275, 3)).toBe(303); // 275 × 1.1 = 302.5
    });

    it('should round to nearest integer', () => {
      // 150 × (1 + 5/30) = 175
      expect(calculateOneRM(150, 5)).toBe(175);

      // 155 × (1 + 5/30) = 180.83... ≈ 181
      expect(calculateOneRM(155, 5)).toBe(181);
    });
  });

  describe('calculateOneRMWithDetails', () => {
    it('should return full result object', () => {
      const result = calculateOneRMWithDetails({ weight: 200, reps: 5 });

      expect(result).toEqual({
        theoretical1RM: 233,
        weight: 200,
        reps: 5,
      });
    });

    it('should work with single rep', () => {
      const result = calculateOneRMWithDetails({ weight: 315, reps: 1 });

      expect(result).toEqual({
        theoretical1RM: 315,
        weight: 315,
        reps: 1,
      });
    });
  });

  describe('calculateWeightForReps', () => {
    it('should return 1RM itself when target is 1 rep', () => {
      expect(calculateWeightForReps(225, 1)).toBe(225);
      expect(calculateWeightForReps(315, 1)).toBe(315);
    });

    it('should calculate correct weight for 5 reps', () => {
      // weight = 225 / (1 + 5/30) = 225 / 1.1667 = 192.86... ≈ 193
      expect(calculateWeightForReps(225, 5)).toBe(193);
    });

    it('should calculate correct weight for 3 reps', () => {
      // weight = 315 / (1 + 3/30) = 315 / 1.1 = 286.36... ≈ 286
      expect(calculateWeightForReps(315, 3)).toBe(286);
    });

    it('should be the inverse of calculateOneRM', () => {
      // If we calculate 1RM from weight/reps, then calculate weight back for those reps,
      // we should get approximately the same weight (within rounding)
      const originalWeight = 200;
      const reps = 5;
      const oneRM = calculateOneRM(originalWeight, reps);
      const calculatedWeight = calculateWeightForReps(oneRM, reps);

      // Should be within 1 lb due to rounding
      expect(Math.abs(calculatedWeight - originalWeight)).toBeLessThanOrEqual(1);
    });

    it('should calculate correct weight for high rep sets', () => {
      // weight = 200 / (1 + 10/30) = 200 / 1.3333 = 150
      expect(calculateWeightForReps(200, 10)).toBe(150);
    });
  });
});

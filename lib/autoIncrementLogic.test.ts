import {
  getTargetReps,
  getIncrementAmount,
  calculateNewOneRM,
  calculateCycleProgression,
  shouldProgress,
  LiftType,
  AMRAPResult,
  OneRMValues,
} from './autoIncrementLogic';

describe('autoIncrementLogic', () => {
  describe('getTargetReps', () => {
    it('should return 5 for week 1', () => {
      expect(getTargetReps(1)).toBe(5);
    });

    it('should return 3 for week 2', () => {
      expect(getTargetReps(2)).toBe(3);
    });

    it('should return 1 for week 3', () => {
      expect(getTargetReps(3)).toBe(1);
    });

    it('should return 5 for week 4 (deload)', () => {
      expect(getTargetReps(4)).toBe(5);
    });
  });

  describe('getIncrementAmount', () => {
    describe('pounds (lbs)', () => {
      it('should return 10 for squat', () => {
        expect(getIncrementAmount('squat', 'lbs')).toBe(10);
      });

      it('should return 5 for bench', () => {
        expect(getIncrementAmount('bench', 'lbs')).toBe(5);
      });

      it('should return 10 for deadlift', () => {
        expect(getIncrementAmount('deadlift', 'lbs')).toBe(10);
      });

      it('should return 5 for overhead press', () => {
        expect(getIncrementAmount('overheadPress', 'lbs')).toBe(5);
      });
    });

    describe('kilograms (kg)', () => {
      it('should return 5 for squat', () => {
        expect(getIncrementAmount('squat', 'kg')).toBe(5);
      });

      it('should return 2.5 for bench', () => {
        expect(getIncrementAmount('bench', 'kg')).toBe(2.5);
      });

      it('should return 5 for deadlift', () => {
        expect(getIncrementAmount('deadlift', 'kg')).toBe(5);
      });

      it('should return 2.5 for overhead press', () => {
        expect(getIncrementAmount('overheadPress', 'kg')).toBe(2.5);
      });
    });
  });

  describe('calculateNewOneRM', () => {
    it('should increase 1RM when target met in week 1 (5+ reps)', () => {
      const result = calculateNewOneRM(
        300,
        { lift: 'squat', weekNumber: 1, reps: 7, weight: 255 },
        'lbs'
      );

      expect(result).toEqual({
        lift: 'squat',
        currentOneRM: 300,
        newOneRM: 310, // +10 lbs
        increased: true,
        targetReps: 5,
        actualReps: 7,
      });
    });

    it('should increase 1RM when exactly hitting target', () => {
      const result = calculateNewOneRM(
        300,
        { lift: 'squat', weekNumber: 1, reps: 5, weight: 255 },
        'lbs'
      );

      expect(result.increased).toBe(true);
      expect(result.newOneRM).toBe(310);
    });

    it('should NOT increase 1RM when target missed', () => {
      const result = calculateNewOneRM(
        300,
        { lift: 'squat', weekNumber: 1, reps: 3, weight: 255 }, // Only 3 when 5+ required
        'lbs'
      );

      expect(result).toEqual({
        lift: 'squat',
        currentOneRM: 300,
        newOneRM: 300, // No change
        increased: false,
        targetReps: 5,
        actualReps: 3,
      });
    });

    it('should increase bench by 5 lbs when target met', () => {
      const result = calculateNewOneRM(
        185,
        { lift: 'bench', weekNumber: 2, reps: 5, weight: 165 }, // 3+ required
        'lbs'
      );

      expect(result.increased).toBe(true);
      expect(result.newOneRM).toBe(190); // +5 lbs for bench
    });

    it('should use kg increments when units are kg', () => {
      const result = calculateNewOneRM(
        140, // kg
        { lift: 'deadlift', weekNumber: 3, reps: 3, weight: 133 }, // 1+ required
        'kg'
      );

      expect(result.increased).toBe(true);
      expect(result.newOneRM).toBe(145); // +5 kg for deadlift
    });

    it('should use 2.5 kg increment for upper body in kg', () => {
      const result = calculateNewOneRM(
        60,
        { lift: 'overheadPress', weekNumber: 1, reps: 8, weight: 51 },
        'kg'
      );

      expect(result.newOneRM).toBe(62.5);
    });
  });

  describe('calculateCycleProgression', () => {
    const currentValues: OneRMValues = {
      squat: 300,
      bench: 200,
      deadlift: 350,
      overheadPress: 135,
    };

    it('should increment lifts where targets were met', () => {
      const amrapResults: AMRAPResult[] = [
        { lift: 'squat', weekNumber: 3, reps: 3, weight: 285 }, // Met 1+ target
        { lift: 'bench', weekNumber: 3, reps: 0, weight: 190 }, // Missed 1+ target
        { lift: 'deadlift', weekNumber: 3, reps: 2, weight: 332 }, // Met 1+ target
        { lift: 'overheadPress', weekNumber: 3, reps: 1, weight: 128 }, // Met 1+ target
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues).toEqual({
        squat: 310, // +10
        bench: 200, // No change (missed target)
        deadlift: 360, // +10
        overheadPress: 140, // +5
      });
    });

    it('should prefer week 3 results when multiple weeks available', () => {
      const amrapResults: AMRAPResult[] = [
        { lift: 'squat', weekNumber: 1, reps: 10, weight: 255 }, // Week 1 great
        { lift: 'squat', weekNumber: 2, reps: 8, weight: 270 }, // Week 2 great
        { lift: 'squat', weekNumber: 3, reps: 0, weight: 285 }, // Week 3 failed
      ];

      const result = calculateCycleProgression(
        { ...currentValues },
        amrapResults,
        'lbs'
      );

      // Should use week 3 result, which failed
      expect(result.newValues.squat).toBe(300); // No change
    });

    it('should handle missing AMRAP results for some lifts', () => {
      const amrapResults: AMRAPResult[] = [
        { lift: 'squat', weekNumber: 1, reps: 7, weight: 255 },
        // No bench, deadlift, or OHP results
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues.squat).toBe(310); // +10 for meeting target
      expect(result.newValues.bench).toBe(200); // No change (no result)
      expect(result.newValues.deadlift).toBe(350); // No change (no result)
      expect(result.newValues.overheadPress).toBe(135); // No change (no result)
    });

    it('should provide details for all lifts', () => {
      const amrapResults: AMRAPResult[] = [
        { lift: 'squat', weekNumber: 1, reps: 8, weight: 255 },
        { lift: 'bench', weekNumber: 1, reps: 6, weight: 170 },
        { lift: 'deadlift', weekNumber: 1, reps: 5, weight: 298 },
        { lift: 'overheadPress', weekNumber: 1, reps: 4, weight: 115 },
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.details).toHaveLength(4);
      expect(result.details.map((d) => d.lift)).toEqual([
        'squat',
        'bench',
        'deadlift',
        'overheadPress',
      ]);
    });
  });

  describe('shouldProgress', () => {
    it('should return true when reps meet target', () => {
      expect(shouldProgress(1, 5)).toBe(true);
      expect(shouldProgress(1, 10)).toBe(true);
      expect(shouldProgress(2, 3)).toBe(true);
      expect(shouldProgress(3, 1)).toBe(true);
    });

    it('should return false when reps below target', () => {
      expect(shouldProgress(1, 4)).toBe(false);
      expect(shouldProgress(2, 2)).toBe(false);
      expect(shouldProgress(3, 0)).toBe(false);
    });
  });
});

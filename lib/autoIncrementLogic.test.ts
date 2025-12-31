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

    it('should increment lifts where ALL targets were met across all weeks', () => {
      const amrapResults: AMRAPResult[] = [
        // Squat: met all targets (5+, 3+, 1+)
        { lift: 'squat', weekNumber: 1, reps: 7, weight: 255 },
        { lift: 'squat', weekNumber: 2, reps: 5, weight: 270 },
        { lift: 'squat', weekNumber: 3, reps: 3, weight: 285 },
        // Bench: met all targets
        { lift: 'bench', weekNumber: 1, reps: 5, weight: 170 },
        { lift: 'bench', weekNumber: 2, reps: 3, weight: 180 },
        { lift: 'bench', weekNumber: 3, reps: 1, weight: 190 },
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues.squat).toBe(310); // +10 for meeting all targets
      expect(result.newValues.bench).toBe(205); // +5 for meeting all targets
      expect(result.newValues.deadlift).toBe(350); // No change (no results)
      expect(result.newValues.overheadPress).toBe(135); // No change (no results)
    });

    it('should NOT increment if week 1 target was missed (4 reps when 5+ required)', () => {
      const amrapResults: AMRAPResult[] = [
        // Squat: FAILED week 1 (only 4 reps when 5+ required)
        { lift: 'squat', weekNumber: 1, reps: 4, weight: 255 }, // FAILED
        { lift: 'squat', weekNumber: 2, reps: 5, weight: 270 }, // Met 3+
        { lift: 'squat', weekNumber: 3, reps: 3, weight: 285 }, // Met 1+
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues.squat).toBe(300); // No change - failed week 1
      const squatDetail = result.details.find((d) => d.lift === 'squat');
      expect(squatDetail?.increased).toBe(false);
      expect(squatDetail?.targetReps).toBe(5);
      expect(squatDetail?.actualReps).toBe(4);
    });

    it('should NOT increment if week 2 target was missed (2 reps when 3+ required)', () => {
      const amrapResults: AMRAPResult[] = [
        { lift: 'bench', weekNumber: 1, reps: 8, weight: 170 }, // Met 5+
        { lift: 'bench', weekNumber: 2, reps: 2, weight: 180 }, // FAILED 3+
        { lift: 'bench', weekNumber: 3, reps: 3, weight: 190 }, // Met 1+
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues.bench).toBe(200); // No change - failed week 2
    });

    it('should NOT increment if week 3 target was missed (0 reps when 1+ required)', () => {
      const amrapResults: AMRAPResult[] = [
        { lift: 'deadlift', weekNumber: 1, reps: 10, weight: 298 }, // Met 5+
        { lift: 'deadlift', weekNumber: 2, reps: 8, weight: 315 }, // Met 3+
        { lift: 'deadlift', weekNumber: 3, reps: 0, weight: 332 }, // FAILED 1+
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues.deadlift).toBe(350); // No change - failed week 3
    });

    it('should handle mixed results - some lifts pass, some fail', () => {
      const amrapResults: AMRAPResult[] = [
        // Squat: met all targets
        { lift: 'squat', weekNumber: 1, reps: 5, weight: 255 },
        { lift: 'squat', weekNumber: 2, reps: 3, weight: 270 },
        { lift: 'squat', weekNumber: 3, reps: 1, weight: 285 },
        // Bench: failed week 1
        { lift: 'bench', weekNumber: 1, reps: 4, weight: 170 }, // FAILED
        { lift: 'bench', weekNumber: 2, reps: 5, weight: 180 },
        { lift: 'bench', weekNumber: 3, reps: 2, weight: 190 },
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues.squat).toBe(310); // +10 (all targets met)
      expect(result.newValues.bench).toBe(200); // No change (failed week 1)
    });

    it('should increment if only some weeks were completed but all completed weeks met target', () => {
      const amrapResults: AMRAPResult[] = [
        // Only week 1 and 2 completed, both targets met
        { lift: 'squat', weekNumber: 1, reps: 6, weight: 255 },
        { lift: 'squat', weekNumber: 2, reps: 4, weight: 270 },
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.newValues.squat).toBe(310); // +10 (all completed weeks met target)
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
        { lift: 'overheadPress', weekNumber: 1, reps: 4, weight: 115 }, // FAILED 5+
      ];

      const result = calculateCycleProgression(currentValues, amrapResults, 'lbs');

      expect(result.details).toHaveLength(4);
      expect(result.details.map((d) => d.lift)).toEqual([
        'squat',
        'bench',
        'deadlift',
        'overheadPress',
      ]);

      // OHP should show it failed
      const ohpDetail = result.details.find((d) => d.lift === 'overheadPress');
      expect(ohpDetail?.increased).toBe(false);
      expect(ohpDetail?.newOneRM).toBe(135);
    });

    it('should use correct increment amounts (kg)', () => {
      const kgValues: OneRMValues = {
        squat: 140,
        bench: 90,
        deadlift: 160,
        overheadPress: 60,
      };

      const amrapResults: AMRAPResult[] = [
        { lift: 'squat', weekNumber: 3, reps: 3, weight: 133 },
        { lift: 'bench', weekNumber: 3, reps: 2, weight: 85 },
      ];

      const result = calculateCycleProgression(kgValues, amrapResults, 'kg');

      expect(result.newValues.squat).toBe(145); // +5 kg
      expect(result.newValues.bench).toBe(92.5); // +2.5 kg
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

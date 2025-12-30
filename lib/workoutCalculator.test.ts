/**
 * Unit Tests for Workout Calculator
 *
 * Tests all calculation functions for the 5/3/1 workout program
 */

import {
  calculateTrainingMax,
  roundToPlate,
  generateWeek,
  generateWorkoutPlan,
  type OneRMValues,
  type WorkoutSet,
  type WorkoutPlanData,
} from './workoutCalculator';

describe('calculateTrainingMax', () => {
  describe('standard calculations', () => {
    it('should calculate TM as 90% of 1RM', () => {
      expect(calculateTrainingMax(100)).toBe(90);
      expect(calculateTrainingMax(200)).toBe(180);
      expect(calculateTrainingMax(315)).toBe(283.5);
    });

    it('should handle large numbers', () => {
      expect(calculateTrainingMax(1000)).toBe(900);
      expect(calculateTrainingMax(2000)).toBe(1800);
    });

    it('should handle decimal values', () => {
      expect(calculateTrainingMax(225.5)).toBeCloseTo(202.95);
      expect(calculateTrainingMax(133.33)).toBeCloseTo(119.997);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for zero input', () => {
      expect(calculateTrainingMax(0)).toBe(0);
    });

    it('should return 0 for negative input', () => {
      expect(calculateTrainingMax(-100)).toBe(0);
      expect(calculateTrainingMax(-50)).toBe(0);
    });

    it('should handle very small positive numbers', () => {
      expect(calculateTrainingMax(1)).toBe(0.9);
      expect(calculateTrainingMax(0.5)).toBeCloseTo(0.45);
    });
  });
});

describe('roundToPlate', () => {
  describe('pounds (lbs) rounding', () => {
    it('should round to nearest 5 lbs', () => {
      expect(roundToPlate(182.5, 'lbs')).toBe(185);
      expect(roundToPlate(183, 'lbs')).toBe(185);
      expect(roundToPlate(182, 'lbs')).toBe(180);
    });

    it('should handle exact increments', () => {
      expect(roundToPlate(185, 'lbs')).toBe(185);
      expect(roundToPlate(200, 'lbs')).toBe(200);
    });

    it('should round down when appropriate', () => {
      expect(roundToPlate(187.4, 'lbs')).toBe(185);
      expect(roundToPlate(142.4, 'lbs')).toBe(140);
    });

    it('should round up when appropriate', () => {
      expect(roundToPlate(187.5, 'lbs')).toBe(190);
      expect(roundToPlate(142.6, 'lbs')).toBe(145);
    });
  });

  describe('kilograms (kg) rounding', () => {
    it('should round to nearest 2.5 kg', () => {
      expect(roundToPlate(82.5, 'kg')).toBe(82.5);
      expect(roundToPlate(83, 'kg')).toBe(82.5);
      expect(roundToPlate(84, 'kg')).toBe(85);
    });

    it('should handle exact increments', () => {
      expect(roundToPlate(100, 'kg')).toBe(100);
      expect(roundToPlate(102.5, 'kg')).toBe(102.5);
    });

    it('should round correctly at boundaries', () => {
      expect(roundToPlate(81.25, 'kg')).toBe(82.5);
      expect(roundToPlate(81.24, 'kg')).toBe(80);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for zero input', () => {
      expect(roundToPlate(0, 'lbs')).toBe(0);
      expect(roundToPlate(0, 'kg')).toBe(0);
    });

    it('should return 0 for negative input', () => {
      expect(roundToPlate(-100, 'lbs')).toBe(0);
      expect(roundToPlate(-50, 'kg')).toBe(0);
    });

    it('should handle very small weights', () => {
      expect(roundToPlate(2.5, 'lbs')).toBe(5);
      expect(roundToPlate(1, 'lbs')).toBe(0);
      expect(roundToPlate(1.25, 'kg')).toBe(2.5);
      expect(roundToPlate(0.5, 'kg')).toBe(0);
    });
  });
});

describe('generateWeek', () => {
  const trainingMax = 200; // Using a round number for easy verification

  describe('Week 1 - 5/5/5 (65%/75%/85%)', () => {
    it('should generate correct percentages for Week 1', () => {
      const sets = generateWeek(trainingMax, 1, 'lbs');
      expect(sets).toHaveLength(3);
      expect(sets[0].percentage).toBe(65);
      expect(sets[1].percentage).toBe(75);
      expect(sets[2].percentage).toBe(85);
    });

    it('should calculate correct weights for Week 1', () => {
      const sets = generateWeek(trainingMax, 1, 'lbs');
      expect(sets[0].weight).toBe(130); // 200 * 0.65 = 130
      expect(sets[1].weight).toBe(150); // 200 * 0.75 = 150
      expect(sets[2].weight).toBe(170); // 200 * 0.85 = 170
    });

    it('should set correct reps for Week 1 (all 5s)', () => {
      const sets = generateWeek(trainingMax, 1, 'lbs');
      expect(sets.every((s) => s.reps === 5)).toBe(true);
    });

    it('should mark last set as AMRAP', () => {
      const sets = generateWeek(trainingMax, 1, 'lbs');
      expect(sets[0].isAmrap).toBe(false);
      expect(sets[1].isAmrap).toBe(false);
      expect(sets[2].isAmrap).toBe(true);
    });
  });

  describe('Week 2 - 3/3/3 (70%/80%/90%)', () => {
    it('should generate correct percentages for Week 2', () => {
      const sets = generateWeek(trainingMax, 2, 'lbs');
      expect(sets[0].percentage).toBe(70);
      expect(sets[1].percentage).toBe(80);
      expect(sets[2].percentage).toBe(90);
    });

    it('should calculate correct weights for Week 2', () => {
      const sets = generateWeek(trainingMax, 2, 'lbs');
      expect(sets[0].weight).toBe(140); // 200 * 0.70 = 140
      expect(sets[1].weight).toBe(160); // 200 * 0.80 = 160
      expect(sets[2].weight).toBe(180); // 200 * 0.90 = 180
    });

    it('should set correct reps for Week 2 (all 3s)', () => {
      const sets = generateWeek(trainingMax, 2, 'lbs');
      expect(sets.every((s) => s.reps === 3)).toBe(true);
    });

    it('should mark last set as AMRAP', () => {
      const sets = generateWeek(trainingMax, 2, 'lbs');
      expect(sets[2].isAmrap).toBe(true);
    });
  });

  describe('Week 3 - 5/3/1 (75%/85%/95%)', () => {
    it('should generate correct percentages for Week 3', () => {
      const sets = generateWeek(trainingMax, 3, 'lbs');
      expect(sets[0].percentage).toBe(75);
      expect(sets[1].percentage).toBe(85);
      expect(sets[2].percentage).toBe(95);
    });

    it('should calculate correct weights for Week 3', () => {
      const sets = generateWeek(trainingMax, 3, 'lbs');
      expect(sets[0].weight).toBe(150); // 200 * 0.75 = 150
      expect(sets[1].weight).toBe(170); // 200 * 0.85 = 170
      expect(sets[2].weight).toBe(190); // 200 * 0.95 = 190
    });

    it('should set correct reps for Week 3 (5/3/1)', () => {
      const sets = generateWeek(trainingMax, 3, 'lbs');
      expect(sets[0].reps).toBe(5);
      expect(sets[1].reps).toBe(3);
      expect(sets[2].reps).toBe(1);
    });

    it('should mark last set as AMRAP', () => {
      const sets = generateWeek(trainingMax, 3, 'lbs');
      expect(sets[2].isAmrap).toBe(true);
    });
  });

  describe('Week 4 - Deload (40%/50%/60%)', () => {
    it('should generate correct percentages for Week 4', () => {
      const sets = generateWeek(trainingMax, 4, 'lbs');
      expect(sets[0].percentage).toBe(40);
      expect(sets[1].percentage).toBe(50);
      expect(sets[2].percentage).toBe(60);
    });

    it('should calculate correct weights for Week 4', () => {
      const sets = generateWeek(trainingMax, 4, 'lbs');
      expect(sets[0].weight).toBe(80); // 200 * 0.40 = 80
      expect(sets[1].weight).toBe(100); // 200 * 0.50 = 100
      expect(sets[2].weight).toBe(120); // 200 * 0.60 = 120
    });

    it('should set correct reps for Week 4 (all 5s)', () => {
      const sets = generateWeek(trainingMax, 4, 'lbs');
      expect(sets.every((s) => s.reps === 5)).toBe(true);
    });

    it('should NOT mark any sets as AMRAP during deload', () => {
      const sets = generateWeek(trainingMax, 4, 'lbs');
      expect(sets.every((s) => s.isAmrap === false)).toBe(true);
    });
  });

  describe('weight rounding', () => {
    it('should round weights to nearest 5 lbs', () => {
      const sets = generateWeek(185, 1, 'lbs'); // TM of 185
      // 185 * 0.65 = 120.25 -> 120
      expect(sets[0].weight).toBe(120);
      // 185 * 0.75 = 138.75 -> 140
      expect(sets[1].weight).toBe(140);
      // 185 * 0.85 = 157.25 -> 155
      expect(sets[2].weight).toBe(155);
    });

    it('should round weights to nearest 2.5 kg', () => {
      const sets = generateWeek(100, 1, 'kg'); // TM of 100 kg
      expect(sets[0].weight).toBe(65); // 100 * 0.65 = 65
      expect(sets[1].weight).toBe(75); // 100 * 0.75 = 75
      expect(sets[2].weight).toBe(85); // 100 * 0.85 = 85
    });
  });
});

describe('generateWorkoutPlan', () => {
  const testOneRMs: OneRMValues = {
    squat: 300,
    bench: 225,
    deadlift: 350,
    overheadPress: 135,
  };

  describe('structure validation', () => {
    it('should generate a plan with 4 weeks', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');
      expect(plan.weeks).toHaveLength(4);
    });

    it('should include all four lifts in each week', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');
      plan.weeks.forEach((week) => {
        expect(week.lifts).toHaveLength(4);
        expect(week.lifts.map((l) => l.lift)).toEqual([
          'squat',
          'bench',
          'deadlift',
          'overheadPress',
        ]);
      });
    });

    it('should include 3 sets per lift per week', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');
      plan.weeks.forEach((week) => {
        week.lifts.forEach((lift) => {
          expect(lift.sets).toHaveLength(3);
        });
      });
    });

    it('should have correct week numbers and names', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');
      expect(plan.weeks[0].weekNumber).toBe(1);
      expect(plan.weeks[0].weekName).toBe('Week 1 - 5/5/5');
      expect(plan.weeks[1].weekNumber).toBe(2);
      expect(plan.weeks[1].weekName).toBe('Week 2 - 3/3/3');
      expect(plan.weeks[2].weekNumber).toBe(3);
      expect(plan.weeks[2].weekName).toBe('Week 3 - 5/3/1');
      expect(plan.weeks[3].weekNumber).toBe(4);
      expect(plan.weeks[3].weekName).toBe('Week 4 - Deload');
    });
  });

  describe('training max calculations', () => {
    it('should calculate and round training maxes correctly (lbs)', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');
      // 300 * 0.9 = 270 -> 270 (already divisible by 5)
      expect(plan.trainingMaxValues.squat).toBe(270);
      // 225 * 0.9 = 202.5 -> 205
      expect(plan.trainingMaxValues.bench).toBe(205);
      // 350 * 0.9 = 315 -> 315
      expect(plan.trainingMaxValues.deadlift).toBe(315);
      // 135 * 0.9 = 121.5 -> 120
      expect(plan.trainingMaxValues.overheadPress).toBe(120);
    });

    it('should calculate and round training maxes correctly (kg)', () => {
      const kgOneRMs: OneRMValues = {
        squat: 140,
        bench: 100,
        deadlift: 160,
        overheadPress: 60,
      };
      const plan = generateWorkoutPlan(kgOneRMs, 'kg');
      // 140 * 0.9 = 126 -> 125 (rounds to nearest 2.5)
      expect(plan.trainingMaxValues.squat).toBe(125);
      // 100 * 0.9 = 90 -> 90
      expect(plan.trainingMaxValues.bench).toBe(90);
      // 160 * 0.9 = 144 -> 145
      expect(plan.trainingMaxValues.deadlift).toBe(145);
      // 60 * 0.9 = 54 -> 55
      expect(plan.trainingMaxValues.overheadPress).toBe(55);
    });
  });

  describe('lift names', () => {
    it('should include proper display names for all lifts', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');
      const week1Lifts = plan.weeks[0].lifts;
      expect(week1Lifts[0].liftName).toBe('Squat');
      expect(week1Lifts[1].liftName).toBe('Bench Press');
      expect(week1Lifts[2].liftName).toBe('Deadlift');
      expect(week1Lifts[3].liftName).toBe('Overhead Press');
    });
  });

  describe('units and rounding preference', () => {
    it('should store units in the plan', () => {
      const lbsPlan = generateWorkoutPlan(testOneRMs, 'lbs');
      expect(lbsPlan.units).toBe('lbs');

      const kgPlan = generateWorkoutPlan(testOneRMs, 'kg');
      expect(kgPlan.units).toBe('kg');
    });

    it('should store rounding preference in the plan', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs', 'plate');
      expect(plan.roundingPreference).toBe('plate');

      const plan2 = generateWorkoutPlan(testOneRMs, 'lbs', '2.5');
      expect(plan2.roundingPreference).toBe('2.5');
    });

    it('should default rounding preference to plate', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');
      expect(plan.roundingPreference).toBe('plate');
    });
  });

  describe('complete workout verification', () => {
    it('should generate a complete and valid 4-week plan', () => {
      const plan = generateWorkoutPlan(testOneRMs, 'lbs');

      // Verify structure
      expect(plan.trainingMaxValues).toBeDefined();
      expect(plan.units).toBe('lbs');
      expect(plan.weeks).toHaveLength(4);

      // Verify each week has correct lifts
      plan.weeks.forEach((week, weekIndex) => {
        expect(week.weekNumber).toBe((weekIndex + 1) as 1 | 2 | 3 | 4);
        expect(week.lifts).toHaveLength(4);

        // Verify each lift has sets
        week.lifts.forEach((lift) => {
          expect(lift.sets).toHaveLength(3);
          expect(lift.trainingMax).toBeGreaterThan(0);

          // Verify each set has required properties
          lift.sets.forEach((set, setIndex) => {
            expect(set.setNumber).toBe(setIndex + 1);
            expect(set.percentage).toBeGreaterThan(0);
            expect(set.weight).toBeGreaterThan(0);
            expect(set.reps).toBeGreaterThan(0);
            expect(typeof set.isAmrap).toBe('boolean');
          });
        });
      });
    });
  });
});

import { detectPR, getBest1RM, getBestRepsAtWeight, AMRAPEntry, PRDetails } from './prDetection';

describe('prDetection', () => {
  describe('detectPR', () => {
    const baseDate = new Date('2024-01-01');
    const laterDate = new Date('2024-01-15');
    const latestDate = new Date('2024-02-01');

    it('should return no PR when history is empty', () => {
      const current: AMRAPEntry = {
        lift: 'squat',
        weight: 200,
        reps: 5,
        date: latestDate,
      };

      const result = detectPR(current, []);

      expect(result).toEqual({
        isPR: false,
        prType: null,
      });
    });

    it('should detect a rep PR when more reps at same weight', () => {
      const current: AMRAPEntry = {
        lift: 'squat',
        weight: 200,
        reps: 8,
        date: latestDate,
      };

      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate, notes: 'Felt good' },
      ];

      const result = detectPR(current, history);

      expect(result.isPR).toBe(true);
      expect(result.prType).toBe('both'); // Also a 1RM PR since theoretical 1RM increased
      expect(result.repPR).toEqual({
        currentReps: 8,
        previousReps: 5,
        improvement: 3,
        previousDate: baseDate,
        previousNotes: 'Felt good',
        weight: 200,
      });
    });

    it('should detect a 1RM PR when theoretical 1RM is higher', () => {
      const current: AMRAPEntry = {
        lift: 'squat',
        weight: 225, // Higher weight
        reps: 3,
        date: latestDate,
      };

      // Previous: 200 × (1 + 5/30) = 233.33
      // Current: 225 × (1 + 3/30) = 247.5
      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate },
      ];

      const result = detectPR(current, history);

      expect(result.isPR).toBe(true);
      expect(result.prType).toBe('1rm');
      expect(result.oneRMPR).toBeDefined();
      expect(result.oneRMPR!.current1RM).toBe(248); // 225 × 1.1 = 247.5 ≈ 248
      expect(result.oneRMPR!.previous1RM).toBe(233); // 200 × 1.1667 = 233.33
      expect(result.oneRMPR!.improvement).toBe(15); // 248 - 233 = 15
    });

    it('should detect both rep PR and 1RM PR', () => {
      const current: AMRAPEntry = {
        lift: 'bench',
        weight: 185,
        reps: 7,
        date: latestDate,
      };

      // Previous at same weight with fewer reps
      const history: AMRAPEntry[] = [
        { lift: 'bench', weight: 185, reps: 5, date: baseDate },
      ];

      const result = detectPR(current, history);

      expect(result.isPR).toBe(true);
      expect(result.prType).toBe('both');
      expect(result.repPR).toBeDefined();
      expect(result.oneRMPR).toBeDefined();
    });

    it('should return no PR when performance is worse', () => {
      const current: AMRAPEntry = {
        lift: 'squat',
        weight: 200,
        reps: 3, // Fewer reps than before
        date: latestDate,
      };

      // Previous: 200 × (1 + 5/30) = 233.33
      // Current: 200 × (1 + 3/30) = 220
      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate },
      ];

      const result = detectPR(current, history);

      expect(result.isPR).toBe(false);
      expect(result.prType).toBe(null);
    });

    it('should return no PR when performance is exactly the same', () => {
      const current: AMRAPEntry = {
        lift: 'squat',
        weight: 200,
        reps: 5,
        date: latestDate,
      };

      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate },
      ];

      const result = detectPR(current, history);

      expect(result.isPR).toBe(false);
      expect(result.prType).toBe(null);
    });

    it('should only compare against same lift', () => {
      const current: AMRAPEntry = {
        lift: 'squat',
        weight: 200,
        reps: 5,
        date: latestDate,
      };

      // Even though bench has higher reps, it's a different lift
      const history: AMRAPEntry[] = [
        { lift: 'bench', weight: 200, reps: 10, date: baseDate },
        { lift: 'deadlift', weight: 200, reps: 8, date: baseDate },
      ];

      const result = detectPR(current, history);

      // No squat history, so no PR
      expect(result.isPR).toBe(false);
      expect(result.prType).toBe(null);
    });

    it('should be case-insensitive for lift names', () => {
      const current: AMRAPEntry = {
        lift: 'SQUAT',
        weight: 200,
        reps: 8,
        date: latestDate,
      };

      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate },
      ];

      const result = detectPR(current, history);

      expect(result.isPR).toBe(true);
    });

    it('should find the best beaten entry when multiple history entries exist', () => {
      const current: AMRAPEntry = {
        lift: 'squat',
        weight: 200,
        reps: 10,
        date: latestDate,
      };

      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate },
        { lift: 'squat', weight: 200, reps: 7, date: laterDate }, // Best beaten entry
        { lift: 'squat', weight: 200, reps: 3, date: baseDate },
      ];

      const result = detectPR(current, history);

      expect(result.repPR!.previousReps).toBe(7); // Beat the 7-rep entry
      expect(result.repPR!.improvement).toBe(3); // 10 - 7 = 3
    });
  });

  describe('getBest1RM', () => {
    const baseDate = new Date('2024-01-01');

    it('should return null when no history', () => {
      expect(getBest1RM('squat', [])).toBeNull();
    });

    it('should return null when no history for that lift', () => {
      const history: AMRAPEntry[] = [
        { lift: 'bench', weight: 185, reps: 5, date: baseDate },
      ];

      expect(getBest1RM('squat', history)).toBeNull();
    });

    it('should return the best theoretical 1RM for a lift', () => {
      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate }, // 233
        { lift: 'squat', weight: 225, reps: 3, date: baseDate }, // 248 - best
        { lift: 'squat', weight: 180, reps: 8, date: baseDate }, // 228
      ];

      expect(getBest1RM('squat', history)).toBe(248);
    });

    it('should be case-insensitive', () => {
      const history: AMRAPEntry[] = [
        { lift: 'SQUAT', weight: 200, reps: 5, date: baseDate },
      ];

      expect(getBest1RM('squat', history)).toBe(233);
    });
  });

  describe('getBestRepsAtWeight', () => {
    const baseDate = new Date('2024-01-01');

    it('should return null when no history', () => {
      expect(getBestRepsAtWeight('squat', 200, [])).toBeNull();
    });

    it('should return null when no history at that weight', () => {
      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 185, reps: 5, date: baseDate },
      ];

      expect(getBestRepsAtWeight('squat', 200, history)).toBeNull();
    });

    it('should return the best reps at a specific weight', () => {
      const history: AMRAPEntry[] = [
        { lift: 'squat', weight: 200, reps: 5, date: baseDate },
        { lift: 'squat', weight: 200, reps: 7, date: baseDate }, // best
        { lift: 'squat', weight: 200, reps: 3, date: baseDate },
        { lift: 'squat', weight: 225, reps: 10, date: baseDate }, // different weight
      ];

      expect(getBestRepsAtWeight('squat', 200, history)).toBe(7);
    });

    it('should be case-insensitive', () => {
      const history: AMRAPEntry[] = [
        { lift: 'SQUAT', weight: 200, reps: 8, date: baseDate },
      ];

      expect(getBestRepsAtWeight('squat', 200, history)).toBe(8);
    });
  });
});

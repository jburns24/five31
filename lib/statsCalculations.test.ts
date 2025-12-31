import { findHeaviestAMRAPs, transformAMRAPToChartData } from './statsCalculations'
import type { IAMRAPHistoryEntry } from '@/models/User'
import { Types } from 'mongoose'

// Helper to create a mock AMRAP entry
function createAMRAPEntry(
  lift: 'squat' | 'bench' | 'deadlift' | 'overheadPress',
  weight: number,
  reps: number,
  date: Date = new Date(),
  notes?: string,
  weekNumber: number = 1
): IAMRAPHistoryEntry {
  return {
    lift,
    weight,
    reps,
    units: 'lbs',
    date,
    workoutPlanId: new Types.ObjectId(),
    weekNumber,
    notes,
  }
}

describe('statsCalculations', () => {
  describe('findHeaviestAMRAPs', () => {
    it('should return empty object when history is empty', () => {
      const result = findHeaviestAMRAPs([])
      expect(result).toEqual({})
    })

    it('should return empty object when history is null/undefined', () => {
      const result = findHeaviestAMRAPs(null as unknown as IAMRAPHistoryEntry[])
      expect(result).toEqual({})
    })

    it('should find heaviest record for single lift with multiple entries', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5),
        createAMRAPEntry('squat', 225, 3),
        createAMRAPEntry('squat', 185, 8),
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.squat).toBeDefined()
      expect(result.squat?.weight).toBe(225)
      expect(result.squat?.reps).toBe(3)
    })

    it('should find heaviest records for all four lifts', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 300, 5),
        createAMRAPEntry('bench', 200, 5),
        createAMRAPEntry('deadlift', 400, 3),
        createAMRAPEntry('overheadPress', 135, 6),
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.squat?.weight).toBe(300)
      expect(result.bench?.weight).toBe(200)
      expect(result.deadlift?.weight).toBe(400)
      expect(result.overheadPress?.weight).toBe(135)
    })

    it('should handle ties by preferring more reps', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 225, 3),
        createAMRAPEntry('squat', 225, 5),
        createAMRAPEntry('squat', 225, 4),
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.squat?.weight).toBe(225)
      expect(result.squat?.reps).toBe(5)
    })

    it('should include notes when present', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('bench', 185, 7, new Date(), 'Felt really strong today!'),
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.bench?.notes).toBe('Felt really strong today!')
    })

    it('should not include notes when not present', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('bench', 185, 7),
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.bench?.notes).toBeUndefined()
    })

    it('should only return data for lifts that exist in history', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 300, 5),
        createAMRAPEntry('deadlift', 400, 3),
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.squat).toBeDefined()
      expect(result.deadlift).toBeDefined()
      expect(result.bench).toBeUndefined()
      expect(result.overheadPress).toBeUndefined()
    })

    it('should preserve the date of the heaviest entry', () => {
      const targetDate = new Date('2024-06-15')
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, new Date('2024-01-01')),
        createAMRAPEntry('squat', 250, 3, targetDate),
        createAMRAPEntry('squat', 225, 4, new Date('2024-12-01')),
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.squat?.date).toEqual(targetDate)
    })

    it('should preserve units from the heaviest entry', () => {
      const history: IAMRAPHistoryEntry[] = [
        {
          lift: 'squat',
          weight: 100,
          reps: 5,
          units: 'kg',
          date: new Date(),
          workoutPlanId: new Types.ObjectId(),
          weekNumber: 1,
        },
      ]

      const result = findHeaviestAMRAPs(history)

      expect(result.squat?.units).toBe('kg')
    })
  })

  describe('transformAMRAPToChartData', () => {
    it('should return empty array when history is empty', () => {
      const result = transformAMRAPToChartData([])
      expect(result).toEqual([])
    })

    it('should return empty array when history is null/undefined', () => {
      const result = transformAMRAPToChartData(null as unknown as IAMRAPHistoryEntry[])
      expect(result).toEqual([])
    })

    it('should exclude week 4 (deload) entries', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, new Date('2024-06-01'), undefined, 1),
        createAMRAPEntry('squat', 210, 3, new Date('2024-06-08'), undefined, 2),
        createAMRAPEntry('squat', 220, 1, new Date('2024-06-15'), undefined, 3),
        createAMRAPEntry('squat', 150, 5, new Date('2024-06-22'), undefined, 4), // Deload - should be excluded
      ]

      const result = transformAMRAPToChartData(history, 'all')

      expect(result).toHaveLength(3)
      // Verify all entries are from weeks 1-3
      expect(result.every((point) => point.squat !== undefined)).toBe(true)
    })

    it('should calculate theoretical 1RM using Epley formula', () => {
      // 200 lbs x 5 reps = 200 * (1 + 5/30) = 200 * 1.1667 = 233.33 ≈ 233
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, new Date('2024-06-01'), undefined, 1),
      ]

      const result = transformAMRAPToChartData(history, 'all')

      expect(result).toHaveLength(1)
      expect(result[0].squat).toBe(233)
    })

    it('should sort data points by date ascending', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 210, 5, new Date('2024-06-15'), undefined, 1),
        createAMRAPEntry('squat', 200, 5, new Date('2024-06-01'), undefined, 1),
        createAMRAPEntry('squat', 205, 5, new Date('2024-06-08'), undefined, 1),
      ]

      const result = transformAMRAPToChartData(history, 'all')

      expect(result).toHaveLength(3)
      expect(result[0].date).toBe('2024-06-01')
      expect(result[1].date).toBe('2024-06-08')
      expect(result[2].date).toBe('2024-06-15')
    })

    it('should group multiple lifts on the same date', () => {
      const sameDate = new Date('2024-06-01')
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, sameDate, undefined, 1),
        createAMRAPEntry('bench', 150, 5, sameDate, undefined, 1),
      ]

      const result = transformAMRAPToChartData(history, 'all')

      expect(result).toHaveLength(1)
      expect(result[0].squat).toBe(233) // 200 * (1 + 5/30)
      expect(result[0].bench).toBe(175) // 150 * (1 + 5/30)
    })

    it('should keep highest 1RM for same lift on same date', () => {
      const sameDate = new Date('2024-06-01')
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, sameDate, undefined, 1),
        createAMRAPEntry('squat', 225, 3, sameDate, undefined, 2), // Higher weight, fewer reps
      ]

      const result = transformAMRAPToChartData(history, 'all')

      expect(result).toHaveLength(1)
      // 225 x 3 = 225 * 1.1 = 247.5 ≈ 248 vs 200 x 5 = 233
      expect(result[0].squat).toBe(248)
    })

    it('should filter by 3 month time period', () => {
      const now = new Date()
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
      const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate())

      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, twoMonthsAgo, undefined, 1),
        createAMRAPEntry('squat', 180, 5, fourMonthsAgo, undefined, 1), // Should be excluded
      ]

      const result = transformAMRAPToChartData(history, '3mo')

      expect(result).toHaveLength(1)
    })

    it('should filter by 6 month time period', () => {
      const now = new Date()
      const fiveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, now.getDate())
      const sevenMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 7, now.getDate())

      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, fiveMonthsAgo, undefined, 1),
        createAMRAPEntry('squat', 180, 5, sevenMonthsAgo, undefined, 1), // Should be excluded
      ]

      const result = transformAMRAPToChartData(history, '6mo')

      expect(result).toHaveLength(1)
    })

    it('should filter by 1 year time period (default)', () => {
      const now = new Date()
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
      const eighteenMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 18, now.getDate())

      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, sixMonthsAgo, undefined, 1),
        createAMRAPEntry('squat', 180, 5, eighteenMonthsAgo, undefined, 1), // Should be excluded
      ]

      const result = transformAMRAPToChartData(history, '1yr')

      expect(result).toHaveLength(1)
    })

    it('should include all data when time period is all', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 200, 5, new Date('2020-01-01'), undefined, 1),
        createAMRAPEntry('squat', 180, 5, new Date('2024-06-01'), undefined, 1),
      ]

      const result = transformAMRAPToChartData(history, 'all')

      expect(result).toHaveLength(2)
    })

    it('should return empty when all entries are week 4', () => {
      const history: IAMRAPHistoryEntry[] = [
        createAMRAPEntry('squat', 150, 5, new Date('2024-06-22'), undefined, 4),
        createAMRAPEntry('bench', 100, 5, new Date('2024-06-23'), undefined, 4),
      ]

      const result = transformAMRAPToChartData(history, 'all')

      expect(result).toEqual([])
    })
  })
})

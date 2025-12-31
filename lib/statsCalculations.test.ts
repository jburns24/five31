import { findHeaviestAMRAPs } from './statsCalculations'
import type { IAMRAPHistoryEntry } from '@/models/User'
import { Types } from 'mongoose'

// Helper to create a mock AMRAP entry
function createAMRAPEntry(
  lift: 'squat' | 'bench' | 'deadlift' | 'overheadPress',
  weight: number,
  reps: number,
  date: Date = new Date(),
  notes?: string
): IAMRAPHistoryEntry {
  return {
    lift,
    weight,
    reps,
    units: 'lbs',
    date,
    workoutPlanId: new Types.ObjectId(),
    weekNumber: 1,
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
})

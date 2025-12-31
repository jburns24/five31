/**
 * Stats Calculation Utilities
 *
 * Functions for calculating statistics from AMRAP history for the Stats page.
 */

import type { IAMRAPHistoryEntry } from '@/models/User'
import type { LiftType } from '@/lib/autoIncrementLogic'

export interface HeaviestAMRAP {
  lift: LiftType
  weight: number
  reps: number
  units: 'lbs' | 'kg'
  date: Date
  notes?: string
}

export type HeaviestAMRAPsByLift = Partial<Record<LiftType, HeaviestAMRAP>>

/**
 * Find the heaviest AMRAP record for each lift.
 * "Heaviest" is determined by the highest weight lifted (regardless of reps).
 * In case of ties (same weight), the entry with more reps wins.
 *
 * @param amrapHistory - Array of AMRAP history entries
 * @returns Object mapping each lift to its heaviest AMRAP record
 */
export function findHeaviestAMRAPs(
  amrapHistory: IAMRAPHistoryEntry[]
): HeaviestAMRAPsByLift {
  const result: HeaviestAMRAPsByLift = {}

  if (!amrapHistory || amrapHistory.length === 0) {
    return result
  }

  const lifts: LiftType[] = ['squat', 'bench', 'deadlift', 'overheadPress']

  for (const lift of lifts) {
    const liftHistory = amrapHistory.filter((entry) => entry.lift === lift)

    if (liftHistory.length === 0) {
      continue
    }

    // Find the heaviest entry (by weight, then by reps for ties)
    const heaviest = liftHistory.reduce((best, current) => {
      if (current.weight > best.weight) {
        return current
      }
      if (current.weight === best.weight && current.reps > best.reps) {
        return current
      }
      return best
    })

    result[lift] = {
      lift,
      weight: heaviest.weight,
      reps: heaviest.reps,
      units: heaviest.units,
      date: heaviest.date,
      notes: heaviest.notes,
    }
  }

  return result
}

/**
 * Serialize heaviest AMRAPs for client component consumption.
 * Converts Date objects to ISO strings for JSON serialization.
 */
export interface SerializedHeaviestAMRAP {
  lift: LiftType
  weight: number
  reps: number
  units: 'lbs' | 'kg'
  date: string
  notes?: string
}

export type SerializedHeaviestAMRAPsByLift = Partial<Record<LiftType, SerializedHeaviestAMRAP>>

export function serializeHeaviestAMRAPs(
  heaviestAMRAPs: HeaviestAMRAPsByLift
): SerializedHeaviestAMRAPsByLift {
  const result: SerializedHeaviestAMRAPsByLift = {}

  for (const [lift, data] of Object.entries(heaviestAMRAPs)) {
    if (data) {
      result[lift as LiftType] = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
      }
    }
  }

  return result
}

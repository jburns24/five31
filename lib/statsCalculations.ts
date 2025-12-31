/**
 * Stats Calculation Utilities
 *
 * Functions for calculating statistics from AMRAP history for the Stats page.
 */

import type { IAMRAPHistoryEntry } from '@/models/User'
import type { LiftType } from '@/lib/autoIncrementLogic'
import { calculateOneRM } from '@/lib/oneRMCalculation'

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

/**
 * Chart data point for 1RM progress visualization
 */
export interface ChartDataPoint {
  date: string
  timestamp: number
  squat?: number
  bench?: number
  deadlift?: number
  overheadPress?: number
}

export type TimePeriod = '3mo' | '6mo' | '1yr' | 'all'

/**
 * Transform AMRAP history into chart data points.
 * - Filters to weeks 1-3 only (excludes week 4 deload)
 * - Calculates theoretical 1RM for each entry using Epley formula
 * - Sorts by date ascending
 * - Groups by date for multi-lift data points
 *
 * @param amrapHistory - Array of AMRAP history entries
 * @param timePeriod - Time period filter ('3mo', '6mo', '1yr', 'all')
 * @returns Array of chart data points sorted by date
 */
export function transformAMRAPToChartData(
  amrapHistory: IAMRAPHistoryEntry[],
  timePeriod: TimePeriod = '1yr'
): ChartDataPoint[] {
  if (!amrapHistory || amrapHistory.length === 0) {
    return []
  }

  // Filter to weeks 1-3 only (exclude week 4 deload)
  const nonDeloadEntries = amrapHistory.filter(
    (entry) => entry.weekNumber >= 1 && entry.weekNumber <= 3
  )

  if (nonDeloadEntries.length === 0) {
    return []
  }

  // Apply time period filter
  const now = new Date()
  const cutoffDate = getCutoffDate(now, timePeriod)

  const filteredEntries = nonDeloadEntries.filter((entry) => {
    const entryDate = new Date(entry.date)
    return entryDate >= cutoffDate
  })

  if (filteredEntries.length === 0) {
    return []
  }

  // Group entries by date (YYYY-MM-DD)
  const groupedByDate = new Map<string, Map<LiftType, number>>()

  for (const entry of filteredEntries) {
    const entryDate = new Date(entry.date)
    const dateKey = entryDate.toISOString().split('T')[0]

    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, new Map())
    }

    const dateGroup = groupedByDate.get(dateKey)!
    const theoretical1RM = calculateOneRM(entry.weight, entry.reps)

    // Keep the highest 1RM for each lift on the same date
    const existing = dateGroup.get(entry.lift as LiftType)
    if (existing === undefined || theoretical1RM > existing) {
      dateGroup.set(entry.lift as LiftType, theoretical1RM)
    }
  }

  // Convert to array of ChartDataPoint
  const dataPoints: ChartDataPoint[] = []

  groupedByDate.forEach((liftValues, dateKey) => {
    const point: ChartDataPoint = {
      date: dateKey,
      timestamp: new Date(dateKey).getTime(),
    }

    liftValues.forEach((value, lift) => {
      if (lift === 'squat') point.squat = value
      else if (lift === 'bench') point.bench = value
      else if (lift === 'deadlift') point.deadlift = value
      else if (lift === 'overheadPress') point.overheadPress = value
    })

    dataPoints.push(point)
  })

  // Sort by date ascending
  dataPoints.sort((a, b) => a.timestamp - b.timestamp)

  return dataPoints
}

/**
 * Get the cutoff date for time period filtering
 */
function getCutoffDate(now: Date, timePeriod: TimePeriod): Date {
  switch (timePeriod) {
    case '3mo':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    case '6mo':
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    case '1yr':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    case 'all':
      return new Date(0) // Beginning of time
    default:
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  }
}

/**
 * Serialize chart data for client component consumption.
 */
export function serializeChartData(
  amrapHistory: IAMRAPHistoryEntry[]
): IAMRAPHistoryEntry[] {
  return amrapHistory.map((entry) => ({
    ...entry,
    date: entry.date instanceof Date ? entry.date : new Date(entry.date),
  }))
}

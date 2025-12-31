'use client'

import type { LiftType } from '@/lib/autoIncrementLogic'

const LIFT_DISPLAY_NAMES: Record<LiftType, string> = {
  squat: 'Squat',
  bench: 'Bench Press',
  deadlift: 'Deadlift',
  overheadPress: 'Overhead Press',
}

interface Theoretical1RMSectionProps {
  theoretical1RMs: Partial<Record<LiftType, number>>
  units: 'lbs' | 'kg'
}

export default function Theoretical1RMSection({
  theoretical1RMs,
  units,
}: Theoretical1RMSectionProps) {
  const lifts: LiftType[] = ['squat', 'bench', 'deadlift', 'overheadPress']
  const hasAnyData = lifts.some((lift) => theoretical1RMs[lift] !== undefined)

  if (!hasAnyData) {
    return (
      <section className="stats-section">
        <h2 className="stats-section-title">Theoretical 1RM</h2>
        <p className="stats-empty-state">
          No data yet. Complete AMRAP sets in your workouts to see your theoretical 1RM values here.
        </p>
      </section>
    )
  }

  return (
    <section className="stats-section">
      <h2 className="stats-section-title">Theoretical 1RM</h2>
      <p className="stats-section-description">
        Calculated from your best AMRAP performances using the Epley formula.
      </p>
      <div className="theoretical-1rm-grid">
        {lifts.map((lift) => (
          <div key={lift} className="theoretical-1rm-item">
            <span className="lift-name">{LIFT_DISPLAY_NAMES[lift]}</span>
            <span className="lift-value">
              {theoretical1RMs[lift] !== undefined
                ? `${theoretical1RMs[lift]} ${units}`
                : '—'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

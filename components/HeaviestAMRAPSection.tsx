'use client'

import { useState } from 'react'
import type { LiftType } from '@/lib/autoIncrementLogic'
import type { SerializedHeaviestAMRAPsByLift } from '@/lib/statsCalculations'

const LIFT_DISPLAY_NAMES: Record<LiftType, string> = {
  squat: 'Squat',
  bench: 'Bench Press',
  deadlift: 'Deadlift',
  overheadPress: 'Overhead Press',
}

interface HeaviestAMRAPSectionProps {
  heaviestAMRAPs: SerializedHeaviestAMRAPsByLift
  units: 'lbs' | 'kg'
}

export default function HeaviestAMRAPSection({
  heaviestAMRAPs,
  units,
}: HeaviestAMRAPSectionProps) {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({})

  const lifts: LiftType[] = ['squat', 'bench', 'deadlift', 'overheadPress']
  const hasAnyData = lifts.some((lift) => heaviestAMRAPs[lift] !== undefined)

  const toggleNotes = (lift: LiftType) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [lift]: !prev[lift],
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (!hasAnyData) {
    return (
      <section className="stats-section">
        <h2 className="stats-section-title">Heaviest AMRAP Records</h2>
        <p className="stats-empty-state">
          No AMRAP records yet. Complete AMRAP sets in your workouts to see your heaviest lifts here.
        </p>
      </section>
    )
  }

  return (
    <section className="stats-section">
      <h2 className="stats-section-title">Heaviest AMRAP Records</h2>
      <p className="stats-section-description">
        Your heaviest recorded weight for each lift.
      </p>
      <div className="heaviest-amrap-grid">
        {lifts.map((lift) => {
          const record = heaviestAMRAPs[lift]
          const isExpanded = expandedNotes[lift] || false

          return (
            <div key={lift} className="heaviest-amrap-card">
              <div className="heaviest-amrap-header">
                <span className="heaviest-amrap-lift">{LIFT_DISPLAY_NAMES[lift]}</span>
              </div>

              {record ? (
                <div className="heaviest-amrap-content">
                  <div className="heaviest-amrap-weight">
                    {record.weight} {units}
                  </div>
                  <div className="heaviest-amrap-details">
                    <span className="heaviest-amrap-reps">{record.reps} reps</span>
                    <span className="heaviest-amrap-date">{formatDate(record.date)}</span>
                  </div>

                  {record.notes && (
                    <div className="heaviest-amrap-notes-container">
                      <button
                        className="heaviest-amrap-notes-toggle"
                        onClick={() => toggleNotes(lift)}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Hide notes' : 'View notes'}
                      </button>
                      {isExpanded && (
                        <div className="heaviest-amrap-notes">
                          {record.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="heaviest-amrap-empty">
                  No data yet
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

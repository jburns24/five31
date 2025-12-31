import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import type { IAMRAPHistoryEntry } from '@/models/User'
import { calculateOneRM } from '@/lib/oneRMCalculation'
import type { LiftType } from '@/lib/autoIncrementLogic'
import { findHeaviestAMRAPs, serializeHeaviestAMRAPs } from '@/lib/statsCalculations'
import Theoretical1RMSection from '@/components/Theoretical1RMSection'
import HeaviestAMRAPSection from '@/components/HeaviestAMRAPSection'
import OneRMProgressChart from '@/components/OneRMProgressChart'

export default async function StatsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/')
  }

  await connectDB()

  const user = await User.findOne({ email: session.user.email }).lean()

  if (!user) {
    redirect('/')
  }

  // Get user's preferred units
  const units = user.oneRM?.units || 'lbs'

  // Calculate theoretical 1RM values from AMRAP history
  const amrapHistory = (user.amrapHistory || []) as IAMRAPHistoryEntry[]
  const theoretical1RMs: Partial<Record<LiftType, number>> = {}

  const lifts: LiftType[] = ['squat', 'bench', 'deadlift', 'overheadPress']
  for (const lift of lifts) {
    const liftHistory = amrapHistory.filter((entry) => entry.lift === lift)
    if (liftHistory.length > 0) {
      // Find the best theoretical 1RM from history
      const best = liftHistory.reduce((max, entry) => {
        const theoretical = calculateOneRM(entry.weight, entry.reps)
        return theoretical > max ? theoretical : max
      }, 0)
      if (best > 0) {
        theoretical1RMs[lift] = best
      }
    }
  }

  // Find heaviest AMRAP for each lift
  const heaviestAMRAPs = findHeaviestAMRAPs(amrapHistory)
  const serializedHeaviestAMRAPs = serializeHeaviestAMRAPs(heaviestAMRAPs)

  // Serialize AMRAP history for the chart component
  const serializedAmrapHistory = amrapHistory.map((entry) => ({
    ...entry,
    date: entry.date instanceof Date ? entry.date : new Date(entry.date),
    workoutPlanId: entry.workoutPlanId.toString(),
  })) as unknown as IAMRAPHistoryEntry[]

  return (
    <main className="stats-page">
      <div className="stats-container">
        <h1 className="stats-title">My Stats</h1>

        {/* Theoretical 1RM Section */}
        <Theoretical1RMSection
          theoretical1RMs={theoretical1RMs}
          units={units}
        />

        {/* Heaviest AMRAP Records Section */}
        <HeaviestAMRAPSection
          heaviestAMRAPs={serializedHeaviestAMRAPs}
          units={units}
        />

        {/* 1RM Progress Chart Section */}
        <OneRMProgressChart
          amrapHistory={serializedAmrapHistory}
          units={units}
        />
      </div>
    </main>
  )
}

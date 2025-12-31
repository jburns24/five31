import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Link from 'next/link'
import UserAvatar from '@/components/UserAvatar'
import SignOutButton from '@/components/SignOutButton'
import AccountOneRMSection from '@/components/AccountOneRMSection'
import type { IOneRM, IAMRAPHistoryEntry } from '@/models/User'
import { calculateCycleProgression, type AMRAPResult, type OneRMValues, type LiftType, type IncrementResult } from '@/lib/autoIncrementLogic'

interface AccountPageProps {
  searchParams: Promise<{ completed?: string }>
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams
  const fromCompletedPlan = params.completed === 'true'
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/')
  }

  await connectDB()

  const user = await User.findOne({ email: session.user.email }).lean()

  if (!user) {
    redirect('/')
  }

  // Format the creation date
  const createdDate = new Date(user.createdAt)
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  // Serialize 1RM data for client component
  const oneRMData: IOneRM | undefined = user.oneRM ? {
    squat: user.oneRM.squat,
    bench: user.oneRM.bench,
    deadlift: user.oneRM.deadlift,
    overheadPress: user.oneRM.overheadPress,
    units: user.oneRM.units,
    roundingPreference: user.oneRM.roundingPreference,
  } : undefined

  // Get AMRAP history for cycle progression calculation
  const amrapHistory = (user.amrapHistory || []) as IAMRAPHistoryEntry[]

  // Calculate suggested new 1RM values if coming from completed plan
  let suggestedOneRMs: IOneRM | undefined = undefined
  let progressionDetails: IncrementResult[] = []
  if (fromCompletedPlan && oneRMData) {
    const currentValues: OneRMValues = {
      squat: oneRMData.squat || 0,
      bench: oneRMData.bench || 0,
      deadlift: oneRMData.deadlift || 0,
      overheadPress: oneRMData.overheadPress || 0,
    }

    // Convert AMRAP history to AMRAPResult format
    const amrapResults: AMRAPResult[] = amrapHistory.map((entry) => ({
      lift: entry.lift as LiftType,
      weekNumber: entry.weekNumber || 1,
      reps: entry.reps,
      weight: entry.weight,
    }))

    const { newValues, details } = calculateCycleProgression(
      currentValues,
      amrapResults,
      oneRMData.units || 'lbs'
    )

    progressionDetails = details
    suggestedOneRMs = {
      squat: newValues.squat,
      bench: newValues.bench,
      deadlift: newValues.deadlift,
      overheadPress: newValues.overheadPress,
      units: oneRMData.units,
      roundingPreference: oneRMData.roundingPreference,
    }
  }

  return (
    <main className="account-page">
      <div className="account-card">
        <div className="account-header">
          <UserAvatar
            name={user.name}
            image={user.image}
            size={80}
          />
          <div className="account-info">
            <h1>{user.name}</h1>
            <p className="account-email">{user.email}</p>
            <p className="account-joined">Member since {formattedDate}</p>
          </div>
        </div>
        <div className="account-actions">
          <Link href="/stats" className="button button-secondary">
            View Stats
          </Link>
          <SignOutButton />
        </div>
      </div>

      <AccountOneRMSection
        initialData={oneRMData}
        suggestedData={suggestedOneRMs}
        progressionDetails={progressionDetails}
        fromCompletedPlan={fromCompletedPlan}
      />
    </main>
  )
}

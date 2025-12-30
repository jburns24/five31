'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import WorkoutNavigation, { type LiftType } from '@/components/WorkoutNavigation';
import SetRow from '@/components/SetRow';
import type { IWorkoutSet } from '@/models/WorkoutPlan';

// Type for the workout plan data from API
interface WorkoutPlanData {
  _id: string;
  dateCreated: string;
  units: 'lbs' | 'kg';
  trainingMaxValues: {
    squat: number;
    bench: number;
    deadlift: number;
    overheadPress: number;
  };
  weeklyWorkouts: {
    weekNumber: number;
    weekName: string;
    lifts: {
      lift: LiftType;
      liftName: string;
      trainingMax: number;
      sets: IWorkoutSet[];
    }[];
  }[];
}

function WorkoutPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingSetId, setLoadingSetId] = useState<number | null>(null);

  // Get current week and lift from URL params (defaults: week 1, squat)
  const weekParam = searchParams.get('week');
  const liftParam = searchParams.get('lift');
  const currentWeek = weekParam ? parseInt(weekParam, 10) : 1;
  const currentLift: LiftType = (liftParam as LiftType) || 'squat';

  // Validate week and lift values
  const validWeek = currentWeek >= 1 && currentWeek <= 4 ? currentWeek : 1;
  const validLift: LiftType = ['squat', 'bench', 'deadlift', 'overheadPress'].includes(currentLift)
    ? currentLift
    : 'squat';

  // Fetch workout plan data
  const fetchWorkoutPlan = useCallback(async () => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/workout/current');

      if (response.status === 404) {
        // No workout plan found
        setWorkoutPlan(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch workout plan');
      }

      const data = await response.json();
      setWorkoutPlan(data.workoutPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchWorkoutPlan();
  }, [fetchWorkoutPlan]);

  // Update URL when week or lift changes
  const handleWeekChange = useCallback(
    (week: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('week', week.toString());
      router.push(`/workout?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleLiftChange = useCallback(
    (lift: LiftType) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lift', lift);
      router.push(`/workout?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handle set completion toggle
  const handleSetClick = useCallback(
    async (setNumber: number, currentCompleted: boolean) => {
      if (!workoutPlan) return;

      // Store the previous state for rollback
      const previousPlan = workoutPlan;

      // Optimistic update
      setWorkoutPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          weeklyWorkouts: prev.weeklyWorkouts.map((week) => {
            if (week.weekNumber !== validWeek) return week;
            return {
              ...week,
              lifts: week.lifts.map((lift) => {
                if (lift.lift !== validLift) return lift;
                return {
                  ...lift,
                  sets: lift.sets.map((set) => {
                    if (set.setNumber !== setNumber) return set;
                    return { ...set, completed: !currentCompleted };
                  }),
                };
              }),
            };
          }),
        };
      });

      setLoadingSetId(setNumber);

      try {
        const response = await fetch('/api/workout/complete-set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workoutPlanId: workoutPlan._id,
            weekNumber: validWeek,
            lift: validLift,
            setNumber,
            completed: !currentCompleted,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update set');
        }

        // Update with server response
        const data = await response.json();
        setWorkoutPlan(data.workoutPlan);
      } catch (err) {
        // Rollback on error
        setWorkoutPlan(previousPlan);
        console.error('Failed to complete set:', err);
        // Could add a toast notification here
      } finally {
        setLoadingSetId(null);
      }
    },
    [workoutPlan, validWeek, validLift]
  );

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="workout-loading">
        <p>Loading your workout...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="workout-empty">
        <h1>Error</h1>
        <p>{error}</p>
        <Link href="/account" className="workout-link-button">
          Go to Account Page
        </Link>
      </div>
    );
  }

  // Empty state - no active workout plan
  if (!workoutPlan) {
    return (
      <div className="workout-empty">
        <h1>No Active Workout Plan</h1>
        <p>
          You don&apos;t have an active workout plan yet. Enter your 1RM values on
          your account page to generate a personalized 4-week 5/3/1 program.
        </p>
        <Link href="/account" className="workout-link-button">
          Go to Account Page
        </Link>
      </div>
    );
  }

  // Get the current week data
  const currentWeekData = workoutPlan.weeklyWorkouts.find(
    (w) => w.weekNumber === validWeek
  );

  // Get the current lift data
  const currentLiftData = currentWeekData?.lifts.find(
    (l) => l.lift === validLift
  );

  // Check if all sets are complete and last set is AMRAP
  const allSetsComplete = currentLiftData?.sets.every((s) => s.completed) ?? false;
  const hasAmrapSet = currentLiftData?.sets.some((s) => s.isAmrap) ?? false;
  const amrapSet = currentLiftData?.sets.find((s) => s.isAmrap);
  const amrapRecorded = amrapSet?.amrapRecorded ?? false;
  const showRecordAmrapButton = allSetsComplete && hasAmrapSet && !amrapRecorded;

  // Format date
  const createdDate = new Date(workoutPlan.dateCreated);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="workout-header">
        <div className="workout-header-content">
          <h1>Your 5/3/1 Workout</h1>
          <p className="workout-date">Plan created on {formattedDate}</p>
        </div>
        <Link href="/account" className="workout-back-link">
          ← Back to Account
        </Link>
      </div>

      {/* Navigation Controls */}
      <WorkoutNavigation
        currentWeek={validWeek}
        currentLift={validLift}
        onWeekChange={handleWeekChange}
        onLiftChange={handleLiftChange}
      />

      {/* Current Workout Display */}
      {currentWeekData && currentLiftData && (
        <section
          className={`workout-section workout-current ${
            validWeek === 4 ? 'deload-week' : ''
          }`}
        >
          <div className="workout-current__header">
            <h2>{currentLiftData.liftName}</h2>
            <span className="workout-current__week-badge">
              {currentWeekData.weekName}
            </span>
          </div>

          {validWeek === 4 && (
            <p className="workout-section-desc deload-desc">
              Deload week - lighter weights for recovery
            </p>
          )}

          <div className="workout-current__tm">
            Training Max: {currentLiftData.trainingMax} {workoutPlan.units}
          </div>

          <div className="sets-list sets-list--interactive">
            {currentLiftData.sets.map((set) => (
              <SetRow
                key={set.setNumber}
                set={set}
                units={workoutPlan.units}
                completed={set.completed ?? false}
                disabled={amrapRecorded}
                isLoading={loadingSetId === set.setNumber}
                onClick={() => handleSetClick(set.setNumber, set.completed ?? false)}
              />
            ))}
          </div>

          {/* Record AMRAP Button */}
          {showRecordAmrapButton && (
            <button
              className="record-amrap-button"
              onClick={() => {
                // Will be implemented in Task 4.0
                console.log('Record AMRAP clicked');
              }}
            >
              🎯 Record AMRAP Performance
            </button>
          )}

          {/* AMRAP Recorded indicator */}
          {amrapRecorded && (
            <div className="workout-amrap-recorded">
              ✓ AMRAP recorded for this workout
            </div>
          )}
        </section>
      )}

      {/* Legend */}
      <section className="workout-legend">
        <h3>Legend</h3>
        <ul>
          <li>
            <span className="amrap-badge">+</span> AMRAP (As Many Reps As
            Possible) - Push for more reps on your last set
          </li>
          <li>Percentages are based on your Training Max (90% of 1RM)</li>
          <li>Weights are rounded to the nearest available plate</li>
        </ul>
      </section>
    </>
  );
}

export default function WorkoutPage() {
  return (
    <main className="workout-page">
      <Suspense
        fallback={
          <div className="workout-loading">
            <p>Loading your workout...</p>
          </div>
        }
      >
        <WorkoutPageContent />
      </Suspense>
    </main>
  );
}

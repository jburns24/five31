import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WorkoutPlan, { type IWorkoutPlan } from '@/models/WorkoutPlan';
import Link from 'next/link';

export default async function WorkoutPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/');
  }

  await connectDB();

  // Get user to find their ID
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    redirect('/');
  }

  // Find active (non-archived) workout plan for this user
  const workoutPlan = await WorkoutPlan.findOne({
    userId: user._id,
    isArchived: false,
  })
    .sort({ dateCreated: -1 })
    .lean() as (IWorkoutPlan & { _id: string; dateCreated: Date }) | null;

  // Empty state - no active workout plan
  if (!workoutPlan) {
    return (
      <main className="workout-page">
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
      </main>
    );
  }

  // Format date
  const createdDate = new Date(workoutPlan.dateCreated);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="workout-page">
      <div className="workout-header">
        <div className="workout-header-content">
          <h1>Your 5/3/1 Workout Plan</h1>
          <p className="workout-date">Created on {formattedDate}</p>
        </div>
        <Link href="/account" className="workout-back-link">
          ← Back to Account
        </Link>
      </div>

      {/* Training Max Summary */}
      <section className="workout-section">
        <h2>Training Max Values</h2>
        <p className="workout-section-desc">
          Your Training Max (TM) is 90% of your 1RM, rounded to the nearest
          available plate increment.
        </p>
        <div className="tm-grid">
          <div className="tm-card">
            <span className="tm-label">Squat</span>
            <span className="tm-value">
              {workoutPlan.trainingMaxValues.squat} {workoutPlan.units}
            </span>
          </div>
          <div className="tm-card">
            <span className="tm-label">Bench Press</span>
            <span className="tm-value">
              {workoutPlan.trainingMaxValues.bench} {workoutPlan.units}
            </span>
          </div>
          <div className="tm-card">
            <span className="tm-label">Deadlift</span>
            <span className="tm-value">
              {workoutPlan.trainingMaxValues.deadlift} {workoutPlan.units}
            </span>
          </div>
          <div className="tm-card">
            <span className="tm-label">Overhead Press</span>
            <span className="tm-value">
              {workoutPlan.trainingMaxValues.overheadPress} {workoutPlan.units}
            </span>
          </div>
        </div>
      </section>

      {/* Weekly Workouts */}
      {workoutPlan.weeklyWorkouts.map((week) => (
        <section
          key={week.weekNumber}
          className={`workout-section ${week.weekNumber === 4 ? 'deload-week' : ''}`}
        >
          <h2>{week.weekName}</h2>
          {week.weekNumber === 4 && (
            <p className="workout-section-desc deload-desc">
              Deload week - lighter weights for recovery
            </p>
          )}
          <div className="lifts-grid">
            {week.lifts.map((lift) => (
              <div key={lift.lift} className="lift-card">
                <h3 className="lift-name">{lift.liftName}</h3>
                <div className="sets-list">
                  {lift.sets.map((set) => (
                    <div key={set.setNumber} className="set-row">
                      <span className="set-label">Set {set.setNumber}</span>
                      <span className="set-weight">
                        {set.weight} {workoutPlan.units}
                      </span>
                      <span className="set-reps">
                        × {set.reps}
                        {set.isAmrap && <span className="amrap-badge">+</span>}
                      </span>
                      <span className="set-percentage">{set.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

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
    </main>
  );
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WorkoutPlan from '@/models/WorkoutPlan';

// Force dynamic rendering since this route uses session/headers
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user to find their ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find active (non-archived) workout plan for this user
    const workoutPlan = await WorkoutPlan.findOne({
      userId: user._id,
      isArchived: false,
    })
      .sort({ dateCreated: -1 })
      .lean();

    if (!workoutPlan) {
      return NextResponse.json(
        { error: 'No active workout plan found' },
        { status: 404 }
      );
    }

    // Plans recorded before actualReps was persisted: backfill from AMRAP history
    const history = (user.amrapHistory || []) as {
      lift: string;
      reps: number;
      weekNumber: number;
      workoutPlanId: { toString(): string };
    }[];
    for (const week of workoutPlan.weeklyWorkouts) {
      for (const lift of week.lifts) {
        const amrapSet = lift.sets.find((s) => s.isAmrap);
        if (!amrapSet?.amrapRecorded || amrapSet.actualReps !== undefined) continue;
        const entry = history.find(
          (h) =>
            h.workoutPlanId?.toString() === workoutPlan._id.toString() &&
            h.weekNumber === week.weekNumber &&
            h.lift === lift.lift
        );
        if (entry) amrapSet.actualReps = entry.reps;
      }
    }

    return NextResponse.json({ workoutPlan });
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

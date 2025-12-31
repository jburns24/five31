import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WorkoutPlan from '@/models/WorkoutPlan';

// Force dynamic rendering since this route uses session/headers
export const dynamic = 'force-dynamic';

interface CompleteSetRequest {
  workoutPlanId: string;
  weekNumber: number;
  lift: 'squat' | 'bench' | 'deadlift' | 'overheadPress';
  setNumber: number;
  completed: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body: CompleteSetRequest = await request.json();
    const { workoutPlanId, weekNumber, lift, setNumber, completed } = body;

    // Validate required fields
    if (!workoutPlanId || !weekNumber || !lift || !setNumber === undefined || completed === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate weekNumber
    if (weekNumber < 1 || weekNumber > 4) {
      return NextResponse.json(
        { error: 'Invalid week number. Must be between 1 and 4.' },
        { status: 400 }
      );
    }

    // Validate lift
    const validLifts = ['squat', 'bench', 'deadlift', 'overheadPress'];
    if (!validLifts.includes(lift)) {
      return NextResponse.json(
        { error: 'Invalid lift type' },
        { status: 400 }
      );
    }

    // Validate setNumber
    if (setNumber < 1 || setNumber > 10) {
      return NextResponse.json(
        { error: 'Invalid set number. Must be between 1 and 10.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user to verify ownership
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the workout plan and verify ownership
    const workoutPlan = await WorkoutPlan.findById(workoutPlanId);
    if (!workoutPlan) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    if (workoutPlan.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not own this workout plan' },
        { status: 403 }
      );
    }

    // Find the specific week, lift, and set
    const week = workoutPlan.weeklyWorkouts.find(
      (w: { weekNumber: number }) => w.weekNumber === weekNumber
    );
    if (!week) {
      return NextResponse.json(
        { error: 'Week not found' },
        { status: 404 }
      );
    }

    const liftData = week.lifts.find(
      (l: { lift: string }) => l.lift === lift
    );
    if (!liftData) {
      return NextResponse.json(
        { error: 'Lift not found' },
        { status: 404 }
      );
    }

    const set = liftData.sets.find(
      (s: { setNumber: number }) => s.setNumber === setNumber
    );
    if (!set) {
      return NextResponse.json(
        { error: 'Set not found' },
        { status: 404 }
      );
    }

    // Check if AMRAP is already recorded for this workout (prevents unmarking)
    const amrapSet = liftData.sets.find(
      (s: { isAmrap: boolean; amrapRecorded?: boolean }) => s.isAmrap && s.amrapRecorded === true
    );
    if (amrapSet && !completed) {
      // User is trying to unmark a set after AMRAP is recorded
      return NextResponse.json(
        { error: 'Cannot unmark sets after AMRAP has been recorded' },
        { status: 400 }
      );
    }

    // Update the set's completed field using MongoDB positional operators
    const updateResult = await WorkoutPlan.updateOne(
      {
        _id: workoutPlanId,
      },
      {
        $set: {
          [`weeklyWorkouts.$[week].lifts.$[lift].sets.$[set].completed`]: completed,
        },
      },
      {
        arrayFilters: [
          { 'week.weekNumber': weekNumber },
          { 'lift.lift': lift },
          { 'set.setNumber': setNumber },
        ],
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update set' },
        { status: 500 }
      );
    }

    // Fetch the updated workout plan
    const updatedPlan = await WorkoutPlan.findById(workoutPlanId).lean();

    return NextResponse.json({
      success: true,
      workoutPlan: updatedPlan,
    });
  } catch (error) {
    console.error('Error completing set:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

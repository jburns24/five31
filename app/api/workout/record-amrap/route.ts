import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import WorkoutPlan, { IWorkoutPlan } from '@/models/WorkoutPlan';
import { detectPR, PRDetails, AMRAPEntry } from '@/lib/prDetection';

interface RecordAMRAPRequest {
  workoutPlanId: string;
  weekNumber: number;
  lift: string;
  reps: number;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - please sign in' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body: RecordAMRAPRequest = await request.json();
    const { workoutPlanId, weekNumber, lift, reps, notes } = body;

    if (!workoutPlanId || weekNumber === undefined || !lift || reps === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: workoutPlanId, weekNumber, lift, reps' },
        { status: 400 }
      );
    }

    if (typeof reps !== 'number' || reps < 0) {
      return NextResponse.json(
        { error: 'Invalid reps value - must be a non-negative number' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the workout plan
    const workoutPlan = await WorkoutPlan.findById(workoutPlanId) as IWorkoutPlan | null;
    if (!workoutPlan) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    // Verify user owns this workout plan
    if (workoutPlan.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not own this workout plan' },
        { status: 403 }
      );
    }

    // Find the specific week and lift
    const weekData = workoutPlan.weeklyWorkouts.find((w) => w.weekNumber === weekNumber);
    if (!weekData) {
      return NextResponse.json(
        { error: `Week ${weekNumber} not found in workout plan` },
        { status: 404 }
      );
    }

    const liftData = weekData.lifts.find((l) => l.lift === lift);
    if (!liftData) {
      return NextResponse.json(
        { error: `Lift ${lift} not found in week ${weekNumber}` },
        { status: 404 }
      );
    }

    // Find the AMRAP set
    const amrapSet = liftData.sets.find((s) => s.isAmrap);
    if (!amrapSet) {
      return NextResponse.json(
        { error: 'No AMRAP set found for this lift' },
        { status: 404 }
      );
    }

    // Check if AMRAP is already recorded
    if (amrapSet.amrapRecorded === true) {
      return NextResponse.json(
        { error: 'AMRAP has already been recorded for this set' },
        { status: 400 }
      );
    }

    // Get current workout details
    const weight = amrapSet.weight;
    const expectedReps = amrapSet.reps;

    // Fetch user's AMRAP history for this lift
    const liftHistory: AMRAPEntry[] = (user.amrapHistory || [])
      .filter((entry: { lift: string }) => entry.lift.toLowerCase() === lift.toLowerCase())
      .map((entry: { lift: string; weight: number; reps: number; date: Date; notes?: string; weekNumber?: number }) => ({
        lift: entry.lift,
        weight: entry.weight,
        reps: entry.reps,
        date: entry.date,
        notes: entry.notes,
        weekNumber: entry.weekNumber,
      }));

    // Create current AMRAP entry
    const currentAMRAP: AMRAPEntry = {
      lift,
      weight,
      reps,
      date: new Date(),
      notes: notes || undefined,
      weekNumber,
    };

    // Check for PRs
    const prDetails: PRDetails = detectPR(currentAMRAP, liftHistory);

    // Create new AMRAP history entry and add to User
    await User.findByIdAndUpdate(user._id, {
      $push: {
        amrapHistory: {
          lift,
          weight,
          reps,
          date: new Date(),
          notes: notes || undefined,
          weekNumber,
          workoutPlanId,
        },
      },
    });

    // Mark the AMRAP set as recorded in WorkoutPlan
    await WorkoutPlan.updateOne(
      { _id: workoutPlanId },
      {
        $set: {
          [`weeklyWorkouts.$[week].lifts.$[lift].sets.$[set].amrapRecorded`]: true,
          [`weeklyWorkouts.$[week].lifts.$[lift].sets.$[set].actualReps`]: reps,
        },
      },
      {
        arrayFilters: [
          { 'week.weekNumber': weekNumber },
          { 'lift.lift': lift },
          { 'set.isAmrap': true },
        ],
      }
    );

    // Fetch updated workout plan
    const updatedWorkoutPlan = await WorkoutPlan.findById(workoutPlanId);

    return NextResponse.json({
      success: true,
      workoutPlan: updatedWorkoutPlan,
      prDetails,
      recordedAMRAP: {
        lift,
        weight,
        reps,
        expectedReps,
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error('Error recording AMRAP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

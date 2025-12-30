import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WorkoutPlan from '@/models/WorkoutPlan';
import { generateWorkoutPlan } from '@/lib/workoutCalculator';
import type { IOneRM } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    let body: IOneRM;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { squat, bench, deadlift, overheadPress, units = 'lbs', roundingPreference = 'plate' } = body;

    if (!squat || !bench || !deadlift || !overheadPress) {
      return NextResponse.json(
        { error: 'All four lift values are required' },
        { status: 400 }
      );
    }

    // Validate numeric values
    const lifts = { squat, bench, deadlift, overheadPress };
    const maxValue = units === 'lbs' ? 2000 : 900;

    for (const [name, value] of Object.entries(lifts)) {
      if (typeof value !== 'number' || value <= 0 || value > maxValue) {
        return NextResponse.json(
          { error: `${name} must be a positive number not exceeding ${maxValue} ${units}` },
          { status: 400 }
        );
      }
    }

    // Validate units
    if (units !== 'lbs' && units !== 'kg') {
      return NextResponse.json(
        { error: 'Units must be "lbs" or "kg"' },
        { status: 400 }
      );
    }

    // Validate rounding preference
    if (roundingPreference !== 'plate' && roundingPreference !== '2.5') {
      return NextResponse.json(
        { error: 'Rounding preference must be "plate" or "2.5"' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find and update user with 1RM values
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        oneRM: {
          squat,
          bench,
          deadlift,
          overheadPress,
          units,
          roundingPreference,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Archive any existing active workout plans for this user
    await WorkoutPlan.updateMany(
      { userId: user._id, isArchived: false },
      { isArchived: true }
    );

    // Generate workout plan
    const workoutPlanData = generateWorkoutPlan(
      { squat, bench, deadlift, overheadPress },
      units,
      roundingPreference
    );

    // Create and save new workout plan
    const newWorkoutPlan = new WorkoutPlan({
      userId: user._id,
      units,
      roundingPreference,
      trainingMaxValues: workoutPlanData.trainingMaxValues,
      weeklyWorkouts: workoutPlanData.weeks,
    });

    await newWorkoutPlan.save();

    return NextResponse.json(
      {
        success: true,
        workoutPlanId: newWorkoutPlan._id.toString(),
        message: 'Workout plan generated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the workout plan' },
      { status: 500 }
    );
  }
}

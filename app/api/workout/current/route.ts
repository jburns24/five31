import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WorkoutPlan from '@/models/WorkoutPlan';

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

    return NextResponse.json({ workoutPlan });
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      status: 'ok',
      mongodb: 'connected'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        mongodb: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

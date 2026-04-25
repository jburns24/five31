import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { markAndGetMainSpan } from '@/lib/otel/utils';

export async function GET() {
  markAndGetMainSpan();

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

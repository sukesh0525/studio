import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const isLiked = job.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      await Job.findByIdAndUpdate(params.id, {
        $pull: { likes: userId },
      });
    } else {
      // Like
      await Job.findByIdAndUpdate(params.id, {
        $addToSet: { likes: userId },
      });
    }

    return NextResponse.json({
      message: isLiked ? 'Job unliked' : 'Job liked',
      liked: !isLiked,
    });

  } catch (error) {
    console.error('Job like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
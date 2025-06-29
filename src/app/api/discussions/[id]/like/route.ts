import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Discussion from '@/models/Discussion';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);

    const discussion = await Discussion.findById(params.id);
    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    const isLiked = discussion.likes.includes(payload.userId);
    
    if (isLiked) {
      // Unlike
      await Discussion.findByIdAndUpdate(params.id, {
        $pull: { likes: payload.userId },
      });
    } else {
      // Like
      await Discussion.findByIdAndUpdate(params.id, {
        $addToSet: { likes: payload.userId },
      });
    }

    return NextResponse.json({
      message: isLiked ? 'Discussion unliked' : 'Discussion liked',
      liked: !isLiked,
    });

  } catch (error) {
    console.error('Discussion like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
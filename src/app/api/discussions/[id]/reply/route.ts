import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Discussion from '@/models/Discussion';
import { verifyToken } from '@/lib/auth';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';
import { z } from 'zod';

const replySchema = z.object({
  content: z.string().min(5),
});

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
    requirePermission(payload.userType, PERMISSIONS.DISCUSSION_CREATE);

    const body = await request.json();
    const validatedData = replySchema.parse(body);

    const discussion = await Discussion.findById(params.id);
    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    if (discussion.isLocked) {
      return NextResponse.json({ error: 'Discussion is locked' }, { status: 403 });
    }

    const reply = {
      authorId: payload.userId,
      content: validatedData.content,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    discussion.replies.push(reply);
    await discussion.save();

    await discussion.populate('replies.authorId', 'profile.fullName profile.companyName userType');

    const newReply = discussion.replies[discussion.replies.length - 1];

    return NextResponse.json({
      message: 'Reply added successfully',
      reply: {
        id: newReply._id,
        content: newReply.content,
        author: {
          id: newReply.authorId._id,
          name: newReply.authorId.userType === 'company' 
            ? newReply.authorId.profile?.companyName 
            : newReply.authorId.profile?.fullName,
          type: newReply.authorId.userType,
        },
        likes: newReply.likes.length,
        createdAt: newReply.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Reply creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
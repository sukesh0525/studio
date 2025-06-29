import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Discussion from '@/models/Discussion';
import { verifyToken } from '@/lib/auth';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const discussion = await Discussion.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('authorId', 'profile.fullName profile.companyName userType')
      .populate('replies.authorId', 'profile.fullName profile.companyName userType')
      .populate('likes', 'profile.fullName profile.companyName userType');

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    return NextResponse.json({
      discussion: {
        id: discussion._id,
        title: discussion.title,
        content: discussion.content,
        category: discussion.category,
        tags: discussion.tags,
        author: {
          id: discussion.authorId._id,
          name: discussion.authorId.userType === 'company' 
            ? discussion.authorId.profile?.companyName 
            : discussion.authorId.profile?.fullName,
          type: discussion.authorId.userType,
        },
        likes: discussion.likes.map((like: any) => ({
          id: like._id,
          name: like.userType === 'company' 
            ? like.profile?.companyName 
            : like.profile?.fullName,
          type: like.userType,
        })),
        replies: discussion.replies.map((reply: any) => ({
          id: reply._id,
          content: reply.content,
          author: {
            id: reply.authorId._id,
            name: reply.authorId.userType === 'company' 
              ? reply.authorId.profile?.companyName 
              : reply.authorId.profile?.fullName,
            type: reply.authorId.userType,
          },
          likes: reply.likes.length,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
        })),
        views: discussion.views,
        isPinned: discussion.isPinned,
        isLocked: discussion.isLocked,
        createdAt: discussion.createdAt,
        updatedAt: discussion.updatedAt,
      },
    });

  } catch (error) {
    console.error('Discussion fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    requirePermission(payload.userType, PERMISSIONS.DISCUSSION_UPDATE);

    const body = await request.json();
    const { title, content, tags } = body;

    const discussion = await Discussion.findOneAndUpdate(
      { _id: params.id, authorId: payload.userId },
      { 
        $set: { 
          title, 
          content, 
          tags,
          updatedAt: new Date(),
        } 
      },
      { new: true, runValidators: true }
    );

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Discussion updated successfully',
      discussion,
    });

  } catch (error) {
    console.error('Discussion update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    requirePermission(payload.userType, PERMISSIONS.DISCUSSION_DELETE);

    const discussion = await Discussion.findOneAndDelete({ 
      _id: params.id, 
      authorId: payload.userId 
    });

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Discussion deleted successfully',
    });

  } catch (error) {
    console.error('Discussion deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
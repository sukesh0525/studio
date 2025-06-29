import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Discussion from '@/models/Discussion';
import { verifyToken } from '@/lib/auth';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';
import { z } from 'zod';

const createDiscussionSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  category: z.enum(['general', 'jobs', 'internships', 'career-advice', 'company-updates']).optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    const discussions = await Discussion.find(query)
      .populate('authorId', 'profile.fullName profile.companyName userType')
      .populate('replies.authorId', 'profile.fullName profile.companyName userType')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Discussion.countDocuments(query);
    
    const formattedDiscussions = discussions.map(discussion => ({
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
      likes: discussion.likes.length,
      replies: discussion.replies.length,
      views: discussion.views,
      isPinned: discussion.isPinned,
      isLocked: discussion.isLocked,
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
    }));
    
    return NextResponse.json({
      discussions: formattedDiscussions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Discussions fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);
    requirePermission(payload.userType, PERMISSIONS.DISCUSSION_CREATE);

    const body = await request.json();
    const validatedData = createDiscussionSchema.parse(body);

    const discussion = new Discussion({
      title: validatedData.title,
      content: validatedData.content,
      authorId: payload.userId,
      category: validatedData.category || 'general',
      tags: validatedData.tags || [],
    });

    await discussion.save();
    await discussion.populate('authorId', 'profile.fullName profile.companyName userType');

    return NextResponse.json({
      message: 'Discussion created successfully',
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
        likes: discussion.likes.length,
        replies: discussion.replies.length,
        views: discussion.views,
        createdAt: discussion.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Discussion creation error:', error);
    
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
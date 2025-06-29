import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CompanyUpdate from '@/models/CompanyUpdate';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    
    let query: any = {};
    if (companyId) {
      query.companyId = companyId;
    }
    
    const updates = await CompanyUpdate.find(query)
      .populate('companyId', 'profile.companyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await CompanyUpdate.countDocuments(query);
    
    const formattedUpdates = updates.map(update => ({
      id: update._id,
      title: update.title,
      content: update.content,
      image: update.image,
      company: update.companyId?.profile?.companyName || 'Unknown Company',
      likes: update.likes.length,
      comments: update.comments.length,
      createdAt: update.createdAt,
    }));
    
    return NextResponse.json({
      updates: formattedUpdates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Company updates fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');
    
    if (!userId || userType !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, image } = body;

    const update = new CompanyUpdate({
      companyId: userId,
      title,
      content,
      image,
    });

    await update.save();
    await update.populate('companyId', 'profile.companyName');

    return NextResponse.json({
      message: 'Company update created successfully',
      update: {
        id: update._id,
        title: update.title,
        content: update.content,
        image: update.image,
        company: update.companyId?.profile?.companyName || 'Unknown Company',
        likes: update.likes.length,
        comments: update.comments.length,
        createdAt: update.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Company update creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
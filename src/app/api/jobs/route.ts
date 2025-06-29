import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { status: 'Open' };
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('companyId', 'profile.companyName profile.location profile.followers');
    
    const total = await Job.countDocuments(query);
    
    const formattedJobs = jobs.map(job => ({
      id: job._id,
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
      company: job.companyId?.profile?.companyName || 'Unknown Company',
      followers: job.companyId?.profile?.followers || 0,
      applicants: job.applicants.length,
      likes: job.likes.length,
      comments: job.comments.length,
      image: job.image,
      createdAt: job.createdAt,
    }));
    
    return NextResponse.json({
      jobs: formattedJobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Jobs fetch error:', error);
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
    const { title, description, location, type, requirements, skills, salary, image, hint } = body;

    const job = new Job({
      companyId: userId,
      title,
      description,
      location,
      type,
      requirements: requirements || [],
      skills: skills || [],
      salary,
      image,
      hint,
    });

    await job.save();
    await job.populate('companyId', 'profile.companyName profile.location profile.followers');

    return NextResponse.json({
      message: 'Job created successfully',
      job: {
        id: job._id,
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        company: job.companyId?.profile?.companyName || 'Unknown Company',
        status: job.status,
        applicants: job.applicants.length,
        likes: job.likes.length,
        comments: job.comments.length,
        createdAt: job.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
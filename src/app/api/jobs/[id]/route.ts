import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const job = await Job.findById(params.id)
      .populate('companyId', 'profile.companyName profile.location profile.followers')
      .populate('applicants', 'profile.fullName')
      .populate('likes', 'profile.fullName')
      .populate('comments.userId', 'profile.fullName');

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      job: {
        id: job._id,
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        status: job.status,
        requirements: job.requirements,
        skills: job.skills,
        salary: job.salary,
        image: job.image,
        hint: job.hint,
        company: {
          id: job.companyId._id,
          name: job.companyId.profile?.companyName || 'Unknown Company',
          location: job.companyId.profile?.location,
          followers: job.companyId.profile?.followers || 0,
        },
        applicants: job.applicants.map((applicant: any) => ({
          id: applicant._id,
          name: applicant.profile?.fullName || 'Unknown User',
        })),
        likes: job.likes.map((like: any) => ({
          id: like._id,
          name: like.profile?.fullName || 'Unknown User',
        })),
        comments: job.comments.map((comment: any) => ({
          id: comment._id,
          user: {
            id: comment.userId._id,
            name: comment.userId.profile?.fullName || 'Unknown User',
          },
          comment: comment.comment,
          createdAt: comment.createdAt,
        })),
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    });

  } catch (error) {
    console.error('Job fetch error:', error);
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
    
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');
    
    if (!userId || userType !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const job = await Job.findOneAndUpdate(
      { _id: params.id, companyId: userId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!job) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Job updated successfully',
      job,
    });

  } catch (error) {
    console.error('Job update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');
    
    if (!userId || userType !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await Job.findOneAndDelete({ _id: params.id, companyId: userId });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Job deleted successfully',
    });

  } catch (error) {
    console.error('Job deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
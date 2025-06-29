import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query: any = {};
    
    if (userType === 'student') {
      query.studentId = userId;
    } else if (userType === 'company') {
      query.companyId = userId;
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }
    
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('jobId', 'title location type')
      .populate('studentId', 'profile.fullName email')
      .populate('companyId', 'profile.companyName')
      .sort({ appliedAt: -1 });

    const formattedApplications = applications.map(app => ({
      id: app._id,
      job: {
        id: app.jobId._id,
        title: app.jobId.title,
        location: app.jobId.location,
        type: app.jobId.type,
      },
      student: {
        id: app.studentId._id,
        name: app.studentId.profile?.fullName || 'Unknown Student',
        email: app.studentId.email,
      },
      company: {
        id: app.companyId._id,
        name: app.companyId.profile?.companyName || 'Unknown Company',
      },
      status: app.status,
      matchPercentage: app.matchPercentage,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      appliedAt: app.appliedAt,
      reviewedAt: app.reviewedAt,
      notes: app.notes,
    }));

    return NextResponse.json({
      applications: formattedApplications,
    });

  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
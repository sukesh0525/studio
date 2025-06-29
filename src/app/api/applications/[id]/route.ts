import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import { verifyToken } from '@/lib/auth';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

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
    requirePermission(payload.userType, PERMISSIONS.APPLICATION_UPDATE);

    const body = await request.json();
    const { status, notes } = body;

    // Only companies can update application status
    if (payload.userType !== 'company') {
      return NextResponse.json({ error: 'Only companies can update application status' }, { status: 403 });
    }

    const application = await Application.findOneAndUpdate(
      { _id: params.id, companyId: payload.userId },
      { 
        $set: { 
          status,
          notes,
          reviewedAt: new Date(),
        } 
      },
      { new: true, runValidators: true }
    )
      .populate('jobId', 'title')
      .populate('studentId', 'profile.fullName email');

    if (!application) {
      return NextResponse.json({ error: 'Application not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Application updated successfully',
      application: {
        id: application._id,
        status: application.status,
        notes: application.notes,
        reviewedAt: application.reviewedAt,
        job: {
          title: application.jobId.title,
        },
        student: {
          name: application.studentId.profile?.fullName,
          email: application.studentId.email,
        },
      },
    });

  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
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
    requirePermission(payload.userType, PERMISSIONS.APPLICATION_READ);

    // Build query based on user type
    let query: any = { _id: params.id };
    if (payload.userType === 'student') {
      query.studentId = payload.userId;
    } else if (payload.userType === 'company') {
      query.companyId = payload.userId;
    }

    const application = await Application.findOne(query)
      .populate('jobId', 'title description location type requirements skills')
      .populate('studentId', 'profile.fullName profile.education profile.interest email')
      .populate('companyId', 'profile.companyName profile.location');

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      application: {
        id: application._id,
        job: {
          id: application.jobId._id,
          title: application.jobId.title,
          description: application.jobId.description,
          location: application.jobId.location,
          type: application.jobId.type,
          requirements: application.jobId.requirements,
          skills: application.jobId.skills,
        },
        student: {
          id: application.studentId._id,
          name: application.studentId.profile?.fullName,
          email: application.studentId.email,
          education: application.studentId.profile?.education,
          interest: application.studentId.profile?.interest,
        },
        company: {
          id: application.companyId._id,
          name: application.companyId.profile?.companyName,
          location: application.companyId.profile?.location,
        },
        status: application.status,
        coverLetter: application.coverLetter,
        resumeUrl: application.resumeUrl,
        matchPercentage: application.matchPercentage,
        appliedAt: application.appliedAt,
        reviewedAt: application.reviewedAt,
        notes: application.notes,
      },
    });

  } catch (error) {
    console.error('Application fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
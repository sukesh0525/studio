import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Application from '@/models/Application';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const userId = request.headers.get('x-user-id');
    const userType = request.headers.get('x-user-type');
    
    if (!userId || userType !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { coverLetter, resumeUrl } = body;

    // Check if job exists and is open
    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status !== 'Open') {
      return NextResponse.json({ error: 'Job is not open for applications' }, { status: 400 });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId: params.id,
      studentId: userId,
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 400 });
    }

    // Generate random match percentage (65-95%)
    const matchPercentage = Math.floor(Math.random() * (95 - 65 + 1)) + 65;

    // Create application
    const application = new Application({
      jobId: params.id,
      studentId: userId,
      companyId: job.companyId,
      coverLetter,
      resumeUrl,
      matchPercentage,
    });

    await application.save();

    // Add user to job applicants
    await Job.findByIdAndUpdate(params.id, {
      $addToSet: { applicants: userId },
    });

    return NextResponse.json({
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        matchPercentage: application.matchPercentage,
        status: application.status,
        appliedAt: application.appliedAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Job application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
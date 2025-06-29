import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';
import Application from '@/models/Application';
import Discussion from '@/models/Discussion';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);

    let stats: any = {};

    if (payload.userType === 'student') {
      // Student statistics
      const [applications, savedJobs, discussionPosts] = await Promise.all([
        Application.countDocuments({ studentId: payload.userId }),
        Job.countDocuments({ likes: payload.userId }),
        Discussion.countDocuments({ authorId: payload.userId }),
      ]);

      const applicationsByStatus = await Application.aggregate([
        { $match: { studentId: payload.userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      stats = {
        totalApplications: applications,
        savedJobs,
        discussionPosts,
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      };

    } else if (payload.userType === 'company') {
      // Company statistics
      const [jobPosts, totalApplications, companyUpdates, followers] = await Promise.all([
        Job.countDocuments({ companyId: payload.userId }),
        Application.countDocuments({ companyId: payload.userId }),
        Discussion.countDocuments({ authorId: payload.userId }),
        User.findById(payload.userId).select('profile.followers'),
      ]);

      const applicationsByStatus = await Application.aggregate([
        { $match: { companyId: payload.userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      const jobsByType = await Job.aggregate([
        { $match: { companyId: payload.userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]);

      stats = {
        jobPosts,
        totalApplications,
        companyUpdates,
        followers: followers?.profile?.followers || 0,
        applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        jobsByType: jobsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      };
    }

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
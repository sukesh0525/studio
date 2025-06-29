import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';
import Discussion from '@/models/Discussion';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // jobs, companies, discussions, all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const searchRegex = { $regex: query, $options: 'i' };
    
    const results: any = {
      jobs: [],
      companies: [],
      discussions: [],
      total: 0,
    };

    // Search jobs
    if (type === 'all' || type === 'jobs') {
      const jobs = await Job.find({
        $and: [
          { status: 'Open' },
          {
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { location: searchRegex },
              { skills: { $in: [searchRegex] } },
            ],
          },
        ],
      })
        .populate('companyId', 'profile.companyName profile.location')
        .sort({ createdAt: -1 })
        .skip(type === 'jobs' ? skip : 0)
        .limit(type === 'jobs' ? limit : 5);

      results.jobs = jobs.map(job => ({
        id: job._id,
        title: job.title,
        description: job.description.substring(0, 200) + '...',
        location: job.location,
        type: job.type,
        company: job.companyId?.profile?.companyName || 'Unknown Company',
        applicants: job.applicants.length,
        createdAt: job.createdAt,
      }));
    }

    // Search companies
    if (type === 'all' || type === 'companies') {
      const companies = await User.find({
        $and: [
          { userType: 'company' },
          {
            $or: [
              { 'profile.companyName': searchRegex },
              { 'profile.description': searchRegex },
              { 'profile.location': searchRegex },
            ],
          },
        ],
      })
        .select('profile.companyName profile.description profile.location profile.followers')
        .sort({ 'profile.followers': -1 })
        .skip(type === 'companies' ? skip : 0)
        .limit(type === 'companies' ? limit : 5);

      results.companies = companies.map(company => ({
        id: company._id,
        name: company.profile?.companyName || 'Unknown Company',
        description: company.profile?.description?.substring(0, 200) + '...' || '',
        location: company.profile?.location || '',
        followers: company.profile?.followers || 0,
      }));
    }

    // Search discussions
    if (type === 'all' || type === 'discussions') {
      const discussions = await Discussion.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: { $in: [searchRegex] } },
        ],
      })
        .populate('authorId', 'profile.fullName profile.companyName userType')
        .sort({ createdAt: -1 })
        .skip(type === 'discussions' ? skip : 0)
        .limit(type === 'discussions' ? limit : 5);

      results.discussions = discussions.map(discussion => ({
        id: discussion._id,
        title: discussion.title,
        content: discussion.content.substring(0, 200) + '...',
        category: discussion.category,
        author: {
          name: discussion.authorId.userType === 'company' 
            ? discussion.authorId.profile?.companyName 
            : discussion.authorId.profile?.fullName,
          type: discussion.authorId.userType,
        },
        likes: discussion.likes.length,
        replies: discussion.replies.length,
        createdAt: discussion.createdAt,
      }));
    }

    // Calculate total for pagination
    if (type !== 'all') {
      const totalQuery = type === 'jobs' 
        ? Job.countDocuments({
            $and: [
              { status: 'Open' },
              {
                $or: [
                  { title: searchRegex },
                  { description: searchRegex },
                  { location: searchRegex },
                  { skills: { $in: [searchRegex] } },
                ],
              },
            ],
          })
        : type === 'companies'
        ? User.countDocuments({
            $and: [
              { userType: 'company' },
              {
                $or: [
                  { 'profile.companyName': searchRegex },
                  { 'profile.description': searchRegex },
                  { 'profile.location': searchRegex },
                ],
              },
            ],
          })
        : Discussion.countDocuments({
            $or: [
              { title: searchRegex },
              { content: searchRegex },
              { tags: { $in: [searchRegex] } },
            ],
          });

      results.total = await totalQuery;
    }

    return NextResponse.json({
      query,
      type,
      results,
      pagination: type !== 'all' ? {
        page,
        limit,
        total: results.total,
        pages: Math.ceil(results.total / limit),
      } : undefined,
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
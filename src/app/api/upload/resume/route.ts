import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { uploadFile, parseFormData } from '@/lib/fileUpload';
import { verifyToken } from '@/lib/auth';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);
    
    // Check permissions
    requirePermission(payload.userType, PERMISSIONS.RESUME_UPLOAD);

    // Parse form data
    const { files } = await parseFormData(request);
    const resumeFile = files.resume;

    if (!resumeFile) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }

    // Upload file
    const uploadedFile = await uploadFile(resumeFile, 'resumes');

    // Deactivate previous resumes
    await Resume.updateMany(
      { userId: payload.userId, isActive: true },
      { $set: { isActive: false } }
    );

    // Save resume record
    const resume = new Resume({
      userId: payload.userId,
      filename: uploadedFile.filename,
      originalName: uploadedFile.originalName,
      filePath: uploadedFile.filePath,
      fileSize: uploadedFile.fileSize,
      mimeType: uploadedFile.mimeType,
      isActive: true,
    });

    await resume.save();

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        filename: resume.filename,
        originalName: resume.originalName,
        filePath: resume.filePath,
        fileSize: resume.fileSize,
        uploadedAt: resume.uploadedAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);
    requirePermission(payload.userType, PERMISSIONS.RESUME_READ);

    const resumes = await Resume.find({ userId: payload.userId })
      .sort({ uploadedAt: -1 });

    return NextResponse.json({
      resumes: resumes.map(resume => ({
        id: resume._id,
        filename: resume.filename,
        originalName: resume.originalName,
        filePath: resume.filePath,
        fileSize: resume.fileSize,
        isActive: resume.isActive,
        uploadedAt: resume.uploadedAt,
      })),
    });

  } catch (error) {
    console.error('Resume fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB

export interface UploadedFile {
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

export async function uploadFile(
  file: File,
  subfolder: string = 'general'
): Promise<UploadedFile> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  // Validate file type for resumes
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (subfolder === 'resumes' && !allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed for resumes.');
  }

  // Create upload directory if it doesn't exist
  const uploadPath = path.join(UPLOAD_DIR, subfolder);
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(file.name);
  const filename = `${timestamp}-${randomString}${extension}`;
  const filePath = path.join(uploadPath, filename);

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  return {
    filename,
    originalName: file.name,
    filePath: filePath.replace('./public', ''), // Remove public prefix for URL
    fileSize: file.size,
    mimeType: file.type,
  };
}

export async function parseFormData(request: NextRequest): Promise<{
  fields: Record<string, string>;
  files: Record<string, File>;
}> {
  const formData = await request.formData();
  const fields: Record<string, string> = {};
  const files: Record<string, File> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files[key] = value;
    } else {
      fields[key] = value;
    }
  }

  return { fields, files };
}
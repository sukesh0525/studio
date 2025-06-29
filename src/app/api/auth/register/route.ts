import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.enum(['student', 'company']),
  fullName: z.string().optional(),
  companyName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user profile based on type
    const profile: any = {};
    if (validatedData.userType === 'student' && validatedData.fullName) {
      profile.fullName = validatedData.fullName;
    } else if (validatedData.userType === 'company' && validatedData.companyName) {
      profile.companyName = validatedData.companyName;
      profile.followers = Math.floor(Math.random() * 100000) + 10000; // Random follower count
    }

    // Create new user
    const user = new User({
      email: validatedData.email,
      password: hashedPassword,
      userType: validatedData.userType,
      profile,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      userType: user.userType,
    });

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        profile: user.profile,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
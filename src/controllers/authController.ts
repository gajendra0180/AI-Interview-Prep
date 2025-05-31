import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '@/services/email';

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  });
};

// Register new user
export const registerUser = async (req: NextRequest) => {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken, name);

    return NextResponse.json(
      { message: 'Registration successful. Please verify your email.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
};

// Verify email
export const verifyEmail = async (req: NextRequest) => {
  try {
    await connectDB();
    const { token } = await req.json();

    // Find user with this token
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user to verified status
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully. You can now log in.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
};

// Login user
export const loginUser = async (req: NextRequest) => {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Prepare user data without sensitive information
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      interviewPreferences: user.interviewPreferences || {},
    };

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userData,
        token 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
};

// Update interview preferences
export const updateInterviewPreferences = async (req: NextRequest) => {
  try {
    await connectDB();
    const { userId, preferences } = await req.json();

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update preferences
    user.interviewPreferences = {
      ...user.interviewPreferences,
      ...preferences
    };
    
    await user.save();

    return NextResponse.json(
      { 
        message: 'Interview preferences updated successfully',
        preferences: user.interviewPreferences
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update preferences' },
      { status: 500 }
    );
  }
}; 
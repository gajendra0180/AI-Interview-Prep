import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import { sendEmail } from '@/utils/email';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });

    // Don't reveal if the user exists or not
    if (!user) {
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving to database
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiration to 15 minutes
    const resetTokenExpiration = new Date(Date.now() + 15 * 60 * 1000);
    
    // Save token and expiration to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = resetTokenExpiration;
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    // Email content
    const emailSubject = 'Interview Prep - Password Reset';
    const emailContent = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
    `;
    
    // Send email
    await sendEmail(user.email, emailSubject, emailContent);
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Password reset request failed. Please try again.' },
      { status: 500 }
    );
  }
} 
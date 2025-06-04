import { NextRequest } from 'next/server';
import { verifyEmail } from '@/controllers/authController';

export async function POST(req: NextRequest) {
  return verifyEmail(req);
} 
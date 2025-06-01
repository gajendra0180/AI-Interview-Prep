import { NextRequest } from 'next/server';
import { registerUser } from '@/controllers/authController';

export async function POST(req: NextRequest) {
  return registerUser(req);
} 
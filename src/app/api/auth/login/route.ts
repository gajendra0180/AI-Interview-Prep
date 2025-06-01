import { NextRequest } from 'next/server';
import { loginUser } from '@/controllers/authController';

export async function POST(req: NextRequest) {
  return loginUser(req);
} 
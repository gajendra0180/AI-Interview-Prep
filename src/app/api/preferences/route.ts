import { NextRequest } from 'next/server';
import { updateInterviewPreferences } from '@/controllers/authController';

export async function PUT(req: NextRequest) {
  return updateInterviewPreferences(req);
} 
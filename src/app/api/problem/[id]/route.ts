import { NextResponse } from 'next/server';

// Proxy API route to fetch LeetCode problems and avoid CORS errors
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`https://leetcode-api-pied.vercel.app/problem/${id}`);
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch problem from LeetCode API' },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
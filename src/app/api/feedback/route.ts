import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  const {
    GITHUB_TOKEN
  } = process.env;
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN is not set' },
      { status: 500 }
    );
  }
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }
    
    const endpoint = 'https://models.github.ai/inference';
    const modelName = 'openai/gpt-4o';
    // Using server-side environment variable

    const client = new OpenAI({ 
      baseURL: endpoint, 
      apiKey: GITHUB_TOKEN 
    });
    
    const response = await client.chat.completions.create({
      messages,
      model: modelName
    });
    
    return NextResponse.json({ 
      content: response.choices[0].message.content 
    });
    
  } catch (error: any) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 
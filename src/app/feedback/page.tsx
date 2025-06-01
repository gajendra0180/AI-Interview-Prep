'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInterviewContext } from '@/context/InterviewContext';
import Logo from '@/components/Logo';

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { interviewData } = useInterviewContext();

  useEffect(() => {
    const generateFeedback = async () => {
      try {
        // Get interview data from context instead of localStorage
        if (!interviewData) {
          setError('No interview data found. Please complete an interview first.');
          setLoading(false);
          return;
        }

        console.log("Processing interview data:", interviewData);
        
        // Filter conversation to just user responses
        const userResponses = interviewData.items.filter((item: any) => 
          item.role === 'user' || (item.formatted && item.formatted.text)
        );
        console.log("userResponses",userResponses);
        // Count how many times user asked for hints (simple heuristic)
        const hintCount = userResponses.filter((item: any) => {
          console.log("item",item);
          const text = item.formatted?.transcript || '';
          console.log("text",text);
          return text.toLowerCase().includes('hint') || 
                 text.toLowerCase().includes('help') || 
                 text.toLowerCase().includes('stuck') || 
                 text.toLowerCase().includes('hints') || 
                 text.toLowerCase().includes("i don't know");
        }).length;
        
        console.log("Hint requests identified:", hintCount);

        // Prepare messages for the OpenAI client
        const messages = [
          {
            role: "system" as const, 
            content: `You are an expert technical interviewer providing strict, detailed feedback on a coding interview. 
            Analyze the conversation between interviewer and candidate, along with the candidate's final code.
            Provide extremely critical feedback focusing on:
            1. Problem solving approach (structured thinking, algorithm design)
            2. Technical communication quality (clarity, precision, terminology use)
            3. Code quality (correctness, efficiency, style)
            4. Areas for improvement (be specific and direct)
            5. Give a score out of 10 for the candidate's performance
            6. Give a score out of 10 for the candidate's communication skills
            7. Give a score out of 10 for the candidate's problem solving skills
            8. Give a score out of 10 for the candidate's technical skills
            9. Give a score out of 10 for the candidate's overall performance
            10. Give a score out of 10 for the candidate's confidence
            also tell how many times the candidate asked for hints
            
            Format your response with clear sections using markdown headers. Be brutally honest - point out even minor mistakes or hesitations.
            Your feedback should be direct, actionable, and reflect the standards of top tech companies.`
          },
          {
            role: "user" as const,
            content: `Here is the complete interview data:
            
            Problem: ${interviewData.problem?.title || 'Technical Interview'}
            Problem Description: ${interviewData.problem?.description || 'No description available'}
            
            Conversation:
            ${interviewData.items.map((item: any) => {
              const role = item.role === 'user' ? 'Candidate' : 'Interviewer';
              return `${role}: ${item.formatted?.text || '[audio response]'}`;
            }).join('\n\n')}
            
            Final Code Solution:
            \`\`\`
            ${interviewData.code || 'No code submitted'}
            \`\`\`
            
            Focus Area: ${interviewData.focusArea || 'General'}
            Times Asked for Hints: ${hintCount}
            
            Please provide comprehensive, critical feedback on this candidate's performance.
            also tell how many times the candidate asked for hints`
          }
        ];
        
        console.log("Generating AI feedback...");
        
        try {
          // Use our server-side API route instead of direct client call
          const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${errorData.error || response.statusText}`);
          }
          
          const data = await response.json();
          console.log("Feedback response:", data);
          
          if (!data.content) {
            throw new Error('Invalid response from API');
          }
          
          setFeedback({
            content: data.content,
            problemTitle: interviewData.problem?.title || 'Technical Interview',
            hintCount,
            code: interviewData.code
          });
        } catch (apiError: any) {
          console.error('API error:', apiError);
          setError(`AI feedback generation failed: ${apiError.message || 'Unknown error'}`);
        }
        
      } catch (err) {
        console.error('Error generating feedback:', err);
        setError('Failed to generate interview feedback. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    generateFeedback();
  }, [interviewData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Analyzing your interview performance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Logo />
          </div>
        </header>

        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link href="/dashboard" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>

      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-indigo-600 mb-2">Interview Feedback</h1>
            <h2 className="text-lg text-gray-700 mb-6">Problem: {feedback?.problemTitle}</h2>
            
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Hint Requests</p>
                <p className="font-medium text-gray-600">{feedback?.hintCount} times</p>
              </div>
            </div>
            
            {/* Render AI Feedback using markdown */}
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: feedback?.content ? convertMarkdownToHtml(feedback.content) : '' }}></div>
          </div>
          
          <div className="flex justify-between">
            <Link href="/dashboard" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
              Return to Dashboard
            </Link>
            
            <button 
              onClick={() => {
                router.push('/dashboard');
              }}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Complete Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
  // Convert headers
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-800 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-indigo-700 mt-10 mb-5">$1</h1>')
    
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Convert lists
    .replace(/^\s*\n\*/gim, '<ul>\n*')
    .replace(/^(\*.+)\s*\n([^\*])/gim, '$1\n</ul>\n\n$2')
    .replace(/^\*(.+)/gim, '<li>$1</li>')
    
    // Convert numbered lists
    .replace(/^\s*\n\d\./gim, '<ol>\n1.')
    .replace(/^(\d\..+)\s*\n([^\d\.])/gim, '$1\n</ol>\n\n$2')
    .replace(/^\d\.(.+)/gim, '<li>$1</li>')
    
    // Convert code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm my-4"><code>$1</code></pre>')
    
    // Convert paragraphs
    .replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /\<(\/)?(h\d|ul|ol|li|pre|code)/.test(m) ? m : '<p class="mb-4">' + m + '</p>';
    })
    
    // Fix line breaks
    .replace(/\n/gim, '<br>');
    
  return html;
} 
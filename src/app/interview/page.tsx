'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type { Problem } from '@/components/ProblemDescription';
import { VoiceChat } from './Interview-assistant';
import { useInterviewContext } from '@/context/InterviewContext';
// Dynamically import components to prevent SSR issues
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });
const ProblemDescription = dynamic(() => import('@/components/ProblemDescription'), { ssr: false });

// Client component that uses useSearchParams
function InterviewContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [splitPosition, setSplitPosition] = useState(33); // Default split at 33%
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [editorCode, setEditorCode] = useState<string>('');
  const [conversationItems, setConversationItems] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams.get('language');
  const { setInterviewData } = useInterviewContext();

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // If no programming language is specified for DSA focus, redirect to setup
      if (
        parsedUser.interviewPreferences?.focusArea === 'DSA' && 
        !parsedUser.interviewPreferences?.programmingLanguage && 
        !language
      ) {
        router.push('/interview-setup');
      }
      
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router, language]);

  // Handle mouse down event on the resizer
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle mouse move event for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const container = document.getElementById('split-container');
      if (!container) return;
      
      // Calculate percentage position
      const containerRect = container.getBoundingClientRect();
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limit the range (min 20%, max 80%)
      if (newPosition >= 20 && newPosition <= 80) {
        setSplitPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine which language to use for the editor
  const getEditorLanguage = () => {
    // If language is passed via query param, use that
    if (language) {
      return language;
    }
    
    // Otherwise use the user's preferred language from their profile
    if (user?.interviewPreferences?.programmingLanguage) {
      return user.interviewPreferences.programmingLanguage;
    }
    
    // Default to JavaScript if nothing is specified
    return 'JavaScript';
  };

  const getFocusArea = () => {
    return user?.interviewPreferences?.focusArea || 'DSA';
  };

  const handleSubmitSolution = () => {
    // Store conversation data in context instead of localStorage
    setInterviewData({
      items: conversationItems,
      problem: selectedProblem,
      code: editorCode,
      focusArea: getFocusArea()
    });
    
    router.push('/feedback');
  };

  const handleConversationUpdate = (items: any[]) => {
    setConversationItems(items);
  };

  return (
    <div id="split-container" className="flex min-h-screen bg-gray-50 relative">
      {/* Problem Description Panel - Resizable width */}
      <div style={{ width: `${splitPosition}%` }} className="p-4 overflow-auto h-screen">
        <ProblemDescription focusArea={getFocusArea()} onSelect={setSelectedProblem} />
      </div>
      <VoiceChat
        scrapedContent={getFocusArea()}
        problemTitle={selectedProblem?.title ?? ''}
        problemDescription={selectedProblem?.description ?? ''}
        codeContext={editorCode}
        interviewerGender={user.interviewPreferences?.interviewerGender || 'Male'}
        onConversationUpdate={handleConversationUpdate}
      />
      {/* Resizer handle */}
      <div 
        className="w-2 hover:w-4 bg-gray-300 hover:bg-indigo-500 cursor-col-resize active:bg-indigo-700 transition-all flex items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
      >
        <div className="h-8 w-1 bg-gray-500 rounded-full opacity-50"></div>
      </div>
      
      {/* Code Editor Panel - Remaining width */}
      <div style={{ width: `${100 - splitPosition}%` }} className="flex flex-col">
        <CodeEditor language={getEditorLanguage()} onCodeChange={setEditorCode} />
        
        {/* Submit Solution Button */}
        <div className="p-1 bg-gray-100 border-t border-gray-300 flex justify-center">
          <button
            onClick={handleSubmitSolution}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
          >
            Submit Solution for Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  );
} 
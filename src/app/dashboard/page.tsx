'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

type User = {
  id: string;
  name: string;
  email: string;
  interviewPreferences?: {
    experienceLevel?: string;
    focusArea?: string;
    interviewerGender?: string;
    programmingLanguage?: string;
  };
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // If user hasn't completed setup, redirect to setup
      if (!parsedUser.interviewPreferences?.focusArea) {
        router.push('/interview-setup');
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleStartInterview = () => {
    // For DSA focus, we will navigate to the code editor
    if (user?.interviewPreferences?.focusArea === 'DSA') {
      router.push(`/interview?language=${user.interviewPreferences.programmingLanguage || 'JavaScript'}`);
    } else {
      // For other focus areas, we'll still navigate to the interview page
      // but without a specific language parameter
      router.push('/interview');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo />
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Interview Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium text-gray-600 mb-1">Experience Level</p>
              <p className="font-medium text-gray-500">{user?.interviewPreferences?.experienceLevel || 'Not specified'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium text-gray-600 mb-1">Focus Area</p>
              <p className="font-medium text-gray-500">{user?.interviewPreferences?.focusArea || 'Not specified'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium text-gray-600 mb-1">Interviewer Voice</p>
              <p className="font-medium text-gray-500">{user?.interviewPreferences?.interviewerGender || 'Not specified'}</p>
            </div>
            
            {user?.interviewPreferences?.focusArea === 'DSA' && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium text-gray-600 mb-1">Programming Language</p>
                <p className="font-medium text-gray-500">{user?.interviewPreferences?.programmingLanguage || 'Not specified'}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Link
              href="/interview-setup"
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              Update Preferences
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Start an Interview</h2>
          <p className="text-gray-600 mb-6">Ready to practice? Start a mock interview based on your preferences.</p>
          
          <button
            onClick={handleStartInterview}
            className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
          >
            Start Interview Session
          </button>
        </div>
      </main>
    </div>
  );
} 
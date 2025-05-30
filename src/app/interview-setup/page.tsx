'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InterviewSetupForm from '@/components/InterviewSetupForm';
import Logo from '@/components/Logo';

export default function InterviewSetup() {
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-transparent backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>

      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8 mt-8">
            <h1 className="text-2xl font-extrabold text-indigo-500 mb-3 tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">Customize your interview experience</h1>
          </div>
          <InterviewSetupForm />
        </div>
      </main>
    </div>
  );
} 
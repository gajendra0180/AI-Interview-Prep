'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Logo from '@/components/Logo';

// Client component that uses useSearchParams
function VerifyEmailContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setError('Invalid verification link. Please try again or request a new verification email.');
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.post('/api/auth/verify-email', { token });
        setIsVerified(true);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-transparent backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>

      <main className="flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Verification</h1>
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}
          
          {!isLoading && isVerified && (
            <div className="py-4">
              <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                <p className="font-medium">Your email has been successfully verified!</p>
                <p className="text-sm mt-2">You can now sign in to your account.</p>
              </div>
              
              <Link href="/" className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200">
                Sign In
              </Link>
            </div>
          )}
          
          {!isLoading && error && (
            <div className="py-4">
              <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                <p className="font-medium">Verification Failed</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
              
              <Link href="/" className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200">
                Return to Sign In
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Main component with Suspense boundary
export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Logo />
          </div>
        </header>
        
        <main className="flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Verification</h1>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 
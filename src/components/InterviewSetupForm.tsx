'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferenceSchema } from '@/utils/validation';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type FormData = {
  experienceLevel: string;
  focusArea: 'DSA' | 'System Design' | 'Core Fundamentals';
  interviewerGender: 'Male' | 'Female';
  programmingLanguage?: string;
};

const InterviewSetupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(preferenceSchema),
  });

  // Watch the focus area to conditionally show programming language field
  const focusArea = watch('focusArea');

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      router.push('/');
    }
  }, [router]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        '/api/preferences',
        {
          userId: user.id,
          preferences: data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update user in localStorage with new preferences
      const updatedUser = {
        ...user,
        interviewPreferences: response.data.preferences
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Interview Preferences</h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience
          </label>
          <input
            id="experienceLevel"
            type="text"
            {...register('experienceLevel')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
            placeholder="e.g., 2 years"
            disabled={isLoading}
          />
          {errors.experienceLevel && (
            <p className="mt-1 text-sm text-red-500">{errors.experienceLevel.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 mb-1 ">
            Main Focus Area
          </label>
          <select
            id="focusArea"
            {...register('focusArea')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
            disabled={isLoading}
          >
            <option value="">Select focus area</option>
            <option value="DSA">Data Structures & Algorithms</option>
            <option value="System Design">System Design</option>
            <option value="Core Fundamentals">Core Fundamentals</option>
          </select>
          {errors.focusArea && (
            <p className="mt-1 text-sm text-red-500">{errors.focusArea.message}</p>
          )}
        </div>
        
        {focusArea === 'DSA' && (
          <div>
            <label htmlFor="programmingLanguage" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Programming Language
            </label>
            <select
              id="programmingLanguage"
              {...register('programmingLanguage')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
              disabled={isLoading}
            >
              <option value="">Select language</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
            </select>
            {errors.programmingLanguage && (
              <p className="mt-1 text-sm text-red-500">{errors.programmingLanguage.message}</p>
            )}
          </div>
        )}
        
        <div>
          <label htmlFor="interviewerGender" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Interviewer Voice
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Male"
                {...register('interviewerGender')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                disabled={isLoading}
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Female"
                {...register('interviewerGender')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                disabled={isLoading}
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>
          </div>
          {errors.interviewerGender && (
            <p className="mt-1 text-sm text-red-500">{errors.interviewerGender.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Continue to Dashboard'}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetupForm; 
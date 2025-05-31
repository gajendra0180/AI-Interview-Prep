'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import axios from 'axios';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post('/api/auth/forgot-password', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      {success ? (
        <div className="text-center">
          <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
            Password reset instructions have been sent to your email.
          </div>
          <p className="text-gray-600 mb-4">
            Please check your inbox and follow the link to reset your password.
          </p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Return to login
          </Link>
        </div>
      ) : (
        <>
          <div>
            <h2 className="mt-0 text-center text-3xl font-bold text-gray-900 py-5">
              Reset your password
            </h2>
        </div>
          <p className="text-gray-600 mb-6 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Back to login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm; 
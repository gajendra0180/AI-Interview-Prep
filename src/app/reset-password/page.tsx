import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Logo from '@/components/Logo';
import { Suspense } from 'react';

export const metadata = {
  title: 'Reset Password | Interview Prep',
  description: 'Set a new password for your Interview Prep account',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <header className="bg-transparent backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
} 
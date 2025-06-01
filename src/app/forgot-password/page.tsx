import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Logo from '@/components/Logo';

export const metadata = {
  title: 'Forgot Password | Interview Prep',
  description: 'Reset your Interview Prep account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-transparent backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo />
        </div>
      </header>


      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
} 
import ForgotPassword from '@/components/auth/ForgotPassword';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-abstract.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
      
      <div className="z-10 w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl space-y-6">
        <ForgotPassword />
        
        <div className="text-center mt-6">
          <Link href="/auth" className="text-sm text-white/60 hover:text-white transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

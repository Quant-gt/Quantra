import ForgotPassword from '@/components/auth/ForgotPassword';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#fff]/20 relative overflow-hidden">
      {/* Super Subtle Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-[420px] relative space-y-6">
        <ForgotPassword />
        
        <div className="text-center mt-6">
          <Link href="/auth" className="text-sm font-semibold text-[#A1A1AA] hover:text-white transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

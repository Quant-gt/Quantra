import Wizard from '@/components/onboarding/Wizard';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] relative p-4 sm:p-8">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="z-10 w-full max-w-3xl">
        <div className="mb-8 text-center">
          <img src="/logo_transparent.png" alt="SigmaSpire Logo" className="h-10 mx-auto mb-6" />
          <h1 className="text-white text-xl font-medium tracking-wide">INITIALIZATION SEQUENCE</h1>
        </div>
        <Wizard />
      </div>
    </div>
  );
}


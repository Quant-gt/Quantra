import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-abstract.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
      
      <div className="z-10 w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">QUANTRA</h1>
          <p className="text-muted-foreground">Your Algorithm. Your Mantra. Your Edge.</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
}

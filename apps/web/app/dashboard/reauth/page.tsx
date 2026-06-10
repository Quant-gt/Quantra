import MorningReauth from '@/components/compliance/MorningReauth';

export default function ReauthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-abstract.jpg')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md z-0"></div>
      
      <div className="z-10 w-full max-w-md">
        <MorningReauth />
      </div>
    </div>
  );
}


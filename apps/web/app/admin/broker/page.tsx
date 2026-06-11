"use client";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import { ShieldCheck, LogIn, Key, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function BrokerAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    
    if (success) {
      toast.success("Successfully authenticated with Fyers!");
      router.replace("/admin/broker"); // clear query params
    }
    
    if (error) {
      toast.error(`Broker Auth Failed: ${error}`);
      router.replace("/admin/broker");
    }
  }, [searchParams, router]);

  return null;
}

export default function BrokerAdminPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:8000";
      const res = await fetch(`${ENGINE_URL}/api/v1/fyers/login_url`);
      const data = await res.json();
      
      if (data.url) {
        // Redirect browser to Fyers Login Consent page
        window.location.href = data.url;
      } else {
        toast.error("Failed to generate login URL. Check backend logs.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Network error communicating with AI Engine.");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <Suspense fallback={null}>
        <BrokerAuthHandler />
      </Suspense>
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <ShieldCheck className="text-[#39D353]" size={32} />
          Master Execution Account
        </h1>
        <p className="text-gray-400 mt-2">
          Manage the central Fyers brokerage connection for live algorithmic execution.
        </p>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
              <Key size={20} className="text-[#58A6FF]" />
              Daily Broker Authorization
            </h2>
            <p className="text-sm text-gray-400 max-w-xl">
              Fyers API v3 requires human consent once per day. Click the button below to log in to the Fyers web portal. You will be redirected back here automatically once the access token is secured.
            </p>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#FF4A4A] hover:bg-[#FF6B6B] text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            Login to Fyers
          </button>
        </div>
      </div>
      
      <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-4 flex gap-4 items-center">
        <div className="w-3 h-3 rounded-full bg-[#39D353] animate-pulse"></div>
        <p className="text-sm font-mono text-gray-300">
          In-Memory Async Event Loop Active (200ms netting cycle)
        </p>
      </div>
    </div>
  );
}

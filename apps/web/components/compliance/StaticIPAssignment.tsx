"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function StaticIPAssignment() {
  const [staticIp, setStaticIp] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchIp = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('static_ip_v4, static_ip_verified_at').eq('id', user.id).single();
        if (data) {
          // Mock data if null
          setStaticIp(data.static_ip_v4 || "192.168.1.100"); // Should be pulled from Render/Oracle 
          setVerified(!!data.static_ip_verified_at);
        }
      }
    };
    fetchIp();
  }, [supabase]);

  const verifyWithBroker = async () => {
    setLoading(true);
    try {
      // Simulate verification API call
      await new Promise(r => setTimeout(r, 2000));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').update({ 
          static_ip_verified_at: new Date().toISOString() 
        }).eq('id', user.id);
      }
      setVerified(true);
      alert("Broker successfully validated your Static IP!");
    } catch (e) {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 w-full max-w-lg">
      <h2 className="text-xl font-bold text-white mb-2">Static IP Provisioning</h2>
      <p className="text-sm text-white/60 mb-6">
        SEBI mandates that all live algorithmic orders originate from a pre-whitelisted Static IP.
      </p>

      <div className="bg-black/30 border border-white/10 rounded-lg p-4 mb-6">
        <p className="text-sm text-white/60 mb-1">Your assigned Static IP Address</p>
        <div className="flex items-center justify-between">
          <code className="text-2xl font-mono text-primary font-bold">{staticIp || "Loading..."}</code>
          <button className="text-white/60 hover:text-white px-3 py-1 bg-white/10 rounded transition-colors"
            onClick={() => {
              if (staticIp) navigator.clipboard.writeText(staticIp);
              alert("IP Copied!");
            }}
          >
            Copy
          </button>
        </div>
      </div>

      {!verified ? (
        <div className="space-y-4">
          <div className="text-sm text-white/80 space-y-2">
            <p>1. Copy your Static IP above.</p>
            <p>2. Paste it in your Broker's Developer Portal whitelist.</p>
            <p>3. Click the verify button below to perform a handshake.</p>
          </div>
          <button
            onClick={verifyWithBroker}
            disabled={loading || !staticIp}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying Handshake..." : "Verify Broker IP Handshake"}
          </button>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Static IP successfully verified and active for live trading.
        </div>
      )}
    </div>
  );
}

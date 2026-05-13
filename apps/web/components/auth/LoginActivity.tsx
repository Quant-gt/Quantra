"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginActivity() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchSessions = async () => {
      // Assuming a custom user_sessions table populated via webhook/triggers
      // Fallback: use Supabase's native getSession to display the current one
      const { data: { session } } = await supabase.auth.getSession();
      
      try {
        const { data, error } = await supabase
          .from("user_sessions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
          
        if (data && data.length > 0) {
          setSessions(data);
        } else if (session) {
          // Mock data if table doesn't exist or is empty
          setSessions([
            {
              id: session.access_token.slice(-10),
              ip_address: "Current IP",
              user_agent: navigator.userAgent,
              created_at: new Date().toISOString(),
              status: "active"
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [supabase]);

  if (loading) return <div className="text-white/50">Loading activity...</div>;

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 max-w-2xl w-full">
      <h2 className="text-xl font-bold text-white mb-4">Recent Login Activity</h2>
      <div className="space-y-4">
        {sessions.map((s, i) => (
          <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-white font-medium flex items-center">
                {s.ip_address}
                {s.status === "active" && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">Current Session</span>
                )}
              </p>
              <p className="text-white/60 text-sm truncate max-w-sm">{s.user_agent}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">
                {new Date(s.created_at).toLocaleDateString()}
              </p>
              <p className="text-white/40 text-xs">
                {new Date(s.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-white/50 text-sm text-center py-4">No recent activity found.</p>
        )}
      </div>
    </div>
  );
}

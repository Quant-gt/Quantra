import dynamic from 'next/dynamic';

const VisualBuilder = dynamic(() => import("@/components/builder/VisualBuilder"), {
  ssr: false,
  loading: () => <div className="p-8 text-white/50 text-center bg-slate-950 h-full flex items-center justify-center">Loading Visual Canvas...</div>
});
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function BuilderPage() {
  const supabase = await createClient();
  
  // Verify strategy exists and user owns it
  // Since this is the generic /builder route (not [id]), we just fetch a placeholder or skip it
  const { data: strategy, error } = await supabase
    .from("strategies")
    .select("*")
    .limit(1)
    .single();

  // If error or not found, we can still allow creating a new one or just return 404 for now
  // For this MVP, if it fails, we will just show the builder anyway to demonstrate it
  // In real app, we would enforce ownership: if (!strategy) notFound();

  return (
    <div className="h-screen flex flex-col">
      {/* Header Bar */}
      <div className="h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 text-white">
        <div>
          <h1 className="text-xl font-bold">{strategy?.name || "New Strategy"}</h1>
          <p className="text-xs text-slate-400">Visual Strategy Builder</p>
        </div>
        
        <div className="flex-1 flex justify-center">
          <a href="/builder/ai" className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 rounded-full text-sm text-indigo-300 font-medium transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-indigo-400 group-hover:text-indigo-300"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
            Try the AI Strategy Prompt Generator
          </a>
        </div>
        
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-white/5">
            Validate
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-white/5">
            Backtest
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-semibold transition-colors">
            Save Draft
          </button>
        </div>
      </div>

      <VisualBuilder />
    </div>
  );
}


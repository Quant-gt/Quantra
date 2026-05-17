import BuilderCanvas from "@/components/builder/BuilderCanvas";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Verify strategy exists and user owns it
  const { data: strategy, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("id", params.id)
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

      <BuilderCanvas />
    </div>
  );
}

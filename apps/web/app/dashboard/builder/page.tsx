import BuilderCanvas from '@/components/builder/BuilderCanvas';

export const metadata = {
  title: 'Strategy Builder | Quantra',
  description: 'Visual DAG-based algorithmic strategy builder.',
};

export default function BuilderPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0D1117]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D] bg-[#0B0F19]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#388BFD] animate-pulse"></span>
            Visual Strategy Engine
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Construct complex multi-leg algorithmic strategies without coding. Drag and drop nodes to define execution logic.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            Save Draft
          </button>
          <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm font-bold transition-all shadow-lg flex items-center gap-2">
            Compile & Backtest
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <BuilderCanvas />
      </div>
    </div>
  );
}

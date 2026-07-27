import { DollarSign } from "lucide-react";

export function StepCapital({ data, handleSelect }: any) {
  return (
    <div className="space-y-8 max-w-lg mx-auto py-6">
      <div className="bg-[#0D1117] border border-[#30363D] rounded-2xl p-8 text-center shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#58A6FF] to-transparent opacity-50" />
        <DollarSign className="w-6 h-6 text-[#58A6FF] mx-auto mb-2 opacity-50" />
        <div className="text-5xl font-black text-white tracking-tighter">
          ₹ {parseInt(data.capital || "100000").toLocaleString('en-IN')}
        </div>
        <p className="text-gray-500 text-xs font-mono mt-2 tracking-widest">ESTIMATED DEPLOYMENT</p>
      </div>
      
      <div className="px-4">
        <input
          type="range"
          min="10000"
          max="10000000"
          step="10000"
          value={data.capital || "100000"}
          onChange={(e) => handleSelect('capital', e.target.value)}
          className="w-full h-2 bg-[#30363D] rounded-lg appearance-none cursor-pointer accent-[#58A6FF]"
        />
        <div className="flex justify-between text-xs text-gray-500 font-mono mt-3">
          <span>₹10K</span>
          <span>₹1Cr+</span>
        </div>
      </div>
    </div>
  );
}

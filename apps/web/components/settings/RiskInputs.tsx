import React from 'react';
import { TrendingDown, AlertOctagon } from 'lucide-react';

interface RiskInputsProps {
  maxDrawdown: number;
  setMaxDrawdown: (val: number) => void;
  maxPositions: number;
  setMaxPositions: (val: number) => void;
}

export function RiskInputs({ maxDrawdown, setMaxDrawdown, maxPositions, setMaxPositions }: RiskInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Max Drawdown */}
      <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-yellow-500" size={20} />
          <h3 className="text-md font-bold text-white">Max Daily Drawdown</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">If your total portfolio drops by this percentage in a single day, all positions will be flattened.</p>
        
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="0.5" 
            max="20" 
            step="0.5" 
            value={maxDrawdown} 
            onChange={(e) => setMaxDrawdown(parseFloat(e.target.value))}
            className="flex-1 accent-yellow-500"
          />
          <div className="bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded-lg text-white font-bold min-w-[70px] text-center">
            {maxDrawdown}%
          </div>
        </div>
      </div>

      {/* Max Open Positions */}
      <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertOctagon className="text-blue-500" size={20} />
          <h3 className="text-md font-bold text-white">Max Open Positions</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">The maximum number of simultaneous trades the engine is allowed to hold across all algorithms.</p>
        
        <div className="flex items-center gap-3">
          <input 
            type="number" 
            min="1" 
            max="100" 
            value={maxPositions} 
            onChange={(e) => setMaxPositions(parseInt(e.target.value))}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2 text-white focus:border-[#58A6FF] outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

import { TrendingUp, LineChart, Cpu } from "lucide-react";

export function StepExperience({ data, handleSelect }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { id: 'Novice', icon: <TrendingUp size={24} />, desc: 'New to quantitative models' },
        { id: 'Intermediate', icon: <LineChart size={24} />, desc: 'Familiar with algorithmic execution' },
        { id: 'Quant', icon: <Cpu size={24} />, desc: 'Developing custom Alpha logic' }
      ].map((level) => (
        <button
          key={level.id}
          onClick={() => handleSelect('experience', level.id)}
          className={`p-6 rounded-xl border transition-all text-left flex flex-col items-start gap-4 ${
            data.experience === level.id
              ? 'border-[#388BFD] bg-[#388BFD]/10 text-white shadow-[0_0_20px_rgba(56,139,253,0.15)] ring-1 ring-[#388BFD]'
              : 'border-[#30363D] bg-[#0D1117]/50 text-gray-400 hover:bg-[#1C2128] hover:border-gray-600'
          }`}
        >
          <div className={`p-3 rounded-lg ${data.experience === level.id ? 'bg-[#388BFD] text-white' : 'bg-[#21262D] text-gray-400'}`}>
            {level.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white mb-1">{level.id}</h3>
            <p className="text-xs leading-relaxed opacity-80">{level.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export function StepStyle({ data, handleSelect }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['High-Frequency Scalping', 'Intraday Momentum', 'Swing Trades (Days)', 'Positional Holding'].map((style) => (
        <button
          key={style}
          onClick={() => handleSelect('style', style)}
          className={`p-5 rounded-xl border transition-all text-left group flex justify-between items-center ${
            data.style === style
              ? 'border-[#238636] bg-[#238636]/10 text-white'
              : 'border-[#30363D] bg-[#0D1117]/50 text-gray-400 hover:bg-[#1C2128]'
          }`}
        >
          <span className={`font-semibold ${data.style === style ? 'text-white' : 'text-gray-300'}`}>{style}</span>
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.style === style ? 'border-[#238636] bg-[#238636]' : 'border-[#30363D]'}`}>
            {data.style === style && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
        </button>
      ))}
    </div>
  );
}

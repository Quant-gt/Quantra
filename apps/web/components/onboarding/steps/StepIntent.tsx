export function StepIntent({ data, handleSelect }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { title: 'Alpha Generation', sub: 'Aggressive growth seeking high ROI' },
        { title: 'Capital Preservation', sub: 'Low drawdown, steady compounding' },
        { title: 'Portfolio Hedging', sub: 'Automated risk mitigation' },
        { title: 'Statistical Arbitrage', sub: 'Market-neutral mean reversion' }
      ].map((intent) => (
        <button
          key={intent.title}
          onClick={() => handleSelect('intent', intent.title)}
          className={`p-5 rounded-xl border transition-all text-left ${
            data.intent === intent.title
              ? 'border-[#D29922] bg-[#D29922]/10'
              : 'border-[#30363D] bg-[#0D1117]/50 hover:bg-[#1C2128]'
          }`}
        >
          <h3 className={`font-bold mb-1 ${data.intent === intent.title ? 'text-[#D29922]' : 'text-gray-300'}`}>{intent.title}</h3>
          <p className={`text-xs ${data.intent === intent.title ? 'text-[#D29922]/80' : 'text-gray-500'}`}>{intent.sub}</p>
        </button>
      ))}
    </div>
  );
}

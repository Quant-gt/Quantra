"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  strategy: 100000 * Math.pow(1.02 + Math.random() * 0.05, i),
  benchmark: 100000 * Math.pow(1.01 + Math.random() * 0.03, i),
  drawdown: -(Math.random() * 15)
}));

export default function StrategyAnalytics() {
  return (
    <div className="space-y-8">
      {/* Equity Curve */}
      <div className="glass-panel p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Equity Curve</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="strategy" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} name="Strategy" />
              <Line type="monotone" dataKey="benchmark" stroke="rgba(255,255,255,0.3)" strokeWidth={2} dot={false} name="Nifty 50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drawdown Chart */}
      <div className="glass-panel p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Drawdown Profile</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(val) => `${val}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <Area type="step" dataKey="drawdown" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Drawdown" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

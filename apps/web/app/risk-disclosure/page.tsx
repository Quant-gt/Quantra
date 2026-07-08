import React from 'react';
import { AlertTriangle, ShieldX, TrendingDown, ArrowLeft } from 'lucide-react';

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-sans pb-20">
      {/* Top Banner */}
      <div className="border-b border-[#30363D] bg-[#161B22] py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#F85149] text-sm font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle size={16} />
              Risk Disclosure Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Risk Disclosure</h1>
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Mandated Regulatory Warnings & Disclaimers</p>
          </div>
          <a href="/" className="flex items-center gap-2 text-sm text-[#58A6FF] hover:underline bg-[#21262D] border border-[#30363D] px-4 py-2 rounded-lg transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Table of Contents */}
        <aside className="lg:w-1/4 lg:sticky lg:top-8 h-fit space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 px-2">Table of Contents</div>
          {[
            { id: "1", title: "1. Mandatory SEBI F&O Warning" },
            { id: "2", title: "2. Leverage & Margin Risks" },
            { id: "3", title: "3. Technological & Execution Risks" },
            { id: "4", title: "4. Algorithmic Logic & Backtest Gaps" },
            { id: "5", title: "5. Operational Constraints" },
            { id: "6", title: "6. Market Volatility & Gaps" },
            { id: "7", title: "7. No Guarantee of Capital or Profit" },
            { id: "8", title: "8. Client Consent & Declaration" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#section-${item.id}`}
              className="block px-3 py-2 text-sm rounded-md border border-transparent hover:bg-[#161B22] hover:border-[#30363D] text-[#8B949E] hover:text-[#F85149] transition-all"
            >
              {item.title}
            </a>
          ))}
        </aside>

        {/* Main Content Pane */}
        <main className="lg:w-3/4 space-y-12">
          {/* Crucial Risk Alert */}
          <div className="bg-[#F85149]/10 border border-[#F85149]/30 rounded-xl p-6 flex gap-4">
            <ShieldX className="text-[#F85149] shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-white mb-2">9 OUT OF 10 INDIVIDUAL TRADERS IN F&O LOSE CAPITAL</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                As per SEBI regulations, you are hereby warned that 9 out of 10 individual traders in the equity Futures & Options (F&O) segment incur net losses. On average, loss-makers registered a net loss of close to ₹50,000 per year. Transaction costs (including brokerage, clearing fees, GST, STT, and exchange transaction fees) represent an additional drag on net returns.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2 flex items-center gap-2">
              <TrendingDown size={20} className="text-[#F85149]" />
              1. Mandatory SEBI F&O Warning
            </h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In compliance with Securities and Exchange Board of India (SEBI) directives, all users engaging in derivative trading (Futures and Options) must acknowledge the statistical probability of net losses. Trading in derivative contracts involves high risk due to embedded leverage. 
              </p>
              <p>
                By linking your broker account to Quantra's execution engine, you declare that you have read and accepted this warning and possess sufficient financial resilience to absorb absolute capital write-downs.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. Leverage & Margin Risks</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Derivative and margin-based trades carry "geared" risks. The low margins required to open derivative positions mean that a small adverse movement in stock indices can trigger immediate margin shortfalls:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Auto Liquidation**: If your account margin drops below your broker's maintenance threshold, the broker reserves the right to square off your positions instantly without notice. Quantra's automation loop is not liable for auto-liquidations.</li>
                <li>**Peak Margin Penalties**: Exchanges calculate peak margin utilization dynamically throughout the day. Incorrect position sizing or excessive open positions could result in margin penalty assessments by your broker.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. Technological & Execution Risks</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Algorithmic trading is entirely dependent on technology infrastructure. Physical order routing involves a chain of servers, APIs, internet service providers, and exchange matchmakers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Execution Latency**: Milliseconds matter in fast-moving markets. Network congestion or API latency can lead to order fills at rates worse than expected (slippage).</li>
                <li>**API Outages**: Third-party broker APIs frequently experience connection dropouts, throttle responses during high volume, or fail to respond. Quantra cannot guarantee that an order signal dispatched from our platform will successfully land at the broker or exchange.</li>
                <li>**Internet & Server Failures**: Server crashes, electricity dropouts, or packet drops anywhere along the route will cause automated strategies to miss entries or exits.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. Algorithmic Logic & Backtest Gaps</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                There is a fundamental difference between historical simulation (backtesting) and live execution:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Slippage Inaccuracy**: Backtesting assumes frictionless execution at historical tick prices. In live markets, placing large market orders generates impact costs and execution slippage that drag down returns.</li>
                <li>**Overfitting (Curve Fitting)**: Algorithms optimized to perform exceptionally well on past data often fail when exposed to live, unpredictable market cycles.</li>
                <li>**Logic Faults**: Coding errors, rounding mismatches, or unhandled data feed gaps (such as missing ticks from yfinance or broker feeds) can cause algorithms to calculate incorrect entry/exit signals or trigger infinite order loops.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. Operational Constraints</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Our execution engines enforce strict safeguards to satisfy compliance standards. These constraints can affect trading results:
              </p>
              <p>
                **OPS Limiting**: 
                Our platform throttles API calls at **10 Operations Per Second (OPS)**. In highly active markets where your strategy tries to place scale orders, throttling will delay trade execution, potentially causing loss of trade entries or delayed exits.
              </p>
              <p>
                **Drawdown Limits**: 
                If your portfolio breaches your configured max daily drawdown limits, the system will prevent new deployments and pause active bots. You acknowledge that during fast market crashes, slippage might result in actual losses exceeding your set limits before the system can square off your positions.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Market Volatility & Gaps</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Financial markets are subject to sudden structural breaks, black swan events, and overnight gaps:
              </p>
              <p>
                When the market opens with a gap (up or down) due to overnight global events, your trailing stop-loss levels will not protect you from executing at the opening gap price, which may be significantly worse than your target stop price. Algorithmic rules cannot mitigate this market gap risk.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. No Guarantee of Capital or Profit</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra does not promise, represent, or guarantee that any algorithm, strategy, indicator, or configuration will yield profits or protect capital. You must only trade with money you can afford to lose entirely.
              </p>
              <p>
                Any metrics shown on the platform (CAGR, Sharpe Ratio, Max Drawdown) represent historical statistics or calculations and are not forward-looking predictions.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. Client Consent & Declaration</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                By linking your broker API keys and deploying algorithms on Quantra, you confirm that:
              </p>
              <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-lg space-y-4 font-mono text-xs text-gray-400">
                <div>[ ] I understand and accept that 9 out of 10 individual F&O traders incur net losses.</div>
                <div>[ ] I acknowledge that Quantra is a technology service provider and does not manage my capital.</div>
                <div>[ ] I accept all risks regarding order latency, execution slippage, broker API downtime, and server failures.</div>
                <div>[ ] I declare that all trades routed through the platform are authorized by me and executed on my personal account.</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

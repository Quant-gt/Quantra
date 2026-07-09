import React from 'react';
import { AlertTriangle, ShieldX, TrendingDown, ArrowLeft, Activity } from 'lucide-react';

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
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Mandated Regulatory Warnings & Systemic Constraints</p>
          </div>
          <a href="/" className="flex items-center gap-2 text-sm text-[#58A6FF] hover:underline bg-[#21262D] border border-[#30363D] px-4 py-2 rounded-lg transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Table of Contents */}
        <aside className="lg:w-1/4 lg:sticky lg:top-8 h-fit space-y-1 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 px-2">Table of Contents</div>
          {[
            { id: "1", title: "1. Mandatory SEBI F&O Warning" },
            { id: "2", title: "2. Absolute Loss Potential" },
            { id: "3", title: "3. Leverage & Margin Liquidation Risks" },
            { id: "4", title: "4. Technological & API Execution Risks" },
            { id: "5", title: "5. Algorithmic Logic & Backtest Fallacies" },
            { id: "6", title: "6. Overfitting & Curve-Fitting Realities" },
            { id: "7", title: "7. Sequence of Returns Risk" },
            { id: "8", title: "8. Slippage & Impact Cost Mathematics" },
            { id: "9", title: "9. Market Volatility & Black Swan Events" },
            { id: "10", title: "10. Overnight Gap Risks (Un-hedged Portfolios)" },
            { id: "11", title: "11. Operational Constraints (10 OPS Limit)" },
            { id: "12", title: "12. Third-Party Broker API Failures" },
            { id: "13", title: "13. Exchange Connectivity Outages" },
            { id: "14", title: "14. Regulatory Risk (Policy Changes)" },
            { id: "15", title: "15. Drawdown Cascades & Stop-Loss Failure" },
            { id: "16", title: "16. Fat-Finger & Coding Errors" },
            { id: "17", title: "17. Marketplace Strategy Risks" },
            { id: "18", title: "18. Tax Implications & GST/STT Drag" },
            { id: "19", title: "19. No Guarantee of Capital or Profit" },
            { id: "20", title: "20. Explicit Client Consent & Declaration" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#section-${item.id}`}
              className="block px-3 py-1.5 text-[13px] rounded-md border border-transparent hover:bg-[#161B22] hover:border-[#30363D] text-[#8B949E] hover:text-[#F85149] transition-all"
            >
              {item.title}
            </a>
          ))}
        </aside>

        {/* Main Content Pane */}
        <main className="lg:w-3/4 space-y-16">
          {/* Crucial Risk Alert */}
          <div className="bg-[#F85149]/10 border border-[#F85149]/30 rounded-xl p-6 flex gap-4">
            <ShieldX className="text-[#F85149] shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-white mb-2 text-lg">9 OUT OF 10 INDIVIDUAL TRADERS IN F&O LOSE CAPITAL</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                As per SEBI regulations, you are hereby unequivocally warned that 9 out of 10 individual traders in the equity Futures & Options (F&O) segment incur net losses. On average, loss-makers registered a net loss of close to ₹50,000 per year. Transaction costs (including brokerage, clearing fees, GST, STT, and exchange transaction fees) represent an additional mathematical drag on net returns. Before deploying algorithms, you must possess the absolute financial resilience to absorb total capital write-downs.
              </p>
            </div>
          </div>

          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2 flex items-center gap-2">
              <TrendingDown size={24} className="text-[#F85149]" />
              1. Mandatory SEBI F&O Warning
            </h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In strict compliance with Securities and Exchange Board of India (SEBI) directives regarding the proliferation of derivative trading, all users must acknowledge the statistical probability of net losses. Trading in derivative contracts involves inherently high risk due to embedded leverage.
              </p>
              <p>
                By linking your broker account to SigmaSpire's execution engine, you declare that you have read and accepted this warning. The automation of trading does not mitigate, reduce, or bypass the fundamental statistical realities of derivative market risks.
              </p>
            </div>
          </section>

          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. Absolute Loss Potential</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Algorithmic trading is not a guaranteed investment scheme, savings account, or fixed deposit. The deployment of capital into financial markets via automated bots exposes you to the potential for absolute loss of your entire margin account balance. 
              </p>
              <p>
                Under specific adverse market conditions (such as un-hedged option selling during extreme volatility spikes), it is mathematically possible to incur losses that <em>exceed</em> your initial deposited capital, obligating you to deposit further funds to your broker to clear negative ledger balances.
              </p>
            </div>
          </section>

          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. Leverage & Margin Liquidation Risks</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Derivative and margin-based equity trades carry "geared" risks. The fractionally low margins required to open large derivative positions mean that a minute adverse movement in stock indices can trigger immediate, catastrophic margin shortfalls:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Auto Liquidation:</strong> If your account margin drops below your broker's maintenance threshold, the broker's RMS (Risk Management System) reserves the right to square off your positions instantly without notice. SigmaSpire's automation loop is blind to your broker's RMS logic and is not liable for auto-liquidations that disrupt an algorithm's lifecycle.</li>
                <li><strong>Peak Margin Penalties:</strong> Exchanges calculate peak margin utilization dynamically across multiple snapshots throughout the day. Rapidly firing algorithms placing excessive open limit orders could temporarily block margins, resulting in penalty assessments by your broker.</li>
              </ul>
            </div>
          </section>

          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. Technological & API Execution Risks</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Algorithmic trading is entirely, 100% dependent on technology infrastructure. Physical order routing involves a fragile chain of servers, DNS resolvers, APIs, internet service providers (ISPs), and exchange matchmakers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Execution Latency:</strong> Milliseconds matter in fast-moving markets. Network congestion anywhere between SigmaSpire's AWS servers in Mumbai and your broker's endpoints can lead to order fills at rates worse than expected.</li>
                <li><strong>Dropped Packets:</strong> A TCP/IP packet drop can result in SigmaSpire assuming an order failed when it actually succeeded, or assuming it succeeded when it failed, leading to mismatched virtual and physical portfolios.</li>
              </ul>
            </div>
          </section>

          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. Algorithmic Logic & Backtest Fallacies</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                There is a massive, fundamental difference between historical simulation (backtesting) and live execution. Backtests are sterile laboratory environments. Live markets are chaotic.
              </p>
              <p>
                Backtesting assumes frictionless execution at historical tick prices. If an algorithm generates a "Buy" signal at ₹100.50 in a backtest, the backtest records the entry at exactly ₹100.50. In live markets, placing a market order at that exact microsecond may result in a fill at ₹100.75 due to queue latency and lack of liquidity. This discrepancy compounded over thousands of trades can turn a profitable backtest into a massive live loss.
              </p>
            </div>
          </section>

          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Overfitting & Curve-Fitting Realities</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                When utilizing SigmaSpire's Strategy Builder or AI-generation tools, users frequently fall into the trap of "Overfitting" (also known as curve-fitting).
              </p>
              <p>
                Overfitting occurs when you hyper-optimize indicators (e.g., changing an RSI length from 14 to 13.8) specifically to maximize the equity curve on past historical data. Algorithms optimized to perform exceptionally well on past data almost universally fail when exposed to live, unpredictable, out-of-sample market cycles. Past performance is computationally irrelevant to future results.
              </p>
            </div>
          </section>

          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. Sequence of Returns Risk</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Even a mathematically robust algorithm with a proven 60% win rate can destroy your capital due to the Sequence of Returns Risk.
              </p>
              <p>
                In a statistical distribution, a 60% win rate algorithm could easily encounter a completely normal "losing streak" of 10-15 consecutive losses. If your position sizing (capital allocated per trade) is too large, you will experience a 100% account blowout during this losing streak before the algorithm has the mathematical time to revert to its mean win rate.
              </p>
            </div>
          </section>

          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. Slippage & Impact Cost Mathematics</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                <strong>Slippage</strong> is the difference between the expected price of a trade and the price at which the trade is actually executed. 
              </p>
              <p>
                <strong>Impact Cost</strong> is the measure of how much your own large order pushes the market price against you. If your algorithm attempts to buy 10,000 shares of an illiquid option contract at the market price, your order will eat through multiple levels of the order book, resulting in an average fill price drastically worse than the current Best Bid/Offer (BBO). Algorithms trading illiquid strikes will invariably bleed capital to impact costs.
              </p>
            </div>
          </section>

          <section id="section-9" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">9. Market Volatility & Black Swan Events</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Financial markets are subject to sudden structural breaks, macroeconomic shocks, algorithmic flash crashes, and "Black Swan" events (highly improbable events with massive impact).
              </p>
              <p>
                During such events, market liquidity evaporates. Spreads widen from pennies to hundreds of rupees. In these conditions, algorithmic stop-loss triggers utilizing "Market Orders" will execute at terrifyingly bad prices. Limit-based stop-losses will simply be jumped over and ignored, leaving you holding a plummeting asset.
              </p>
            </div>
          </section>

          <section id="section-10" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">10. Overnight Gap Risks (Un-hedged Portfolios)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Algorithms designed to hold positions overnight (carry-forward trades) are exposed to extreme Overnight Gap Risks.
              </p>
              <p>
                If the market closes at 3:30 PM IST and an international macroeconomic event occurs overnight, the Indian markets may open the next morning at 9:15 AM with a massive 5% gap down. In this scenario, your algorithmic stop-loss placed at 1% below the previous close is entirely useless. Your broker's system will trigger your stop-loss at the opening gap price, locking in a 5% loss instantly. Algorithms cannot protect against opening gaps in un-hedged portfolios.
              </p>
            </div>
          </section>

          <section id="section-11" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">11. Operational Constraints (10 OPS Limit)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                As detailed in our Terms of Service, SigmaSpire throttles API calls at <strong>10 Operations Per Second (OPS)</strong> per user. 
              </p>
              <p>
                In highly active markets where your strategy tries to place massive scale orders, square off a basket of 50 option strikes simultaneously, or rapidly adjust grids, throttling will delay trade execution. This hard limit acts as a bottleneck that may cause your algorithm to miss critical, fleeting entry windows, fundamentally altering the profitability of the strategy.
              </p>
            </div>
          </section>

          <section id="section-12" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">12. Third-Party Broker API Failures</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SigmaSpire does not execute trades natively; it routes them to your broker (e.g., Zerodha, Fyers, Angel One). Retail broker APIs in India frequently experience connection dropouts, throttle responses during morning volatility (9:15 AM - 9:30 AM), or return undocumented HTTP 500 server errors.
              </p>
              <p>
                When a broker API fails, SigmaSpire's engine cannot force a trade through. A broker API crash during a market collapse will leave your algorithm stranded, entirely unable to execute its programmed exit protocols.
              </p>
            </div>
          </section>

          <section id="section-13" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">13. Exchange Connectivity Outages</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                On rare but devastating occasions, the primary stock exchanges themselves (NSE/BSE) suffer from matching engine halts or leased line disconnections. During exchange halts, neither manual traders, broker apps, nor SigmaSpire algorithms can process orders. The chaotic reopening phase following a halt involves massive price distortions that algorithms are rarely trained to handle safely.
              </p>
            </div>
          </section>

          <section id="section-14" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">14. Regulatory Risk (Policy Changes)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Algorithmic trading is heavily regulated. SEBI or the exchanges may abruptly introduce new policies, margin frameworks (e.g., the Peak Margin rules), or API restrictions that fundamentally break the logic of your existing algorithms.
              </p>
              <p>
                An algorithm that relies on high leverage and low margins today may become entirely unviable tomorrow due to a sudden regulatory decree. You bear the sole responsibility of adapting your automated portfolios to regulatory shifts.
              </p>
            </div>
          </section>

          <section id="section-15" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">15. Drawdown Cascades & Stop-Loss Failure</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                While SigmaSpire offers platform-level "Max Daily Drawdown" limits, these are soft-software locks that trigger market square-offs <em>after</em> the threshold is breached.
              </p>
              <p>
                If your limit is ₹10,000, and an illiquid option premium suddenly spikes, pushing your MTM loss to ₹15,000 in a single tick, the system will trigger the square-off at ₹15,000. You acknowledge that during fast market crashes, execution slippage will result in actual realized losses vastly exceeding your configured soft limits.
              </p>
            </div>
          </section>

          <section id="section-16" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">16. Fat-Finger & Coding Errors</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                When you write custom Python code or use the drag-and-drop builder, a simple typographical error (e.g., multiplying order size by 100 instead of 10, or using a `=` instead of `==` in a condition) can cause the algorithm to buy maximum permissible quantities of an asset uncontrollably.
              </p>
              <p>
                You are entirely responsible for rigorously sandbox-testing (Paper Trading) your logic before exposing it to live capital.
              </p>
            </div>
          </section>

          <section id="section-17" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">17. Marketplace Strategy Risks</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Subscribing to and deploying third-party strategies from the SigmaSpire Marketplace carries immense risk. You are trusting the logic of an unknown Creator. 
              </p>
              <p>
                Creators may design "martingale" systems (doubling down on losers) that show smooth historical equity curves but guarantee eventual account blowouts. SigmaSpire does not audit, endorse, or verify the safety of marketplace algorithms. You subscribe and deploy them entirely at your own peril.
              </p>
            </div>
          </section>

          <section id="section-18" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">18. Tax Implications & GST/STT Drag</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                High-frequency algorithmic trading generates massive turnover volumes. In the Indian tax jurisdiction, this triggers substantial Securities Transaction Tax (STT), Goods and Services Tax (GST) on brokerage, Stamp Duty, and Exchange Transaction Charges.
              </p>
              <p>
                An algorithm that makes a gross profit of ₹1,00,000 over 10,000 trades may easily rack up ₹1,20,000 in STT and brokerage fees, resulting in a net loss. You must rigorously factor in comprehensive taxation models when designing your bot.
              </p>
            </div>
          </section>

          <section id="section-19" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">19. No Guarantee of Capital or Profit</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SigmaSpire does not promise, represent, or guarantee that any algorithm, strategy, indicator, or configuration will yield profits or protect capital. <strong>You must only trade with discretionary risk capital that you can afford to lose entirely without affecting your livelihood.</strong>
              </p>
              <p>
                Any metrics shown on the platform (CAGR, Sharpe Ratio, Max Drawdown, Calmar Ratio) represent historical statistics or calculations and are never forward-looking predictions.
              </p>
            </div>
          </section>

          <section id="section-20" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">20. Explicit Client Consent & Declaration</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                By linking your broker API keys, authorizing server access, and deploying algorithms from a `PAUSED` state to a `LIVE` state on SigmaSpire, you legally confirm that:
              </p>
              <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-lg space-y-4 font-mono text-xs text-gray-400">
                <div>[X] I understand and accept that 9 out of 10 individual F&O traders incur net losses.</div>
                <div>[X] I acknowledge that SigmaSpire is a technology interface provider and does not manage, direct, or pool my capital.</div>
                <div>[X] I accept all risks regarding order latency, execution slippage, broker API downtime, and server failures.</div>
                <div>[X] I understand the mathematical reality of overfitting, sequence of returns risk, and overnight gap wipeouts.</div>
                <div>[X] I declare that all trades routed through the platform are authorized solely by me and executed strictly on my personal ledger account.</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { Scale, BookOpen, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';

export default function SebiRegulationsPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-sans pb-20">
      {/* Top Banner */}
      <div className="border-b border-[#30363D] bg-[#161B22] py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#58A6FF] text-sm font-semibold uppercase tracking-wider mb-2">
              <Scale size={16} />
              Regulatory Compliance
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">SEBI Regulations</h1>
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Algorithmic Trading Framework & Guidelines</p>
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
            { id: "1", title: "1. SEBI Compliance Framework" },
            { id: "2", title: "2. Technology Provider (TSP) Status" },
            { id: "3", title: "3. No Pooling of Funds or PMS" },
            { id: "4", title: "4. API Approval & Broker Responsibilities" },
            { id: "5", title: "5. Operational Auditing & Logs" },
            { id: "6", title: "6. Platform Safeguards (OPS, 2FA)" },
            { id: "7", title: "7. OTR (Order-to-Trade Ratio)" },
            { id: "8", title: "8. Prohibited Advisory Practices" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#section-${item.id}`}
              className="block px-3 py-2 text-sm rounded-md border border-transparent hover:bg-[#161B22] hover:border-[#30363D] text-[#8B949E] hover:text-[#58A6FF] transition-all"
            >
              {item.title}
            </a>
          ))}
        </aside>

        {/* Main Content Pane */}
        <main className="lg:w-3/4 space-y-12">
          {/* Regulatory Compliance Overview */}
          <div className="bg-[#58A6FF]/10 border border-[#58A6FF]/30 rounded-xl p-6 flex gap-4">
            <Scale className="text-[#58A6FF] shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-white mb-2">SEBI REGULATORY FRAMEWORK FOR ALGO TRADING</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Quantra operates strictly within the guidelines issued by the Securities and Exchange Board of India (SEBI) regarding algorithmic trading interfaces and tech providers. In order to comply with current circulars, we do not run pooled trading accounts, do not promise returns, and mandate that all live deployments connect exclusively via the client's direct broker credentials.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">1. SEBI Compliance Framework</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Algorithmic trading in India is governed strictly by SEBI circulars, primarily focused on preventing market manipulation, protecting retail capital, and reducing systemic risks on stock exchanges (NSE/BSE).
              </p>
              <p>
                Quantra is fully committed to maintaining the integrity of these circulars by enforcing client-side validations, auditing signal routing paths, and preventing any automated actions that might lead to unfair trade execution or artificial market volume creation.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. Technology Provider (TSP) Status</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra is registered as a **Technology Service Provider (TSP)**. Under SEBI regulations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are **not** an investment advisor, research analyst, portfolio manager, or stock broker.</li>
                <li>We do not hold a SEBI registration certificate under the SEBI (Investment Advisers) Regulations, 2013, or the SEBI (Research Analysts) Regulations, 2014.</li>
                <li>Our software tools are purely technical interfaces. Users write or configure strategies using mathematical indicators, and the platform merely translates those rules into order requests routed through the user's connected stock broker.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. No Pooling of Funds or PMS</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SEBI strictly prohibits tech platforms from operating pooled investment structures or un-registered Portfolio Management Services (PMS):
              </p>
              <p>
                All trading capital stays exclusively in your personal trading account with your SEBI-registered stock broker. Quantra has no access to your capital, does not handle withdraw/deposit queries, and cannot direct funds. Every transaction is settled directly between your bank account, your broker, and the clearing house.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. API Approval & Broker Responsibilities</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Under exchange regulations, retail algorithmic trading via APIs requires broker-level approvals:
              </p>
              <p>
                All API keys (such as Zerodha Kite Connect, Fyers API, or Angel One API) provided by stock brokers are issued directly to the client under the broker's terms of service. It is the broker's responsibility to validate client logins and manage the approval of API credentials. 
              </p>
              <p>
                Users must ensure their API keys are authorized for algorithmic routing under their broker's terms. Quantra does not bypass broker checks and relies entirely on standard broker API endpoints to execute trades.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. Operational Auditing & Logs</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To support compliance checks, Quantra maintains rigorous system logs:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**IP Address Logging**: Every API request and order execution routed through our engine is logged with the client's static or public IP address.</li>
                <li>**Audit Trails**: All database changes, key links, strategy activations, and order events are captured in a read-only `compliance_audit` timescaledb table.</li>
                <li>**Data Sharing**: In compliance with regulatory inquiries, we will provide these logs to stock brokers, exchanges, or SEBI officials if requested during audits.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Platform Safeguards (OPS, 2FA)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To prevent accidental runaway algorithms or malicious attacks, our platform enforces several built-in compliance boundaries:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Daily 2FA Requirements**: Stock brokers require a daily manual login to activate API tokens. Quantra complies with this by enforcing daily re-authentication; strategies will not route live signals if your broker session is expired.</li>
                <li>**OPS Limits**: Live trade routing is capped at **10 Operations Per Second (OPS)** to prevent spamming broker servers. Staged orders exceeding this are throttled, and the corresponding strategy is paused with a warning toast.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. OTR (Order-to-Trade Ratio)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Exchanges levy steep penalties on accounts with a high Order-to-Trade Ratio (OTR), which is calculated by dividing total placed/modified orders by the number of filled trades.
              </p>
              <p>
                You must design algorithms that do not trigger high volumes of updates and modifications (e.g. constant tick-by-tick adjustments). If your strategy breaches the exchange OTR thresholds, your broker may block your API token, and any resulting OTR penalties will be charged directly to your broker ledger.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. Prohibited Advisory Practices</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In alignment with SEBI rules against misleading financial promotions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Quantra does **not** advertise guaranteed returns, risk-free trades, or fixed monthly profits.</li>
                <li>Strategy creators publishing on the marketplace are prohibited from using titles or descriptions promising returns (e.g., "100% Win Rate" or "Double Capital Monthly"). Any strategies violating these guidelines will be deleted instantly by our moderation team.</li>
                <li>We do not operate mutualized mirror trading where users blindly copy trades into automated accounts without manual confirmation or individual license setup.</li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

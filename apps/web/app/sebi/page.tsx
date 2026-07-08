import React from 'react';
import { Scale, BookOpen, ShieldAlert, CheckCircle, ArrowLeft, Landmark } from 'lucide-react';

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
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Algorithmic Trading Framework & Statutory Guidelines</p>
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
            { id: "1", title: "1. SEBI Compliance Overview" },
            { id: "2", title: "2. Technology Provider (TSP) Exemption Status" },
            { id: "3", title: "3. No Pooling of Funds or Account Management" },
            { id: "4", title: "4. Explicit Prohibition of Unregistered PMS" },
            { id: "5", title: "5. Broker API Approvals & T&C Compliance" },
            { id: "6", title: "6. Exchange Approvals for Algo Strategies" },
            { id: "7", title: "7. Daily Two-Factor Authentication (2FA) Mandate" },
            { id: "8", title: "8. Operational Auditing & IP Logging" },
            { id: "9", title: "9. Half-Yearly System Audit Requirements" },
            { id: "10", title: "10. OTR (Order-to-Trade Ratio) Enforcement" },
            { id: "11", title: "11. Prohibited Advisory & Marketing Practices" },
            { id: "12", title: "12. Wash Trading & Spoofing Guardrails" },
            { id: "13", title: "13. Risk Management Systems (RMS) Isolation" },
            { id: "14", title: "14. SEBI SCORES Grievance Redressal Mechanism" },
            { id: "15", title: "15. KYC / AML Document Retention" },
            { id: "16", title: "16. Unauthorized API Access & Sharing" },
            { id: "17", title: "17. API Rate Limiting to Prevent Exchange DoS" },
            { id: "18", title: "18. Circular No. CIR/MRD/DP/16/2013 Adherence" },
            { id: "19", title: "19. Disclosure of Backtest Fallibilities" },
            { id: "20", title: "20. Future Regulatory Policy Shifts" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#section-${item.id}`}
              className="block px-3 py-1.5 text-[13px] rounded-md border border-transparent hover:bg-[#161B22] hover:border-[#30363D] text-[#8B949E] hover:text-[#58A6FF] transition-all"
            >
              {item.title}
            </a>
          ))}
        </aside>

        {/* Main Content Pane */}
        <main className="lg:w-3/4 space-y-16">
          {/* Regulatory Compliance Overview */}
          <div className="bg-[#58A6FF]/10 border border-[#58A6FF]/30 rounded-xl p-6 flex gap-4">
            <Landmark className="text-[#58A6FF] shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-white mb-2 text-lg">STATUTORY SEBI REGULATORY FRAMEWORK</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Quantra operates strictly within the guidelines issued by the Securities and Exchange Board of India (SEBI) regarding algorithmic trading interfaces and Retail API tech providers. In order to comply with current circulars, we do not run pooled trading accounts, do not promise fixed returns, and mandate that all live algorithmic deployments connect exclusively via the client's direct, legally verified broker credentials.
              </p>
            </div>
          </div>

          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">1. SEBI Compliance Overview</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Algorithmic trading in India is governed strictly by SEBI circulars, primarily focused on preventing market manipulation, protecting retail capital from sophisticated predatory algorithms, and reducing systemic risks (like flash crashes) on recognized stock exchanges such as the NSE and BSE.
              </p>
              <p>
                Quantra is fully committed to maintaining the integrity of these circulars by enforcing hard-coded client-side validations, auditing signal routing paths, and preventing any automated actions that might lead to unfair trade execution or artificial market volume creation.
              </p>
            </div>
          </section>

          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. Technology Provider (TSP) Exemption Status</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra is structured strictly as a <strong>Technology Service Provider (TSP)</strong>. We supply a SaaS (Software as a Service) graphical interface and server compute environment to assist users in routing trades.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are <strong>not</strong> an investment advisor, research analyst, portfolio manager, or stock broker.</li>
                <li>We do not hold, nor are we required to hold, a SEBI registration certificate under the SEBI (Investment Advisers) Regulations, 2013, or the SEBI (Research Analysts) Regulations, 2014, because we do not dispense personalized financial advice.</li>
                <li>Our software tools are purely technical interfaces. A user writing a Python script to trigger a buy order based on an RSI crossover is solely responsible for that logic; the platform merely translates that script into an HTTP request.</li>
              </ul>
            </div>
          </section>

          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. No Pooling of Funds or Account Management</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SEBI strictly prohibits tech platforms from operating pooled investment structures or soliciting funds to trade on behalf of users without an AMC (Asset Management Company) license.
              </p>
              <p>
                All trading capital, margin, and collateral stays exclusively in your personal Demat/Trading account with your SEBI-registered stock broker. Quantra has no legal or technical access to your capital, does not handle withdraw/deposit queries, and cannot direct funds. Every transaction is settled directly between your bank account, your broker, and the clearing corporation.
              </p>
            </div>
          </section>

          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. Explicit Prohibition of Unregistered PMS</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Operating an unregistered Portfolio Management Service (PMS) is a severe criminal offense under Indian securities law.
              </p>
              <p>
                Quantra does not offer "fully managed" accounts. We do not operate mutualized mirror trading where users blindly copy trades into automated accounts without manual configuration or license setup. You must proactively log in, connect your API, manually select or build a strategy, and click "Deploy" to initiate automation. 
              </p>
            </div>
          </section>

          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. Broker API Approvals & T&C Compliance</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Under exchange regulations, retail algorithmic trading via APIs requires broker-level approvals:
              </p>
              <p>
                All API keys (such as Zerodha Kite Connect, Fyers API, or Upstox API) are issued directly to the client under the broker's terms of service. It is the broker's statutory responsibility to validate client logins, conduct KYC, and manage the approval of API credentials.
              </p>
              <p>
                You must ensure your API keys are authorized for algorithmic routing under your broker's terms. Quantra does not bypass broker checks. If a broker revokes your API access for violating their terms, Quantra is not liable for your suspended automation.
              </p>
            </div>
          </section>

          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Exchange Approvals for Algo Strategies</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Historically, SEBI mandated that every individual algorithmic strategy required explicit exchange approval. However, for retail API routing where the logic executes on the client-side (or a TSP cloud) and routes standard order packets to a broker's pre-approved API gateway, the exchange approves the broker's API infrastructure rather than the individual retail strategy.
              </p>
              <p>
                You are utilizing Quantra to send standard REST API order payloads (e.g., LIMIT BUY 100 QTY) to your broker. The broker's Risk Management System (RMS) is responsible for vetting that payload before transmitting it to the exchange matching engine.
              </p>
            </div>
          </section>

          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. Daily Two-Factor Authentication (2FA) Mandate</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To prevent unauthorized or "zombie" algorithmic execution, SEBI circulars require brokers to enforce a daily manual login to activate API tokens. 
              </p>
              <p>
                Quantra complies with this entirely by enforcing daily re-authentication protocols on our dashboard. You must log in manually every trading morning to generate a fresh access token from your broker. Strategies will not route live signals if your broker session token is expired. We do not employ headless browser scraping to bypass this SEBI 2FA mandate.
              </p>
            </div>
          </section>

          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. Operational Auditing & IP Logging</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To support compliance investigations into market abuse, Quantra maintains rigorous, immutable system logs in our TimescaleDB clusters:
              </p>
              <p>
                Every API request and order execution routed through our engine is logged with your platform User ID, your static/public IP address, and the precise millisecond timestamp. In the event of a regulatory query regarding a specific trade, Quantra is mandated to compile this data and share it with broker houses, exchanges, or SEBI compliance officers.
              </p>
            </div>
          </section>

          <section id="section-9" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">9. Half-Yearly System Audit Requirements</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Brokers providing API access are required to conduct half-yearly system audits of their algorithmic infrastructure. As a TSP bridging to these brokers, Quantra maintains architectural readiness to assist brokers during these audits.
              </p>
              <p>
                We employ continuous integration (CI) security checks, penetration testing, and infrastructure-as-code audits to ensure our routing engines do not introduce vulnerabilities into the broker network.
              </p>
            </div>
          </section>

          <section id="section-10" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">10. OTR (Order-to-Trade Ratio) Enforcement</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Exchanges levy steep penalties on accounts with a high Order-to-Trade Ratio (OTR) to deter algorithmic spamming of the order book. 
              </p>
              <p>
                If your custom strategy loops and rapidly modifies a limit order thousands of times without execution, the exchange will penalize your broker, who will immediately pass the financial penalty to your ledger and block your API access. You are statutorily responsible for designing algorithms that respect exchange OTR limits.
              </p>
            </div>
          </section>

          <section id="section-11" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">11. Prohibited Advisory & Marketing Practices</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In strict alignment with SEBI rules against misleading financial promotions and "finfluencer" abuse:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Quantra does <strong>not</strong> advertise guaranteed returns, risk-free trades, or fixed monthly profits.</li>
                <li>Strategy creators publishing on the Quantra Marketplace are expressly prohibited from using titles or descriptions promising returns (e.g., "100% Win Rate" or "Double Capital Monthly").</li>
                <li>Any marketplace strategies violating these advertising guidelines are deleted instantly by our moderation algorithms, and the creator is permanently banned.</li>
              </ul>
            </div>
          </section>

          <section id="section-12" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">12. Wash Trading & Spoofing Guardrails</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SEBI continuously monitors for market manipulation techniques such as Wash Trading (simultaneously buying and selling to create fake volume) and Spoofing/Layering (placing massive fake orders to manipulate the BBO, then cancelling them).
              </p>
              <p>
                Algorithms coded on Quantra must not be used to execute such schemes. If our internal heuristics detect repetitive spoofing patterns, we reserve the right to forcefully terminate your execution loop and report the IP trail to the relevant exchange surveillance teams.
              </p>
            </div>
          </section>

          <section id="section-13" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">13. Risk Management Systems (RMS) Isolation</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SEBI mandates that all algorithmic orders must pass through the broker's Risk Management System (RMS) before hitting the exchange. 
              </p>
              <p>
                Quantra does not bypass the broker's RMS. If your algorithm attempts to buy 10,000 shares but you only have margin for 100 shares, Quantra will dispatch the order, but your broker's RMS will instantly reject it with a `Margin Shortfall` error. This dual-layer architecture ensures exchange-level safety protocols are never violated.
              </p>
            </div>
          </section>

          <section id="section-14" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">14. SEBI SCORES Grievance Redressal Mechanism</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                The SEBI Complaints Redress System (SCORES) is a centralized grievance redressal portal. 
              </p>
              <p>
                However, because Quantra is a SaaS technology provider and not a SEBI-registered intermediary (like a broker or mutual fund), complaints regarding software bugs, subscription refunds, or algorithmic slippage cannot be filed against Quantra on the SCORES portal. 
              </p>
              <p>
                If you have a grievance regarding your broker's API uptime, you may file a SCORES complaint against the broker. For platform issues, you must utilize our internal Legal Grievance Officer.
              </p>
            </div>
          </section>

          <section id="section-15" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">15. KYC / AML Document Retention</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To comply with the Prevention of Money Laundering Act (PMLA) and SEBI AML frameworks, we require verified identification (like PAN details) for creators who monetize strategies on the marketplace. We are required to retain these KYC records and associated transaction trails for a period of five (5) years to assist law enforcement if required.
              </p>
            </div>
          </section>

          <section id="section-16" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">16. Unauthorized API Access & Sharing</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Your broker API key is equivalent to your digital signature for financial transactions. SEBI rules dictate that users must not share their trading credentials with unauthorized third parties to trade on their behalf (colloquially known as "dabba trading" or unauthorized portfolio management).
              </p>
              <p>
                By inputting your keys into Quantra, you are authorizing an automated software script (that you control) to execute trades. You must never allow another human being to log into your Quantra account to manage your algorithms.
              </p>
            </div>
          </section>

          <section id="section-17" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">17. API Rate Limiting to Prevent Exchange DoS</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Exchanges demand that brokers implement rate limits to prevent rogue algorithms from crashing exchange matching engines. Consequently, brokers enforce rate limits on their retail APIs (e.g., 10 requests per second).
              </p>
              <p>
                Quantra respects these systemic limits by implementing a global **10 Operations Per Second (OPS)** throttle on our outgoing API dispatchers. This ensures our platform remains compliant with broker infrastructure protection rules.
              </p>
            </div>
          </section>

          <section id="section-18" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">18. Circular No. CIR/MRD/DP/16/2013 Adherence</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                While older SEBI circulars (like CIR/MRD/DP/16/2013) focused heavily on institutional co-location (Colo) algorithms, the regulatory framework has expanded to cover retail APIs. Quantra's architecture is built to evolve with these directives, ensuring that our SaaS layer acts purely as a routing conduit, maintaining the broker as the ultimate gatekeeper of exchange connectivity.
              </p>
            </div>
          </section>

          <section id="section-19" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">19. Disclosure of Backtest Fallibilities</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In line with SEBI's mandate for fair disclosure, Quantra places prominent disclaimers on all backtesting interfaces. Users are explicitly warned that simulated historical performance does not account for slippage, liquidity gaps, or margin shortfalls, and therefore cannot be relied upon as a guarantee of future returns.
              </p>
            </div>
          </section>

          <section id="section-20" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">20. Future Regulatory Policy Shifts</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SEBI periodically releases discussion papers proposing new rules for retail algorithmic trading (e.g., mandating TSP registration frameworks or restricting certain API functionalities). 
              </p>
              <p>
                Quantra actively monitors these regulatory developments. Should SEBI enact new laws that require architectural overhauls (such as removing certain automated features or demanding formal TSP certifications), we will comply immediately. This may result in sudden, unannounced changes to platform capabilities. By using the platform, you accept the risk of regulatory policy shifts disrupting your automated strategies.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

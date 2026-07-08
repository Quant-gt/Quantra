import React from 'react';
import { ShieldAlert, BookOpen, Scale, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-sans pb-20">
      {/* Top Banner */}
      <div className="border-b border-[#30363D] bg-[#161B22] py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#58A6FF] text-sm font-semibold uppercase tracking-wider mb-2">
              <Scale size={16} />
              Legal & Compliance Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Version 2.1 • Effective Immediately</p>
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
            { id: "1", title: "1. Acceptance of Terms" },
            { id: "2", title: "2. Technology Service Provider Status" },
            { id: "3", title: "3. Account Security & Verification" },
            { id: "4", title: "4. Algorithmic Trading Operations" },
            { id: "5", title: "5. Subscription Fees & Billing" },
            { id: "6", title: "6. Intellectual Property & Licenses" },
            { id: "7", title: "7. Disclaimer of Warranties" },
            { id: "8", title: "8. Limitation of Liability" },
            { id: "9", title: "9. Indemnification" },
            { id: "10", title: "10. Dispute & Governing Law" },
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
          {/* Important Warning Callout */}
          <div className="bg-[#D29922]/10 border border-[#D29922]/30 rounded-xl p-6 flex gap-4">
            <ShieldAlert className="text-[#D29922] shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-white mb-2">IMPORTANT NOTICE REGARDING FINANCIAL RISK</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Algorithmic trading is highly speculative and involves substantial risks, including the complete loss of trading capital. Quantra is a technology service provider and NOT a SEBI-registered broker, investment advisor, or research analyst. All trade routing and automation depend strictly on your API keys linked through third-party stock brokers.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">1. Acceptance of Terms</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                By registering for, accessing, or utilizing the Quantra web application, API routes, execution engines, and local or remote scripts (collectively, the "Services"), you declare that you have read, understood, and agreed to be legally bound by these Terms of Service (the "Terms"). These Terms govern the relationship between you ("User", "Client") and Quantra Technologies Private Limited ("Quantra", "Company", "We").
              </p>
              <p>
                If you do not agree to these Terms, you are strictly prohibited from utilizing the Services and must immediately terminate your account. Continued usage of the Services following modifications to these Terms constitutes explicit acceptance of any changes. We reserve the right to amend, adjust, or completely rewrite these terms at any time without prior specific notification to individual users.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. Technology Service Provider Status</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra operates exclusively as a **Technology Service Provider (TSP)**. The Services represent software tools designed to assist users in writing, backtesting, and automated execution routing of stock market trading strategies. 
              </p>
              <p>
                Quantra does not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide financial, investment, legal, tax, or analytical advice.</li>
                <li>Execute trades directly on any exchange; instead, signals are routed to third-party brokerage endpoints where the user holds an active trading account.</li>
                <li>Hold, pool, manage, or act as custodian for any user funds or securities. All capital remains securely inside the user's personal brokerage account.</li>
                <li>Guarantee the success, accuracy, or profitability of any algorithm created or hosted on the platform.</li>
              </ul>
              <p>
                You explicitly acknowledge that any strategy deployed through the execution engine is built, evaluated, and executed entirely at your own risk. Past performance curves, backtest records, or simulated results are strictly for educational purposes and do not represent actual live performance guarantees.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. Account Security & Verification</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To utilize the Services, you must register a valid user account. You are responsible for keeping your login credentials, including passwords and JWT auth tokens, completely secure. Any action taken under your account is deemed to be executed by you.
              </p>
              <p>
                As part of SEBI compliance protocols and general platform safety:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate, verified information, including your full legal name, email address, phone number, and PAN number.</li>
                <li>We enforce strict **Disposable Email Firewalls (DEF)** and automated threat detection. Registration using disposable, proxy, or anonymous email domains is blocked.</li>
                <li>To enable live execution, you must link your own broker accounts via valid API keys. These credentials are encrypted on our servers using industry-standard AES-256-GCM configurations. You authorize Quantra to route automated trading signals using these keys on your behalf.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. Algorithmic Trading Operations</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Automated order routing introduces unique operational constraints. You agree to adhere to the following execution limitations:
              </p>
              <p>
                **Order-to-Trade Ratio (OTR) & Rate Limits**: 
                To comply with exchange rules and prevent denial of service attacks on broker servers, our system enforces a hard limit of **10 Operations Per Second (OPS)** per user subscription. If a running strategy attempts to place, adjust, or cancel orders at a rate exceeding 10 OPS, the system will instantly flag the account, place the strategy in a `PAUSED` state, issue an admin alert, and throttle execution.
              </p>
              <p>
                **Emergency Kill Switch**: 
                In case of runaway loops, broker API malfunctions, or extreme market volatility, users are equipped with a Master Kill Switch. The switch prompts for confirmation and executes market square-offs for all open positions. You agree that Quantra is not liable if broker API connections fail to process square-off orders during a kill-switch execution.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. Subscription Fees & Billing</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Certain features of the Services are subject to subscription plans (Hobbyist, Pro, Institutional). Subscription billing is processed automatically via third-party gateways (Stripe/Razorpay) on a recurring monthly or annual basis.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All subscription fees are non-refundable. We do not offer pro-rated refunds for partial months or unused periods.</li>
                <li>If your payment method fails, your account tier will immediately revert to the Hobbyist plan, and any running execution engines exceeding the Hobbyist limits will be paused automatically.</li>
                <li>For strategy creators publishing on the marketplace, earnings payouts are subject to platform service fees, and payment calculations are handled dynamically according to your profit-share configuration. Payouts are made monthly after verifying compliance audits.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Intellectual Property & Licenses</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                The software, design systems, AI intent-parsing engines, indicators, and deployment structures constitute proprietary intellectual property owned exclusively by Quantra. 
              </p>
              <p>
                Quantra grants you a limited, non-exclusive, non-transferable, revocable license to access the platform for personal or internal business operations. You may not copy, reverse-engineer, decompile, or extract the underlying code of our execution engine.
              </p>
              <p>
                **Strategy Ownership**:
                Strategies built by you in the Strategy Builder belong entirely to you. If you choose to publish a strategy to the Quantra Marketplace, you grant Quantra a worldwide, royalty-free license to host, display, and route subscription signals for that strategy. You represent that your custom strategies do not infringe on any third-party copyrights or proprietary algorithms.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. Disclaimer of Warranties</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p className="italic">
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST PERMISSIBLE UNDER APPLICABLE LAW, QUANTRA DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The platform will function continuously, securely, or free from server outages, execution latency, or system bugs.</li>
                <li>The historical backtesting simulations are completely identical to live execution environments. Live trading conditions involve real market slippage, broker queue latency, and margin variations that cannot be simulated.</li>
                <li>Third-party broker APIs (Zerodha Kite, Fyers, etc.) will always be available or function correctly.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. Limitation of Liability</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p className="uppercase font-bold text-red-400">
                IN NO EVENT SHALL QUANTRA, ITS DIRECTORS, EMPLOYEES, AGENTS, OR PARTNERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF TRADING CAPITAL, PROFITS, REVENUE, DATA, OR USE, INCURRED BY YOU OR ANY THIRD PARTY.
              </p>
              <p>
                This limitation covers losses resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Algorithmic errors, infinite execution loops, or incorrect signal generations.</li>
                <li>Network latency, packet drops, or complete communication failures between our servers, your broker, and the stock exchanges.</li>
                <li>Broker account liquidations, margin calls, or failure of broker APIs.</li>
                <li>Unauthorized access to your API keys due to user negligence.</li>
              </ul>
              <p>
                In all cases, Quantra's maximum cumulative liability under these terms is strictly capped at the total subscription fees paid by you to Quantra during the three (3) months preceding the event giving rise to liability.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">9. Indemnification</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                You agree to defend, indemnify, and hold harmless Quantra, its affiliates, directors, officers, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your usage of and access to the Services, including any orders placed or strategies deployed.</li>
                <li>Your violation of any clause within these Terms.</li>
                <li>Your violation of SEBI regulations, exchange policies, or other applicable financial laws.</li>
                <li>Any third-party claims arising from strategies you publish on the marketplace.</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">10. Dispute & Governing Law</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                These Terms and any dispute arising out of or in connection with the Services shall be governed exclusively by the laws of the Republic of India, without regard to conflict of law principles.
              </p>
              <p>
                Any legal action, suit, or proceeding arising under these Terms shall be instituted exclusively in the competent courts located in **Mumbai, Maharashtra, India**. You hereby consent to the personal jurisdiction and venue of such courts and waive any objections regarding inconvenient forums.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

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
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Version 3.0 • Exhaustive Framework</p>
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
            { id: "1", title: "1. Acceptance of Terms & Conditions" },
            { id: "2", title: "2. Definitions & Interpretation" },
            { id: "3", title: "3. Technology Service Provider (TSP) Status" },
            { id: "4", title: "4. Account Security, Verification & KYC" },
            { id: "5", title: "5. Algorithmic Trading Operations & Routing" },
            { id: "6", title: "6. Order-to-Trade Ratio (OTR) Limits" },
            { id: "7", title: "7. API Rate Limits & Throttling (10 OPS)" },
            { id: "8", title: "8. Master Kill Switch Protocols" },
            { id: "9", title: "9. Subscription Fees, Billing & Taxes" },
            { id: "10", title: "10. Refund & Cancellation Policies" },
            { id: "11", title: "11. Quantra Marketplace & Creator Payouts" },
            { id: "12", title: "12. Intellectual Property & Licenses" },
            { id: "13", title: "13. Strategy Ownership & Copyright" },
            { id: "14", title: "14. Code of Conduct & Acceptable Use" },
            { id: "15", title: "15. Market Manipulation & Wash Trading Prohibitions" },
            { id: "16", title: "16. Third-Party Broker API Integrations" },
            { id: "17", title: "17. Disclaimer of Warranties" },
            { id: "18", title: "18. Limitation of Liability & Caps" },
            { id: "19", title: "19. Indemnification Obligations" },
            { id: "20", title: "20. Force Majeure & System Outages" },
            { id: "21", title: "21. Termination for Cause & Post-Termination Rights" },
            { id: "22", title: "22. Governing Law & Arbitration Framework" },
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
          {/* Important Warning Callout */}
          <div className="bg-[#D29922]/10 border border-[#D29922]/30 rounded-xl p-6 flex gap-4">
            <ShieldAlert className="text-[#D29922] shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-white mb-2 text-lg">IMPORTANT NOTICE REGARDING FINANCIAL RISK</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Algorithmic trading is highly speculative and involves substantial risks, including the complete loss of trading capital. Quantra is a technology service provider and NOT a SEBI-registered broker, investment advisor, portfolio manager, or research analyst. All trade routing and automation depend strictly on your API keys linked through third-party stock brokers. You must independently evaluate the risks associated with every line of code, strategy logic, or pre-built system you deploy on this platform.
              </p>
            </div>
          </div>

          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">1. Acceptance of Terms & Conditions</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                By registering for, accessing, downloading, installing, or utilizing the Quantra web application, mobile applications, API routes, execution engines, local or remote scripts, and associated documentation (collectively, the "Services"), you declare that you have read, understood, and agreed to be legally bound by these Terms of Service (the "Terms"). These Terms govern the relationship between you ("User", "Client", "Subscriber", "Creator") and Quantra Technologies Private Limited ("Quantra", "Company", "We", "Us", "Our"), a company incorporated under the Companies Act, 2013, with its registered office in Mumbai, Maharashtra, India.
              </p>
              <p>
                If you do not agree to every single clause, sub-clause, and condition stipulated in these Terms, you are strictly prohibited from utilizing the Services and must immediately cease use and terminate your account. Continued usage of the Services following modifications, updates, or amendments to these Terms constitutes your explicit and irrevocable acceptance of any such changes. We reserve the absolute right to amend, adjust, or completely rewrite these terms at any time. While we may attempt to notify active subscribers via email of material changes, it is your sole responsibility to periodically review this page for updates.
              </p>
            </div>
          </section>

          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. Definitions & Interpretation</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>For the purposes of these exhaustive Terms, the following definitions apply:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong>"Algorithmic Order Flow"</strong> refers to the automated, machine-driven sequence of HTTP/WebSocket requests generated by the platform's execution engine that translates user-defined mathematical or logical rules into actionable buy, sell, or modify instructions.</li>
                <li><strong>"API Bridging"</strong> signifies the technological linkage between Quantra's secure server environments and the authorized third-party endpoints provided by SEBI-registered stockbrokers (e.g., Zerodha Kite Connect, Upstox API, Fyers API).</li>
                <li><strong>"Execution Venue"</strong> means the recognized stock exchanges (such as the National Stock Exchange of India (NSE), Bombay Stock Exchange (BSE), or Multi Commodity Exchange (MCX)) where the final trade matching occurs, mediated entirely by the user's broker.</li>
                <li><strong>"Strategy"</strong> or <strong>"Bot"</strong> refers to a specific configuration of technical indicators, price action rules, risk management protocols, and capital allocation instructions created, copied, or purchased by the User within the Quantra ecosystem.</li>
              </ul>
              <p>Any reference to statutory provisions, SEBI circulars, or laws includes amendments, modifications, or re-enactments thereof.</p>
            </div>
          </section>

          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. Technology Service Provider (TSP) Status</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra operates exclusively as a <strong>Technology Service Provider (TSP)</strong>. The Services represent software tools designed to assist users in writing, backtesting, visualizing, and automated execution routing of stock market trading strategies. We are a software-as-a-service (SaaS) entity, providing infrastructure, server uptime, and code compilation environments.
              </p>
              <p>Quantra explicitly disclaims any status as a financial intermediary. Specifically, Quantra does NOT:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide financial, investment, legal, tax, or analytical advice. Nothing generated by our AI engines, scanners, or backtesters should be construed as a recommendation to buy or sell any asset.</li>
                <li>Execute trades directly on any exchange. All signals generated by our platform are routed to third-party brokerage endpoints where the user holds an active, KYC-verified trading account.</li>
                <li>Hold, pool, manage, or act as custodian for any user funds, margin, or securities. All your capital remains securely inside your personal brokerage account under the purview of your broker and clearing corporation.</li>
                <li>Guarantee the success, accuracy, or profitability of any algorithm created or hosted on the platform.</li>
                <li>Operate any form of unregistered Portfolio Management Service (PMS) or mutualized investment fund.</li>
              </ul>
              <p>You explicitly acknowledge that any strategy deployed through the execution engine is built, evaluated, and executed entirely at your own risk. Past performance curves, backtest records, or simulated forward-testing results are strictly for educational and structural analysis purposes and do not represent actual live performance guarantees.</p>
            </div>
          </section>

          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. Account Security, Verification & KYC</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To utilize the Services, you must register a valid user account. You are solely responsible for maintaining the strict confidentiality of your login credentials, including passwords, Multi-Factor Authentication (MFA) codes, and JWT auth tokens. Any action, strategy deployment, or subscription purchase made under your account is legally deemed to be executed by you.
              </p>
              <p>As part of our commitment to platform safety and adherence to broader financial ecosystem norms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate, verified information during onboarding, including your full legal name, permanent email address, phone number, and in certain jurisdictions, your Permanent Account Number (PAN) or equivalent tax ID.</li>
                <li>We enforce strict <strong>Disposable Email Firewalls (DEF)</strong> and automated threat detection mechanisms. Registration utilizing disposable, proxy, anonymous email domains (e.g., Mailinator, TempMail), or known VPN exit nodes associated with malicious activity is categorically blocked.</li>
                <li>To enable live execution, you must link your own broker accounts via valid API keys. These credentials are encrypted on our servers using industry-standard AES-256-GCM configurations. By inputting these keys, you explicitly authorize Quantra's servers to construct and dispatch automated trading signals on your behalf, utilizing your identity.</li>
                <li>You must immediately notify Quantra's support team if you suspect any unauthorized access to your account or breach of your API keys. However, Quantra bears no liability for losses resulting from compromised user credentials.</li>
              </ul>
            </div>
          </section>

          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. Algorithmic Trading Operations & Routing</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Automated order routing introduces unique operational constraints fundamentally different from manual trading. When you transition a strategy from a "Backtest" state to a "Live" or "Paper" state, you agree to adhere to the following execution realities:
              </p>
              <p>
                <strong>Asynchronous Execution:</strong> Order signals generated by Quantra are transmitted asynchronously over the public internet to your broker's API gateways. We cannot control the time it takes for a packet to traverse the network, the time the broker takes to validate your margin, or the time the exchange takes to match the order. Slippage (the difference between expected price and executed price) is an inherent, unavoidable characteristic of algorithmic trading.
              </p>
              <p>
                <strong>Feed Dependency:</strong> The execution engine relies entirely on continuous, uninterrupted tick data feeds (either from our proprietary aggregators, third-party vendors like Yahoo Finance, or direct broker WebSocket streams). If the data feed disconnects, drops packets, or delivers erroneous spikes (bad ticks), your strategy may execute catastrophic false signals. You agree that Quantra is immune from liability arising from dirty data or feed interruptions.
              </p>
            </div>
          </section>

          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Order-to-Trade Ratio (OTR) Limits</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Exchanges such as the NSE levy steep, escalating penalties on trading accounts that exhibit a disproportionately high Order-to-Trade Ratio (OTR). OTR is calculated by dividing the total number of orders placed, modified, or cancelled by the actual number of filled trades.
              </p>
              <p>
                When designing your algorithms on Quantra, you must implement logic that avoids incessant order modification (e.g., trailing a stop loss tick-by-tick every microsecond). If your strategy breaches the exchange OTR thresholds, your broker may block your API token, disable your trading account, and pass the exchange-levied financial penalties directly to your ledger.
              </p>
              <p>
                Quantra does not pre-validate or simulate OTR ratios. The responsibility for optimizing order frequency rests entirely with you. We are not liable for any OTR penalties, broker bans, or subsequent losses caused by aggressive algorithm logic.
              </p>
            </div>
          </section>

          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. API Rate Limits & Throttling (10 OPS)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To comply with exchange rules, preserve platform stability, and prevent denial-of-service (DoS) conditions on broker servers, Quantra enforces a hard, non-negotiable rate limit across its execution infrastructure.
              </p>
              <p>
                <strong>10 Operations Per Second (OPS):</strong> No single user subscription may place, adjust, or cancel more than 10 orders per second. If a running strategy (or a combination of multiple running strategies in your workspace) attempts to breach this limit, the system will instantly flag the account, place the offending strategy into a `PAUSED` state, issue an admin alert, and drop the excess orders.
              </p>
              <p>
                In highly volatile markets where your strategy attempts to place massive scale orders or rapidly modify grids, this throttling will intentionally delay or block trade execution, potentially causing loss of entries or delayed exits. You accept this structural limitation as a necessary safeguard.
              </p>
            </div>
          </section>

          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. Master Kill Switch Protocols</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In the event of runaway algorithmic loops (e.g., a logic flaw causing endless buying and selling), broker API malfunctions, or extreme macroeconomic volatility, users are equipped with a "Master Kill Switch" located on the primary dashboard.
              </p>
              <p>
                Activating the Kill Switch prompts for a secondary confirmation. Once confirmed, Quantra's execution engine will attempt to dispatch market square-off orders for all open positions associated with active strategies, and subsequently sever the connection to the broker API, forcing all strategies into an `OFFLINE` state.
              </p>
              <p>
                <strong>No Guarantee of Liquidation:</strong> You explicitly agree that Quantra cannot guarantee the success of the Kill Switch. If the broker API is unresponsive, rate-limited, or if the market has hit a lower/upper circuit breaker (no buyers/sellers), the square-off orders will fail or remain pending. You must always monitor your positions natively on your broker's terminal as a fallback mechanism.
              </p>
            </div>
          </section>

          <section id="section-9" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">9. Subscription Fees, Billing & Taxes</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Access to the premium features of the Services (including live execution routing, high-fidelity tick backtesting, and AI strategy generation) is subject to subscription plans (e.g., Hobbyist, Pro, Institutional). Subscription billing is processed automatically via our authorized third-party payment gateways (Stripe, Razorpay, or similar) on a recurring monthly or annual basis.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>By providing your payment information, you authorize us to charge the applicable subscription fees, plus any applicable taxes (such as GST in India), on a recurring basis.</li>
                <li>If your payment method fails, is declined, or expires, your account tier will immediately revert to the free/Hobbyist plan. Any running execution engines that exceed the free tier limits (e.g., running more than 1 live strategy) will be paused automatically without prior warning.</li>
                <li>We reserve the right to modify our pricing structure, introduce new tiers, or retire legacy plans upon 30 days' written notice via email or dashboard announcement.</li>
              </ul>
            </div>
          </section>

          <section id="section-10" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">10. Refund & Cancellation Policies</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Due to the intensive computational resources allocated for dedicated execution environments and backtesting clusters immediately upon subscription activation, <strong>all subscription fees are strictly non-refundable</strong>.
              </p>
              <p>
                We do not offer pro-rated refunds for partial months, unused periods, or if you simply fail to utilize the platform. You may cancel your recurring subscription at any time via the Billing dashboard. Upon cancellation, you will retain access to your premium features until the end of the current paid billing cycle, after which your account will downgrade.
              </p>
              <p>
                Exceptions to the no-refund policy are evaluated at the sole discretion of Quantra's management in cases of proven, prolonged, and complete systemic outages exceeding 72 hours.
              </p>
            </div>
          </section>

          <section id="section-11" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">11. Quantra Marketplace & Creator Payouts</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra operates a community Marketplace where users ("Creators") can publish, license, and monetize their proprietary trading strategies for other users ("Subscribers") to utilize.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Revenue Split:</strong> Earnings generated from strategy subscriptions are subject to a platform service fee, detailed in the Creator Dashboard. Quantra reserves the right to adjust this commission structure.</li>
                <li><strong>Payouts:</strong> Creator earnings are accumulated and paid out dynamically according to the profit-share configuration. Payouts are made monthly on a Net-30 basis, provided the Creator has completed KYC and reached the minimum payout threshold (₹5,000 or equivalent).</li>
                <li><strong>Compliance Audits:</strong> All payouts are subject to prior compliance audits. If a Creator is found to be utilizing deceptive titles, promising guaranteed returns, or manipulating backtest data to boost sales, Quantra reserves the right to freeze their earnings, refund subscribers, and ban the Creator.</li>
              </ul>
            </div>
          </section>

          <section id="section-12" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">12. Intellectual Property & Licenses</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                The Services—including but not limited to the source code, user interfaces, design systems, AI intent-parsing engines, proprietary indicators, deployment infrastructure, logos, and trademarks—constitute the exclusive intellectual property of Quantra and are protected by international copyright, patent, and trademark laws.
              </p>
              <p>
                Quantra grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the platform strictly for personal or internal business operations in accordance with your subscription tier.
              </p>
              <p>
                You may NOT, under any circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, modify, reverse-engineer, decompile, disassemble, or attempt to extract the underlying source code of our execution engine or web application.</li>
                <li>Scrape, spider, or utilize automated bots to extract data from our platform, apart from using our official public APIs within designated rate limits.</li>
                <li>Resell, lease, white-label, or package Quantra's services as your own product without a formal enterprise agreement.</li>
              </ul>
            </div>
          </section>

          <section id="section-13" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">13. Strategy Ownership & Copyright</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                <strong>Your Strategies:</strong> Any strategy, algorithm, or mathematical logic built, uploaded, or configured by you in the Strategy Builder remains your exclusive intellectual property. Quantra does not claim ownership over your proprietary alpha. We employ encryption and strict access controls to ensure our staff cannot access your private strategy parameters.
              </p>
              <p>
                <strong>Marketplace License:</strong> If you explicitly choose to publish a strategy to the public Quantra Marketplace, you grant Quantra a worldwide, royalty-free, sublicensable license to host, display, advertise, and route subscription signals for that strategy on your behalf.
              </p>
              <p>
                <strong>Non-Infringement:</strong> You represent and warrant that any custom logic you deploy or publish does not infringe upon the patents, copyrights, or trade secrets of any third-party quantitative firm or individual. Quantra complies with DMCA and local copyright takedown notices and will swiftly remove infringing algorithms.
              </p>
            </div>
          </section>

          <section id="section-14" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">14. Code of Conduct & Acceptable Use</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>While using the Services, you strictly agree NOT to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deploying algorithms specifically designed to test the limits, break, or execute Denial of Service (DoS) attacks on Quantra's infrastructure or the infrastructure of connected stock brokers.</li>
                <li>Exploiting software vulnerabilities, bypassing authentication screens, or attempting to access the database records of other users.</li>
                <li>Utilizing the AI engines for prompt injection attacks or attempting to execute arbitrary remote code (RCE) on our servers via the Python evaluation environments.</li>
                <li>Using the platform to launder money, evade taxes, or route funds for illicit activities.</li>
              </ul>
              <p>Violation of these rules will result in an immediate, permanent, and non-refundable ban, alongside reporting to relevant cybersecurity and financial authorities.</p>
            </div>
          </section>

          <section id="section-15" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">15. Market Manipulation & Wash Trading Prohibitions</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra strictly prohibits the use of its infrastructure for any form of illegal market manipulation. You agree that your algorithms will not be designed or deployed to execute:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Wash Trades:</strong> Simultaneously buying and selling the same asset to create artificial volume.</li>
                <li><strong>Spoofing / Layering:</strong> Placing massive orders on the order book with no intent to execute, solely to manipulate the price, and cancelling them before fulfillment.</li>
                <li><strong>Front-Running:</strong> Utilizing insider information or faster latency to execute trades ahead of large institutional block deals.</li>
                <li><strong>Pump and Dump Schemes:</strong> Using the marketplace or social features to coordinate artificial price inflation of illiquid penny stocks.</li>
              </ul>
              <p>If our compliance heuristics detect manipulative patterns, we are legally obligated to freeze your account and hand over all audit logs, IP addresses, and strategy parameters to SEBI, the exchanges, or the broker.</p>
            </div>
          </section>

          <section id="section-16" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">16. Third-Party Broker API Integrations</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                The core functionality of Quantra relies on bridging to third-party brokerage APIs. Your relationship with your broker is governed entirely by their terms of service, which supersede these Terms regarding actual trade execution.
              </p>
              <p>
                Quantra is not affiliated with, endorsed by, or legally partnered with these brokers unless explicitly stated. If a broker alters their API structure, revokes your API access, changes their pricing, or experiences a massive server outage on their end, Quantra's service will subsequently fail to execute your trades. We disclaim all liability for any losses, missed opportunities, or damages arising from the failure, deprecation, or alteration of third-party broker APIs.
              </p>
            </div>
          </section>

          <section id="section-17" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">17. Disclaimer of Warranties</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p className="italic font-bold">
                THE SERVICES ARE PROVIDED ON AN "AS IS", "AS AVAILABLE", AND "WITH ALL FAULTS" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, QUANTRA EXPLICITLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TIMELINESS, NON-INFRINGEMENT, AND ACCURACY.
              </p>
              <p>We do not warrant, represent, or guarantee that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The platform will function continuously, securely, or free from server outages, execution latency, or catastrophic system bugs.</li>
                <li>The historical backtesting simulations are completely identical to live execution environments. Live trading conditions involve real market slippage, broker queue latency, gap openings, and margin variations that cannot be perfectly simulated.</li>
                <li>The AI strategy generator will produce profitable, syntax-error-free, or logically sound trading strategies.</li>
                <li>Any data feed, price quote, or chart provided on the platform is 100% real-time or accurate. You must verify prices on your broker's terminal.</li>
              </ul>
            </div>
          </section>

          <section id="section-18" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">18. Limitation of Liability & Caps</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p className="uppercase font-bold text-red-400">
                IN NO EVENT SHALL QUANTRA, ITS DIRECTORS, FOUNDERS, EMPLOYEES, AGENTS, AFFILIATES, OR PARTNERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF TRADING CAPITAL, PROFITS, REVENUE, DATA, GOODWILL, OR USE, INCURRED BY YOU OR ANY THIRD PARTY, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE), EVEN IF QUANTRA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>This massive limitation covers, without exception, losses resulting from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Algorithmic errors, infinite execution loops, or incorrect signal generations.</li>
                <li>Network latency, packet drops, or complete communication failures between our servers, your broker, and the stock exchanges.</li>
                <li>Broker account liquidations, margin calls, or failure of broker APIs.</li>
                <li>Unauthorized access to your API keys due to user negligence or platform breaches.</li>
                <li>Failure of the Master Kill Switch to successfully square off positions.</li>
              </ul>
              <p className="font-bold">
                In all cases, irrespective of the nature of the claim, Quantra's maximum cumulative financial liability under these terms is strictly capped at the total subscription fees actually paid by you to Quantra during the three (3) months immediately preceding the event giving rise to the liability.
              </p>
            </div>
          </section>

          <section id="section-19" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">19. Indemnification Obligations</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                You agree to unconditionally defend, indemnify, and hold harmless Quantra, its affiliates, directors, officers, employees, contractors, and agents from and against any and all claims, damages, obligations, losses, liabilities, regulatory fines, costs, or debt, and expenses (including but not limited to attorney's fees) arising directly or indirectly from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your usage of, connection to, and access to the Services, including any live orders placed or strategies deployed.</li>
                <li>Your violation of any explicit clause, rule, or boundary defined within these Terms.</li>
                <li>Your violation of SEBI regulations, exchange policies, broker terms, or other applicable financial laws.</li>
                <li>Any third-party claims arising from strategies you publish on the marketplace (e.g., subscribers losing money and suing you).</li>
                <li>Your infringement of any intellectual property rights.</li>
              </ul>
            </div>
          </section>

          <section id="section-20" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">20. Force Majeure & System Outages</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra shall not be held liable or deemed to be in default for any delay, failure in performance, or interruption of service resulting directly or indirectly from acts of God, civil or military authority, acts of public enemy, terrorism, cyber-warfare, nation-state hacking, widespread internet outages, telecommunication failures, exchange closures, regulatory bans on algorithmic trading, earthquakes, fires, floods, or any other cause beyond our reasonable control.
              </p>
              <p>
                In the event of a Force Majeure, our primary obligation is to attempt to safely shut down execution loops and prevent further API routing until the situation stabilizes. We are not liable for managing your open market positions during such events.
              </p>
            </div>
          </section>

          <section id="section-21" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">21. Termination for Cause & Post-Termination Rights</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                <strong>Termination by You:</strong> You may terminate these Terms at any time by cancelling your subscription and deleting your account via the dashboard settings.
              </p>
              <p>
                <strong>Termination by Quantra:</strong> We reserve the right to instantly suspend or permanently terminate your account, without notice or refund, if we determine in our sole discretion that you have violated these Terms, engaged in market manipulation, abused our infrastructure, or pose a legal or regulatory risk to the platform.
              </p>
              <p>
                <strong>Post-Termination:</strong> Upon termination, your right to access the execution engines ceases immediately. We will securely purge your API keys. However, we are legally required to retain your transaction audit logs, IP addresses, and KYC metadata for a minimum of five (5) years to comply with SEBI and anti-money laundering (AML) regulations. Clauses regarding Intellectual Property, Limitation of Liability, Indemnification, and Arbitration shall survive termination.
              </p>
            </div>
          </section>

          <section id="section-22" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">22. Governing Law & Arbitration Framework</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                These Terms and any dispute, controversy, or claim arising out of, relating to, or in connection with the Services shall be governed exclusively by and construed in accordance with the laws of the <strong>Republic of India</strong>, without regard to its conflict of law principles.
              </p>
              <p>
                <strong>Mandatory Arbitration:</strong> Any dispute shall be resolved by binding arbitration under the Arbitration and Conciliation Act, 1996. The arbitral tribunal shall consist of a sole arbitrator mutually appointed by both parties. If the parties cannot agree on an arbitrator within 30 days, the appointment shall be made by the High Court of Bombay.
              </p>
              <p>
                The seat and venue of the arbitration shall be <strong>Mumbai, Maharashtra, India</strong>. The language of the arbitration shall be English. The arbitrator's award shall be final, binding, and enforceable in any court of competent jurisdiction.
              </p>
              <p>
                You and Quantra agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

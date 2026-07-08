import React from 'react';
import { ShieldCheck, BookOpen, Key, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-sans pb-20">
      {/* Top Banner */}
      <div className="border-b border-[#30363D] bg-[#161B22] py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#39D353] text-sm font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck size={16} />
              Privacy Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Version 2.0 • Data Security & Token Protection</p>
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
            { id: "1", title: "1. Information We Collect" },
            { id: "2", title: "2. How We Use Information" },
            { id: "3", title: "3. API Credentials & Encryption" },
            { id: "4", title: "4. Data Sharing & Disclosures" },
            { id: "5", title: "5. Data Retention & Backups" },
            { id: "6", title: "6. Cookies & Tracking Technologies" },
            { id: "7", title: "7. User Rights & Data Deletion" },
            { id: "8", title: "8. SEBI & Regulatory Compliance" },
            { id: "9", title: "9. International Operations" },
            { id: "10", title: "10. Grievance Officer & Contact" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#section-${item.id}`}
              className="block px-3 py-2 text-sm rounded-md border border-transparent hover:bg-[#161B22] hover:border-[#30363D] text-[#8B949E] hover:text-[#39D353] transition-all"
            >
              {item.title}
            </a>
          ))}
        </aside>

        {/* Main Content Pane */}
        <main className="lg:w-3/4 space-y-12">
          {/* Encryption Focus Callout */}
          <div className="bg-[#238636]/10 border border-[#238636]/30 rounded-xl p-6 flex gap-4">
            <Key className="text-[#39D353] shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-white mb-2">MILITARY-GRADE CREDENTIAL PROTECTION</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                We handle highly sensitive broker API keys, access tokens, and execution profiles. Every single API credential stored on Quantra's databases is encrypted at rest using AES-256-GCM cryptography. Our engineering staff cannot access or read your underlying broker passwords or secrets.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">1. Information We Collect</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To provide you with secure algorithmic routing, Quantra collects specific categories of personal and technical data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Personal Identifiers**: Legal name, email address, mobile number, and Permanent Account Number (PAN) which is required for regulatory compliance checks.</li>
                <li>**Broker Connection Metadata**: Broker application keys, secret tokens, and user IDs. We do *not* collect or store your broker login password or pin numbers.</li>
                <li>**Audit & Network Logs**: Static IP addresses, API requests, routing latencies, order parameters, browser device fingerprints, and operating system details.</li>
                <li>**Trading History**: Parameters of deployed algorithms, backtesting configurations, simulation runs, and local execution logs of order signals.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. How We Use Your Information</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Your data is processed strictly for functional, security, and compliance reasons:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Signal Routing**: To authenticate with your broker API and route buy/sell orders generated by your running strategies.</li>
                <li>**Compliance Auditing**: To log static IPs and transaction parameters in accordance with SEBI guidelines for algorithmic service providers.</li>
                <li>**Anti-Abuse Verification**: Utilizing our Disposable Email Firewall (DEF) to check signup domains against known threat matrices and block fake registrations.</li>
                <li>**System Diagnostics**: Monitoring execution engine response times, database bottlenecks, and API endpoint errors.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. API Credentials & Encryption</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Security is our paramount engineering priority. Broker connection tokens (such as Fyers or Zerodha credentials) are processed using isolated crypto layers:
              </p>
              <p>
                All sensitive credentials are encrypted using **AES-256-GCM** authenticated symmetric encryption. Cryptographic keys are managed via segregated key manager systems with strict role-based access. In-transit data is exclusively piped through TLS 1.3 transport security.
              </p>
              <p>
                Furthermore, we do not store static authorization tokens on the frontend. When you execute trades, our backend establishes session validation dynamically and deletes short-lived memory pointers upon order completion.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. Data Sharing & Disclosures</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Quantra holds a strict **zero-monetization policy** for user data. We do not rent, sell, or trade your personal information, trading strategies, or execution histories to third-party marketing companies, hedge funds, or broker houses.
              </p>
              <p>
                Data is shared only in the following restricted scenarios:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Stock Brokers**: Transmitting your order payload (symbol, price, qty, auth key) to your connected broker endpoints.</li>
                <li>**Regulatory Mandates**: Providing audit logs to SEBI, stock exchanges, or judicial authorities if served with a valid legal warrant.</li>
                <li>**Infrastructure Providers**: Storing encrypted database records on secure cloud platforms (Supabase, Upstash Redis) which comply with ISO 27001 safety guidelines.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. Data Retention & Backups</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Compliance logs and database transactions are stored for as long as your account remains active. Under Indian financial regulations, certain audit logs (specifically transaction metadata and compliance checks) must be archived for a minimum of five (5) years even after account closure.
              </p>
              <p>
                System database backups are performed hourly and stored in encrypted formats across multiple geolocations. Our backups are isolated from write permissions to prevent ransomware attacks.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Cookies & Tracking Technologies</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                We use cookies and browser storage strictly to maintain user sessions and secure dashboard authentication states. 
              </p>
              <p>
                We do not utilize tracking pixels or behavioral cookies for retargeting campaigns. You can disable cookies in your browser settings; however, doing so will prevent you from signing in to the dashboard since our JWT auth framework depends on secure cookie validation.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. User Rights & Data Deletion</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                You retain complete control over your account. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update your contact information or revoke broker API access at any time via Settings.</li>
                <li>Export your historical trading logs and backtest parameters in JSON or CSV formats.</li>
                <li>Request account termination. Upon deletion, personal details are purged within thirty (30) days, except for compliance audit logs which are archived according to regulatory requirements.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. SEBI & Regulatory Compliance</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In accordance with SEBI rules for algorithmic technology interfaces:
              </p>
              <p>
                Your linked IP address must be logged on every transaction. In the event of a regulatory query, Quantra is required to compile this data and share it with broker houses or exchange compliance teams. By linking your broker API, you grant explicit consent for this compliance logging.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">9. International Operations</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                While the Quantra platform is hosted globally, our broker execution engine is calibrated exclusively for Indian stock exchanges (NSE/BSE). If you access the Services from outside India, you are responsible for ensuring compliance with your local jurisdictional laws regarding capital outflows and algorithmic trading.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">10. Grievance Officer & Contact</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                If you have any questions regarding this Privacy Policy, your data security, or wish to report a vulnerability, please reach out to our legal department.
              </p>
              <p>
                Under the Indian Information Technology Act, our designated Grievance Officer is:
              </p>
              <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-lg space-y-1 font-mono text-xs">
                <div>Grievance Officer: Legal Department, Quantra Technologies</div>
                <div>Email: compliance@quantra.com</div>
                <div>Address: Bandra Kurla Complex, Mumbai, MH, 400051, India</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

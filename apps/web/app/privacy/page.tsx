import React from 'react';
import { ShieldCheck, BookOpen, Key, ArrowLeft, Lock, Server } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-sans pb-20">
      {/* Top Banner */}
      <div className="border-b border-[#30363D] bg-[#161B22] py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#39D353] text-sm font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck size={16} />
              Privacy & Data Security Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
            <p className="text-gray-400 text-xs mt-1">Last Updated: July 8, 2026 • Version 3.1 • Global Data Protection Compliant</p>
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
            { id: "1", title: "1. Introduction & Scope" },
            { id: "2", title: "2. Personal Identifiable Information (PII) We Collect" },
            { id: "3", title: "3. Non-Personal & Technical Data Collection" },
            { id: "4", title: "4. Broker Connection Metadata & API Keys" },
            { id: "5", title: "5. How We Use Your Information" },
            { id: "6", title: "6. Legal Basis for Processing (GDPR & DPDP Act)" },
            { id: "7", title: "7. Zero-Monetization Policy" },
            { id: "8", title: "8. Data Sharing & Third-Party Subprocessors" },
            { id: "9", title: "9. Regulatory & Legal Disclosures (SEBI)" },
            { id: "10", title: "10. Cryptographic Standards (AES-256-GCM)" },
            { id: "11", title: "11. Network Security & TLS 1.3" },
            { id: "12", title: "12. Data Retention & Archival Timelines" },
            { id: "13", title: "13. Automated Audits & Threat Detection" },
            { id: "14", title: "14. Cookie Policy & Session Management" },
            { id: "15", title: "15. Cross-Border Data Transfers" },
            { id: "16", title: "16. User Rights & Data Portability" },
            { id: "17", title: "17. Right to Erasure (Right to be Forgotten)" },
            { id: "18", title: "18. Data Breach Notification Protocols" },
            { id: "19", title: "19. Children's Privacy" },
            { id: "20", title: "20. Contact & Grievance Officer" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#section-${item.id}`}
              className="block px-3 py-1.5 text-[13px] rounded-md border border-transparent hover:bg-[#161B22] hover:border-[#30363D] text-[#8B949E] hover:text-[#39D353] transition-all"
            >
              {item.title}
            </a>
          ))}
        </aside>

        {/* Main Content Pane */}
        <main className="lg:w-3/4 space-y-16">
          {/* Encryption Focus Callout */}
          <div className="bg-[#238636]/10 border border-[#238636]/30 rounded-xl p-6 flex gap-4">
            <Lock className="text-[#39D353] shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-white mb-2 text-lg">MILITARY-GRADE CREDENTIAL PROTECTION</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                We handle highly sensitive broker API keys, access tokens, and execution profiles. SigmaSpire operates on a zero-trust architecture. Every single API credential stored on our PostgreSQL databases is encrypted at rest using AES-256-GCM cryptography. Our engineering staff, administrators, and customer support representatives cannot decrypt, access, or read your underlying broker passwords or secrets under any circumstances.
              </p>
            </div>
          </div>

          <section id="section-1" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">1. Introduction & Scope</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                At SigmaSpire Technologies Private Limited ("SigmaSpire", "We", "Us"), your privacy and the security of your trading data are our highest priorities. This Privacy Policy details the exact types of data we collect, how that data is processed within our execution engines, the cryptographic standards used to protect it, and your rights regarding your personal information.
              </p>
              <p>
                This policy applies to all users accessing the SigmaSpire web application, strategy builder, API routes, and mobile interfaces (the "Services"). By registering an account and linking your broker API, you consent to the data collection practices described herein. If you do not agree with this policy, you must not use the Services.
              </p>
            </div>
          </section>

          <section id="section-2" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">2. Personal Identifiable Information (PII) We Collect</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>To provide secure authentication and comply with financial regulations, we collect the following PII during the onboarding and KYC processes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> Full legal name, date of birth, and profile images (if uploaded).</li>
                <li><strong>Contact Data:</strong> Primary email address, secondary backup emails, and mobile phone numbers for SMS/WhatsApp alert routing.</li>
                <li><strong>Regulatory Data:</strong> Where mandated by SEBI guidelines for algorithm creators, we may require your Permanent Account Number (PAN), Aadhar details, or equivalent government-issued tax identifiers.</li>
                <li><strong>Financial Data:</strong> Last four digits of credit cards or UPI IDs used for subscription billing (processed securely by Stripe/Razorpay; we do not store full card numbers).</li>
              </ul>
            </div>
          </section>

          <section id="section-3" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">3. Non-Personal & Technical Data Collection</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>Our infrastructure automatically logs technical data required to maintain server stability, monitor execution latency, and prevent abuse:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Network Logs:</strong> IP addresses (static and dynamic), ISP details, MAC addresses, and geo-location data based on IP routing.</li>
                <li><strong>Device Fingerprints:</strong> Browser types, operating systems, screen resolutions, and WebGL rendering signatures to detect botnets or credential stuffing attacks.</li>
                <li><strong>Execution Metrics:</strong> API request timestamps, millisecond-level routing latencies, payload sizes, and HTTP status codes returned by your broker's servers.</li>
                <li><strong>Strategy Metadata:</strong> The structural logic of your algorithms (indicators used, timeframes, asset classes). *Note: The specific alpha (parameter values) remains encrypted and inaccessible to our analysts.*</li>
              </ul>
            </div>
          </section>

          <section id="section-4" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">4. Broker Connection Metadata & API Keys</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To enable live trading, you must input API keys generated by your stock broker (e.g., `api_key`, `api_secret`, `access_token`).
              </p>
              <p>
                <strong>What we collect:</strong> The alphanumeric strings representing your API keys and your Broker Client ID.
              </p>
              <p>
                <strong>What we DO NOT collect:</strong> We never ask for, collect, or store your actual broker login password, trading PIN, Time-based One-Time Passwords (TOTP) from Google Authenticator, or biometric login data. You generate the API keys independently on your broker's dashboard and provide only the bridging tokens to SigmaSpire.
              </p>
            </div>
          </section>

          <section id="section-5" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">5. How We Use Your Information</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>Your data is processed strictly for functional, security, and compliance reasons:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Core Functionality:</strong> To authenticate with your broker API and route buy, sell, or modify orders generated by your running strategies in real-time.</li>
                <li><strong>Compliance Auditing:</strong> To log IP addresses and transaction parameters in our TimescaleDB instance, satisfying SEBI audit guidelines for algorithmic service providers.</li>
                <li><strong>Anti-Abuse Systems:</strong> Utilizing our Disposable Email Firewall (DEF) to check signup domains against known threat matrices, blocking fake registrations and Sybil attacks.</li>
                <li><strong>System Diagnostics:</strong> Monitoring execution engine response times, identifying database bottlenecks, and diagnosing API endpoint timeout errors.</li>
                <li><strong>Notifications:</strong> Sending critical system alerts, margin call warnings, or kill-switch confirmations via Email or Telegram bots.</li>
              </ul>
            </div>
          </section>

          <section id="section-6" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">6. Legal Basis for Processing (GDPR & DPDP Act)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                We process your personal data under the following legal frameworks, including the EU General Data Protection Regulation (GDPR) and the Indian Digital Personal Data Protection (DPDP) Act:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contractual Necessity:</strong> Processing is required to fulfill our Terms of Service (e.g., routing your trades).</li>
                <li><strong>Legal Obligation:</strong> Retaining audit logs and KYC data to comply with financial laws and SEBI anti-money laundering (AML) mandates.</li>
                <li><strong>Legitimate Interests:</strong> Monitoring network traffic to prevent cyber-attacks, fraud, and infrastructure abuse.</li>
                <li><strong>Explicit Consent:</strong> Sending marketing newsletters or product updates (which you can opt out of at any time).</li>
              </ul>
            </div>
          </section>

          <section id="section-7" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">7. Zero-Monetization Policy</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SigmaSpire holds a strict <strong>zero-monetization policy</strong> for user data. Our business model is entirely supported by SaaS subscription fees.
              </p>
              <p>
                We absolutely do not rent, sell, trade, or expose your personal information, trading strategies, portfolio holdings, or execution histories to third-party marketing companies, hedge funds, High-Frequency Trading (HFT) firms, or competing broker houses. Your alpha remains yours.
              </p>
            </div>
          </section>

          <section id="section-8" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">8. Data Sharing & Third-Party Subprocessors</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>We share data exclusively with trusted third-party subprocessors necessary to operate the platform. All subprocessors are bound by strict Data Processing Agreements (DPAs):</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stock Brokers:</strong> Transmitting your order payload (symbol, price, quantity, auth token) to your connected broker endpoints for execution.</li>
                <li><strong>Cloud Infrastructure:</strong> AWS, Vercel, and Supabase for hosting databases, serverless functions, and frontend assets. Data is encrypted at rest.</li>
                <li><strong>Communication Services:</strong> Brevo (Email) and Telegram (Webhooks) for routing transactional alerts and OTPs.</li>
                <li><strong>Payment Processors:</strong> Stripe or Razorpay for handling subscription billing. (SigmaSpire does not process card numbers natively).</li>
              </ul>
            </div>
          </section>

          <section id="section-9" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">9. Regulatory & Legal Disclosures (SEBI)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                As a Technology Service Provider operating in the Indian financial markets, we are subject to regulatory oversight. We will disclose your personal data, IP logs, and trading history without your prior consent only when legally compelled:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To comply with a valid subpoena, court order, or search warrant.</li>
                <li>To respond to direct audit requests from the Securities and Exchange Board of India (SEBI), the NSE, BSE, or allied clearing corporations investigating market manipulation, wash trading, or fraud.</li>
                <li>To protect the physical safety of any person or to defend SigmaSpire against legal liability.</li>
              </ul>
            </div>
          </section>

          <section id="section-10" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">10. Cryptographic Standards (AES-256-GCM)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Broker API keys and application secrets are the keys to your financial capital. We treat them as highly classified payloads:
              </p>
              <p>
                All sensitive credentials injected into the database are encrypted using <strong>AES-256-GCM</strong> authenticated symmetric encryption. Cryptographic keys are managed via isolated Key Management Systems (KMS) with strict role-based access controls (RBAC) and hardware security modules (HSM). 
              </p>
              <p>
                We do not store static authorization tokens on the frontend client. When you execute trades, our backend establishes session validation dynamically and deletes short-lived memory pointers upon order dispatch, ensuring memory dumps cannot expose active tokens.
              </p>
            </div>
          </section>

          <section id="section-11" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">11. Network Security & TLS 1.3</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                All data transmitted between your browser, the SigmaSpire mobile app, our backend servers, and the broker APIs is encrypted in transit using <strong>Transport Layer Security (TLS 1.3)</strong>. 
              </p>
              <p>
                We enforce HTTP Strict Transport Security (HSTS) across all domains to prevent protocol downgrade attacks and cookie hijacking. Internal microservices communicate exclusively over encrypted Virtual Private Cloud (VPC) peering connections, isolated from the public internet.
              </p>
            </div>
          </section>

          <section id="section-12" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">12. Data Retention & Archival Timelines</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                Your data is retained only for as long as necessary to provide the Services, or as mandated by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Active Accounts:</strong> Strategy logic, backtest results, and profile data are retained indefinitely while your account is active.</li>
                <li><strong>Compliance Logs:</strong> Under Indian financial regulations, API routing logs, static IP stamps, and transaction metadata must be archived for a minimum of <strong>five (5) years</strong>, even if you delete your account.</li>
                <li><strong>Backups:</strong> System database backups are performed hourly and stored in encrypted formats. Backups are rotated and permanently purged after 90 days.</li>
              </ul>
            </div>
          </section>

          <section id="section-13" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">13. Automated Audits & Threat Detection</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                To protect the platform from unauthorized access, we employ automated threat detection algorithms. If our systems detect anomalous behavior—such as rapid login attempts from varying geographical locations, or attempts to brute-force JWT endpoints—your account will be temporarily locked, and all active API routing will be suspended until manual identity verification is completed.
              </p>
            </div>
          </section>

          <section id="section-14" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">14. Cookie Policy & Session Management</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                We utilize cookies and browser local storage strictly to maintain secure user sessions and CSRF (Cross-Site Request Forgery) protection.
              </p>
              <p>
                <strong>Essential Cookies:</strong> Used for JWT authentication. You cannot disable these without breaking dashboard access. They are marked `HttpOnly` and `Secure`.
              </p>
              <p>
                <strong>Analytics Cookies:</strong> We use privacy-friendly, cookieless analytics tools (like Vercel Analytics) to monitor page load times and user journeys. We do not utilize intrusive tracking pixels (like Facebook Pixel) for retargeting campaigns.
              </p>
            </div>
          </section>

          <section id="section-15" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">15. Cross-Border Data Transfers</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                SigmaSpire operates server infrastructure primarily in the `ap-south-1` (Mumbai) region to guarantee ultra-low latency to Indian stock exchanges. However, certain edge network functions (like Vercel Edge caching or Supabase auth nodes) may process transient data globally.
              </p>
              <p>
                By using the Services, you consent to the transfer, storage, and processing of your data across international borders in accordance with this policy, provided the recipient infrastructure maintains equivalent or superior cryptographic standards.
              </p>
            </div>
          </section>

          <section id="section-16" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">16. User Rights & Data Portability</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>You retain complete sovereign control over your non-compliance data. You possess the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access & Review:</strong> View all profile information, connected broker statuses, and active subscription details in your dashboard.</li>
                <li><strong>Rectification:</strong> Update or correct inaccurate email addresses, phone numbers, or billing details at any time.</li>
                <li><strong>Portability:</strong> Export your historical trading logs, strategy parameters, and backtest results in JSON or CSV formats directly from the Strategy Builder interface.</li>
                <li><strong>Revocation:</strong> Instantly revoke our access to your broker account by deleting the API key from the dashboard or regenerating the key natively on your broker's platform.</li>
              </ul>
            </div>
          </section>

          <section id="section-17" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">17. Right to Erasure (Right to be Forgotten)</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                You may request complete account termination and data erasure via the Settings panel or by emailing support.
              </p>
              <p>
                Upon initiation, your profile, custom strategies, billing records, and API credentials are fundamentally purged from our active databases within thirty (30) days. However, as noted in Section 12, the <em>"Right to be Forgotten"</em> is not absolute; we are legally prohibited from deleting transaction audit logs required by SEBI and AML frameworks until the mandatory 5-year retention period expires.
              </p>
            </div>
          </section>

          <section id="section-18" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">18. Data Breach Notification Protocols</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                In the highly unlikely event of a cryptographic failure resulting in unauthorized access to sensitive user data, SigmaSpire is bound by strict incident response protocols.
              </p>
              <p>
                We will notify the Indian Computer Emergency Response Team (CERT-In) and affected users within 72 hours of confirming a breach, detailing the nature of the compromised data, the potential risks, and the immediate mitigation steps deployed (e.g., forcing global password resets and flushing API tokens).
              </p>
            </div>
          </section>

          <section id="section-19" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">19. Children's Privacy</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                The Services involve financial markets and derivative trading routing. SigmaSpire is strictly restricted to individuals who are at least eighteen (18) years of age, or the legal age of majority in their jurisdiction.
              </p>
              <p>
                We do not knowingly collect, solicit, or maintain PII from anyone under the age of 18. If we become aware that a minor has created an account and linked a broker API, we will immediately freeze the account, cancel all active orders, and purge the personal data.
              </p>
            </div>
          </section>

          <section id="section-20" className="scroll-mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-[#30363D] pb-2">20. Contact & Grievance Officer</h2>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                If you have any questions, concerns, or disputes regarding this Privacy Policy, your data security, or wish to report a vulnerability through our Bug Bounty program, please reach out to our legal department.
              </p>
              <p>
                In compliance with the Indian Information Technology (Intermediaries Guidelines) Rules, our designated Grievance Officer can be contacted at:
              </p>
              <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-lg space-y-2 font-mono text-[13px]">
                <div><strong>Grievance Officer:</strong> Legal & Compliance Department</div>
                <div><strong>Company:</strong> SigmaSpire Technologies Private Limited</div>
                <div><strong>Email:</strong> compliance@sigmaspire.com</div>
                <div><strong>Address:</strong> Bandra Kurla Complex (BKC), Mumbai, Maharashtra, 400051, India</div>
                <div className="text-gray-500 mt-2 italic">*Please allow 48-72 hours for initial grievance acknowledgment.*</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

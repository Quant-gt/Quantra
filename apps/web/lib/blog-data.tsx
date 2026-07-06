import React from 'react';
import { ShieldAlert } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  content: React.ReactNode;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "unlocking-alpha",
    title: "Unlocking Alpha: A Guide to Low-Latency Execution",
    excerpt: "Explore the architecture of modern direct market access (DMA) systems, including order routing, tick processing, and microsecond-level execution optimization.",
    date: "July 4, 2026",
    readTime: "6 min read",
    category: "Systematic Trading",
    tags: ["DMA", "Low-Latency", "C++", "Order Routing"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          In quantitative finance, alpha is a shrinking commodity. While signal quality is crucial, the mechanism of 
          execution—how quickly and cleanly you can route an order to an exchange—often determines whether a strategy 
          is profitable or drag-heavy. This guide explores the engineering principles behind direct market access (DMA) terminals.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. The Execution Lifecycle</h3>
        <p>
          A standard retail execution loop traverses multiple network hops, web servers, and third-party APIs. For professional 
          systematic desks, this layout is collapsed:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Tick Feed Ingestion:</strong> Subscribing directly to multicast market data feeds via UDP.</li>
          <li><strong>Order Matching Pipeline:</strong> Processing signals in-memory using lock-free rings and ring buffers (such as the LMAX Disruptor pattern).</li>
          <li><strong>Fix Protocol Routing:</strong> Translating logic commands directly into binary FIX (Financial Information eXchange) frames.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Mitigating Jitter in Python Services</h3>
        <p>
          While core low-latency engines are built in C++ or Rust, Python is heavily utilized for signal generation. To maintain 
          speed, follow these rules:
        </p>
        <div className="bg-[#161B22] p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-1 my-4 overflow-x-auto border border-white/5">
          <div><span className="text-purple-400">import</span> gc</div>
          <div className="text-gray-500"># Disable automatic garbage collection during market hours</div>
          <div>gc.disable()</div>
          <div className="text-gray-500"># Pre-allocate memory blocks for streaming tickers</div>
          <div>ticker_pool = [TickerFrame() <span className="text-purple-400">for</span> _ <span className="text-purple-400">in</span> range(<span className="text-amber-500">10000</span>)]</div>
        </div>

        <p>
          By avoiding runtime allocations and garbage collector pauses (GC sweeps), execution services can sustain sub-millisecond latency.
        </p>
      </div>
    )
  },
  {
    id: "fyers-api-fallback",
    title: "Fyers API Integration: Mastering Live Auth Fallbacks",
    excerpt: "How to handle broker connection token persistence on ephemeral cloud container platforms by building Supabase Postgres fallbacks for secure daily auth checking.",
    date: "June 28, 2026",
    readTime: "5 min read",
    category: "Engineering",
    tags: ["Fyers API", "Supabase", "Token Auth", "FastAPI"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Ephemeral hosting environments (such as Render, Fly.io, or serverless functions) wipe out local filesystems upon redeployments, 
          causing cached session tokens to disappear. If your systematic execution worker relies on a local file to store access keys, 
          redeploying your app will instantly lock you out.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Redundant Database Syncing</h3>
        <p>
          A modern solution is to couple local file reading (for speed) with an encrypted fallback inside a relational database 
          like Supabase:
        </p>
        <div className="bg-[#161B22] p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-1 my-4 overflow-x-auto border border-white/5">
          <div><span className="text-purple-400">def</span> <span className="text-cyan-400">get_access_token</span>():</div>
          <div className="pl-4">token = read_local_cache()</div>
          <div className="pl-4"><span className="text-purple-400">if</span> <span className="text-purple-400">not</span> token:</div>
          <div className="pl-8 text-gray-500"># Fallback to Supabase REST endpoint</div>
          <div className="pl-8">token = fetch_from_supabase_db()</div>
          <div className="pl-8">write_local_cache(token)</div>
          <div className="pl-4"><span className="text-purple-400">return</span> token</div>
        </div>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Enforcing Encryption</h3>
        <p>
          Never store tokens in plain text in your database. Utilize symmetric XOR ciphering or AES-256 encryption using your 
          App Secret as a private salt. This guarantees that if your database is ever compromised, your trading execution keys 
          remain safe.
        </p>
      </div>
    )
  },
  {
    id: "sebi-compliance-rules",
    title: "SEBI Compliance: Hardening Strategy Validation Rules",
    excerpt: "An audit checklist for systematic retail trading setups in India, outlining SEBI RA limits, compliance kill switches, and anti-dummy algo verification.",
    date: "June 18, 2026",
    readTime: "4 min read",
    category: "Compliance",
    tags: ["SEBI Regulations", "Algo Validation", "Risk Management", "Daily 2FA"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Systematic trading platforms operating in retail environments must conform strictly to regulatory frameworks. In India, 
          the Securities and Exchange Board of India (SEBI) imposes tight rules to protect retail investors from misleading 
          algorithmic performance figures and unauthorized trade triggers.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Algorithmic Id Validation</h3>
        <p>
          Regulatory validation checks must reject test patterns or placeholders. Simple checks should scan for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Placeholder strings containing test patterns like 'XXX' or 'TEMP'.</li>
          <li>Repeating characters (e.g. 'AAAAAA') and simple sequential counts (e.g. '123456').</li>
          <li>Verification of a valid registered SEBI RA license suffix on strategy publisher accounts.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. The Mandatory Compliance Kill Switch</h3>
        <p>
          Every trading terminal must provide a master compliance kill switch that can be triggered by either the user or 
          the platform's administrator:
        </p>
        <div className="bg-[#161B22]/80 border border-red-500/20 p-4 rounded-xl flex items-start gap-4 my-6">
          <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-white text-sm">Administrative Kill Switch Trigger</h4>
            <p className="text-xs text-gray-400 mt-1">
              Upon activation, all active WebSocket feeds are disconnected, and open market positions are immediately 
              closed or set to exit-only mode across all connected brokers.
            </p>
          </div>
        </div>

        <p>
          By embedding these validations natively in your Next.js frontend and Express/FastAPI backends, you ensure full 
          auditability during review passes.
        </p>
      </div>
    )
  },
  {
    id: "retail-algo-legality",
    title: "Is Algorithmic Trading Legal for Retail Investors in India?",
    excerpt: "Demystifying the regulations around retail API access and institutional prop-desk systems under the SEBI framework.",
    date: "May 14, 2026",
    readTime: "4 min read",
    category: "Compliance",
    tags: ["Regulations", "Retail Trading", "APIs", "SEBI"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          There is a massive amount of confusion surrounding the legality of algorithmic trading for retail investors in India. 
          If you browse online forums, check Reddit discussions, or read news reports, you will find highly conflicting opinions. 
          Some claim that retail algorithmic trading is illegal, while others argue it is perfectly fine. Let's separate the facts 
          from the rumors.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. The Institutional vs. Retail Split</h3>
        <p>
          The confusion stems from a failure to distinguish between two completely different types of trading setups:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Institutional Proprietary Desks:</strong> These setups run fully automated algorithms directly connected to high-speed exchanges (colocation servers). They are subject to rigorous SEBI testing, audit logs, and approval processes.</li>
          <li><strong>Retail Personal API Access:</strong> This is when a retail trader uses an API key provided by their broker (such as Zerodha Kite Connect, Fyers API, or Angel One SmartAPI) to execute trades through custom software or platforms.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Is Retail API Access Legal?</h3>
        <p>
          Yes. Under current SEBI guidelines, retail investors are allowed to use personal APIs to place trades. The broker is responsible for enforcing client-level risk management (like checking margin availability). Since the broker validates every order before sending it to the exchange, using personal APIs is 100% legal.
        </p>

        <p>
          However, where things become illegal is when someone hosts a shared database or runs a public portal that automates orders for multiple clients without holding a SEBI Registered Research Analyst (RA) or Investment Adviser (IA) license. Offering automated trading as a service to others without authorization violates SEBI's advisory regulations.
        </p>
      </div>
    )
  },
  {
    id: "sebi-ra-requirement",
    title: "What is a SEBI Registered Research Analyst (RA), and Why Does It Matter?",
    excerpt: "Why retail traders should rely on certified advisors rather than Telegram or YouTube channel execution groups.",
    date: "June 4, 2026",
    readTime: "4 min read",
    category: "Compliance",
    tags: ["SEBI RA", "Investor Protection", "Strategy Creators", "Ethics"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          With the rise of retail algorithmic trading, a new breed of "strategy creators" has emerged. Many operate through 
          Telegram channels, YouTube tutorials, or WhatsApp groups, promising overnight wealth through automated bots. 
          But how do you distinguish professional, regulated strategy publishers from unauthorized advisors?
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. The Role of a SEBI Research Analyst (RA)</h3>
        <p>
          A SEBI Registered Research Analyst (RA) is a certified professional authorized by the Securities and Exchange Board of 
          India to publish recommendations, strategies, and systematic models. RAs are bound by strict code-of-conduct guidelines:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Qualification & Auditing:</strong> RAs must hold specific financial qualifications and are subject to periodic regulatory compliance audits.</li>
          <li><strong>No Performance Hype:</strong> RAs are prohibited from showing exaggerated, unverified backtest statistics or promising guaranteed returns.</li>
          <li><strong>Conflict of Interest Disclosure:</strong> RAs must declare any personal holdings or financial interests in the strategies they publish.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Why You Shouldn't Rely on Unregulated Advisors</h3>
        <p>
          Relying on unregulated Telegram channel bots exposes your capital to extreme risks:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Lack of Accountability:</strong> If an unregulated bot glitches or executes erroneous orders, you have no legal recourse or protection.</li>
          <li><strong>Hidden Incentives:</strong> Unregulated publishers often make money from affiliate commissions or proprietary trade front-running rather than strategy performance.</li>
        </ul>
        <p>
          Platforms like Quantra enforce that all public creators list their verified SEBI RA credentials, ensuring a safe, transparent marketplace for retail subscribers.
        </p>
      </div>
    )
  },
  {
    id: "verifying-algo-performance",
    title: "How to Verify if a Trading Algorithm's Performance is Real or Fake",
    excerpt: "A practical checklist for identifying curve-fitted backtests, hidden drawdowns, and unrealistic slippage assumptions.",
    date: "June 24, 2026",
    readTime: "5 min read",
    category: "Systematic Trading",
    tags: ["Backtesting", "Metrics Verification", "Slippage", "CAGR"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          In systematic trading, backtesting is the foundation of strategy design. A backtest lets you evaluate how a set of 
          trading rules would have performed in historical market conditions. However, a beautiful backtest curve does not 
          always translate to real-world profitability.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Common Backtesting Pitfalls</h3>
        <p>
          Here is a checklist of critical factors to inspect when verifying strategy performance metrics:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Curve Fitting (Overfitting):</strong> Optimizing the strategy parameters to match historical data perfectly. An overfitted model performs exceptionally well in backtests but fails immediately in live execution.</li>
          <li><strong>Neglecting Slippage and Brokerage Fees:</strong> In live trading, you will rarely execute at the exact closing price. Slippage (difference between expected and executed price) and transaction taxes (STT, stamp duty) can turn a winning backtest into a losing live strategy.</li>
          <li><strong>Look-Ahead Bias:</strong> When a model accidentally incorporates future data (e.g. using today's closing price to calculate entry criteria at the open) during backtesting.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. How to Verify Real-World Performance</h3>
        <p>
          Look for platforms that separate backtesting reports from live verification metrics. Live tracking (such as out-of-sample forward testing) verifies that the strategy continues to perform as expected against live feeds, ensuring full transparency.
        </p>
      </div>
    )
  },
  {
    id: "is-broker-linking-safe",
    title: "Is it Safe to Connect Your Broker Account to an Algo Platform?",
    excerpt: "A deep dive into security frameworks, credential encryption, and API tokens used by Zerodha, Fyers, and Angel One.",
    date: "May 24, 2026",
    readTime: "8 min read",
    category: "Engineering",
    tags: ["Broker API", "Kite Connect", "SmartAPI", "Security"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          The rise of retail algorithmic trading has opened up incredible execution speeds for everyday investors. 
          However, one of the most common questions raised on forums like Reddit's r/algotrading or Google Search is: 
          <strong> Is it actually safe to link my Zerodha Kite, Fyers, or Angel One account to a third-party algorithmic platform?</strong>
        </p>
        <p>
          It is natural to feel cautious. After all, your brokerage account holds your hard-earned money and stock holdings. 
          Let’s dive into how modern broker connectivity is designed, why it is secure, and what safety checks you should look for.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Understanding the OAuth 2.0 Security Framework</h3>
        <p>
          When you link your broker account, you are not handing over your password. Instead, the connection relies on a standard industry 
          protocol known as **OAuth 2.0**.
        </p>
        <p>
          When you click "Connect Broker", you are redirected to the official login portal hosted directly by Zerodha, Fyers, or Angel One. 
          You type your credentials, complete your 2FA, and log in. Once authenticated, the broker generates a temporary **Access Token** 
          and passes it back to the platform. 
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>No Password Leakage:</strong> The third-party platform never sees, transmits, or stores your master password or PIN.</li>
          <li><strong>Daily Expiration:</strong> Under SEBI mandates, retail execution access tokens expire automatically every day (typically at 6:00 AM). You must manually re-authorize the session each trading morning.</li>
          <li><strong>Revocable Access:</strong> You can terminate the active token instantly from your broker's administrative developer console.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">How Algotrading Platforms Secure Your Keys</h3>
        <p>
          While the broker secures the login process, the algo platform is responsible for protecting the generated API keys and secrets 
          that route the actual orders. 
        </p>
        <p>
          Leading platforms like Quantra implement **AES-256-GCM or AES-256-CBC encryption at rest**. This ensures that even if a 
          database backup is leaked, the encrypted payloads cannot be decrypted without the private server-side master key (which is stored 
          securely outside the database in private cloud environments).
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Summary Checklist: What Makes a Platform Safe?</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Direct Login:</strong> The login screen must belong to the broker's official domain (e.g. `kite.zerodha.com`).</li>
          <li><strong>Server-Side Encryption:</strong> Look for platforms that handle token encryption on the server side rather than in the client browser.</li>
          <li><strong>No Shared Databases:</strong> Your credentials must be isolated per account session.</li>
        </ul>
        <p>
          By choosing platforms that adhere strictly to SEBI rules and utilize OAuth-driven handshakes, retail investors can automate their trading 
          with peace of mind.
        </p>
      </div>
    )
  },
  {
    id: "do-apps-have-password-access",
    title: "Do Algo Trading Apps Have Access to Your Login Password or Money?",
    excerpt: "Understanding how brokerage API scopes prevent third-party apps from executing funds transfers or reading login credentials.",
    date: "June 12, 2026",
    readTime: "8 min read",
    category: "Compliance",
    tags: ["API Scopes", "Fund Security", "OAuth", "SEBI Regulations"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          When people consider using a systematic trading platform, two specific fears often hold them back: 
          <em> "Can the app steal my password?"</em> and <em> "Can the app withdraw my money?"</em>
        </p>
        <p>
          These are valid concerns. The short answer is: **No, authorized algorithmic trading apps have absolutely no access 
          to your login password or your funds.** Let’s look at the underlying technology and security architectures that make 
          this isolation possible.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Isolated API Scopes</h3>
        <p>
          In modern web engineering, access permissions are separated using **Scopes**. When a platform requests connection to your 
          broker API, the broker presents a list of requested permissions during login.
        </p>
        <p>
          For trading engines, the only requested scopes are **"Read Portfolio"** (to fetch margin and holdings) and **"Place Orders"** 
          (to execute buys/sells). 
        </p>
        <p>
          The scope for **"Funds Management"** (withdrawing money or transferring funds out of your account) is completely restricted. 
          Brokers do not expose fund withdrawal endpoints via their retail trading APIs.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. The Withdrawal Barrier</h3>
        <p>
          In India, retail funds withdrawals can only be initiated by logging into your official broker portal, and they are processed 
          via a **registered bank account** linked directly to your Demat profile.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Strict Destination:</strong> Funds can only be moved back into the pre-verified personal bank account registered under your own name. An app cannot route your money to a third-party account.</li>
          <li><strong>TPIN and OTP Mandate:</strong> Selling delivery holdings requires CDSL TPIN validation and mobile OTP verification, which must be completed manually by the account owner.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Password Protection</h3>
        <p>
          As discussed in our broker linking guide, third-party apps utilize temporary access tokens. When you log in, your password 
          is entered directly into the broker's domain. The algo app never receives, scans, or caches your master password or login PIN.
        </p>
        <p>
          This dual-layer isolation ensures that even in a worst-case scenario where an algo platform's database is compromised, the attacker 
          only gets access to expired daily tokens, leaving your master credentials and account funds completely secure.
        </p>
      </div>
    )
  },
  {
    id: "broker-disconnect-handling",
    title: "What Happens If Your Broker Connection Disconnects During a Live Trade?",
    excerpt: "How modern execution engines handle network downtime, session drops, and position synchronization.",
    date: "June 30, 2026",
    readTime: "9 min read",
    category: "Systematic Trading",
    tags: ["Websockets", "Disconnects", "Risk Control", "Auto Sync"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Algorithmic execution is incredibly efficient, but it relies on a critical foundation: **continuous network connectivity**. 
          A common worry among retail traders is: <strong>What happens if the internet goes down, my broker's API drops, or my connection 
          disconnects in the middle of an active trade?</strong>
        </p>
        <p>
          In systematic trading, connection drops are not a matter of "if", but "when". Reliable platforms are designed with the assumption 
          that disconnects will happen, and they build multiple fallback systems to protect your capital.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. How Disconnects are Detected</h3>
        <p>
          Trading platforms maintain active connections to brokers using **WebSockets**. WebSockets enable two-way streaming of quotes and order statuses.
        </p>
        <p>
          To monitor connection health, the platform sends small test packets known as **Heartbeats** (or Ping/Pong frames) every few seconds. 
          If the broker fails to reply to consecutive heartbeats (typically within 5-10 seconds), the execution engine immediately flags 
          the session as disconnected.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Mitigation and Fail-Safe Routines</h3>
        <p>
          Once a disconnect is flagged, the platform initiates a series of automated safety protocols:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Immediate Execution Pause:</strong> The engine suspends the dispatch of any new trading signals. It will not attempt to buy or sell until the session is re-established, preventing "blind" trading.</li>
          <li><strong>Automated Reconnection Loops:</strong> The platform runs back-off reconnection routines, attempting to re-establish the socket stream at increasing intervals (e.g., 2s, 5s, 10s).</li>
          <li><strong>Emergency Position Reconciliation:</strong> Once the connection is restored, the engine queries the broker's active position book. It compares the actual open positions at the broker with the expected positions in the database. If there is a mismatch (e.g., a target exit order was missed), it alerts the user or automatically executes correcting orders.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Broker-Side Safeguards</h3>
        <p>
          Even if the platform completely crashes, the broker's exchange servers keep your open positions safe. For intraday traders, 
          brokers enforce **Auto-Square Off (RMS)** rules. If a connection is lost and an open intraday position remains unhedged, the broker's 
          risk management system will automatically liquidate the position before market close (typically between 3:15 PM and 3:25 PM), 
          limiting overnight exposure.
        </p>
        <p>
          By understanding these fail-safe designs, systematic traders can rest assured that their accounts are protected from network anomalies.
        </p>
      </div>
    )
  }
];

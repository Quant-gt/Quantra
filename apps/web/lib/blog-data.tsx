import React from 'react';

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
    id: "instant-kill-switch",
    title: "How to Instantly Stop or Pause an Active Strategy if the Market Crashes",
    excerpt: "Why risk management requires a hard compliance kill switch and how systematic traders can use manual overrides during extreme market volatility.",
    date: "July 2, 2026",
    readTime: "8 min read",
    category: "Systematic Trading",
    tags: ["Kill Switch", "Risk Control", "Market Crash", "Manual Override"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          One of the greatest fears for any algorithmic trader is watching a strategy run out of control during a sudden market crash 
          or black swan event. When volatility spikes, bid-ask spreads widen, liquidity evaporates, and models that perform beautifully 
          in calm conditions can experience rapid, cascading drawdowns. 
        </p>
        <p>
          To protect capital, retail and institutional systematic systems must implement a robust **"Kill Switch"** (or manual override). 
          This article explains what a kill switch is, how it should be engineered, and how to use it safely during flash crashes.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">What is a Trading Kill Switch?</h3>
        <p>
          A kill switch is an emergency mechanism that immediately halts all trading activities for a specific strategy or an entire 
          account. Unlike pausing a video, a trading kill switch must execute three sequential, critical tasks in fractions of a second:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Halt Signal Generation:</strong> Block the algorithmic script from generating any new buy or sell signals.</li>
          <li><strong>Cancel Pending Orders:</strong> Immediately send order cancellation requests (e.g. via REST/WebSocket) to the broker for all outstanding limit and stop-loss orders in the queue.</li>
          <li><strong>Flatten Open Positions:</strong> Depending on the risk parameters, either liquidate all open positions at market price immediately (flattening) or place the system into "exit-only" mode where it only manages current trades without opening new ones.</li>
        </ol>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Manual Override vs. Automated Circuit Breakers</h3>
        <p>
          A complete risk framework utilizes two types of kill switches:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Manual Override:</strong> A large, prominent button in the user dashboard that can be clicked instantly by the trader if they notice abnormal system behavior, API delays, or macro news events.</li>
          <li><strong>Automated Circuit Breakers (Rules-Engine):</strong> Pre-set programmatic triggers that activate without human intervention. Common triggers include:
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>*Daily Max Loss Limit:* If the account's realized or unrealized loss exceeds 2% of total capital, the algo is terminated for the day.</li>
              <li>*Maximum Consecutive Losses:* Halt the algo if it registers 5 consecutive losing trades, signifying that current market conditions do not suit the strategy.</li>
              <li>*Latency Spike:* If the time difference between signal generation and broker order acknowledgement exceeds 1.5 seconds, shut down execution to prevent stale fills.</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">How Quantra Implements the Kill Switch</h3>
        <p>
          Quantra implements a server-level risk management dashboard. With a single click on the "Kill Switch" button:
          - A high-priority payload is dispatched to the execution cluster.
          - Active WebSocket streams are disconnected.
          - A batch cancel request is sent to the broker API.
          - Intraday positions are marked for automatic square-off at the broker level.
        </p>
        <p>
          Having a reliable manual override ensures that you remain in control of your account, protecting your capital when the market acts unpredictably.
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
          that disconnects will happen, and they build multiple fallback systems to protect your capital. Let's look at the detection 
          mechanisms, fail-safe routines, and broker reconciliation safeguards.
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
    id: "order-throttling-ops",
    title: "What is Order Throttling (or OPS Limits), and Why Do Brokers Block Some Algos?",
    excerpt: "Understand exchange rate limiting (Orders Per Second), why brokers restrict rapid trading loops, and how to avoid trade suspensions.",
    date: "June 14, 2026",
    readTime: "9 min read",
    category: "Engineering",
    tags: ["Order Throttling", "OPS Limit", "Rate Limiting", "Broker Blocks"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          When moving from backtesting to live algorithmic execution, developers often encounter a frustrating barrier: **Order Throttling**. 
          You might see errors like `429 Too Many Requests` or find your broker session temporarily blocked. 
        </p>
        <p>
          This occurs due to **Orders Per Second (OPS)** limits enforced by brokers and stock exchanges. This article explains 
          what order throttling is, why it is mandated, and how you can optimize your execution engine to prevent blocks.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">What is an OPS Limit?</h3>
        <p>
          An OPS (Orders Per Second) limit restricts the number of requests (such as places, modifies, and cancels) you can send to a broker's 
          API within a rolling one-second window.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Exchange Protections:</strong> Exchanges (such as NSE or BSE) enforce limits on brokers to prevent market manipulation or technical server overloads.</li>
          <li><strong>Broker Policies:</strong> Retail brokers typically allocate a set maximum limit per client. For example, Zerodha Kite Connect enforces a limit of **10 orders per second** per API key.</li>
          <li><strong>Penalties:</strong> Exceeding this rate results in rejected orders, connection throttling, or daily account suspensions for safety.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Why Do Trading Loops Trigger Throttling?</h3>
        <p>
          Throttling is rarely triggered by single orders. Instead, it is caused by bad loop designs:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Frequent Trailings:</strong> If an algo attempts to adjust a trailing stop-loss tick-by-tick on a highly volatile asset, it can send dozens of modify requests per second.</li>
          <li><strong>Rapid Retries:</strong> If an order fails due to margin issues, a naive loop might immediately retry execution without waiting, creating a rapid request spiral.</li>
          <li><strong>Market Depth Scanning:</strong> Constantly modifying bracket orders based on microsecond shifts in order book depth.</li>
        </ol>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">How to Prevent Throttling (Token Bucket Pattern)</h3>
        <p>
          To stay under limits, execution engines implement **rate limiters** on the client side. A standard algorithm is the **Token Bucket**:
        </p>
        <div className="bg-[#161B22] p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-1 my-4 overflow-x-auto border border-white/5">
          <div><span className="text-purple-400">class</span> <span className="text-cyan-400">RateLimiter</span>:</div>
          <div className="pl-4">def __init__(self, max_ops=<span className="text-amber-500">10</span>):</div>
          <div className="pl-8">self.capacity = max_ops</div>
          <div className="pl-8">self.tokens = max_ops</div>
          <div className="pl-8">self.last_check = time.time()</div>
          <div className="pl-4">def consume(self):</div>
          <div className="pl-8"># Replenish tokens based on elapsed time...</div>
          <div className="pl-8"># Block or queue order if tokens == 0...</div>
        </div>
        <p>
          By queuing orders locally when approaching the limit, you guarantee that your broker API session remains healthy. Quantra 
          natively restricts strategy executions to a safe 5 OPS threshold, protecting user accounts from exchange penalties.
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
    id: "paper-trading-usefulness",
    title: "Is Paper Trading Actually Useful, or Does It Differ from Live Market Execution?",
    excerpt: "Compare paper trading sandboxes with real-world trading, examining slippages, latency, execution queues, and market impacts.",
    date: "June 8, 2026",
    readTime: "9 min read",
    category: "Systematic Trading",
    tags: ["Paper Trading", "Slippage", "Backtesting", "Market Execution"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Every trading platform encourages users to start with **Paper Trading** (simulated trading). It allows you to run 
          strategies and view performance curves without risking real capital. 
        </p>
        <p>
          However, experienced traders often warn that paper trading results can be deceptive. A strategy that shows an 80% win rate 
          in a sandbox might struggle in the live market. Let’s analyze why paper trading differs from live execution and how 
          to close the gap.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">What Paper Trading Does Well</h3>
        <p>
          Paper trading is a critical validation stage. It is exceptionally useful for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Logic Auditing:</strong> Verifying that your strategy opens, modifies, and exits positions exactly when your rules specify.</li>
          <li><strong>Integration Testing:</strong> Ensuring your API routes connect, receive ticker feeds, and log executions without software crashes.</li>
          <li><strong>Downside Checks:</strong> Checking that stop-loss orders are triggered correctly and capital limits are enforced.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">The Real-World Gap: Why Fills Differ</h3>
        <p>
          Paper trading runs in a vacuum. It assumes that if a price is printed on the tape, your order is filled at that exact price. 
          In live markets, this is not true due to:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Slippage:</strong> The difference between your expected price and the actual executed price. When volatility is high, prices shift between the millisecond your signal is generated and when it reaches the exchange.</li>
          <li><strong>Queue Priority:</strong> Exchanges process orders on a Price-Time priority. If there are 1,000 orders ahead of yours at a specific price, your live order must wait, whereas a paper engine assumes an instant fill.</li>
          <li><strong>Market Impact:</strong> In paper trading, buying 10,000 shares does not affect the price. In live markets, a large order eats up available liquidity and drives the price up, increasing entry costs.</li>
        </ol>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Making Paper Trading Realistic</h3>
        <p>
          To make sandboxes realistic, developers add **slippage parameters** (e.g. subtracting 0.05% from every trade entry) and 
          transaction fees (representing taxes and brokerages) directly into the simulation code.
        </p>
        <p>
          By factoring in these costs, your paper trading reports will match real-world market slips, helping you evaluate 
          strategy metrics accurately.
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
    id: "sandbox-strategy-testing",
    title: "Can I Test a Systematic Strategy in a Sandbox Before Using Real Money?",
    excerpt: "Learn how to use virtual sandbox integrations to forward-test systematic strategies risk-free on simulated feeds.",
    date: "May 20, 2026",
    readTime: "8 min read",
    category: "Systematic Trading",
    tags: ["Sandbox", "Strategy Testing", "Simulations", "Paper Account"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Subscribing to a systematic trading strategy published by a professional quant or SEBI Registered Analyst is exciting, 
          but putting your real capital behind it on day one is risky. 
        </p>
        <p>
          To help users test the waters safely, advanced platforms provide **Sandbox Strategy Testing**. This guide explains 
          how sandbox environments work, how they simulate live execution, and how you can use them to validate strategies risk-free.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">What is a Strategy Sandbox?</h3>
        <p>
          A strategy sandbox is an isolated, virtual environment where a systematic strategy runs on **real-time live market data**, 
          but routes all orders to a simulated trading portfolio rather than your live brokerage account.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Zero Risk:</strong> Live quotes drive the strategy signals, but executions occur on virtual balance sheets.</li>
          <li><strong>Live Validation:</strong> Unlike backtesting (which looks at historical data), sandbox testing evaluates how the strategy handles live, real-time market ticks, slippages, and volatile spreads.</li>
          <li><strong>Behavior Monitoring:</strong> Allows you to verify strategy logic (such as stop-loss triggers or multi-leg options execution) in real time.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">How It Works in Quantra</h3>
        <p>
          When you subscribe to a strategy on Quantra, you are prompted to select an execution mode:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Sandbox Mode (Default):</strong> Directs all execution signals to your virtual account. Quantra's execution engine matches orders against live top-of-book quotes, deducting theoretical slippages and transaction fees.</li>
          <li><strong>Live Mode:</strong> Routes execution signals directly to your connected broker account (e.g. Zerodha, Fyers) for live order matching.</li>
        </ol>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Recommended Testing Plan for New Strategies</h3>
        <p>
          For best results, use a phased onboarding structure:
          - *Phase 1 (Backtest Audit):* Review the creator's historical backtesting report to check drawdown characteristics.
          - *Phase 2 (Sandbox Validation):* Run the strategy in Sandbox mode for **7 to 10 trading days**. Verify that simulated execution logs match the publisher's performance updates.
          - *Phase 3 (Live Scaling):* Switch to Live execution, starting with a reduced capital allocation (e.g. 25% of target capital) to monitor real-world broker fills.
        </p>
        <p>
          Using virtual sandboxes ensures that you only commit real capital once you have built full confidence in the strategy's real-time performance.
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
    id: "min-capital-requirements",
    title: "How Much Minimum Capital Do I Need to Start Algorithmic Trading?",
    excerpt: "Demystify systematic trading budgets, analyzing broker limits, strategy margins, and retail capital allocations.",
    date: "May 4, 2026",
    readTime: "8 min read",
    category: "Systematic Trading",
    tags: ["Trading Capital", "Algo Budget", "Margins", "Retail Options"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          A common misconception in retail finance is that algorithmic trading is reserved exclusively for wealthy hedge funds 
          and institutional prop desks. Retail traders often ask: <strong>"Do I need millions of rupees to start algotrading?"</strong>
        </p>
        <p>
          The truth is that retail API access has democratized execution. You can start algorithmic trading with a budget 
          similar to manual trading. This article breaks down the capital requirements, margin structures, and risk factors.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Breaking Down Capital Requirements</h3>
        <p>
          The minimum capital required is not determined by the API connection or the software, but by the **strategy you choose to execute**:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Equity Investing / Swing Algos:</strong> If your strategy buys and holds equity shares, you can start with as little as **₹5,000 to ₹10,000**. The engine simply buys fractional or low-unit lots based on your signal limits.</li>
          <li><strong>Intraday Futures / Options Buying:</strong> Options buying requires premium payments. A typical options buying setup can be started with **₹15,000 to ₹25,000** to manage option lot premiums and drawdown buffers.</li>
          <li><strong>Futures / Options Writing (Selling):</strong> Option writing requires margin deposits. In India, writing a single lot of Nifty or Bank Nifty options requires a margin of **₹1,00,000 to ₹1,30,000**. If your algo manages option selling strategies, you need a minimum of ₹1.5 Lakhs per lot to cover margins and drawdowns.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Factoring in Drawdowns and Buffer Capital</h3>
        <p>
          Never trade with the exact minimum margin required to open a position. If a strategy requires ₹1.2 Lakhs margin and your account 
          holds exactly ₹1.2 Lakhs:
          - A minor adverse price movement will trigger margin calls.
          - Your broker's risk team might automatically liquidate your position.
          - You must maintain a **20% to 30% capital buffer** in your trading wallet to absorb normal drawdowns.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Summary Table of Budgets</h3>
        <div className="overflow-x-auto my-6 border border-[#30363D] rounded-lg">
          <table className="min-w-full divide-y divide-[#30363D] text-left text-sm">
            <thead className="bg-[#161B22] text-white">
              <tr>
                <th className="p-3">Strategy Type</th>
                <th className="p-3">Min Capital</th>
                <th className="p-3">Recommended Buffer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              <tr>
                <td className="p-3 font-medium">Equity Swing</td>
                <td className="p-3">₹5,000</td>
                <td className="p-3">₹2,000</td>
              </tr>
              <tr className="bg-[#161B22]/20">
                <td className="p-3 font-medium">Options Buying</td>
                <td className="p-3">₹20,000</td>
                <td className="p-3">₹10,000</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Options Selling (1 Lot)</td>
                <td className="p-3">₹1,30,000</td>
                <td className="p-3">₹40,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          By matching your strategy selection to your available capital budget, you can run systematic strategies safely 
          without risking margin penalties.
        </p>
      </div>
    )
  },
  {
    id: "buyer-customer-journey",
    title: "The Trader's Guide: From Sandbox to Live Automated Execution",
    excerpt: "A complete step-by-step journey for retail traders using Quantra—from backtesting in the free sandbox to purchasing and deploying live algorithmic strategies.",
    date: "July 8, 2026",
    readTime: "6 min read",
    category: "Systematic Trading",
    tags: ["Onboarding", "Buyers", "Paper Trading", "Execution", "Marketplace"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Welcome to Quantra! If you are a discretionary trader looking to automate your execution, or an investor 
          wanting to deploy professional quantitative models without writing a single line of code, you are in the right place. 
        </p>
        <p>
          Quantra operates as a high-performance **Software-as-a-Service (SaaS)** and code-licensing marketplace. 
          This means you retain complete control of your capital in your own brokerage account while our low-latency 
          engines execute trades on your behalf. Here is your step-by-step journey to algorithmic trading.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 1: The Free Sandbox Pass</h3>
        <p>
          Your journey begins entirely risk-free. When you create an account, you are automatically enrolled in **The Sandbox Pass**. 
          This tier costs nothing and allows you to explore the platform's visual terminal interface and charting dashboards. 
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Paper Trading:</strong> Simulate live order flows using real-time market data without risking real money.</li>
          <li><strong>Basic Backtesting:</strong> Run historical tests using core indicators (RSI, MACD) to see how simple strategies performed in the past.</li>
          <li><strong>Explore the Marketplace:</strong> Browse public algorithms built by professional quants and verified SEBI Research Analysts.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 2: Acquiring a Strategy License</h3>
        <p>
          Once you find a strategy on the Marketplace that matches your risk profile (e.g., a Nifty Options Scalper), 
          you can purchase a license. Clicking "Subscribe" opens a highly secure **Razorpay Checkout**.
        </p>
        <p>
          Thanks to our split-payment routing architecture, your payment is instantly and securely divided—the majority 
          goes directly to the strategy creator's bank account, and Quantra retains a small technology fee. You are 
          simply buying a software license to use their mathematical model.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 3: Connecting Your Broker</h3>
        <p>
          To deploy your new algorithm, you must connect your brokerage account (e.g., Zerodha, Fyers, AngelOne). 
          Navigate to the <strong>Broker Integration</strong> panel, generate your API keys from your broker's portal, 
          and paste them into Quantra. These keys are encrypted at rest; we can only send trade signals, we cannot 
          withdraw your funds.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 4: Upgrading to a Live Execution Tier</h3>
        <p>
          To send signals from Quantra to your live broker, you will need to upgrade to a commercial SaaS tier. 
          Navigate to the <strong>Pricing</strong> page and select **The Live Execution Pass** (₹499/mo). 
          This recurring subscription unlocks the ability to route real money trades via our infrastructure.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 5: Go Live!</h3>
        <p>
          Head to the Dashboard, toggle your licensed strategy from "Paper" to "Live", and set your capital allocation limit. 
          The engine takes over. You can monitor every execution tick-by-tick on the Live Feed. 
          If the market crashes, you always have access to the **Instant Kill Switch** to flatten positions and halt execution immediately.
        </p>
      </div>
    )
  },
  {
    id: "creator-customer-journey",
    title: "The Quant's Journey: Building, Backtesting, and Monetizing Your Strategies",
    excerpt: "Learn how quantitative developers and SEBI RAs use Quantra to build low-latency algorithms, encrypt their IP, and monetize their code via the marketplace.",
    date: "July 8, 2026",
    readTime: "7 min read",
    category: "Engineering",
    tags: ["Onboarding", "Creators", "Strategy Builder", "Monetization", "IP Protection"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Are you a quantitative developer, a financial content creator, or a SEBI-registered Research Analyst (RA) with 
          a profitable edge? Quantra provides you with institutional-grade infrastructure to build, test, and monetize 
          your algorithms without giving up your Intellectual Property (IP).
        </p>
        <p>
          Here is how you can leverage Quantra to turn your trading logic into a scalable, recurring revenue stream.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 1: The Private Dev Sandbox</h3>
        <p>
          As a Creator, your journey begins in the free **Private Dev Sandbox**. This tier grants you unrestricted access 
          to the Strategy Builder environment. You can write your logic using our Python/Node SDKs or our visual drag-and-drop builder.
        </p>
        <p>
          Run heavy backtests across 5-years of deep historical tick data. Refine your parameters, optimize your stop-losses, 
          and simulate forward-testing (Paper Trading) in real-time market conditions. In this free tier, your strategies 
          remain strictly private.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 2: IP Protection and Obfuscation</h3>
        <p>
          We know that your algorithm is your most valuable asset. When you finalize a strategy on Quantra, the source code 
          is securely encrypted and compiled. When a retail user licenses your strategy, they never see your underlying code, 
          moving averages, or entry logic. They only see the *results* and the live trade executions hitting their broker.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 3: Vendor Onboarding and Payouts</h3>
        <p>
          Ready to monetize? Head to the **Creator Studio**. Before you can list a strategy publicly, you must connect 
          your bank account via our **Razorpay Linked Accounts** portal. 
        </p>
        <p>
          Because Quantra is a pure software licensing platform, we use multi-party split routing. When a subscriber buys 
          your strategy for ₹2,500/month, the payment gateway instantly splits the transaction. **90% routes directly to your bank account**, 
          and 10% is routed to Quantra as a platform fee. You get paid instantly, with zero delayed payouts or withdrawal minimums.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 4: The SaaS Vendor Tiers</h3>
        <p>
          To list your strategies publicly on the Marketplace, you must hold an active Creator SaaS pass. 
          Navigate to the Pricing page and subscribe to **The Rising Vendor Pass** (₹999/mo). This allows you to publicly list 
          up to 2 strategies and unlocks subscriber analytics. 
        </p>
        <p>
          As your business grows, you can upgrade to the **Institutional Studio** to list up to 10 strategies and access advanced 
          churn tracking.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Step 5: The SEBI Partner Program</h3>
        <p>
          If you are a verified SEBI-registered RA or IA, you can apply for the **SEBI Compliance Partner** tier. 
          Once verified by our team, your public profile receives a prominent "SEBI Registered" trust-badge, significantly 
          boosting your conversion rates. You also unlock unlimited strategy listings and dedicated API support.
        </p>
      </div>
    )
  }
];

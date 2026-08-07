import React from 'react';
import Link from 'next/link';
import { BlogPost } from './blog-data-types';

export const BLOG_POSTS_2: BlogPost[] = [
  {
    id: "what-is-order-throttling-or-ops-limits-and-why-do-brokers-block-some-algos",
    title: "What is Order Throttling (or OPS Limits), and Why Do Brokers Block Some Algos?",
    excerpt: "Understand exchange rate limiting, why brokers restrict rapid trading loops, and how to avoid trade suspensions.",
    date: 'July 17, 2026',
    readTime: "9 min read",
    category: "Engineering",
    tags: ["Order Throttling", "OPS Limit", "Rate Limiting", "Broker Blocks"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>Deploying a high-frequency strategy can cause your broker account to be suspended within seconds. Order Throttling causes "429 Too Many Requests" errors when the market moves away from positions. Encountering broker limits happens often in algorithmic trading. Adapting to these limits prevents financial losses and suspended accounts.</p>
        
        <p>Order Throttling, or Orders Per Second (OPS) limits, bridges backtesting and live execution. Exchanges and brokers enforce this safeguard to prevent market manipulation and server overload. This guide explains OPS limits and the coding mistakes that trigger them. Professional quants use architectural solutions like token buckets and queueing systems to manage these limits.</p>
        
        <h2>Market Connectivity and Order Throttling</h2>
        <p>Throttling regulates the data flow from your local machine to the exchange matching engine. Exchanges process millions of messages per second. They enforce limits on the volume of requests a broker can route to their systems to maintain latency.</p>
        <p>Retail brokers pass these limitations onto users. A standard retail API token might restrict you to 10 requests per second. This includes order placements, order modifications, and cancellations. Throttle limits prevent the broker servers from experiencing a Distributed Denial of Service (DDoS) event when retail algorithms connect simultaneously.</p>
        <p>Modifying a trailing stop-loss on every tick of a volatile options contract breaches this limit. The broker firewall interprets this as a broken loop. It blocks your IP address and rejects subsequent orders. The broker protects its infrastructure from aggressive code.</p>
        
        <h2>Naive Loops in Algorithmic Design</h2>
        <p>Bad loop designs and poor state management within the trading bot cause throttling. Execution scripts often contain naive conditions that fire requests without checking if a previous request is pending. Common issues include:</p>
        <ul>
          <li>Aggressive Trailing Stops: Adjusting a stop-loss order fifty times a second generates excessive API requests. A bot might send hundreds of modification requests for a minor price move.</li>
          <li>Infinite Retry Loops: A script retrying a rejected order without pausing creates a rapid request spiral. This triggers a 429 error within milliseconds.</li>
          <li>Aggressive Polling: Asking the broker for the current status of an order in a tight loop without backoff delays uses up API limits.</li>
          <li>Canceling Instead of Modifying: Sending a cancel request followed by a new order request consumes two API calls. A single modify request consumes one.</li>
        </ul>
        
        <h2>Handling OPS Limits</h2>
        <p>An execution engine must monitor its request footprint. Implement a rate limiter locally rather than waiting for the broker to reject requests. Receiving a "429 Too Many Requests" response indicates a failure. Several strategies manage rate limiting effectively.</p>
        
        <h3>Token Bucket Algorithm</h3>
        <p>The Token Bucket algorithm manages rate limiting. A bucket holds a set number of tokens. The broker adds tokens back to the bucket up to the maximum each second. A request takes a token out of the bucket. If the bucket is empty, the algorithm queues the order until a new token arrives.</p>
        <p>A Token Bucket on your server queues orders and releases them at a metered pace. Bursty traffic is smoothed out. If a strategy generates 20 signals simultaneously, the system releases 10 immediately. It waits a second before releasing the remaining 10. The broker receives requests within the OPS limit.</p>
        
        <h3>WebSocket Subscriptions</h3>
        <p>Subscribe to WebSocket feeds instead of using REST API calls for order updates. WebSockets maintain a persistent connection. The broker pushes data to you upon updates. This offloads the request burden.</p>
        
        <h3>Strategy Level State Management</h3>
        <p>A strategy should update orders only when necessary. Trailing a stop-loss for every 1-tick movement is inefficient. Implement a step function to modify the stop-loss only if the price has moved by a specific amount. This reduces the number of modification requests.</p>
        
        <h3>Exponential Backoff</h3>
        <p>Bots must not retry immediately if an order fails. Implement an exponential backoff strategy. Wait 1 second for the first retry, 2 seconds for the second, and 4 seconds for the third. This prevents infinite retry loops.</p>

        <h2>Platform Infrastructure</h2>
        <p>Building an execution engine with Token Buckets, WebSocket management, and exponential backoffs requires engineering effort. This shifts focus from researching strategies.</p>
        <p>The execution cluster handles rate limiting natively. The routing engine queues and paces orders according to broker OPS limits. Firing 50 orders in a second will prompt the infrastructure to execute them at the permitted rate. You can view your <Link href="/dashboard" className="text-[#58A6FF] hover:underline">dashboard</Link> for order statuses.</p>
        
        <p><Link href="/auth?mode=signup" className="text-[#58A6FF] hover:underline font-medium">Create an account</Link> to deploy systematic strategies.</p>
      </div>
    )
  },
  {
    id: "do-algo-trading-apps-have-access-to-your-login-password-or-money",
    title: "Do Algo Trading Apps Have Access to Your Login Password or Money?",
    excerpt: "How brokerage API scopes prevent third-party apps from executing funds transfers or reading login credentials.",
    date: 'July 2, 2026',
    readTime: "8 min read",
    category: "Compliance",
    tags: ["API Scopes", "Fund Security", "OAuth", "SEBI Regulations"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>Discretionary traders often ask if systematic platforms can access their passwords or withdraw money. Fintech integration requires clear answers regarding fund security.</p>
        <p>Handing over programmatic control of a brokerage account carries perceived risks. Modern financial infrastructure relies on isolation protocols and regulatory frameworks. These systems restrict third-party access to specific actions.</p>
        <p>This article explains how third-party algorithmic trading applications connect to retail brokers. We review the OAuth 2.0 protocol, API scopes, and the limitations of fund withdrawals.</p>
        
        <h2>API Scopes and OAuth 2.0</h2>
        <p>Connecting software previously involved sharing usernames and passwords. This practice created security vulnerabilities. The financial industry now uses OAuth 2.0 to handle authentication.</p>
        <p>Connecting a broker to a platform initiates an authorization handshake. The platform does not request your broker password. Users are redirected to the broker portal to input passwords and Two-Factor Authentication (2FA) PINs. The third-party platform does not process this information.</p>
        <p>The broker asks the user to grant specific permissions known as scopes. Scopes define the allowed actions for the application. Trading engines request two scopes:</p>
        <ul>
          <li>Read Portfolio: The algorithm checks account balances, views open positions, and reads market data.</li>
          <li>Place Orders: The platform sends buy, sell, modify, and cancel requests to the exchange.</li>
        </ul>
        <p>An application attempting an action outside its granted scopes receives a "403 Forbidden" error from the broker API. The application operates strictly within the authorized sandbox. You can test these scopes in the <Link href="/sandbox" className="text-[#58A6FF] hover:underline">sandbox environment</Link>.</p>
        
        <h2>Fund Withdrawal Limitations</h2>
        <p>Broker APIs and regulatory systems restrict fund transfers. Algorithms cannot liquidate a portfolio and transfer cash to unverified accounts.</p>
        <p>Trading platforms do not request scopes for funds management. Brokers do not expose fund withdrawal endpoints via retail trading APIs. API commands for transferring funds to arbitrary accounts do not exist.</p>
        <p>Manual withdrawals initiated through the broker portal route funds to a pre-verified bank account. Brokers lock specific bank accounts to user profiles during account creation. SEBI mandates that money flows only between the broker and the verified bank account. The payment gateway prevents third-party payouts.</p>
        
        <h2>Token Lifespans</h2>
        <p>The OAuth redirect prevents password exposure. The platform receives an encrypted access token from the broker. This token permits the platform to trade for the user on that specific day.</p>
        <p>SEBI mandates that retail API access tokens expire daily. Tokens invalidate at midnight. Users must log in and authenticate the broker before the market opens. Stolen access tokens become useless the next morning.</p>
        <p>Users retain control over API access. You can log into the broker dashboard and revoke access. The access token invalidates instantly on the broker servers.</p>

        <h2>Execution Risks</h2>
        <p>Algorithmic trading carries execution risk. A bot placing incorrect trades or entering infinite loops incurs brokerage fees. Stop-loss orders must be managed properly.</p>
        <p>Platforms provide execution environments. Risk management features and circuit breakers manage execution processes.</p>
        
        <p><Link href="/auth?mode=signup" className="text-[#58A6FF] hover:underline font-medium">Sign up</Link> to access the trading platform.</p>
      </div>
    )
  },
  {
    id: "is-paper-trading-actually-useful-or-does-it-differ-from-live-market-execution",
    title: "Is Paper Trading Actually Useful, or Does It Differ from Live Market Execution?",
    excerpt: "Compare paper trading sandboxes with real-world trading, examining slippages, latency, execution queues, and market impacts.",
    date: 'January 9, 2026',
    readTime: "9 min read",
    category: "Systematic Trading",
    tags: ["Paper Trading", "Slippage", "Backtesting", "Market Execution"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>Traders often present paper trading accounts with high win rates. Paper trading operates differently than live markets.</p>
        <p>Paper trading tests code logic. Sandbox metrics omit market mechanics present in live trading.</p>
        
        <h2>Paper Trading Uses</h2>
        <p>Paper trading audits logic. It verifies that systems enter, modify, and exit trades based on mathematical conditions. It serves as an integration test for API routes.</p>
        
        <h2>Live Market Mechanics</h2>
        <p>Paper trading assumes perfect liquidity. A paper engine simulates fills exactly at the printed price. Live markets present different conditions:</p>
        <ul>
          <li>Slippage: Prices shift while orders travel to the exchange.</li>
          <li>Queue Priority: Exchanges process limit orders based on price and time priority. Orders sit in queues behind earlier submissions.</li>
          <li>Market Impact: Trading large sizes in illiquid options consumes the order book and shifts prices.</li>
        </ul>
        
        <h2>Adjusting Simulations</h2>
        <p>Simulated results require adjustments. Apply artificial slippage and deduct transaction taxes from simulated trades.</p>
        
        <p><Link href="/auth?mode=signup" className="text-[#58A6FF] hover:underline font-medium">Create a profile</Link> to configure simulation parameters.</p>
      </div>
    )
  },
  {
    id: "what-is-a-sebi-registered-research-analyst-ra-and-why-does-it-matter",
    title: "What is a SEBI Registered Research Analyst (RA), and Why Does It Matter?",
    excerpt: "Why retail traders should rely on certified advisors rather than Telegram or YouTube channel execution groups.",
    date: 'January 18, 2026',
    readTime: "4 min read",
    category: "Compliance",
    tags: ["SEBI RA", "Investor Protection", "Strategy Creators", "Ethics"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>Algorithmic trading platforms feature unverified publishers distributing bots. Retail traders lose capital by following anonymous strategy publishers promising guaranteed returns.</p>
        <p>Regulatory frameworks define the role of a SEBI Registered Research Analyst (RA). This certification establishes compliance standards.</p>
        
        <h2>SEBI Registration</h2>
        <p>A SEBI Registered RA holds a certification granted by the Securities and Exchange Board of India. Firms must possess financial qualifications, maintain a minimum net worth, and undergo regulatory audits.</p>
        
        <h2>Regulatory Compliance</h2>
        <p>Certified RAs follow a regulatory code of conduct:</p>
        <ul>
          <li>No Guaranteed Returns: RAs cannot promise risk-free wealth or display manipulated backtests.</li>
          <li>Mandatory Disclosures: Analysts disclose conflicts of interest, including personal holdings in recommended assets.</li>
          <li>Legal Recourse: Regulated systems offer legal recourse if operations violate compliance standards.</li>
        </ul>
        
        <h2>Unregulated Publishers</h2>
        <p>Unregulated publishers derive income from affiliate commissions and subscription fees. They operate outside regulatory oversight.</p>
        
        <p><Link href="/auth?mode=signup" className="text-[#58A6FF] hover:underline font-medium">Join the platform</Link> to view verified strategy creators.</p>
      </div>
    )
  },
  {
    id: "is-it-safe-to-connect-your-broker-account-to-an-algo-platform",
    title: "Is it Safe to Connect Your Broker Account to an Algo Platform?",
    excerpt: "A deep dive into security frameworks, credential encryption, and API tokens used by modern brokers.",
    date: 'February 26, 2026',
    readTime: "8 min read",
    category: "Engineering",
    tags: ["Broker API", "Kite Connect", "SmartAPI", "Security"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>Systemic risk analysis includes infrastructure evaluation. Connecting a brokerage account to a third-party platform introduces specific technical considerations.</p>
        <p>Linking capital to external software requires review. The cryptographic architecture behind these connections provides standardized security measures.</p>
        
        <h2>OAuth 2.0 Framework</h2>
        <p>Modern brokerages utilize the OAuth 2.0 framework. This protocol handles third-party authentication without exposing passwords.</p>
        <p>Account linking redirects users to the broker domain. Users input credentials and 2FA into the broker servers. The broker returns a temporary cryptographic key to the trading platform.</p>
        
        <h2>Token Expiration</h2>
        <p>The platform stores the temporary token. Tokens are encrypted at rest using AES-256 encryption. The tokens have specific restrictions:</p>
        <ul>
          <li>Daily Expiration: Retail API tokens expire daily due to regulatory mandates.</li>
          <li>Revocability: Users can revoke API access through the broker dashboard.</li>
        </ul>
        
        <h2>System Security</h2>
        <p>Temporary and encrypted tokens mitigate credential theft. These systems allow users to run automated processes.</p>
        
        <p><Link href="/auth?mode=signup" className="text-[#58A6FF] hover:underline font-medium">Create an account</Link> to link a broker.</p>
      </div>
    )
  }
];

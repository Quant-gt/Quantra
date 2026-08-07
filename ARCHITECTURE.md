# SigmaSpire Technical Architecture — Anti-Cloning Defense

> **Principle:** The React app is a *dumb terminal*. All valuable logic lives behind authenticated APIs.

---

## 1. Current Site Breakdown

| Feature | Current Location | Risk Level | Target Location |
|---------|-----------------|------------|-----------------|
| Marketing pages (Hero, Features) | Client (React) | Low | Keep on client |
| Static UI components | Client | Low | Keep on client |
| Auth UI | Client | Low | Keep on client |
| **Strategy Marketplace listings** | Client (mock data) | **CRITICAL** | **Server API** |
| **Live Scanner table** | Client (simulated ticks) | **CRITICAL** | **Server + WebSocket** |
| **P&L Chart** | Client (SVG animation) | **HIGH** | **Server → real data** |
| **Backtest engine** | Not present | **CRITICAL** | **Server only** |
| **Strategy scoring (Sharpe, CAGR)** | Client (mock) | **HIGH** | **Server API** |
| **Signal generation** | Not present | **CRITICAL** | **Server only** |
| Order execution | Not present | **CRITICAL** | **Server + broker APIs** |

---

## 2. Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React/Vite)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Marketing    │  │ Auth UI      │  │ Dashboard Shell      │  │
│  │ (Static)     │  │ (Forms)      │  │ (Layout, Nav)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Data Display Components (dumb, only render props)      │   │
│  │  - Strategy cards                                       │   │
│  │  - Scanner table rows                                   │   │
│  │  - P&L charts (recharts/plotly consuming API data)      │   │
│  │  - Order book / position list                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/WSS
                           │ Bearer Token (JWT)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Kong/AWS API GW)               │
│  • Rate limiting per user                                       │
│  • Bot detection (Cloudflare)                                   │
│  • Request signing (HMAC)                                       │
│  • API key rotation                                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
┌─────────────────┐ ┌──────────────┐ ┌────────────────┐
│   REST API      │ │  WebSocket   │ │  Webhook       │
│   (FastAPI/Go)  │ │  Server      │ │  Receiver      │
│                 │ │  (Socket.io) │ │                │
│ • Auth          │ │              │ │ • Broker       │
│ • CRUD ops      │ │ • Live ticks │ │   order        │
│ • Strategy mgmt │ │ • P&L stream │ │   updates      │
│ • Billing       │ │ • Alerts     │ │                │
└────────┬────────┘ └──────┬───────┘ └────────────────┘
         │                 │
         └────────┬────────┘
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  STRATEGY ENGINE (Python/Go) — BLACK BOX                │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │   │
│  │  │ Scanner     │ │ Backtester  │ │ Signal Gen      │   │   │
│  │  │ Algorithms  │ │ Engine      │ │ Engine          │   │   │
│  │  │             │ │             │ │                 │   │   │
│  │  │ • Momentum  │ │ • Tick      │ │ • Entry rules   │   │   │
│  │  │   scanner   │ │   replay    │ │ • Exit rules    │   │   │
│  │  │ • Volume    │ │ • P&L calc  │ │ • Position      │   │   │
│  │  │   inflow    │ │ • Metrics   │ │   sizing        │   │   │
│  │  │ • RSI calc  │ │   (Sharpe)  │ │ • Risk filters  │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ORDER MANAGEMENT SYSTEM (OMS)                          │   │
│  │  • Position tracking    • P&L attribution               │   │
│  │  • Risk checks          • Order routing                 │   │
│  │  • Broker abstraction   • Execution algo (TWAP/VWAP)    │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
┌─────────────────┐ ┌──────────────┐ ┌────────────────┐
│  TICK DATA      │ │  MARKET      │ │  USER DATA     │
│  (QuestDB/      │ │  DATA        │ │  (PostgreSQL)  │
│   ClickHouse)   │ │  (Redis)     │ │                │
│                 │ │              │ │ • Users        │
│ • 10yr NSE/BSE  │ │ • Live LTP   │ │ • Strategies   │
│ • 1min candles  │ │ • Orderbook  │ │ • Subscriptions│
│ • Tick replay   │ │ • Greeks     │ │ • Trades       │
└─────────────────┘ └──────────────┘ └────────────────┘
```

---

## 3. Critical Server-Side Components

### 3.1 Strategy Scanner Engine (Python)

**Current risk:** All scanner logic visible in browser via React.

**Server implementation:**
```python
# scanner/engine.py — NEVER exposed to client

class MomentumScanner:
    """
    Proprietary momentum detection using:
    - Structural break detection (custom algo)
    - Volume inflow shock (proprietary formula)
    - Multi-timeframe confluence
    """
    
    def scan(self, universe: list[str], filters: FilterConfig) -> list[ScanResult]:
        # Access 10yr tick database
        # Run proprietary calculations
        # Return only: ticker, signal_type, confidence_score, metadata
        pass

class SignalGenerator:
    """
    Converts scanner output to actionable signals.
    Contains secret sauce: entry timing, position sizing formula.
    """
    
    def generate_signal(self, scan: ScanResult, portfolio: Portfolio) -> Signal:
        # Kelly criterion sizing (modified)
        # Risk checks (max exposure, sector limits)
        # Return: action, quantity, price_range, stop_loss
        pass
```

**API exposure:**
```http
POST /api/v1/scanner/scan
Authorization: Bearer <jwt>
{
  "universe": ["NIFTY50", "NIFTYBANK"],
  "filters": {
    "min_volume_20d": 1000000,
    "rsi_range": [30, 70],
    "pe_max": 25
  }
}

Response:
{
  "scan_id": "uuid",
  "timestamp": "2026-01-15T09:15:00Z",
  "results": [
    {
      "ticker": "RELIANCE",
      "signal": "MOMENTUM_BREAK",
      "confidence": 0.87,
      "metadata": {
        "current_price": 1327.20,
        "volume_zscore": 2.4,
        "rsi_14": 34.2
        // Note: NO formulas, NO raw calculations
      }
    }
  ]
}
```

### 3.2 Backtest Engine (Python/C++)

**Why server-only:**
- Tick replay requires proprietary database
- P&L calculation methods are trade secrets
- Prevents competitors from validating strategies offline

**Implementation:**
```python
# backtest/engine.py

class BacktestEngine:
    """
    Event-driven backtester with realistic fill simulation.
    Uses proprietary slippage model based on orderbook depth.
    """
    
    def run(
        self,
        strategy_code: str,  # User-submitted Python
        date_range: DateRange,
        initial_capital: Decimal,
        mode: BacktestMode = BacktestMode.TICK  # or MINUTE
    ) -> BacktestResult:
        # Sandboxed execution of user code
        # Tick-by-tick simulation
        # Realistic fill prices using orderbook model
        # Calculate proprietary metrics
        pass
```

**Critical:** User strategy code runs in sandboxed environment (Firejail/Docker). Engine code is native and unreadable.

### 3.3 Strategy Scoring & Ranking

**Current risk:** Mock Sharpe/CAGR on client.

**Server implementation:**
```python
# scoring/engine.py

class StrategyScorer:
    """
    Calculates metrics using methods not disclosed to users.
    """
    
    def calculate_metrics(self, equity_curve: list[Decimal]) -> Metrics:
        return {
            "cagr": self._proprietary_cagr_calc(equity_curve),
            "sharpe": self._modified_sharpe(equity_curve),  # Modified vs textbook
            "max_dd": self._drawdown_calc(equity_curve),
            "omega_ratio": self._omega_calc(equity_curve),  # Proprietary variant
            "proprietary_score": self._alpha_score(equity_curve)  # Secret formula
        }
```

**API:**
```http
GET /api/v1/strategies/{id}/metrics
Response:
{
  "cagr": "42.6%",
  "sharpe": "2.34",
  "max_drawdown": "-8.1%",
  "sigma_score": 87.3  // Proprietary composite score
  // No formulas exposed
}
```

### 3.4 Real-Time Data Pipeline

**Architecture:**
```
NSE/BSE Feeds → Kafka → Stream Processors → WebSocket → Client
                    │
                    ├── Scanner engine (real-time)
                    ├── Signal generator
                    └── P&L attribution (per user)
```

**WebSocket auth:**
```javascript
// Client subscribes to live data
const ws = new WebSocket('wss://api.sigmaspire.in/live');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'jwt_token',
    subscriptions: ['scanner.nifty50', 'portfolio.pnl']
  }));
};

// Server pushes only calculated results
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // data: { ticker, price, signal, pnl }
  // NO raw orderbook, NO calculation steps
};
```

---

## 4. Security Layers

### 4.1 API Protection

```yaml
# Rate limiting per endpoint
/scanner/scan:
  - 10 req/min per user (prevents data harvesting)
  
/strategies/{id}/backtest:
  - 5 req/hour per strategy (compute-intensive)
  
/marketdata/ticks:
  - WebSocket only, max 50 subscriptions per connection

# Request signing
Headers:
  X-Sigma-Request-ID: uuid
  X-Sigma-Timestamp: unix_ms
  X-Sigma-Signature: HMAC-SHA256(payload + timestamp + secret)
```

### 4.2 Data Access Control

```python
# Row-level security in PostgreSQL
# Users can only see their own data + marketplace public data

# Strategy IP protection
class Strategy:
    owner_id: UUID
    code: EncryptedText  # Encrypted at rest
    is_public: bool
    
    def can_view_code(self, user_id: UUID) -> bool:
        return user_id == self.owner_id  # Only owner sees code
        
    def can_view_performance(self, user_id: UUID) -> bool:
        return self.is_public or user_id == self.owner_id
```

### 4.3 Deployment Security

```yaml
# Server hardening
- All services in private VPC, no public IPs
- Bastion host for SSH access only
- Database: No direct internet access, IAM auth
- Secrets: AWS Secrets Manager / HashiCorp Vault
- Code: Binary deployment only (no source on servers)
```

---

## 5. What Stays Client-Side (Safe to Expose)

| Component | Reason |
|-----------|--------|
| Marketing pages | Public by definition |
| UI components (buttons, modals) | No business logic |
| Form validation (basic) | UX only, server validates again |
| Chart rendering libraries | Data comes from server |
| Static assets (images, fonts) | Copyrighted, but visible |
| Auth token storage (httpOnly cookie) | Standard practice |

---

## 6. Migration Path from Current Site

### Phase 1: Immediate (Week 1-2)
- [ ] Remove all mock data from React
- [ ] Create API contracts (OpenAPI spec)
- [ ] Implement basic scanner API (returns static data initially)
- [ ] Add JWT auth flow

### Phase 2: Core Engine (Week 3-8)
- [ ] Build scanner engine (Python)
- [ ] Migrate tick data to QuestDB
- [ ] Implement WebSocket server for live data
- [ ] Replace client scanner with API calls

### Phase 3: Advanced Features (Week 9-16)
- [ ] Backtest engine with sandbox
- [ ] Strategy scoring system
- [ ] OMS + broker integrations
- [ ] Real-time P&L attribution

### Phase 4: Hardening (Ongoing)
- [ ] HMAC request signing
- [ ] Bot detection rules
- [ ] IP reputation filtering
- [ ] Audit logging for all API access

---

## 7. API Contract Example

### Scanner Endpoint
```yaml
openapi: 3.0.0
paths:
  /api/v1/scanner/universe:
    get:
      summary: Get available scanner universes
      security:
        - bearerAuth: []
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  universes:
                    type: array
                    items:
                      type: object
                      properties:
                        id: string
                        name: string
                        description: string
                        asset_count: integer

  /api/v1/scanner/scan:
    post:
      summary: Run scanner on universe
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                universe_id:
                  type: string
                filters:
                  type: object
                  # Schema defined but logic hidden
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  scan_id:
                    type: string
                  results:
                    type: array
                    items:
                      type: object
                      properties:
                        ticker:
                          type: string
                        name:
                          type: string
                        last_price:
                          type: number
                        change_1d:
                          type: number
                        pe_ratio:
                          type: number
                        signal_type:
                          type: string
                          enum: [MOMENTUM, MEAN_REVERSION, VOLUME_SPIKE]
                        confidence_score:
                          type: number
                          minimum: 0
                          maximum: 1
                        diagnostic_url:
                          type: string
                          format: uri
                  # NO algorithm details
```

---

## 8. Key Metrics to Monitor

| Metric | Target | Why |
|--------|--------|-----|
| API error rate | < 0.1% | Detect scraping attempts |
| Unusual request patterns | Flag | Bot detection |
| Data egress per user | < 10MB/day | Prevent bulk extraction |
| WebSocket connection duration | < 8 hours | Force re-auth |
| Backtest compute time | Logged | Detect resource abuse |

---

## Summary

**Golden rule:** If a feature gives competitive advantage, it lives on the server behind authentication. The React app is a thin presentation layer.

**Immediate actions:**
1. Design API contracts for scanner, backtest, strategy marketplace
2. Set up FastAPI/Go backend with PostgreSQL + Redis
3. Move all mock data to API responses
4. Implement JWT auth
5. Remove any algorithmic logic from client bundle

This architecture makes cloning functionally impossible — a competitor would need to rebuild your entire backend infrastructure, data pipeline, and broker integrations.

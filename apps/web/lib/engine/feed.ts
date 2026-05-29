export interface Tick {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  direction: 'up' | 'down' | 'none';
  timestamp: number;
}

type Subscriber = (tick: Tick) => void;

class MockWebSocketFeed {
  private subscribers: Set<Subscriber> = new Set();
  private interval: NodeJS.Timeout | null = null;
  private currentPrices: Record<string, number> = {
    'NIFTY 50': 23507.25,
    'BANKNIFTY': 48084.09,
    'RELIANCE': 2951.71,
    'HDFC BANK': 1517.53,
    'TCS': 3924.43,
    'INFY': 1422.13,
    'ICICI BANK': 1120.90,
    'SBI': 780.40
  };

  private prevPrices: Record<string, number> = { ...this.currentPrices };

  constructor() {
    if (typeof window !== 'undefined') {
      this.syncLivePrices();
      // Sync with real quotes from Yahoo Finance every 15 seconds
      setInterval(() => this.syncLivePrices(), 15000);
    }
  }

  getCurrentPrice(symbol: string): number {
    return this.currentPrices[symbol] || 100.00;
  }

  updateSymbols(symbols: string[]) {
    const newPrices: Record<string, number> = {};
    const newPrevPrices: Record<string, number> = {};
    
    symbols.forEach(symbol => {
      newPrices[symbol] = this.currentPrices[symbol] || 100.00;
      newPrevPrices[symbol] = this.prevPrices[symbol] || 100.00;
    });

    this.currentPrices = newPrices;
    this.prevPrices = newPrevPrices;
    
    // Immediate sync for newly added symbols
    this.syncLivePrices();
  }

  private async syncLivePrices() {
    if (typeof window === 'undefined') return;
    try {
      const symbolsList = Object.keys(this.currentPrices).join(',');
      if (!symbolsList) return;

      const res = await fetch(`/api/v1/engine/live-prices?symbols=${encodeURIComponent(symbolsList)}`);
      const data = await res.json();
      if (data.success && data.prices) {
        Object.entries(data.prices).forEach(([symbol, info]: any) => {
          this.currentPrices[symbol] = info.price;
        });
      }
    } catch (err) {
      console.error('Failed to sync live prices:', err);
    }
  }

  subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
    if (!this.interval) this.start();
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: Subscriber) {
    this.subscribers.delete(callback);
    if (this.subscribers.size === 0) this.stop();
  }

  private start() {
    // Emit high-frequency ticks every 100ms
    this.interval = setInterval(() => this.tick(), 100);
  }

  private stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

  private tick() {
    const symbols = Object.keys(this.currentPrices);
    // Randomly select 1-3 symbols to tick this iteration
    const numTicks = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numTicks; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)] as string;
      
      // Random walk: -0.05% to +0.05% change
      const volatility = 0.0005; 
      const changeFactor = 1 + ((Math.random() - 0.5) * volatility);
      
      this.prevPrices[symbol] = this.currentPrices[symbol] as number;
      const newPrice = (this.currentPrices[symbol] as number) * changeFactor;
      this.currentPrices[symbol] = newPrice;
      
      const change = newPrice - (this.prevPrices[symbol] as number);
      const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'none';

      // Ensure price doesn't drift too crazy for the mock
      const changePct = ((newPrice - 22500) / 22500) * 100; // Simplified mock logic

      const tick: Tick = {
        symbol,
        price: Number(newPrice.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePct: Number((change / (this.prevPrices[symbol] as number) * 100).toFixed(2)),
        direction,
        timestamp: Date.now()
      };

      this.subscribers.forEach(sub => sub(tick));
    }
  }
}

// Singleton instance
export const feed = new MockWebSocketFeed();

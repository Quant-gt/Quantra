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
    'NIFTY 50': 22500.0,
    'BANKNIFTY': 48000.0,
    'RELIANCE': 2950.0,
    'HDFCBANK': 1520.0,
    'TCS': 3950.0,
    'INFY': 1420.0
  };

  private prevPrices: Record<string, number> = { ...this.currentPrices };

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

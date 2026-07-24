import { describe, it, expect } from 'vitest';
import { checkMACDCrossover, calculateATR, calculateEMA, calculateSMA, Candle } from '../indicators';

describe('checkMACDCrossover', () => {
  it('should return false if there are less than 35 data points', () => {
    const closes = Array(34).fill(100);
    expect(checkMACDCrossover(closes)).toBe(false);
  });

  it('should return false when price is flat and there is no crossover', () => {
    const closes = Array(40).fill(100);
    expect(checkMACDCrossover(closes)).toBe(false);
  });

  it('should return true for a bullish crossover', () => {
    // Generate data to force a bullish MACD crossover
    // 1. Establish a baseline
    const closes = Array(25).fill(100);
    
    // 2. Drive the price down to make MACD negative, up to the second-to-last tick
    for (let i = 0; i < 14; i++) {
      closes.push(100 - i * 2); // Drops to 74
    }
    
    // 3. Spike the price sharply up ONLY on the very last tick to force a fresh crossover
    closes.push(200);
    
    expect(checkMACDCrossover(closes)).toBe(true);
  });

  it('should return false for a bearish crossover', () => {
    // Generate data for a bearish crossover
    // 1. Establish a baseline
    const closes = Array(25).fill(100);
    
    // 2. Drive the price up to make MACD positive, up to the second-to-last tick
    for (let i = 0; i < 14; i++) {
      closes.push(100 + i * 2); // Rises to 126
    }
    
    // 3. Drop the price sharply down ONLY on the very last tick to force a fresh bearish crossover
    closes.push(10); // Drops down to 10
    
    expect(checkMACDCrossover(closes)).toBe(false);
  });
});

describe('calculateATR', () => {
  it('should return an array of nulls if candles length is less than or equal to period', () => {
    const candles: Candle[] = [
      { open: 10, high: 12, low: 8, close: 10, volume: 100 },
      { open: 10, high: 12, low: 8, close: 10, volume: 100 }
    ];
    const result = calculateATR(candles, 3);
    expect(result).toEqual([null, null]);
  });

  it('should calculate ATR correctly for a given period', () => {
    const candles: Candle[] = [
      { open: 10, high: 10, low: 8, close: 9, volume: 100 }, // TR = 2
      { open: 11, high: 12, low: 10, close: 11, volume: 100 }, // TR = max(2, 12-9, 10-9) = 3
      { open: 10, high: 11, low: 9, close: 10, volume: 100 }, // TR = max(2, 11-11, 9-11) = 2
      { open: 11, high: 13, low: 11, close: 12, volume: 100 }, // TR = max(2, 13-10, 11-10) = 3
      { open: 13, high: 14, low: 12, close: 13, volume: 100 } // TR = max(2, 14-12, 12-12) = 2
    ];
    // period = 3
    const result = calculateATR(candles, 3);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).toBeNull();
    // Index 3: avg of TRs at index 1, 2, 3 = (3 + 2 + 3) / 3 = 8/3 = 2.6666...
    expect(result[3]).toBeCloseTo(8/3, 5);
    // Index 4: (avgPrev * 2 + TR[4]) / 3 = (2.6666... * 2 + 2) / 3 = (5.3333... + 2) / 3 = 7.3333... / 3 = 2.4444...
    expect(result[4]).toBeCloseTo(22/9, 5);
  });
});

describe('calculateEMA', () => {
  it('should return an empty array if closes is empty', () => {
    expect(calculateEMA([], 5)).toEqual([]);
  });

  it('should calculate EMA correctly when closes length is less than period', () => {
    const closes = [10, 12, 11];
    // period = 5, length = 3
    // k = 2 / (3 + 1) = 0.5
    // ema[0] = 10
    // ema[1] = 12 * 0.5 + 10 * 0.5 = 11
    // ema[2] = 11 * 0.5 + 11 * 0.5 = 11
    expect(calculateEMA(closes, 5)).toEqual([10, 11, 11]);
  });

  it('should calculate EMA correctly when closes length is greater than or equal to period', () => {
    const closes = [10, 12, 11, 13, 14];
    // period = 3
    // k = 2 / (3 + 1) = 0.5
    // initialSMA = (10 + 12 + 11) / 3 = 11
    // ema[0] = 11, ema[1] = 11, ema[2] = 11
    // ema[3] = 13 * 0.5 + 11 * 0.5 = 12
    // ema[4] = 14 * 0.5 + 12 * 0.5 = 13
    expect(calculateEMA(closes, 3)).toEqual([11, 11, 11, 12, 13]);
  });
});

describe('calculateSMA', () => {
  it('should return 0 for an empty array if closes length is less than period', () => {
    expect(calculateSMA([], 3)).toBe(0);
  });

  it('should return the last element if closes length is less than period but not empty', () => {
    expect(calculateSMA([10, 20], 3)).toBe(20);
  });

  it('should calculate SMA correctly when closes length is greater than or equal to period', () => {
    expect(calculateSMA([10, 20, 30], 3)).toBe(20);
    expect(calculateSMA([10, 20, 33], 3)).toBe(21);
    expect(calculateSMA([10.5, 20.5, 30.5], 2)).toBe(25.5);
    expect(calculateSMA([1, 2, 4], 3)).toBe(2.33);
  });
});

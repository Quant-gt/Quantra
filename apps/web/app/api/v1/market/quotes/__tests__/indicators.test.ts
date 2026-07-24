import { describe, it, expect } from 'vitest';
import { checkMACDCrossover } from '../indicators';

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

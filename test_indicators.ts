import assert from 'node:assert';
import { 
  calculateVWAP, 
  calculateStochRSI, 
  calculateRSI, 
  calculateSupertrend, 
  calculateADX,
  Candle
} from './apps/web/app/api/v1/market/quotes/indicators.js';

function runTests() {
  console.log("Starting Indicator Tests...");

  // Mock data representing 2 days of intraday data (e.g. 5-min candles)
  const baseTime = new Date('2026-07-01T09:30:00Z').getTime();
  const day2Time = new Date('2026-07-02T09:30:00Z').getTime();

  const mockCandles: Candle[] = [];

  // Generate 20 candles for day 1
  for (let i = 0; i < 20; i++) {
    mockCandles.push({
      open: 100 + i,
      high: 105 + i,
      low: 95 + i,
      close: 102 + i,
      volume: 1000,
      timestamp: baseTime + i * 5 * 60 * 1000, 
    });
  }

  // Generate 20 candles for day 2
  for (let i = 0; i < 20; i++) {
    mockCandles.push({
      open: 120 + i,
      high: 125 + i,
      low: 115 + i,
      close: 122 + i,
      volume: 2000, // higher volume on day 2
      timestamp: day2Time + i * 5 * 60 * 1000,
    });
  }

  const closes = mockCandles.map(c => c.close);

  // --- VWAP Tests ---
  const vwap = calculateVWAP(mockCandles);
  assert.strictEqual(vwap.length, 40, "VWAP array length must match input");
  
  // Day 1 Candle 1: TP = (105+95+102)/3 = 100.6667
  const tp1 = (105 + 95 + 102) / 3;
  assert.strictEqual(vwap[0], parseFloat(tp1.toFixed(4)), "First VWAP should equal TP");

  // Day 2 Candle 1 (Index 20): TP = (125+115+122)/3 = 120.6667
  const tp2_1 = (125 + 115 + 122) / 3;
  assert.strictEqual(vwap[20], parseFloat(tp2_1.toFixed(4)), "VWAP must reset on new day");

  // --- RSI Tests ---
  const rsi = calculateRSI(closes, 14);
  assert.strictEqual(rsi.length, 40, "RSI array length must match input");
  for (let i = 0; i < 14; i++) {
    assert.strictEqual(rsi[i], null, "RSI should pad initial values with null");
  }
  assert.notStrictEqual(rsi[14], null, "RSI[14] should be populated");

  // --- Supertrend Tests ---
  const st = calculateSupertrend(mockCandles, 10, 3);
  assert.strictEqual(st.length, 40, "Supertrend array length must match input");
  for (let i = 0; i < 10; i++) {
    assert.strictEqual(st[i], null, "Supertrend should pad initial values with null");
  }
  assert.notStrictEqual(st[10], null, "Supertrend[10] should be populated");

  // --- ADX Tests ---
  const adx = calculateADX(mockCandles, 14);
  assert.strictEqual(adx.length, 40, "ADX array length must match input");
  for (let i = 0; i < 27; i++) {
    assert.strictEqual(adx[i], null, `ADX[${i}] should be padded with null`);
  }
  assert.notStrictEqual(adx[27], null, "ADX[27] should be populated (period * 2 - 1)");

  // --- StochRSI Tests ---
  const stoch = calculateStochRSI(closes, 14, 14, 3, 3);
  assert.strictEqual(stoch.k.length, 40, "StochRSI K array length must match input");
  assert.strictEqual(stoch.d.length, 40, "StochRSI D array length must match input");
  
  // Padding Check: RSI Period(14) + Stoch Period(14) - 1 = 27 starts StochRSI, + kSmooth(3) - 1 = 29 starts K
  for (let i = 0; i < 29; i++) {
    assert.strictEqual(stoch.k[i], null, `StochRSI K[${i}] should be null`);
  }
  assert.notStrictEqual(stoch.k[29], null, "StochRSI K[29] should be populated");

  console.log("All Mathematical Tests Passed Successfully!");
}

runTests();

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp?: number;
}

// ============================================================================
// Core Indicators
// ============================================================================

export function calculateRSI(closes: number[], period = 14): (number | null)[] {
  const rsi: (number | null)[] = Array(closes.length).fill(null);
  if (closes.length <= period) return rsi;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i]! - closes[i - 1]!;
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) rsi[period] = 100;
  else {
    const rs = avgGain / avgLoss;
    rsi[period] = Math.round(100 - 100 / (1 + rs));
  }

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i]! - closes[i - 1]!;
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;

    if (avgLoss === 0) {
      rsi[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi[i] = Math.round(100 - 100 / (1 + rs));
    }
  }
  return rsi;
}

export function calculateATR(candles: Candle[], period = 14): (number | null)[] {
  const atr: (number | null)[] = Array(candles.length).fill(null);
  if (candles.length <= period) return atr;

  const trs = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1]!.close;
    return Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
  });

  let sum = 0;
  for (let i = 1; i <= period; i++) {
    sum += trs[i]!;
  }
  let avg = sum / period;
  atr[period] = avg;

  for (let i = period + 1; i < trs.length; i++) {
    avg = (avg * (period - 1) + trs[i]!) / period;
    atr[i] = avg;
  }
  return atr;
}

export function calculateSupertrend(candles: Candle[], period = 10, multiplier = 3): (number | null)[] {
  const st: (number | null)[] = Array(candles.length).fill(null);
  if (candles.length <= period) return st;

  const atr = calculateATR(candles, period);
  
  const basicUpper = candles.map((c, i) => (c.high + c.low) / 2 + multiplier * (atr[i] || 0));
  const basicLower = candles.map((c, i) => (c.high + c.low) / 2 - multiplier * (atr[i] || 0));
  
  const finalUpper: number[] = Array(candles.length).fill(0);
  const finalLower: number[] = Array(candles.length).fill(0);
  
  finalUpper[period] = basicUpper[period]!;
  finalLower[period] = basicLower[period]!;
  st[period] = finalUpper[period]!; // Default to bearish start

  for (let i = period + 1; i < candles.length; i++) {
    const prevClose = candles[i - 1]!.close;
    const bu = basicUpper[i]!;
    const bl = basicLower[i]!;
    const fuPrev = finalUpper[i - 1]!;
    const flPrev = finalLower[i - 1]!;

    if (bu < fuPrev || prevClose > fuPrev) {
      finalUpper[i] = bu;
    } else {
      finalUpper[i] = fuPrev;
    }
    
    if (bl > flPrev || prevClose < flPrev) {
      finalLower[i] = bl;
    } else {
      finalLower[i] = flPrev;
    }

    const stPrev = st[i - 1]!;
    const c = candles[i]!;

    if (stPrev === fuPrev) {
      if (c.close > finalUpper[i]!) {
        st[i] = finalLower[i]!;
      } else {
        st[i] = finalUpper[i]!;
      }
    } else {
      if (c.close < finalLower[i]!) {
        st[i] = finalUpper[i]!;
      } else {
        st[i] = finalLower[i]!;
      }
    }
  }
  
  return st.map(val => val !== null ? parseFloat(val.toFixed(2)) : null);
}

export function calculateADX(candles: Candle[], period = 14): (number | null)[] {
  const adx: (number | null)[] = Array(candles.length).fill(null);
  if (candles.length <= period * 2) return adx;
  
  const trs: number[] = [0];
  const plusDM: number[] = [0];
  const minusDM: number[] = [0];
  
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i]!;
    const p = candles[i - 1]!;
    
    trs.push(Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close)));
    
    const upmove = c.high - p.high;
    const downmove = p.low - c.low;
    
    plusDM.push(upmove > downmove && upmove > 0 ? upmove : 0);
    minusDM.push(downmove > upmove && downmove > 0 ? downmove : 0);
  }
  
  let smoothedTR = trs.slice(1, period + 1).reduce((a, b) => a + b, 0);
  let smoothedPlusDM = plusDM.slice(1, period + 1).reduce((a, b) => a + b, 0);
  let smoothedMinusDM = minusDM.slice(1, period + 1).reduce((a, b) => a + b, 0);
  
  const dxs: (number | null)[] = Array(candles.length).fill(null);
  dxs[period] = (smoothedTR === 0) ? 0 : 100 * Math.abs(smoothedPlusDM - smoothedMinusDM) / (smoothedPlusDM + smoothedMinusDM);
  
  for (let i = period + 1; i < candles.length; i++) {
    smoothedTR = smoothedTR - smoothedTR / period + trs[i]!;
    smoothedPlusDM = smoothedPlusDM - smoothedPlusDM / period + plusDM[i]!;
    smoothedMinusDM = smoothedMinusDM - smoothedMinusDM / period + minusDM[i]!;
    
    if (smoothedTR === 0) {
      dxs[i] = 0;
      continue;
    }
    
    const plusDI = (100 * smoothedPlusDM) / smoothedTR;
    const minusDI = (100 * smoothedMinusDM) / smoothedTR;
    const sum = plusDI + minusDI;
    const diff = Math.abs(plusDI - minusDI);
    
    dxs[i] = sum === 0 ? 0 : (100 * diff) / sum;
  }
  
  let adxSum = 0;
  for (let i = period; i < period * 2; i++) {
    adxSum += dxs[i]!;
  }
  let currentAdx = adxSum / period;
  adx[period * 2 - 1] = Math.round(currentAdx);
  
  for (let i = period * 2; i < dxs.length; i++) {
    currentAdx = (currentAdx * (period - 1) + dxs[i]!) / period;
    adx[i] = Math.round(currentAdx);
  }
  
  return adx;
}

export function calculateVWAP(candles: Candle[]): (number | null)[] {
  const vwap: (number | null)[] = Array(candles.length).fill(null);
  
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  let currentDay = -1;

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i]!;
    
    let candleDay = -1;
    if (c.timestamp) {
      candleDay = new Date(c.timestamp).getUTCDate();
    } else {
      // Fallback for non-intraday data if timestamp is missing
      candleDay = -1; 
    }

    if (candleDay !== currentDay && currentDay !== -1) {
      cumulativeTPV = 0;
      cumulativeVolume = 0;
    }
    currentDay = candleDay;

    const typicalPrice = (c.high + c.low + c.close) / 3;
    cumulativeTPV += typicalPrice * c.volume;
    cumulativeVolume += c.volume;

    if (cumulativeVolume === 0) {
      vwap[i] = i > 0 ? (vwap[i - 1] ?? typicalPrice) : typicalPrice;
    } else {
      vwap[i] = parseFloat((cumulativeTPV / cumulativeVolume).toFixed(4));
    }
  }

  return vwap;
}

export function calculateSMAArray(closes: number[], period: number): (number | null)[] {
  const sma: (number | null)[] = Array(closes.length).fill(null);
  let sum = 0;
  for (let i = 0; i < closes.length; i++) {
    sum += closes[i]!;
    if (i === period - 1) {
      sma[i] = sum / period;
    } else if (i >= period) {
      sum -= closes[i - period]!;
      sma[i] = sum / period;
    }
  }
  return sma;
}

export function calculateStochRSI(closes: number[], rsiPeriod = 14, stochPeriod = 14, kSmooth = 3, dSmooth = 3): { k: (number | null)[], d: (number | null)[] } {
  const rsi = calculateRSI(closes, rsiPeriod);
  const stochRsi: (number | null)[] = Array(closes.length).fill(null);

  for (let i = rsiPeriod + stochPeriod - 1; i < closes.length; i++) {
    let minRSI = Infinity;
    let maxRSI = -Infinity;
    for (let j = 0; j < stochPeriod; j++) {
      const val = rsi[i - j]!;
      if (val < minRSI) minRSI = val;
      if (val > maxRSI) maxRSI = val;
    }

    if (maxRSI === minRSI) {
      stochRsi[i] = 0;
    } else {
      stochRsi[i] = 100 * (rsi[i]! - minRSI) / (maxRSI - minRSI);
    }
  }

  // Calculate %K (SMA of StochRSI)
  const kLine: (number | null)[] = Array(closes.length).fill(null);
  const stochStartIndex = rsiPeriod + stochPeriod - 1;
  let kSum = 0;
  for (let i = stochStartIndex; i < closes.length; i++) {
    kSum += stochRsi[i]!;
    if (i - stochStartIndex === kSmooth - 1) {
      kLine[i] = kSum / kSmooth;
    } else if (i - stochStartIndex >= kSmooth) {
      kSum -= stochRsi[i - kSmooth]!;
      kLine[i] = kSum / kSmooth;
    }
  }

  // Calculate %D (SMA of %K)
  const dLine: (number | null)[] = Array(closes.length).fill(null);
  const kStartIndex = stochStartIndex + kSmooth - 1;
  let dSum = 0;
  for (let i = kStartIndex; i < closes.length; i++) {
    dSum += kLine[i]!;
    if (i - kStartIndex === dSmooth - 1) {
      dLine[i] = dSum / dSmooth;
    } else if (i - kStartIndex >= dSmooth) {
      dSum -= kLine[i - dSmooth]!;
      dLine[i] = dSum / dSmooth;
    }
  }

  return { k: kLine, d: dLine };
}

export function calculateSMA(closes: number[], period: number): number {
  if (closes.length < period) {
    const last = closes[closes.length - 1];
    return last !== undefined ? last : 0;
  }
  const sum = closes.slice(closes.length - period).reduce((a, b) => a + b, 0);
  return parseFloat((sum / period).toFixed(2));
}

export function calculateEMA(closes: number[], period: number): number[] {
  const ema: number[] = [];
  if (closes.length === 0) return [];
  
  if (closes.length < period) {
    const k = 2 / (closes.length + 1);
    ema.push(closes[0]!);
    for (let i = 1; i < closes.length; i++) {
      ema.push(closes[i]! * k + ema[i - 1]! * (1 - k));
    }
    return ema;
  }
  
  const k = 2 / (period + 1);
  const initialSMA = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < period - 1; i++) {
    ema.push(initialSMA);
  }
  ema.push(initialSMA);
  
  for (let i = period; i < closes.length; i++) {
    ema.push(closes[i]! * k + ema[i - 1]! * (1 - k));
  }
  return ema;
}

export function checkMACDCrossover(closes: number[]): boolean {
  if (closes.length < 35) return false;
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  
  const macd: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    macd.push(ema12[i]! - ema26[i]!);
  }
  
  const signal = calculateEMA(macd, 9);
  
  const lastMacd = macd[macd.length - 1]!;
  const lastSignal = signal[signal.length - 1]!;
  const prevMacd = macd[macd.length - 2]!;
  const prevSignal = signal[signal.length - 2]!;
  
  return prevMacd <= prevSignal && lastMacd > lastSignal;
}

export function checkGoldenCross(closes: number[]): boolean {
  if (closes.length < 51) return false;
  
  const ema20Arr = calculateEMA(closes, 20);
  const currentEma20 = ema20Arr[ema20Arr.length - 1] || 0;
  const currentSma50 = calculateSMA(closes, 50);
  
  const prevCloses = closes.slice(0, closes.length - 1);
  const prevEma20Arr = calculateEMA(prevCloses, 20);
  const prevEma20 = prevEma20Arr[prevEma20Arr.length - 1] || 0;
  const prevSma50 = calculateSMA(prevCloses, 50);
  
  return prevEma20 <= prevSma50 && currentEma20 > currentSma50;
}

export function calculateFVGBull(candles: Candle[]): number {
  if (candles.length < 3) return 0;
  const len = candles.length;
  const c1 = candles[len - 3]!;
  const c2 = candles[len - 2]!;
  const c3 = candles[len - 1]!;
  
  const gap = c3.low - c1.high;
  return gap > 0 && c2.close > c2.open ? parseFloat(gap.toFixed(2)) : 0.0;
}

export function checkVolumeSurge(candles: Candle[]): boolean {
  if (candles.length < 21) return false;
  const last = candles[candles.length - 1];
  if (!last) return false;
  const currentVol = last.volume;
  const avgVol20 = candles.slice(candles.length - 21, candles.length - 1).reduce((sum, c) => sum + (c ? c.volume : 0), 0) / 20;
  return currentVol > avgVol20 * 1.5;
}

export function isDoji(candles: Candle[]): boolean {
  if (candles.length === 0) return false;
  const last = candles[candles.length - 1]!;
  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  if (range === 0) return true;
  return body / range < 0.1;
}

export function isBullishEngulfing(candles: Candle[]): boolean {
  if (candles.length < 2) return false;
  const prev = candles[candles.length - 2]!;
  const last = candles[candles.length - 1]!;
  const prevIsBearish = prev.close < prev.open;
  const lastIsBullish = last.close > last.open;
  if (!prevIsBearish || !lastIsBullish) return false;
  return last.close >= prev.open && last.open <= prev.close;
}

export function isHammer(candles: Candle[]): boolean {
  if (candles.length === 0) return false;
  const last = candles[candles.length - 1]!;
  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  if (range === 0) return false;
  
  const lowerShadow = Math.min(last.open, last.close) - last.low;
  const upperShadow = last.high - Math.max(last.open, last.close);
  
  return lowerShadow >= 2 * body && upperShadow <= 0.1 * range;
}

export function isShootingStar(candles: Candle[]): boolean {
  if (candles.length === 0) return false;
  const last = candles[candles.length - 1]!;
  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  if (range === 0) return false;
  
  const lowerShadow = Math.min(last.open, last.close) - last.low;
  const upperShadow = last.high - Math.max(last.open, last.close);
  
  return upperShadow >= 2 * body && lowerShadow <= 0.1 * range;
}

export function isMarubozu(candles: Candle[]): boolean {
  if (candles.length === 0) return false;
  const last = candles[candles.length - 1]!;
  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  if (range === 0) return false;
  return body / range > 0.95;
}

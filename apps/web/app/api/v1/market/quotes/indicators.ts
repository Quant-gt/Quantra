export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function calculateRSI(closes: number[], period = 14): number {
  if (closes.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const prev = closes[i - 1]!;
    const cur = closes[i]!;
    const diff = cur - prev;
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const prev = closes[i - 1]!;
    const cur = closes[i]!;
    const diff = cur - prev;
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - 100 / (1 + rs));
}

export function calculateATR(candles: Candle[], period = 14): number[] {
  const atr: number[] = [];
  if (candles.length === 0) return [];
  const trs = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1]!.close;
    return Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
  });
  let sum = 0;
  for (let i = 0; i < Math.min(period, trs.length); i++) {
    sum += trs[i]!;
  }
  let avg = sum / Math.min(period, trs.length);
  for (let i = 0; i < trs.length; i++) {
    if (i < period - 1) {
      atr.push(avg);
    } else if (i === period - 1) {
      atr.push(avg);
    } else {
      avg = (avg * (period - 1) + trs[i]!) / period;
      atr.push(avg);
    }
  }
  return atr;
}

export function calculateSupertrend(candles: Candle[], period = 10, multiplier = 3): number {
  if (candles.length < period) {
    const last = candles[candles.length - 1];
    return last ? last.close : 0;
  }
  const atr = calculateATR(candles, period);
  
  const basicUpper = candles.map((c, i) => (c.high + c.low) / 2 + multiplier * atr[i]!);
  const basicLower = candles.map((c, i) => (c.high + c.low) / 2 - multiplier * atr[i]!);
  
  const finalUpper = [...basicUpper];
  const finalLower = [...basicLower];
  
  for (let i = 1; i < candles.length; i++) {
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
  }
  
  const supertrend = [...finalUpper];
  for (let i = 1; i < candles.length; i++) {
    const fu = finalUpper[i]!;
    const fl = finalLower[i]!;
    const fuPrev = finalUpper[i - 1]!;
    const stPrev = supertrend[i - 1]!;
    const c = candles[i]!;

    if (stPrev === fuPrev) {
      if (c.close > fu) {
        supertrend[i] = fl;
      } else {
        supertrend[i] = fu;
      }
    } else {
      if (c.close < fl) {
        supertrend[i] = fu;
      } else {
        supertrend[i] = fl;
      }
    }
  }
  
  const lastVal = supertrend[supertrend.length - 1];
  return lastVal !== undefined ? parseFloat(lastVal.toFixed(2)) : 0;
}

export function calculateADX(candles: Candle[], period = 14): number {
  if (candles.length <= period * 2) return 20;
  
  const trs: number[] = [];
  const plusDM: number[] = [];
  const minusDM: number[] = [];
  
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      const c = candles[0]!;
      trs.push(c.high - c.low);
      plusDM.push(0);
      minusDM.push(0);
      continue;
    }
    
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
  
  const dxs: number[] = [];
  
  for (let i = period + 1; i < candles.length; i++) {
    smoothedTR = smoothedTR - smoothedTR / period + trs[i]!;
    smoothedPlusDM = smoothedPlusDM - smoothedPlusDM / period + plusDM[i]!;
    smoothedMinusDM = smoothedMinusDM - smoothedMinusDM / period + minusDM[i]!;
    
    if (smoothedTR === 0) {
      dxs.push(0);
      continue;
    }
    
    const plusDI = (100 * smoothedPlusDM) / smoothedTR;
    const minusDI = (100 * smoothedMinusDM) / smoothedTR;
    const sum = plusDI + minusDI;
    const diff = Math.abs(plusDI - minusDI);
    
    dxs.push(sum === 0 ? 0 : (100 * diff) / sum);
  }
  
  if (dxs.length < period) return 20;
  let adx = dxs.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < dxs.length; i++) {
    adx = (adx * (period - 1) + dxs[i]!) / period;
  }
  
  return Math.round(adx);
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
  const k = 2 / (period + 1);
  if (closes.length === 0) return [];
  
  // Seed with first close
  ema.push(closes[0]!);
  for (let i = 1; i < closes.length; i++) {
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
  if (closes.length < 201) return false;
  
  const prevCloses = closes.slice(0, closes.length - 1);
  
  const currentSma50 = calculateSMA(closes, 50);
  const currentSma200 = calculateSMA(closes, 200);
  
  const prevSma50 = calculateSMA(prevCloses, 50);
  const prevSma200 = calculateSMA(prevCloses, 200);
  
  return prevSma50 <= prevSma200 && currentSma50 > currentSma200;
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
  
  return lowerShadow > 2 * body && upperShadow < 0.2 * body;
}

export function isShootingStar(candles: Candle[]): boolean {
  if (candles.length === 0) return false;
  const last = candles[candles.length - 1]!;
  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  if (range === 0) return false;
  
  const lowerShadow = Math.min(last.open, last.close) - last.low;
  const upperShadow = last.high - Math.max(last.open, last.close);
  
  return upperShadow > 2 * body && lowerShadow < 0.2 * body;
}

export function isMarubozu(candles: Candle[]): boolean {
  if (candles.length === 0) return false;
  const last = candles[candles.length - 1]!;
  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  if (range === 0) return false;
  return body / range > 0.95;
}

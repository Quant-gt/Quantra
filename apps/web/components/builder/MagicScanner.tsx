"use client";

import { 
  Sparkles, 
  Navigation, 
  Info, 
  Star, 
  Download, 
  X, 
  TrendingUp, 
  Settings, 
  Layers, 
  Check, 
  Maximize2,
  Trash2,
  Bookmark,
  RefreshCw,
  Plus,
  Calendar,
  Clock,
  Rocket
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { DeployStrategyModal } from '@/components/builder/DeployStrategyModal';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useScreener } from '@/context/ScreenerContext';
import { ClickToChartModal } from '../workspace/click-to-chart-modal';

// Real expanded broad market universe of 100 stocks for dynamic scanning (including Nifty Next 50 and Midcaps)
const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', sector: 'Technology' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'Technology' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'BHARTIALRT', name: 'Bharti Airtel Ltd.', sector: 'Telecommunications' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financial Services' },
  { symbol: 'LICI', name: 'Life Insurance Corporation of India', sector: 'Financial Services' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Construction' },
  { symbol: 'ITC', name: 'ITC Ltd.', sector: 'Consumer Goods' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', sector: 'Consumer Goods' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'NTPC', name: 'NTPC Ltd.', sector: 'Utilities' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd.', sector: 'Services' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Automobile' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', sector: 'Healthcare' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd.', sector: 'Energy' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.', sector: 'Utilities' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', sector: 'Consumer Goods' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', sector: 'Automobile' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', sector: 'Financial Services' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.', sector: 'Energy' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', sector: 'Metals & Mining' },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd.', sector: 'Financial Services' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', sector: 'Materials' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', sector: 'Technology' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.', sector: 'Energy' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', sector: 'Technology' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', sector: 'Consumer Goods' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.', sector: 'Metals & Mining' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', sector: 'Metals & Mining' },
  { symbol: 'ADANIPOWER', name: 'Adani Power Ltd.', sector: 'Utilities' },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd.', sector: 'Materials' },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd.', sector: 'Technology' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.', sector: 'Financial Services' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.', sector: 'Metals & Mining' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.', sector: 'Energy' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', sector: 'Industrial' },
  { symbol: 'DLF', name: 'DLF Ltd.', sector: 'Real Estate' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', sector: 'Consumer Goods' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', sector: 'Technology' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.', sector: 'Financial Services' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.', sector: 'Financial Services' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', sector: 'Automobile' },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd.', sector: 'Financial Services' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', sector: 'Automobile' },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd.', sector: 'Industrial' },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.', sector: 'Healthcare' },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Financial Services' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'YESBANK', name: 'Yes Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'CANBK', name: 'Canara Bank', sector: 'Financial Services' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', sector: 'Financial Services' },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Ltd.', sector: 'Financial Services' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', sector: 'Automobile' },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company Ltd.', sector: 'Automobile' },
  { symbol: 'BALKRISIND', name: 'Balkrishna Industries Ltd.', sector: 'Automobile' },
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland Ltd.', sector: 'Automobile' },
  { symbol: 'GAIL', name: 'GAIL India Ltd.', sector: 'Utilities' },
  { symbol: 'RECLTD', name: 'REC Ltd.', sector: 'Financial Services' },
  { symbol: 'PFC', name: 'Power Finance Corporation Ltd.', sector: 'Financial Services' },
  { symbol: 'NHPC', name: 'NHPC Ltd.', sector: 'Utilities' },
  { symbol: 'SJVN', name: 'SJVN Ltd.', sector: 'Utilities' },
  { symbol: 'SAIL', name: 'Steel Authority of India Ltd.', sector: 'Metals & Mining' },
  { symbol: 'NMDC', name: 'NMDC Ltd.', sector: 'Metals & Mining' },
  { symbol: 'VEDL', name: 'Vedanta Ltd.', sector: 'Metals & Mining' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd.', sector: 'Metals & Mining' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc Ltd.', sector: 'Metals & Mining' },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd.', sector: 'Consumer Goods' },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd.', sector: 'Technology' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd.', sector: 'Consumer Goods' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.', sector: 'Consumer Goods' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd.', sector: 'Consumer Goods' },
  { symbol: 'DABUR', name: 'Dabur India Ltd.', sector: 'Consumer Goods' },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive India Ltd.', sector: 'Consumer Goods' },
  { symbol: 'MARICO', name: 'Marico Ltd.', sector: 'Consumer Goods' },
  { symbol: 'TRENT', name: 'Trent Ltd.', sector: 'Consumer Goods' },
  { symbol: 'PAGEIND', name: 'Page Industries Ltd.', sector: 'Consumer Goods' },
  { symbol: 'CIPLA', name: 'Cipla Ltd.', sector: 'Healthcare' },
  { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd.', sector: 'Healthcare' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.', sector: 'Healthcare' },
  { symbol: 'LUPIN', name: 'Lupin Ltd.', sector: 'Healthcare' },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd.', sector: 'Healthcare' },
  { symbol: 'BIOCON', name: 'Biocon Ltd.', sector: 'Healthcare' },
  { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism Corp.', sector: 'Services' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd.', sector: 'Services' },
  { symbol: 'PAYTM', name: 'One97 Communications Ltd.', sector: 'Services' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd.', sector: 'Services' },
  { symbol: 'KPITTECH', name: 'KPIT Technologies Ltd.', sector: 'Technology' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd.', sector: 'Technology' },
  { symbol: 'COFORGE', name: 'Coforge Ltd.', sector: 'Technology' },
  { symbol: 'DIXON', name: 'Dixon Technologies India Ltd.', sector: 'Technology' },
  { symbol: 'SRF', name: 'SRF Ltd.', sector: 'Materials' },
  { symbol: 'ASTRAL', name: 'Astral Ltd.', sector: 'Materials' },
  { symbol: 'CONCOR', name: 'Container Corporation of India Ltd.', sector: 'Services' },
  { symbol: 'GMRINFRA', name: 'GMR Airports Infrastructure Ltd.', sector: 'Services' },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corp.', sector: 'Financial Services' },
  { symbol: 'HUDCO', name: 'Housing & Urban Development Corp.', sector: 'Financial Services' }
];

const UNIVERSE_MAPS: Record<string, string[]> = {
  'Nifty 50': ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BHARTIALRT', 'SBIN', 'LICI', 'LT', 'ITC', 'HINDUNILVR', 'KOTAKBANK', 'AXISBANK', 'NTPC', 'ADANIPORTS', 'TATAMOTORS', 'SUNPHARMA', 'ONGC', 'POWERGRID', 'TITAN', 'MARUTI', 'BAJFINANCE', 'COALINDIA', 'ADANIENT', 'ULTRACEMCO', 'BPCL', 'HCLTECH', 'ASIANPAINT', 'JSWSTEEL', 'TATASTEEL', 'GRASIM', 'LTIM', 'BAJAJFINSV', 'HINDALCO', 'INDUSINDBK', 'NESTLEIND', 'TECHM', 'EICHERMOT', 'M&M', 'DIVISLAB', 'HEROMOTOCO', 'BRITANNIA'],
  'Nifty 100': ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BHARTIALRT', 'SBIN', 'LICI', 'LT', 'ITC', 'HINDUNILVR', 'KOTAKBANK', 'AXISBANK', 'NTPC', 'ADANIPORTS', 'TATAMOTORS', 'SUNPHARMA', 'ONGC', 'POWERGRID', 'TITAN', 'MARUTI', 'BAJFINANCE', 'COALINDIA', 'ADANIENT', 'ULTRACEMCO', 'BPCL', 'HCLTECH', 'ASIANPAINT', 'JSWSTEEL', 'TATASTEEL', 'GRASIM', 'LTIM', 'BAJAJFINSV', 'HINDALCO', 'INDUSINDBK', 'NESTLEIND', 'TECHM', 'EICHERMOT', 'M&M', 'DIVISLAB', 'HEROMOTOCO', 'BRITANNIA', 'JIOFIN', 'ADANIPOWER', 'IOC', 'HAL', 'DLF', 'HDFCLIFE', 'SBILIFE', 'SHRIRAMFIN', 'BEL', 'PNB', 'DMART', 'PIDILITIND'],
  'Nifty Midcap 100': ['TRENT', 'KPITTECH', 'PERSISTENT', 'COFORGE', 'DIXON', 'ASTRAL', 'PAGEIND', 'CIPLA', 'DRREDDY', 'APOLLOHOSP', 'LUPIN', 'AUROPHARMA', 'BIOCON', 'IRCTC', 'ZOMATO', 'PAYTM', 'NYKAA', 'SRF', 'CONCOR', 'GMRINFRA', 'IRFC', 'HUDCO', 'TVSMOTOR', 'BALKRISIND', 'ASHOKLEY', 'GAIL', 'RECLTD', 'PFC', 'NHPC', 'SJVN', 'SAIL', 'NMDC', 'VEDL', 'JINDALSTEL', 'HINDZINC', 'TATAELXSI', 'GODREJCP', 'DABUR', 'COLPAL', 'MARICO'],
  'Only F&O Stocks': ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BHARTIALRT', 'SBIN', 'LT', 'ITC', 'HINDUNILVR', 'KOTAKBANK', 'AXISBANK', 'NTPC', 'ADANIPORTS', 'TATAMOTORS', 'SUNPHARMA', 'ONGC', 'POWERGRID', 'TITAN', 'MARUTI', 'BAJFINANCE', 'COALINDIA', 'WIPRO', 'BPCL', 'HCLTECH', 'ASIANPAINT', 'JSWSTEEL', 'TATASTEEL', 'GRASIM', 'LTIM', 'BAJAJFINSV', 'HINDALCO', 'INDUSINDBK', 'TECHM', 'EICHERMOT', 'SHRIRAMFIN', 'M&M', 'BEL', 'DIVISLAB', 'PNB', 'CANBK', 'HEROMOTOCO', 'TVSMOTOR', 'BALKRISIND', 'ASHOKLEY', 'GAIL', 'RECLTD', 'PFC', 'SAIL', 'NMDC', 'VEDL', 'JINDALSTEL', 'TATAELXSI', 'BRITANNIA', 'SRF', 'CIPLA', 'DRREDDY', 'APOLLOHOSP', 'LUPIN', 'AUROPHARMA', 'BIOCON'],
};

const MultiExchangeTickerMap: Record<string, { bseSymbol: string; bseCode: string }> = {
  RELIANCE: { bseSymbol: 'RELIANCE', bseCode: '500325' },
  TCS: { bseSymbol: 'TCS', bseCode: '532540' },
  HDFCBANK: { bseSymbol: 'HDFCBANK', bseCode: '500180' },
  INFY: { bseSymbol: 'INFY', bseCode: '500209' },
  ICICIBANK: { bseSymbol: 'ICICIBANK', bseCode: '532174' },
  BHARTIALRT: { bseSymbol: 'BHARTIALRT', bseCode: '532454' },
  SBIN: { bseSymbol: 'SBIN', bseCode: '500112' },
  LT: { bseSymbol: 'LT', bseCode: '500510' },
  ITC: { bseSymbol: 'ITC', bseCode: '500875' },
  HINDUNILVR: { bseSymbol: 'HINDUNILVR', bseCode: '500696' }
};

function getSymbolSeed(symbol: string) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function MagicScanner() {
  const { 
    historicalSnapshotTarget, 
    setHistoricalSnapshotTarget,
    activeUniverseScope,
    setActiveUniverseScope,
    watchlist: globalWatchlist,
    toggleWatchlist: toggleGlobalWatchlist
  } = useScreener();
  const [prompt, setPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [activeExchanges, setActiveExchanges] = useState<Record<string, 'NSE' | 'BSE'>>({});
  const [liveQuotesMap, setLiveQuotesMap] = useState<Record<string, any>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [watchlist, setWatchlist] = useState<any[]>([]);

  // Load watchlist on mount
  useEffect(() => {
    const saved = localStorage.getItem('WatchlistStore');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save watchlist on change
  useEffect(() => {
    localStorage.setItem('WatchlistStore', JSON.stringify(watchlist));
  }, [watchlist]);

  // Workspace Layout view integration states
  const [viewMode, setViewMode] = useState<'single' | 'workspace'>('single');
  const [widgets, setWidgets] = useState<any[]>([
    {
      id: 'rsi-oversold',
      title: 'RSI Oversold Matrix',
      query: 'rsi < 40',
      timeframe: '15m',
      layoutSize: 'medium',
      results: [],
      isScanning: false,
      isPolling: false
    },
    {
      id: 'high-momentum',
      title: 'High Momentum Breakouts',
      query: 'change > 1.5',
      timeframe: '5m',
      layoutSize: 'small',
      results: [],
      isScanning: false,
      isPolling: false
    }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [newTimeframe, setNewTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '1d'>('15m');
  const [newSize, setNewSize] = useState<'small' | 'medium' | 'large'>('small');

  const runWidgetScan = async (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isScanning: true } : w));
    
    try {
      const activeMap = UNIVERSE_MAPS[activeUniverseScope];
      const universeList = activeMap 
        ? STOCK_UNIVERSE.filter(s => activeMap.includes(s.symbol))
        : activeUniverseScope === 'Custom Watchlist'
          ? STOCK_UNIVERSE.filter(s => globalWatchlist.includes(s.symbol))
          : STOCK_UNIVERSE;

      const symbolsList = universeList.map(s => s.symbol);
      const quotesRes = await fetch('/api/v1/market/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symbols: symbolsList,
          asOfTimestamp: historicalSnapshotTarget
        })
      });
      
      let currentQuotesMap = liveQuotesMap;
      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        const fetchedQuotes = quotesData.quotes || {};
        currentQuotesMap = { ...liveQuotesMap, ...fetchedQuotes };
        setLiveQuotesMap(currentQuotesMap);
      }

      setWidgets(prev => {
        const widget = prev.find(w => w.id === id);
        if (!widget) return prev;

        const query = (widget.query || '').toLowerCase().trim();
        
        const filtered = universeList.map(stock => {
          const seed = getSymbolSeed(stock.symbol);
          const liveQuote = currentQuotesMap[stock.symbol];
          
          let closeVal = liveQuote?.close !== undefined ? liveQuote.close : (seed % 1200) + 150;
          let changeVal = liveQuote?.change !== undefined ? liveQuote.change : ((seed % 120) - 60) / 10;
          let openVal = liveQuote?.open !== undefined ? liveQuote.open : closeVal * (1 - changeVal / 100);
          let highVal = liveQuote ? liveQuote.high : Math.max(closeVal, openVal) * (1 + (seed % 15) / 1000);
          let lowVal = liveQuote ? liveQuote.low : Math.min(closeVal, openVal) * (1 - (seed % 15) / 1000);
          let volumeVal = liveQuote ? liveQuote.volume : (seed % 900000) + 100000;
          
          let rsiVal = liveQuote?.rsi !== undefined ? liveQuote.rsi : Math.min(Math.max(Math.round(50 + changeVal * 6), 10), 90);
          let adxVal = liveQuote?.adx !== undefined ? liveQuote.adx : Math.min(Math.max(Math.round(20 + Math.abs(changeVal) * 8), 10), 60);
          let supertrendVal = liveQuote?.supertrend !== undefined ? liveQuote.supertrend : (changeVal >= 0 
            ? (lowVal - (highVal - lowVal) * 1.5) 
            : (highVal + (highVal - lowVal) * 1.5));
          let fvgBullVal = liveQuote?.fvgBull !== undefined ? liveQuote.fvgBull : ((closeVal > openVal && (highVal - lowVal) > (closeVal * 0.02)) 
            ? (closeVal - openVal) * 0.3 
            : 0.0);
          
          let hasMacd = liveQuote?.hasMacd !== undefined ? liveQuote.hasMacd : changeVal > 0.5;
          let hasGoldenCross = liveQuote?.hasGoldenCross !== undefined ? liveQuote.hasGoldenCross : (closeVal > openVal && changeVal > 0.0);
          let hasVolumeSurge = liveQuote?.hasVolumeSurge !== undefined ? liveQuote.hasVolumeSurge : volumeVal > 1500000;

          // Fundamental Metrics
          let pe = liveQuote?.pe !== undefined ? liveQuote.pe : parseFloat((10 + (seed % 65)).toFixed(1)); 
          let pb = liveQuote?.pb !== undefined ? liveQuote.pb : parseFloat((1 + (seed % 15) * 0.8).toFixed(1)); 
          let evebitda = liveQuote?.evEbitda !== undefined ? liveQuote.evEbitda : parseFloat((8 + (seed % 42)).toFixed(1)); 
          let debtequity = liveQuote?.debtEquity !== undefined ? liveQuote.debtEquity : parseFloat(((seed % 180) / 100).toFixed(2)); 
          let currentratio = liveQuote?.currentRatio !== undefined ? liveQuote.currentRatio : parseFloat((0.8 + (seed % 25) * 0.1).toFixed(2)); 
          let netprofitmargin = liveQuote?.netMargin !== undefined ? liveQuote.netMargin : parseFloat((5 + (seed % 35)).toFixed(1)); 
          let roce = liveQuote?.roce !== undefined ? liveQuote.roce : parseFloat((8 + (seed % 42)).toFixed(1)); 
          let roe = liveQuote?.roe !== undefined ? liveQuote.roe : parseFloat((6 + (seed % 34)).toFixed(1)); 
          let profitgrowth = liveQuote?.yoyProfitGrowth !== undefined ? liveQuote.yoyProfitGrowth : parseFloat((((seed % 60) - 15)).toFixed(1)); 
          let salesgrowth = liveQuote?.yoySalesGrowth !== undefined ? liveQuote.yoySalesGrowth : parseFloat((((seed % 40) - 5)).toFixed(1)); 
          let promoterholding = liveQuote?.promoterHolding !== undefined ? liveQuote.promoterHolding : parseFloat((30 + (seed % 45)).toFixed(1)); 
          let institutionholding = liveQuote?.instHolding !== undefined ? liveQuote.instHolding : parseFloat((10 + (seed % 50)).toFixed(1)); 
          let pledgedshares = liveQuote?.pledgedRatio !== undefined ? liveQuote.pledgedRatio : parseFloat(((seed % 120) < 15 ? (seed % 10) : 0).toFixed(1)); 

          // Derivative (F&O) Metrics
          let oi = liveQuote?.oi !== undefined ? liveQuote.oi : (seed % 5000000) + 100000; 
          let oichange = liveQuote?.oiChange !== undefined ? liveQuote.oiChange : parseFloat((((seed % 60) - 30)).toFixed(1)); 
          let oivector = liveQuote?.oiChange !== undefined ? liveQuote.oiChange : parseFloat((((seed % 120) - 40)).toFixed(1)); 
          let vwap = liveQuote?.vwap !== undefined ? liveQuote.vwap : parseFloat((closeVal * (0.997 + (seed % 6) * 0.001)).toFixed(2)); 
          let pcr = liveQuote?.pcr !== undefined ? liveQuote.pcr : parseFloat((0.4 + (seed % 12) * 0.1).toFixed(2)); 
          let costofcarry = liveQuote?.costOfCarry !== undefined ? liveQuote.costOfCarry : parseFloat((4 + (seed % 12)).toFixed(1)); 

          if (historicalSnapshotTarget) {
            const targetTime = new Date(historicalSnapshotTarget).getTime();
            const multiplier = 0.8 + (Math.sin(targetTime + seed) * 0.25);
            closeVal = parseFloat((closeVal * multiplier).toFixed(2));
            changeVal = parseFloat(((multiplier - 1) * 100).toFixed(2));
            openVal = openVal * multiplier;
            highVal = highVal * multiplier;
            lowVal = lowVal * multiplier;
            rsiVal = Math.round(rsiVal * multiplier);
            pe = pe * multiplier;
            oichange = oichange * multiplier;
          }

          return {
            symbol: stock.symbol,
            company: stock.name,
            sector: stock.sector,
            price: `₹${closeVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: `${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)}%`,
            closeVal,
            openVal,
            highVal,
            lowVal,
            volumeVal,
            rsi: rsiVal,
            adx: adxVal,
            supertrendVal,
            fvgBullVal,
            hasMacd,
            hasGoldenCross,
            hasVolumeSurge,
            rawChange: changeVal,
            pe,
            pb,
            evebitda,
            debtequity,
            currentratio,
            netprofitmargin,
            roce,
            roe,
            profitgrowth,
            salesgrowth,
            promoterholding,
            institutionholding,
            pledgedshares,
            oi,
            oichange,
            oivector,
            vwap,
            pcr,
            costofcarry,
            exchange: liveQuote?.exchange || 'NSE'
          };
        }).filter(stock => {
          const isMathExpression = /[><=+\-*/()]/.test(query);
          if (isMathExpression) {
            return evaluateCustomExpression(query, stock);
          }

          // Conversational NLP matchers
          if (query.includes('rsi') && (query.includes('oversold') || query.includes('under') || query.includes('below') || query.includes('30'))) {
            return stock.rsi < 30;
          }
          if (query.includes('rsi') && (query.includes('overbought') || query.includes('above') || query.includes('70'))) {
            return stock.rsi > 70;
          }
          if (query.includes('macd') || query.includes('crossover')) {
            return stock.hasMacd;
          }
          if (query.includes('golden') || query.includes('cross') || query.includes('sma') || query.includes('ema')) {
            return stock.hasGoldenCross;
          }
          if (query.includes('volume') || query.includes('surge') || query.includes('spike')) {
            return stock.hasVolumeSurge;
          }
          if (query.includes('supertrend') && (query.includes('bullish') || query.includes('buy') || query.includes('above'))) {
            return stock.closeVal > stock.supertrendVal;
          }
          if (query.includes('adx') && (query.includes('strong') || query.includes('trend') || query.includes('25'))) {
            return stock.adx > 25;
          }
          if (query.includes('fvg') || query.includes('fair value gap') || query.includes('imbalance')) {
            return stock.fvgBullVal > 0;
          }
          if (query.includes('orb') || query.includes('opening range')) {
            return stock.closeVal > stock.openVal;
          }

          return stock.symbol.toLowerCase().includes(query) || 
                 stock.company.toLowerCase().includes(query) || 
                 stock.sector.toLowerCase().includes(query);
        });

        return prev.map(w => w.id === id ? { 
          ...w, 
          isScanning: false, 
          results: filtered 
        } : w);
      });
    } catch (error) {
      console.error(error);
      setWidgets(prev => prev.map(w => w.id === id ? { ...w, isScanning: false } : w));
    }
  };

  const handleCreateWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuery.trim()) {
      toast.error('Please input a screener title and query criteria');
      return;
    }
    const newId = `widget-${Date.now()}`;
    const newWidget = {
      id: newId,
      title: newTitle,
      query: newQuery,
      timeframe: newTimeframe,
      layoutSize: newSize,
      results: [],
      isScanning: false,
      isPolling: false
    };

    setWidgets(prev => [...prev, newWidget]);
    setNewTitle('');
    setNewQuery('');
    toast.success(`Created screener widget: ${newTitle}`);
    setTimeout(() => runWidgetScan(newId), 100);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    toast.info('Screener widget removed');
  };

  const handleTogglePolling = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isPolling: !w.isPolling } : w));
  };

  const handleResizeWidget = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, layoutSize: size } : w));
  };

  const handleExportWidgetCSV = (widget: any) => {
    if (!widget.results || widget.results.length === 0) {
      toast.error('No scan data to export');
      return;
    }
    const headers = ['Symbol', 'Sector', 'Price', 'Change %', 'RSI (14)', 'P/E', 'OI Chg %'];
    const rows = widget.results.map((r: any) => [
      r.symbol,
      r.sector,
      r.price,
      r.change,
      r.rsi,
      r.pe,
      r.oichange
    ]);
    const csvContent = [headers.join(','), ...rows.map((row: any) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${widget.title.toLowerCase().replace(/\s+/g, '_')}_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${widget.title} CSV Exported!`);
  };

  // Hydrate all screeners on startup or view mode trigger
  useEffect(() => {
    if (viewMode === 'workspace') {
      widgets.forEach(w => runWidgetScan(w.id));
    }
  }, [viewMode, historicalSnapshotTarget]);

  // Set up workspace polling intervals
  useEffect(() => {
    if (viewMode !== 'workspace') return;
    const intervals = widgets.map(w => {
      if (w.isPolling) {
        return setInterval(() => {
          runWidgetScan(w.id);
        }, 15000); 
      }
      return null;
    });

    return () => {
      intervals.forEach(int => int && clearInterval(int));
    };
  }, [widgets, viewMode]);

  // Automatically re-run scan when historicalSnapshotTarget or activeUniverseScope changes
  useEffect(() => {
    if (prompt.trim() && hasScanned) {
      handleScan();
    }
  }, [historicalSnapshotTarget, activeUniverseScope]);

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Chart popup state
  const [activeStockToken, setActiveStockToken] = useState<any | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Custom indicator profiles toggled by user
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['EMA Trend Cross']);
  const availableIndicators = ['EMA Trend Cross', 'RSI Breakout', 'Supertrend Overlay'];

  const evaluateCustomExpression = (expr: string, stock: any): boolean => {
    let cleanExpr = expr.toLowerCase();
    
    // Map common indicator variables to stock values
    const vars: { [key: string]: number } = {
      close: stock.closeVal,
      open: stock.openVal,
      high: stock.highVal,
      low: stock.lowVal,
      volume: stock.volumeVal,
      rsi: stock.rsi,
      adx: stock.adx,
      supertrend: stock.supertrendVal,
      fvg: stock.fvgBullVal,
      pe: stock.pe,
      pb: stock.pb,
      evebitda: stock.evebitda,
      debtequity: stock.debtequity,
      currentratio: stock.currentratio,
      netprofitmargin: stock.netprofitmargin,
      roce: stock.roce,
      roe: stock.roe,
      profitgrowth: stock.profitgrowth,
      salesgrowth: stock.salesgrowth,
      promoterholding: stock.promoterholding,
      institutionholding: stock.institutionholding,
      pledgedshares: stock.pledgedshares,
      oi: stock.oi,
      oichange: stock.oichange,
      oivector: stock.oivector,
      vwap: stock.vwap,
      pcr: stock.pcr,
      costofcarry: stock.costofcarry
    };
    
    // Replace variables in expression
    Object.keys(vars).forEach(v => {
      const regex = new RegExp(`\\b${v}\\b`, 'g');
      const val = vars[v];
      cleanExpr = cleanExpr.replace(regex, (val ?? 0).toString());
    });
    
    // Remove spaces
    cleanExpr = cleanExpr.replace(/\s+/g, '');
    
    // Replace logical operators with JS equivalents
    cleanExpr = cleanExpr.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
    
    // Sanitization check: ONLY allow numbers, operators, logic signs, comparison signs, parentheses
    if (!/^[0-9.+\-*/()&|!><=]+$/.test(cleanExpr)) {
      return false;
    }
    
    try {
      const evalFn = new Function(`return !!(${cleanExpr});`);
      return evalFn();
    } catch (err) {
      return false;
    }
  };

  const handleScan = async () => {
    if (!prompt.trim()) return;
    setIsScanning(true);
    setHasScanned(true);
    setResults([]);
    
    try {
      const activeMap = UNIVERSE_MAPS[activeUniverseScope];
      const universeList = activeMap 
        ? STOCK_UNIVERSE.filter(s => activeMap.includes(s.symbol))
        : activeUniverseScope === 'Custom Watchlist'
          ? STOCK_UNIVERSE.filter(s => globalWatchlist.includes(s.symbol))
          : STOCK_UNIVERSE;

      const symbolsList = universeList.map(s => s.symbol);
      const quotesRes = await fetch('/api/v1/market/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symbols: symbolsList,
          asOfTimestamp: historicalSnapshotTarget
        })
      });
      
      let liveQuotesMap: Record<string, any> = {};
      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        liveQuotesMap = quotesData.quotes || {};
        setLiveQuotesMap(liveQuotesMap);
      }
      
      const query = prompt.toLowerCase().trim();
      const isMathExpression = /[><=+\-*/()]/.test(query);
      
      const matched = universeList.map(stock => {
        const seed = getSymbolSeed(stock.symbol);
        const liveQuote = liveQuotesMap[stock.symbol];
        const closeVal = liveQuote?.close !== undefined ? liveQuote.close : (seed % 1200) + 150;
        const changeVal = liveQuote?.change !== undefined ? liveQuote.change : ((seed % 120) - 60) / 10;
        const openVal = liveQuote?.open !== undefined ? liveQuote.open : closeVal * (1 - changeVal / 100);
        const highVal = liveQuote ? liveQuote.high : Math.max(closeVal, openVal) * (1 + (seed % 15) / 1000);
        const lowVal = liveQuote ? liveQuote.low : Math.min(closeVal, openVal) * (1 - (seed % 15) / 1000);
        const volumeVal = liveQuote ? liveQuote.volume : (seed % 900000) + 100000;
        
        const rsi = liveQuote?.rsi !== undefined ? liveQuote.rsi : Math.min(Math.max(Math.round(50 + changeVal * 6), 10), 90);
        const adx = liveQuote?.adx !== undefined ? liveQuote.adx : Math.min(Math.max(Math.round(20 + Math.abs(changeVal) * 8), 10), 60);
        const supertrendVal = liveQuote?.supertrend !== undefined ? liveQuote.supertrend : (changeVal >= 0 
          ? (lowVal - (highVal - lowVal) * 1.5) 
          : (highVal + (highVal - lowVal) * 1.5));
        const fvgBullVal = liveQuote?.fvgBull !== undefined ? liveQuote.fvgBull : ((closeVal > openVal && (highVal - lowVal) > (closeVal * 0.02)) 
          ? (closeVal - openVal) * 0.3 
          : 0.0);
        const hasMacd = liveQuote?.hasMacd !== undefined ? liveQuote.hasMacd : changeVal > 0.5;
        const hasGoldenCross = liveQuote?.hasGoldenCross !== undefined ? liveQuote.hasGoldenCross : (closeVal > openVal && changeVal > 0.0);
        const hasVolumeSurge = liveQuote?.hasVolumeSurge !== undefined ? liveQuote.hasVolumeSurge : volumeVal > 1500000;

        const formattedPrice = `₹${closeVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formattedChange = `${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)}%`;

        // Fundamental Metrics
        const pe = parseFloat((10 + (seed % 65)).toFixed(1)); 
        const pb = parseFloat((1 + (seed % 15) * 0.8).toFixed(1)); 
        const evebitda = parseFloat((8 + (seed % 42)).toFixed(1)); 
        const debtequity = parseFloat(((seed % 180) / 100).toFixed(2)); 
        const currentratio = parseFloat((0.8 + (seed % 25) * 0.1).toFixed(2)); 
        const netprofitmargin = parseFloat((5 + (seed % 35)).toFixed(1)); 
        const roce = parseFloat((8 + (seed % 42)).toFixed(1)); 
        const roe = parseFloat((6 + (seed % 34)).toFixed(1)); 
        const profitgrowth = parseFloat((((seed % 60) - 15)).toFixed(1)); 
        const salesgrowth = parseFloat((((seed % 40) - 5)).toFixed(1)); 
        const promoterholding = parseFloat((30 + (seed % 45)).toFixed(1)); 
        const institutionholding = parseFloat((10 + (seed % 50)).toFixed(1)); 
        const pledgedshares = parseFloat(((seed % 120) < 15 ? (seed % 10) : 0).toFixed(1)); 

        // Derivative (F&O) Metrics
        const oi = (seed % 5000000) + 100000; 
        const oichange = parseFloat((((seed % 60) - 30)).toFixed(1)); 
        const oivector = parseFloat((((seed % 120) - 40)).toFixed(1)); 
        const vwap = parseFloat((closeVal * (0.997 + (seed % 6) * 0.001)).toFixed(2)); 
        const pcr = parseFloat((0.4 + (seed % 12) * 0.1).toFixed(2)); 
        const costofcarry = parseFloat((4 + (seed % 12)).toFixed(1)); 
        
        return {
          symbol: stock.symbol,
          company: stock.name,
          sector: stock.sector,
          price: formattedPrice,
          change: formattedChange,
          closeVal,
          openVal,
          highVal,
          lowVal,
          rsi,
          adx,
          volumeVal,
          supertrendVal,
          fvgBullVal,
          hasMacd,
          hasGoldenCross,
          hasVolumeSurge,
          rawChange: changeVal,
          pe,
          pb,
          evebitda,
          debtequity,
          currentratio,
          netprofitmargin,
          roce,
          roe,
          profitgrowth,
          salesgrowth,
          promoterholding,
          institutionholding,
          pledgedshares,
          oi,
          oichange,
          oivector,
          vwap,
          pcr,
          costofcarry
        };
      }).filter(stock => {
        if (isMathExpression) {
          return evaluateCustomExpression(query, stock);
        }

        // Conversational NLP matchers
        if (query.includes('rsi') && (query.includes('oversold') || query.includes('under') || query.includes('below') || query.includes('30'))) {
          return stock.rsi < 30;
        }
        if (query.includes('rsi') && (query.includes('overbought') || query.includes('above') || query.includes('70'))) {
          return stock.rsi > 70;
        }
        if (query.includes('macd') || query.includes('crossover')) {
          return stock.hasMacd;
        }
        if (query.includes('golden') || query.includes('cross') || query.includes('sma') || query.includes('ema')) {
          return stock.hasGoldenCross;
        }
        if (query.includes('volume') || query.includes('surge') || query.includes('spike')) {
          return stock.hasVolumeSurge;
        }
        if (query.includes('supertrend') && (query.includes('bullish') || query.includes('buy') || query.includes('above'))) {
          return stock.closeVal > stock.supertrendVal;
        }
        if (query.includes('adx') && (query.includes('strong') || query.includes('trend') || query.includes('25'))) {
          return stock.adx > 25;
        }
        if (query.includes('fvg') || query.includes('fair value gap') || query.includes('imbalance')) {
          return stock.fvgBullVal > 0;
        }
        if (query.includes('orb') || query.includes('opening range')) {
          return stock.closeVal > stock.openVal;
        }

        return stock.symbol.toLowerCase().includes(query) || 
               stock.company.toLowerCase().includes(query) || 
               stock.sector.toLowerCase().includes(query);
      });

      setResults(matched);
    } catch (err) {
      console.error("Live scanning failed:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Export filtered data directly to CSV format
  const handleExportCSV = () => {
    if (results.length === 0) {
      toast.error('No scan results to export');
      return;
    }
    const headers = [
      'Symbol', 'Company', 'Sector', 'Price', 'Change', 'Open', 'High', 'Low', 'Volume',
      'RSI', 'ADX', 'Supertrend', 'FVG Bullish', 'P/E', 'P/B', 'EV/EBITDA', 'Debt to Equity',
      'Current Ratio', 'Net Margin', 'ROCE', 'ROE', 'YoY Profit Growth', 'QoQ Profit Growth',
      'YoY Sales Growth', 'QoQ Sales Growth', 'Promoter Holding %', 'Inst Holding %',
      'Pledged Ratio %', 'Open Interest', 'OI Change %', 'PCR', 'Cost of Carry', 'VWAP'
    ];
    const rows = results.map(r => [
      r.symbol,
      `"${r.company}"`,
      r.sector,
      r.price.replace(/[^\d.]/g, ''),
      r.change.replace(/[^\d.+-]/g, ''),
      r.openVal,
      r.highVal,
      r.lowVal,
      r.volumeVal,
      r.rsi,
      r.adx,
      r.supertrendVal,
      r.fvgBullVal,
      r.pe,
      r.pb,
      r.evebitda,
      r.debtequity,
      r.currentratio,
      r.netprofitmargin,
      r.roce,
      r.roe,
      r.profitgrowth,
      r.qoqProfitGrowth || 0,
      r.salesgrowth,
      r.qoqSalesGrowth || 0,
      r.promoterholding,
      r.institutionholding,
      r.pledgedshares,
      r.oi,
      r.oichange,
      r.pcr,
      r.costofcarry,
      r.vwap
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sigmaspire_screener_active_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Successfully exported data to CSV');
  };

  // Click-to-Chart data loading simulation
  const handleRowClick = (stock: any) => {
    setActiveStockToken(stock);
    setChartLoading(true);
    
    // Simulate low-latency microservice timeseries fetch
    setTimeout(() => {
      const seed = getSymbolSeed(stock.symbol);
      const dataPoints = [];
      let currentVal = stock.closeVal;
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(Date.now() - (30 - i) * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        const dev = (seed % 8 - 4) + (Math.random() - 0.5) * (currentVal * 0.03);
        currentVal += dev;
        
        dataPoints.push({
          date,
          price: parseFloat(currentVal.toFixed(2)),
          ema9: parseFloat((currentVal * (1.004 + (seed % 3) / 1000)).toFixed(2)),
          ema21: parseFloat((currentVal * (0.992 - (seed % 4) / 1000)).toFixed(2)),
          supertrend: parseFloat((currentVal * (dev >= 0 ? 0.97 : 1.03)).toFixed(2)),
          rsi: Math.round(50 + (dev / currentVal) * 800)
        });
      }
      setChartData(dataPoints);
      setChartLoading(false);
    }, 600);
  };

  // Toggle watchlist inclusion state
  const handleToggleWatchlist = (e: React.MouseEvent, stock: any) => {
    e.stopPropagation();
    const isAlreadyAdded = watchlist.some(w => w.symbol === stock.symbol);
    if (isAlreadyAdded) {
      setWatchlist(prev => prev.filter(w => w.symbol !== stock.symbol));
      toast.info(`Removed ${stock.symbol} from watchlist`);
    } else {
      setWatchlist(prev => [...prev, stock]);
      toast.success(`Added ${stock.symbol} to watchlist`);
    }
  };

  const handleToggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) ? prev.filter(i => i !== indicator) : [...prev, indicator]
    );
  };

  return (
    <div className="relative flex min-h-full w-full bg-[#0D1117]">
      {/* Pinned main workspace view */}
      <div className="flex-1 p-8 max-w-5xl mx-auto h-full w-full transition-all duration-300">
        <div className={`bg-[#1C2128]/50 border rounded-xl overflow-hidden shadow-xl backdrop-blur-sm transition-colors ${
          historicalSnapshotTarget ? 'border-amber-500/40' : 'border-[#30363D]'
        }`}>
          
          {/* Header */}
          <div className={`px-6 py-4 flex items-center justify-between border-b bg-[#1F242C]/50 ${
            historicalSnapshotTarget ? 'border-amber-500/30' : 'border-[#30363D]'
          }`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={historicalSnapshotTarget ? 'text-amber-400' : 'text-cyan-400'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 className={`text-sm font-bold tracking-wider ${
                  historicalSnapshotTarget ? 'text-amber-400' : 'text-cyan-400'
                }`}>
                  MAGIC FILTERS
                </h3>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-[#0D1117] p-0.5 rounded border border-[#30363D] shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded transition-all ${
                    viewMode === 'single'
                      ? 'bg-[#30363D] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Single Scan
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('workspace')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded transition-all ${
                    viewMode === 'workspace'
                      ? 'bg-[#30363D] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Multi-Screener Canvas
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border transition-colors ${
                  isWatchlistOpen 
                    ? historicalSnapshotTarget 
                      ? 'bg-amber-500/10 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'bg-[#161B22] border-[#30363D] text-gray-400 hover:text-white hover:border-[#58A6FF]'
                }`}
              >
                <Bookmark size={12} />
                Watchlist ({watchlist.length})
              </button>
              
              {/* Time Travel Calendar Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border transition-colors ${
                    historicalSnapshotTarget
                      ? 'bg-amber-500/10 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-[#161B22] border-[#30363D] text-gray-400 hover:text-white hover:border-[#58A6FF]'
                  }`}
                >
                  <Calendar size={12} />
                  Time Travel {historicalSnapshotTarget ? '(Active)' : ''}
                </button>
                {showDatePicker && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#0D1117] border border-[#30363D] rounded-xl p-4 shadow-2xl z-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#21262D] pb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Clock size={12} className="text-amber-400" />
                        Time Travel Target
                      </span>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-gray-500 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Select Target Date</label>
                      <input
                        type="date"
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          if (tempDate) {
                            setHistoricalSnapshotTarget(tempDate);
                            setShowDatePicker(false);
                            toast.success(`Traveled back to ${tempDate}`);
                          } else {
                            toast.error('Please select a valid date');
                          }
                        }}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 text-[10px] font-bold py-1.5 rounded transition-all"
                      >
                        Set Date
                      </button>
                      <button
                        onClick={() => {
                          setHistoricalSnapshotTarget(null);
                          setTempDate('');
                          setShowDatePicker(false);
                          toast.info('Returned to real-time feed');
                        }}
                        className="bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-gray-300 text-[10px] font-bold py-1.5 px-3 rounded transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                historicalSnapshotTarget 
                  ? 'bg-amber-900/30 text-amber-400 border-amber-800/30'
                  : 'bg-cyan-900/30 text-cyan-400 border-cyan-800/30'
              }`}>
                {historicalSnapshotTarget ? 'HISTORICAL SNAPSHOT' : 'MATH ENGINE ENHANCED'}
              </span>
            </div>
          </div>

          {/* Input Area */}
          {viewMode === 'single' ? (
            <div className="px-6 py-6 border-b border-[#30363D]">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    placeholder="Type filters like 'rsi oversold' or math formulas like '(close - open) / (high - low) * 100 > 50'"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-cyan-400/50 transition-colors shadow-inner"
                  />
                </div>

                {/* Universe Scope Selector */}
                <div className="w-[180px] shrink-0">
                  <select
                    value={activeUniverseScope}
                    onChange={(e) => setActiveUniverseScope(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] text-white text-xs rounded-lg px-3 py-3 outline-none focus:border-cyan-400/50 cursor-pointer h-[46px] font-bold"
                  >
                    <option value="Nifty 50">Nifty 50 Scope</option>
                    <option value="Nifty 100">Nifty 100 Scope</option>
                    <option value="Nifty Midcap 100">Nifty Midcap 100</option>
                    <option value="Nifty 500">Nifty 500 (All)</option>
                    <option value="Only F&O Stocks">F&O Segment Only</option>
                    <option value="Custom Watchlist">Custom Watchlist</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsDeployModalOpen(true)}
                    disabled={results.length === 0}
                    className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white px-4 py-3 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2 h-[46px]"
                  >
                    <Rocket size={16} /> Deploy Strategy
                  </button>
                  <button 
                    onClick={handleScan}
                    disabled={isScanning || !prompt.trim()}
                    className="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-gray-900 px-6 py-3 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-2 h-[46px]"
                  >
                    {isScanning ? <span className="animate-pulse">Scanning...</span> : <><Sparkles size={16} className="fill-current" /> Generate & Scan</>}
                  </button>
                </div>
              </div>

              {/* Prompt Chips */}
              <div className="flex flex-wrap gap-2.5 mt-4">
                {[
                  'RSI oversold',
                  'supertrend buy',
                  '(close - open) / (high - low) * 100 > 50',
                  'close > supertrend and rsi < 40'
                ].map((chip) => (
                  <button 
                    key={chip}
                    onClick={() => { setPrompt(chip); }}
                    className="bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-gray-300 text-[11px] px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-mono"
                  >
                    {chip} <Navigation size={10} className="rotate-45" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Workspace Creator Form */
            <form onSubmit={handleCreateWidget} className="px-6 py-6 border-b border-[#30363D] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Screener Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. RSI Oversold Matrix"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Query Criteria (e.g. rsi &lt; 30)</label>
                  <input
                    type="text"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    placeholder="e.g. rsi < 40 or change > 1.5"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/50 transition-colors font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-cyan-400 hover:bg-cyan-300 text-gray-900 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-1.5 h-[38px] w-full"
                >
                  <Plus size={14} /> Add Screener Widget
                </button>
              </div>
            </form>
          )}
        </div>
      
      {/* Time Travel Warning Banner */}
      {historicalSnapshotTarget && (
        <div className="mt-8 bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <p className="text-xs text-amber-200">
              Viewing static market capture as of <span className="font-bold font-mono">{new Date(historicalSnapshotTarget).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </p>
          </div>
          <button 
            onClick={() => setHistoricalSnapshotTarget(null)}
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Return to Live
          </button>
        </div>
      )}
            {/* Results Area */}
      {viewMode === 'single' ? (
        isScanning ? (
          <div className={`mt-8 flex flex-col items-center justify-center py-20 ${historicalSnapshotTarget ? 'text-amber-400' : 'text-cyan-400'}`}>
            <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-4 ${historicalSnapshotTarget ? 'border-amber-400' : 'border-cyan-400'}`}></div>
            <p className="text-sm font-bold animate-pulse">AI is parsing "{prompt}" and querying broad market universe...</p>
          </div>
        ) : results.length > 0 ? (
          <div className={`mt-8 bg-[#1C2128]/50 border rounded-xl overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 ${
            historicalSnapshotTarget ? 'border-amber-500/40' : 'border-[#30363D]'
          }`}>
            
            {/* Table Action Header */}
            <div className={`px-6 py-4 border-b bg-[#21262D]/50 flex justify-between items-center ${
              historicalSnapshotTarget ? 'border-amber-500/30' : 'border-[#30363D]'
            }`}>
              <div>
                <h3 className="text-sm font-bold text-white">Scan Results ({results.length} found)</h3>
                <span className="text-[11px] text-gray-400">Match criteria: {prompt}</span>
              </div>
              
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md"
              >
                <Download size={13} />
                Export Data
              </button>
            </div>
            
            <div className="divide-y divide-[#30363D]">
              {results.map((r, i) => {
                const isActiveBse = activeExchanges[r.symbol] === 'BSE';
                let displayPrice = typeof r.price === 'number' ? r.price : r.closeVal;
                let displayChange = typeof r.change === 'number' ? r.change : r.rawChange;
                let displayOpen = r.openVal;
                let displayHigh = r.highVal;
                let displayLow = r.lowVal;
                
                // Real-time currency conversions, exchange mappings and simulation offsets
                if (isActiveBse) {
                  const seed = getSymbolSeed(r.symbol);
                  const multiplier = 0.998 + (Math.sin(seed) * 0.004);
                  displayPrice = displayPrice * multiplier;
                  displayOpen = displayOpen * multiplier;
                  displayHigh = displayHigh * multiplier;
                  displayLow = displayLow * multiplier;
                  displayChange = displayChange * 0.995;
                }

                const isBookmarked = watchlist.some(w => w.symbol === r.symbol);
                const displayPriceStr = displayPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
                const displayChangeStr = `${displayChange >= 0 ? '+' : ''}${displayChange.toFixed(2)}%`;
                
                return (
                  <motion.div 
                    key={r.symbol}
                    layoutId={`row-${r.symbol}`}
                    onClick={() => handleRowClick(r)}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#21262D]/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 min-w-[200px]">
                      {/* Star Bookmark Watchlist Hook */}
                      <button 
                        onClick={(e) => handleToggleWatchlist(e, r)}
                        className={`p-1 rounded hover:bg-[#30363D] transition-colors ${
                          isBookmarked ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
                        }`}
                      >
                        <Star size={14} className={isBookmarked ? 'fill-current' : ''} />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{r.symbol}</span>
                          
                          {/* NSE/BSE toggle badges */}
                          <div className="flex items-center bg-[#0D1117] rounded border border-[#30363D] p-0.5 overflow-hidden shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => setActiveExchanges(prev => ({ ...prev, [r.symbol]: 'NSE' }))}
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                                !isActiveBse ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              NSE
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveExchanges(prev => ({ ...prev, [r.symbol]: 'BSE' }))}
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                                isActiveBse ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              BSE
                            </button>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">{r.name}</span>
                      </div>
                    </div>
                    
                    {/* Technical Parameter Details */}
                    <div className="hidden md:flex items-center gap-8 text-xs text-gray-400 font-mono">
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-mono">RSI (14)</span>
                        <span className={r.rsi > 70 ? 'text-orange-400' : r.rsi < 30 ? 'text-cyan-400' : 'text-gray-300'}>
                          {r.rsi}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-mono">P/E Ratio</span>
                        <span className="text-gray-300">{r.pe || '24.5'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-mono">OI Chg %</span>
                        <span className={`font-bold ${r.oichange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {r.oichange >= 0 ? '+' : ''}{(r.oichange || 2.5).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-sm text-white font-mono">{displayPriceStr}</p>
                        <p className={`text-xs ${displayChange.toString().startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{displayChangeStr}</p>
                      </div>
                      
                      {/* Navigation redirect button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/dashboard/charts?symbol=${r.symbol}`;
                        }}
                        title="Open full page Live Chart"
                        className="p-1.5 rounded hover:bg-[#21262D] text-gray-500 hover:text-cyan-400 transition-colors"
                      >
                        <Maximize2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : hasScanned ? (
          <div className="mt-8 flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-sm">0 results found for "{prompt}". Try modifying your scan criteria.</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center py-20 text-gray-500">
            <Sparkles size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Enter a magic prompt to scan the broad market universe.</p>
          </div>
        )
      ) : (
        /* Workspace Multi-Screener Grid */
        <div className="mt-8">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {widgets.map(w => {
                const sizeClass = w.layoutSize === 'large' 
                  ? 'col-span-1 md:col-span-2 lg:col-span-3' 
                  : w.layoutSize === 'medium' 
                    ? 'col-span-1 md:col-span-2' 
                    : 'col-span-1';

                return (
                  <motion.div 
                    key={w.id}
                    layoutId={w.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.05}
                    whileDrag={{ scale: 1.02, zIndex: 10, cursor: 'grabbing' }}
                    className={`bg-[#161B22]/50 border border-[#30363D] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[420px] transition-colors hover:border-[#58A6FF]/40 ${sizeClass}`}
                  >
                    {/* Widget Header */}
                    <div className="px-5 py-3.5 bg-[#1F242C]/40 border-b border-[#30363D] flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${w.isPolling ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                          {w.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">{w.query} ({w.timeframe})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Size selectors */}
                        <div className="bg-[#0D1117] p-0.5 rounded border border-[#30363D] flex items-center gap-0.5">
                          <button 
                            type="button"
                            onClick={() => handleResizeWidget(w.id, 'small')}
                            title="Small Width"
                            className={`p-1 rounded text-[10px] font-bold ${w.layoutSize === 'small' ? 'bg-[#30363D] text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            1x
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleResizeWidget(w.id, 'medium')}
                            title="Medium Width"
                            className={`p-1 rounded text-[10px] font-bold ${w.layoutSize === 'medium' ? 'bg-[#30363D] text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            2x
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleResizeWidget(w.id, 'large')}
                            title="Full Width"
                            className={`p-1 rounded text-[10px] font-bold ${w.layoutSize === 'large' ? 'bg-[#30363D] text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            3x
                          </button>
                        </div>

                        <button 
                          type="button"
                          onClick={() => handleTogglePolling(w.id)}
                          className={`p-1.5 rounded border transition-colors ${w.isPolling ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-[#0D1117] border-[#30363D] text-gray-400 hover:text-white'}`}
                          title={w.isPolling ? 'Disable Auto-Refresh' : 'Enable 15s Auto-Refresh'}
                        >
                          <RefreshCw size={12} className={w.isPolling ? 'animate-spin' : ''} />
                        </button>

                        <button 
                          type="button"
                          onClick={() => handleExportWidgetCSV(w)}
                          className="p-1.5 rounded bg-[#0D1117] border border-[#30363D] text-gray-400 hover:text-white transition-colors"
                          title="Export CSV"
                        >
                          <Download size={12} />
                        </button>

                        <button 
                          type="button"
                          onClick={() => handleRemoveWidget(w.id)}
                          className="p-1.5 rounded bg-[#0D1117] border border-[#30363D] text-gray-500 hover:text-red-400 hover:border-red-500/40 transition-colors"
                          title="Delete Widget"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Widget Content/Table */}
                    <div className="flex-1 overflow-auto bg-[#0D1117]/20">
                      {w.isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center py-10">
                          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span className="text-[10px] text-gray-500 font-mono animate-pulse">Scanning criteria...</span>
                        </div>
                      ) : !w.results || w.results.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-10 text-gray-500">
                          <span className="text-xs">No matching scanner results found</span>
                        </div>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="sticky top-0 bg-[#161B22] border-b border-[#30363D] text-gray-400 text-[10px] uppercase font-mono">
                              <th className="px-4 py-2.5 w-10">Add</th>
                              <th className="px-4 py-2.5">Symbol</th>
                              <th className="px-4 py-2.5 text-right">Price</th>
                              <th className="px-4 py-2.5 text-right">Change</th>
                              <th className="px-4 py-2.5 text-right">RSI (14)</th>
                              <th className="px-4 py-2.5 text-right">P/E</th>
                              <th className="px-4 py-2.5 text-right">OI Chg</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#21262D]">
                            {w.results.map((r: any) => {
                              const isBookmarked = watchlist.some(item => item.symbol === r.symbol);
                              return (
                                <tr 
                                  key={r.symbol}
                                  onClick={() => handleRowClick(r)}
                                  className="hover:bg-[#21262D]/60 transition-colors group cursor-pointer"
                                >
                                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.85 }}
                                      onClick={(e) => handleToggleWatchlist(e, r)}
                                      className={`p-1 rounded transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                                    >
                                      <Star size={14} className={isBookmarked ? 'fill-current' : ''} />
                                    </motion.button>
                                  </td>
                                  <td className="px-4 py-3 font-bold text-white">
                                    <div>
                                      <span>{r.symbol}</span>
                                      <span className="block text-[10px] text-gray-500 font-normal truncate max-w-[120px]">{r.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono text-white">₹{r.closeVal.toFixed(2)}</td>
                                  <td className={`px-4 py-3 text-right font-mono font-bold ${r.rawChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {r.rawChange >= 0 ? '+' : ''}{r.rawChange.toFixed(2)}%
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono">
                                    <span className={r.rsi > 70 ? 'text-orange-400' : r.rsi < 30 ? 'text-cyan-400' : 'text-gray-300'}>
                                      {r.rsi}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono text-gray-300">
                                    {r.pe || '24.5'}
                                  </td>
                                  <td className={`px-4 py-3 text-right font-mono font-bold ${r.oichange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {r.oichange >= 0 ? '+' : ''}{(r.oichange || 2.5).toFixed(1)}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
      </div>

      {/* Watchlist Slide-out Drawer Panel */}
      <AnimatePresence>
        {isWatchlistOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWatchlistOpen(false)}
              className="fixed inset-0 bg-black z-30 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: 350, opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-[340px] bg-[#161B22] border-l border-[#30363D] z-40 p-6 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#30363D] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <h3 className="text-sm font-bold text-white tracking-wider">LIVE WATCHLIST</h3>
                </div>
                <button 
                  onClick={() => setIsWatchlistOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#21262D] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {watchlist.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-10">
                  <Star size={36} className="mb-3 opacity-20" />
                  <p className="text-xs text-center">Your watchlist is currently empty. Bookmark stocks from the scan results.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  <AnimatePresence initial={false}>
                    {watchlist.map(stock => (
                      <motion.div 
                        key={stock.symbol}
                        layoutId={`watchlist-item-${stock.symbol}`}
                        onClick={() => handleRowClick(stock)}
                        className="bg-[#0D1117] border border-[#30363D] hover:border-[#58A6FF]/40 rounded-xl p-3.5 flex justify-between items-center cursor-pointer group transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs bg-[#21262D] text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">{stock.symbol}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{stock.sector}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 truncate max-w-[150px]">{stock.company}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">{stock.price}</p>
                            <p className={`text-[10px] ${stock.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{stock.change}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWatchlist(prev => prev.filter(w => w.symbol !== stock.symbol));
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 rounded hover:bg-[#21262D] transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <div className="border-t border-[#30363D] pt-4 mt-auto">
                <button
                  onClick={() => {
                    setWatchlist([]);
                    toast.success("Watchlist cleared");
                  }}
                  disabled={watchlist.length === 0}
                  className="w-full bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-400 py-2.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Watchlist
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {activeStockToken && (
        <ClickToChartModal
          isOpen={!!activeStockToken}
          onClose={() => setActiveStockToken(null)}
          ticker={activeStockToken.symbol}
          exchange={activeStockToken.exchange || 'NSE'}
          activeIndicators={
            activeIndicators.includes('EMA Trend Cross')
              ? [
                  {
                    id: 'ema',
                    name: 'EMA Trend',
                    type: 'MA' as const,
                    color: '#EAB308',
                    calculate: (data) =>
                      data.map((d, i) => {
                        let sum = 0;
                        const count = Math.min(i + 1, 9);
                        for (let j = 0; j < count; j++) {
                          sum += data[i - j]!.close;
                        }
                        return { time: d.time, value: sum / count };
                      }),
                  },
                ]
              : []
          }
        />
      )}
      <DeployStrategyModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        strategyName="Magic Scanner Config"
        sourceModule="magic_scanner"
        strategyData={{ prompt, filterLogic: null /* compile if needed */ }}
      />
    </div>
  );
}

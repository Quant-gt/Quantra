"use client";

import { CheckSquare, Square, X, Plus, Zap, Activity, Cpu, Loader2, Save, Search, ChevronDown, Rocket } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import BacktestModal from './BacktestModal';
import { DeployStrategyModal } from './DeployStrategyModal';
import OptionsBuilder, { Instrument, Leg } from './OptionsBuilder';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useScreener } from '@/context/ScreenerContext';
import { Calendar, Clock, Globe } from 'lucide-react';
import { SentenceBuilder, SentenceConditionBlock } from './SentenceBuilder';

const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy' },
  { symbol: 'NIFTY', name: 'Nifty 50 Index', sector: 'Indices' },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', sector: 'Indices' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', sector: 'Technology' },
  { symbol: 'INFOSYS', name: 'Infosys Ltd.', sector: 'Technology' },
  { symbol: 'IBM', name: 'International Business Machines', sector: 'Technology' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Financial Services' },
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

type ConditionBlock = SentenceConditionBlock;

function TimeTravelPicker() {
  const { historicalSnapshotTarget, setHistoricalSnapshotTarget } = useScreener();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historicalSnapshotTarget) {
      const d = new Date(historicalSnapshotTarget);
      const pad = (n: number) => n.toString().padStart(2, '0');
      setInputVal(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    } else {
      setInputVal('');
    }
  }, [historicalSnapshotTarget]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    if (!inputVal) {
      setHistoricalSnapshotTarget(null);
      toast.info("Returned to live trading stream");
    } else {
      const iso = new Date(inputVal).toISOString();
      setHistoricalSnapshotTarget(iso);
      toast.success(`Time Travel Target: ${new Date(iso).toLocaleString()}`);
    }
    setIsOpen(false);
  };

  const setPreset = (daysAgo: number, hour: number, minute: number, isFixedDate?: string) => {
    let target: Date;
    if (isFixedDate) {
      target = new Date(isFixedDate);
    } else {
      target = new Date();
      target.setDate(target.getDate() - daysAgo);
      target.setHours(hour, minute, 0, 0);
    }
    const iso = target.toISOString();
    setHistoricalSnapshotTarget(iso);
    toast.success(`Time Travel Target: ${target.toLocaleString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border text-xs font-bold rounded-md px-3 py-2 outline-none flex items-center justify-between cursor-pointer transition-all h-[38px] ${
          historicalSnapshotTarget 
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            : 'bg-[#0D1117] border-[#30363D] hover:border-[#2EA043]/50 text-emerald-400'
        }`}
      >
        <span className="flex items-center gap-1.5 truncate">
          <Clock size={12} className={historicalSnapshotTarget ? 'animate-pulse' : ''} />
          {historicalSnapshotTarget 
            ? new Date(historicalSnapshotTarget).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
            : 'Live Production (Running)'
          }
        </span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-1.5 w-72 bg-[#161B22] border border-[#30363D] rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-1">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono block mb-1.5">Target Timestamp</span>
              <input 
                type="datetime-local" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#58A6FF]"
              />
            </div>

            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono block mb-2">Preset Snapshots</span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const day = d.getDay();
                    const diff = day === 0 ? 2 : day === 6 ? 1 : 0;
                    d.setDate(d.getDate() - diff);
                    d.setHours(15, 30, 0, 0);
                    setPreset(0, 15, 30, d.toISOString());
                  }}
                  className="w-full text-left bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] text-[11px] text-gray-300 rounded px-2.5 py-1.5 transition-colors"
                >
                  Previous Market Close (3:30 PM)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(7, 9, 15)}
                  className="w-full text-left bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] text-[11px] text-gray-300 rounded px-2.5 py-1.5 transition-colors"
                >
                  1 Week Ago Open (9:15 AM)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(0, 11, 0, '2026-02-01T11:00:00')}
                  className="w-full text-left bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] text-[11px] text-gray-300 rounded px-2.5 py-1.5 transition-colors"
                >
                  Union Budget Day 2026 (11:00 AM)
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#30363D]">
              <button
                type="button"
                onClick={() => {
                  setHistoricalSnapshotTarget(null);
                  setIsOpen(false);
                  toast.info("Returned to live stream");
                }}
                className="flex-1 bg-transparent hover:bg-red-950/20 text-red-400 border border-red-900/30 py-1.5 rounded text-xs font-bold transition-colors"
              >
                Reset Live
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-gray-900 py-1.5 rounded text-xs font-bold transition-colors shadow-md animate-pulse"
              >
                Apply Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlockBuilder() {
  const { historicalSnapshotTarget, activeUniverseScope, setActiveUniverseScope } = useScreener();
  const [buyEnabled, setBuyEnabled] = useState(true);
  const [sellEnabled, setSellEnabled] = useState(true);
  const [isBacktestModalOpen, setIsBacktestModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [strategyId, setStrategyId] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  useEffect(() => {
    const loadCreds = async () => {
      try {
        const res = await fetch('/api/v1/onboarding/load');
        if (res.ok) {
          const data = await res.json();
          const config = data.preferences?.broker_config;
          if (config) {
            setApiKey(config.app_key || config.app_secret || '••••••••••••');
            setApiSecret(config.api_secret || '••••••••••••');
          }
        }
      } catch (err) {
        console.error("Failed to load credentials:", err);
      }
    };
    loadCreds();
  }, []);

  const saveBrokerCredentials = async (key: string, secret: string) => {
    try {
      const loadRes = await fetch('/api/v1/onboarding/load');
      let currentPrefs: any = {};
      if (loadRes.ok) {
        const loadData = await loadRes.json();
        currentPrefs = loadData.preferences || {};
      }
      
      const newBrokerConfig = {
        ...(currentPrefs.broker_config || {}),
        broker: 'kite',
        ...(key && key !== '••••••••••••' ? { app_key: key } : {}),
        ...(secret && secret !== '••••••••••••' ? { api_secret: secret } : {})
      };
      
      const saveRes = await fetch('/api/v1/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: 3,
          data: {
            ...currentPrefs,
            broker_config: newBrokerConfig
          }
        })
      });
      
      if (saveRes.ok) {
        toast.success("Broker credentials updated successfully!");
      }
    } catch (err) {
      console.error("Failed to save broker credentials:", err);
      toast.error("Failed to update broker credentials");
    }
  };

  // Strategy Metadata
  const [strategyName, setStrategyName] = useState('Dual Block Strategy');
  const [symbol, setSymbol] = useState('RELIANCE');
  const [timeframe, setTimeframe] = useState('1d');
  const [baseQty, setBaseQty] = useState(100);

  // Searchable stock dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicResults, setDynamicResults] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchAPI = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setDynamicResults([]);
      return;
    }
    setIsSearchLoading(true);
    try {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(queryStr)}`);
      const data = await res.json();
      if (data.results) {
        setDynamicResults(data.results.map((r: any) => ({
          symbol: r.symbol,
          name: r.name,
          sector: r.exchange || 'EQUITY'
        })));
      }
    } catch (err) {
      console.error("Failed to query stock search API", err);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setDynamicResults([]);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAPI(val);
    }, 400);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Logical Operators
  const [buyOperator, setBuyOperator] = useState<'AND' | 'OR'>('AND');
  const [sellOperator, setSellOperator] = useState<'AND' | 'OR'>('AND');

  // Condition blocks lists
  const [buyBlocks, setBuyBlocks] = useState<ConditionBlock[]>([
    { id: '1', offset: 'Latest', indicator: 'Close Price', comparison: 'Greater Than', valueType: 'Number', value: '100' }
  ]);

  const [sellBlocks, setSellBlocks] = useState<ConditionBlock[]>([
    { id: '1', offset: 'Latest', indicator: 'RSI', period: '14', comparison: 'Greater Than', valueType: 'Number', value: '70' }
  ]);

  // Lifted OptionsBuilder states
  const [buyInstrument, setBuyInstrument] = useState<Instrument>('EQUITY');
  const [buyLegs, setBuyLegs] = useState<Leg[]>([
    { id: '1', action: 'BUY', type: 'CALL', strike: 'ATM', expiry: 'Current Week', qty: 1 }
  ]);

  const [sellInstrument, setSellInstrument] = useState<Instrument>('EQUITY');
  const [sellLegs, setSellLegs] = useState<Leg[]>([
    { id: '1', action: 'SELL', type: 'CALL', strike: 'ATM', expiry: 'Current Week', qty: 1 }
  ]);

  const addBuyBlock = () => {
    const newId = Date.now().toString();
    setBuyBlocks([
      ...buyBlocks,
      { id: newId, offset: 'Latest', indicator: 'Close Price', comparison: 'Greater Than', valueType: 'Number', value: '100' }
    ]);
    toast.success("Added new Buy indicator condition block");
  };

  const removeBuyBlock = (id: string) => {
    if (buyBlocks.length <= 1) {
      toast.error("At least one Buy condition block is required");
      return;
    }
    setBuyBlocks(buyBlocks.filter(b => b.id !== id));
  };

  const updateBuyBlock = (id: string, field: keyof ConditionBlock, value: any) => {
    setBuyBlocks(buyBlocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const addSellBlock = () => {
    const newId = Date.now().toString();
    setSellBlocks([
      ...sellBlocks,
      { id: newId, offset: 'Latest', indicator: 'RSI', period: '14', comparison: 'Greater Than', valueType: 'Number', value: '70' }
    ]);
    toast.success("Added new Sell indicator condition block");
  };

  const removeSellBlock = (id: string) => {
    if (sellBlocks.length <= 1) {
      toast.error("At least one Sell condition block is required");
      return;
    }
    setSellBlocks(sellBlocks.filter(b => b.id !== id));
  };

  const updateSellBlock = (id: string, field: keyof ConditionBlock, value: any) => {
    setSellBlocks(sellBlocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to save strategies.");
      }

      const logicGraph = {
        type: 'block',
        buyOperator,
        buyBlocks,
        buyInstrument,
        buyLegs,
        buyEnabled,
        sellOperator,
        sellBlocks,
        sellInstrument,
        sellLegs,
        sellEnabled,
        symbol,
        timeframe,
        baseQty
      };

      if (strategyId) {
        // Update existing strategy
        const { error } = await supabase
          .from('strategies')
          .update({
            name: strategyName,
            logic_graph: logicGraph as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', strategyId);

        if (error) throw error;
        toast.success("Strategy updated successfully!");
        return strategyId;
      } else {
        // Insert new strategy
        const { data, error } = await supabase
          .from('strategies')
          .insert({
            creator_id: session.user.id,
            name: strategyName,
            logic_graph: logicGraph as any,
            status: 'draft'
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setStrategyId(data.id);
          toast.success("Strategy saved successfully!");
          return data.id;
        }
      }
    } catch (err: any) {
      console.error("Save strategy error:", err);
      toast.error(err.message || "Failed to save strategy.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const launchTrading = async () => {
    setLoading(true);
    try {
      let currentStrategyId = strategyId;
      // Automatically save latest changes
      const savedId = await handleSave();
      if (!savedId) {
        throw new Error("Failed to save strategy configuration before launching.");
      }
      currentStrategyId = savedId;

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const userId = session?.user?.id || 'ef748ee3-b611-45da-8ca5-968bc9f3337d';

      const res = await fetch('/api/v1/execute/fanout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          creator_id: userId,
          strategy_id: currentStrategyId,
          symbol: symbol,
          action: 'BUY',
          base_qty: baseQty
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Execution engine failed");
      }
      
      toast.success(`🚀 Fan-Out Execution: ${data.message || 'Launched successfully'} (${data.executions || 0} subscriber accounts fired)`);
    } catch (e: any) {
      toast.error(e.message || 'Backend execution engine is not running or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col w-full">
      {/* Strategy Configuration Header */}
      <div className={`bg-[#161B22] border rounded-xl p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg transition-colors ${
        historicalSnapshotTarget ? 'border-amber-500/40' : 'border-[#30363D]'
      }`}>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Cpu size={20} className="text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Strategy Name</label>
            <input 
              type="text" 
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              className="bg-transparent text-base font-bold text-white outline-none border-b border-transparent hover:border-[#30363D] focus:border-[#58A6FF] transition-colors pb-0.5 w-full md:w-64"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex-1 min-w-[120px] relative" ref={dropdownRef}>
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Target Symbol</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#0D1117] border border-[#30363D] hover:border-[#8B5CF6]/50 text-white text-sm rounded-md px-3 py-2 outline-none focus:border-[#58A6FF] flex items-center justify-between cursor-pointer transition-colors h-[38px]"
            >
              <span className="truncate">
                {symbol}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-[#161B22] border border-[#30363D] rounded-md shadow-2xl overflow-hidden flex flex-col max-h-64 animate-in fade-in slide-in-from-top-1 w-[260px] md:w-[300px]">
                {/* Search Input Bar */}
                <div className="p-2 border-b border-[#30363D] flex items-center gap-2 bg-[#0D1117]">
                  <Search size={14} className="text-gray-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-transparent text-white text-xs outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setDynamicResults([]);
                      }}
                      className="text-gray-500 hover:text-gray-300"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Scrollable list */}
                <div className="overflow-y-auto flex-1 divide-y divide-[#21262D]">
                  {isSearchLoading ? (
                    <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                      <Loader2 size={12} className="animate-spin text-[#58A6FF]" />
                      <span>Searching cash segment...</span>
                    </div>
                  ) : (
                    (() => {
                      const list = searchQuery.trim() === '' ? STOCK_UNIVERSE : (() => {
                        const localMatches = STOCK_UNIVERSE.filter(stock => 
                          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        const combined = [...localMatches];
                        const existingSymbols = new Set(combined.map(s => s.symbol));
                        for (const r of dynamicResults) {
                          if (!existingSymbols.has(r.symbol)) {
                            combined.push(r);
                            existingSymbols.add(r.symbol);
                          }
                        }
                        return combined;
                      })();

                      if (list.length > 0) {
                        return list.map((stock) => (
                          <button
                            key={stock.symbol}
                            type="button"
                            onClick={() => {
                              setSymbol(stock.symbol);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                              setDynamicResults([]);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-[#30363D]/40 transition-colors flex items-center justify-between ${
                              symbol === stock.symbol ? 'bg-[#30363D]/20 text-[#58A6FF]' : 'text-gray-300'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="font-bold text-white block text-left">{stock.symbol}</span>
                              <span className="text-[10px] text-gray-500 block truncate text-left">{stock.name}</span>
                            </div>
                            <span className="text-[8px] shrink-0 bg-[#21262D] text-gray-400 px-1.5 py-0.5 rounded font-mono uppercase">
                              {stock.sector}
                            </span>
                          </button>
                        ));
                      } else {
                        return (
                          <div className="p-4 text-center text-xs text-gray-500">
                            No stocks found matching "{searchQuery}"
                          </div>
                        );
                      }
                    })()
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-[100px]">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-[#58A6FF] cursor-pointer"
            >
              <option value="1m">1 min</option>
              <option value="5m">5 min</option>
              <option value="15m">15 min</option>
              <option value="1h">1 hour</option>
              <option value="1d">1 day</option>
            </select>
          </div>

          <div className="flex-1 min-w-[100px]">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Base Quantity</label>
            <input
              type="number"
              value={baseQty}
              onChange={(e) => setBaseQty(Number(e.target.value))}
              min={1}
              className="w-full bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-[#58A6FF]"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Universe Scope</label>
            <select
              value={activeUniverseScope}
              onChange={(e) => setActiveUniverseScope(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-[#58A6FF] cursor-pointer h-[38px] font-bold"
            >
              <option value="Nifty 50">Nifty 50 Scope</option>
              <option value="Nifty 100">Nifty 100 Scope</option>
              <option value="Nifty Midcap 100">Nifty Midcap 100</option>
              <option value="Nifty 500">Nifty 500 (All)</option>
              <option value="Only F&O Stocks">F&O Segment Only</option>
              <option value="Custom Watchlist">Custom Watchlist</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Time Travel Engine</label>
            <TimeTravelPicker />
          </div>
        </div>
      </div>

      <div className="bg-[#1C2128] rounded-xl border border-[#30363D] overflow-hidden shadow-2xl flex flex-col">
        {/* Title */}
        <div className="px-6 py-5 border-b border-[#30363D]">
          <h2 className="text-lg font-bold text-white">Dual Strategy Automation Builder</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          {/* BUY PIPELINE */}
          <div className={`rounded-xl border ${buyEnabled ? 'border-[#238636]/50 bg-[#238636]/5' : 'border-[#30363D] bg-[#0D1117]'} p-5 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setBuyEnabled(!buyEnabled)}
              >
                {buyEnabled ? (
                  <CheckSquare className="text-[#39D353]" size={20} />
                ) : (
                  <Square className="text-gray-500" size={20} />
                )}
                <h3 className={`font-bold ${buyEnabled ? 'text-[#39D353]' : 'text-gray-500'}`}>▼ WHEN (Buy Pipeline)</h3>
              </div>
              
              <div className="flex items-center gap-4">
                {buyEnabled && buyBlocks.length > 1 && (
                  <div className="flex items-center bg-[#0D1117] rounded-md p-0.5 border border-[#30363D]">
                    <button 
                      onClick={() => setBuyOperator('AND')}
                      className={`px-2 py-1 text-xs font-bold rounded ${buyOperator === 'AND' ? 'bg-[#30363D] text-[#39D353]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ALL (AND)
                    </button>
                    <button 
                      onClick={() => setBuyOperator('OR')}
                      className={`px-2 py-1 text-xs font-bold rounded ${buyOperator === 'OR' ? 'bg-[#30363D] text-[#39D353]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ANY (OR)
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-300">Allocation per trade: ₹</span>
                  <input 
                    type="text" 
                    defaultValue="10000"
                    disabled={!buyEnabled}
                    className="bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-1 w-24 outline-none focus:border-[#58A6FF] disabled:opacity-50"
                  />
                </div>
                <button 
                  onClick={addBuyBlock}
                  disabled={!buyEnabled}
                  className="bg-[#21262D] hover:bg-[#30363D] text-gray-300 text-xs font-bold py-1.5 px-3 rounded-md border border-[#30363D] flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} /> Block
                </button>
              </div>
            </div>

            {/* Condition Blocks List */}
            <div className={`space-y-4 ${!buyEnabled && 'opacity-50 pointer-events-none'}`}>
              <SentenceBuilder
                blocks={buyBlocks}
                onChange={setBuyBlocks}
                onAddBlock={addBuyBlock}
                onRemoveBlock={removeBuyBlock}
              />
            </div>

            {/* Action Block - Advanced Derivatives Configurator */}
            <div className={`mt-4 ${!buyEnabled && 'opacity-50 pointer-events-none'}`}>
              <OptionsBuilder 
                actionType="BUY" 
                instrument={buyInstrument}
                setInstrument={setBuyInstrument}
                legs={buyLegs}
                setLegs={setBuyLegs}
              />
            </div>
          </div>

          {/* SELL PIPELINE */}
          <div className={`rounded-xl border ${sellEnabled ? 'border-red-500/50 bg-red-500/5' : 'border-[#30363D] bg-[#0D1117]'} p-5 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setSellEnabled(!sellEnabled)}
              >
                {sellEnabled ? (
                  <CheckSquare className="text-red-400" size={20} />
                ) : (
                  <Square className="text-gray-500" size={20} />
                )}
                <h3 className={`font-bold ${sellEnabled ? 'text-red-400' : 'text-gray-500'}`}>▼ WHEN (Sell Pipeline)</h3>
              </div>
              
              <div className="flex items-center gap-4">
                {sellEnabled && sellBlocks.length > 1 && (
                  <div className="flex items-center bg-[#0D1117] rounded-md p-0.5 border border-[#30363D]">
                    <button 
                      onClick={() => setSellOperator('AND')}
                      className={`px-2 py-1 text-xs font-bold rounded ${sellOperator === 'AND' ? 'bg-[#30363D] text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ALL (AND)
                    </button>
                    <button 
                      onClick={() => setSellOperator('OR')}
                      className={`px-2 py-1 text-xs font-bold rounded ${sellOperator === 'OR' ? 'bg-[#30363D] text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ANY (OR)
                    </button>
                  </div>
                )}

                <button 
                  onClick={addSellBlock}
                  disabled={!sellEnabled}
                  className="bg-[#21262D] hover:bg-[#30363D] text-gray-300 text-xs font-bold py-1.5 px-3 rounded-md border border-[#30363D] flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} /> Block
                </button>
              </div>
            </div>
            
            {sellEnabled && (
              <>
                {/* Condition Blocks List */}
                <div className="space-y-4">
                  <SentenceBuilder
                    blocks={sellBlocks}
                    onChange={setSellBlocks}
                    onAddBlock={addSellBlock}
                    onRemoveBlock={removeSellBlock}
                  />
                </div>

                {/* Action Block - Advanced Derivatives Configurator */}
                <div className="mt-4">
                  <OptionsBuilder 
                    actionType="SELL" 
                    instrument={sellInstrument}
                    setInstrument={setSellInstrument}
                    legs={sellLegs}
                    setLegs={setSellLegs}
                  />
                </div>
              </>
            )}
          </div>

          {/* Broker Auth Box */}
          <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 mt-2">
            <h4 className="text-sm font-bold text-gray-300 mb-4">Broker Interface Authentication (Kite / Breeze)</h4>
            
            <div className="flex gap-6 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#58A6FF] mb-2">API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onBlur={() => saveBrokerCredentials(apiKey, apiSecret)}
                  placeholder="Enter API Key"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2 text-white outline-none focus:border-[#58A6FF]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#58A6FF] mb-2">API Secret</label>
                <input 
                  type="password" 
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  onBlur={() => saveBrokerCredentials(apiKey, apiSecret)}
                  placeholder="Enter API Secret"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2 text-white outline-none focus:border-[#58A6FF]"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Your keys are stored securely offline in 'algo_api_key' cache. The automated strategy will use them to place live trades on signals.
            </p>
          </div>

        </div>

        <div className="px-6 py-5 border-t border-[#30363D] bg-[#0B0F19] flex justify-end gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Strategy
          </button>
          
          <button 
            onClick={() => setIsDeployModalOpen(true)}
            className="bg-[#238636] hover:bg-[#2ea043] text-white border border-[#30363D] px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            <Rocket size={16} /> Deploy Strategy
          </button>

          <button 
            onClick={async () => {
              const latestId = await handleSave();
              if (latestId) {
                setIsBacktestModalOpen(true);
              }
            }}
            className="bg-transparent border border-[#6366F1] hover:bg-[#6366F1]/10 text-[#6366F1] px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            <Activity size={16} /> Run Backtest
          </button>
          
          <button 
            onClick={launchTrading}
            disabled={loading}
            className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Zap size={16} className="fill-current" /> {loading ? "Launching..." : "Launch Automated Trading"}
          </button>
        </div>
      </div>
      <BacktestModal 
        isOpen={isBacktestModalOpen} 
        onClose={() => setIsBacktestModalOpen(false)} 
        strategyId={strategyId || ""} 
      />
      <DeployStrategyModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        strategyName={strategyName || "Block Strategy"}
        sourceModule="block_builder"
        strategyData={{ buyBlocks, sellBlocks, buyOperator, sellOperator }}
      />
    </div>
  );
}

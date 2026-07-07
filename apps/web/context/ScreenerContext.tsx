import React, { createContext, useContext, useState, useEffect } from 'react';

interface StockRow {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  matrixValues: Record<string, number | string>;
}

interface ScreenerContextType {
  activeStockToken: string | null;
  setActiveStockToken: (token: string | null) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  activeIndicators: string[];
  setActiveIndicators: (indicators: string[]) => void;
  isChartOpen: boolean;
  setIsChartOpen: (open: boolean) => void;
  historicalSnapshotTarget: string | null;
  setHistoricalSnapshotTarget: (target: string | null) => void;
  activeUniverseScope: string;
  setActiveUniverseScope: (scope: string) => void;
}

const ScreenerContext = createContext<ScreenerContextType | undefined>(undefined);

export const ScreenerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStockToken, setActiveStockToken] = useState<string | null>(null);
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['SMA_20', 'RSI_14']);
  const [historicalSnapshotTarget, setHistoricalSnapshotTarget] = useState<string | null>(null);
  const [activeUniverseScope, setActiveUniverseScope] = useState<string>('Nifty 50');

  // Hydrate watchlist from localStorage on client-side mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('quantra_watchlist');
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, []);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem('quantra_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ScreenerContext.Provider value={{
      activeStockToken, setActiveStockToken,
      watchlist, toggleWatchlist,
      activeIndicators, setActiveIndicators,
      isChartOpen, setIsChartOpen,
      historicalSnapshotTarget, setHistoricalSnapshotTarget,
      activeUniverseScope, setActiveUniverseScope
    }}>
      {children}
    </ScreenerContext.Provider>
  );
};

export const useScreener = () => {
  const context = useContext(ScreenerContext);
  if (!context) throw new Error('useScreener must be used within a ScreenerProvider');
  return context;
};

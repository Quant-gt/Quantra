"use client";

import React, { memo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

function TVChart({ symbol, interval = "D" }: { symbol: string, interval?: string }) {
  // Ensure the symbol is properly formatted for TradingView (usually BSE:SYMBOL)
  const tvSymbol = symbol.includes(":") || symbol.includes(".") ? symbol : `BSE:${symbol}`;

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <AdvancedRealTimeChart 
        symbol={tvSymbol}
        theme="dark"
        autosize
        interval={interval as any}
        timezone="Asia/Kolkata"
        style="1"
        locale="en"
        enable_publishing={false}
        hide_top_toolbar={false}
        hide_legend={false}
        save_image={false}
        allow_symbol_change={true}
      />
    </div>
  );
}

export default memo(TVChart);

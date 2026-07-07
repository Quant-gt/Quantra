import React from 'react';
import { X, Plus, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SentenceConditionBlock {
  id: string;
  offset?: string; // e.g., "Latest"
  indicator: string; // e.g., "Close Price", "Candlestick Pattern"
  period?: string; // e.g., "20"
  comparison: string; // e.g., "Greater Than"
  rightOffset?: string; // e.g., "1 day ago"
  valueType: string; // "Number", "Indicator", "Pattern"
  value: string; // e.g., "100", "Doji"
}

interface SentenceBuilderProps {
  blocks: SentenceConditionBlock[];
  onChange: (blocks: SentenceConditionBlock[]) => void;
  onAddBlock: () => void;
  onRemoveBlock: (id: string) => void;
  accentColor?: string; // tailwind color class e.g., "text-green-400"
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  blocks,
  onChange,
  onAddBlock,
  onRemoveBlock,
  accentColor = "text-cyan-400"
}) => {
  const updateBlock = (id: string, field: keyof SentenceConditionBlock, val: any) => {
    const updated = blocks.map(b => {
      if (b.id !== id) return b;
      
      // Auto-correct configurations when indicator changes
      if (field === 'indicator') {
        if (val === 'Candlestick Pattern') {
          return {
            ...b,
            indicator: val,
            comparison: 'Is',
            valueType: 'Pattern',
            value: 'Doji',
            offset: 'Latest'
          };
        } else {
          return {
            ...b,
            indicator: val,
            comparison: 'Greater Than',
            valueType: 'Number',
            value: '100',
            offset: 'Latest',
            period: '20'
          };
        }
      }
      return { ...b, [field]: val };
    });
    onChange(updated);
  };

  const offsets = ['Latest', '1 day ago', '2 days ago', '3 bars ago', '5 bars ago'];
  const indicators = ['Close Price', 'Volume', 'RSI', 'SMA', 'EMA', 'VWAP', 'Candlestick Pattern'];
  const comparisons = ['Greater Than', 'Less Than', 'Crosses Above', 'Crosses Below', 'Is'];
  const valueTypes = ['Number', 'Indicator'];
  const patterns = ['Doji', 'Bullish Engulfing', 'Hammer', 'Shooting Star'];

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const isPattern = block.indicator === 'Candlestick Pattern';

        return (
          <motion.div 
            key={block.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-2 p-3 bg-[#0D1117] border border-[#30363D] hover:border-gray-700 rounded-xl transition-all"
          >
            {/* Index badge */}
            <span className="text-[10px] bg-[#161B22] text-gray-500 font-mono w-5 h-5 rounded-full flex items-center justify-center border border-[#30363D]">
              {index + 1}
            </span>

            {/* Offset Selector */}
            <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1">
              <select
                value={block.offset || 'Latest'}
                onChange={(e) => updateBlock(block.id, 'offset', e.target.value)}
                className="bg-transparent text-xs text-gray-300 outline-none cursor-pointer pr-1"
              >
                {offsets.map(o => <option key={o} value={o} className="bg-[#161B22]">{o}</option>)}
              </select>
            </div>

            {/* Primary Indicator Badge Selector */}
            <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1">
              <select
                value={block.indicator}
                onChange={(e) => updateBlock(block.id, 'indicator', e.target.value)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-1"
              >
                {indicators.map(i => <option key={i} value={i} className="bg-[#161B22]">{i}</option>)}
              </select>
              
              {/* Optional Indicator Period field */}
              {['SMA', 'EMA', 'RSI'].includes(block.indicator) && (
                <div className="ml-1.5 flex items-center gap-1 border-l border-[#30363D] pl-1.5">
                  <span className="text-[10px] text-gray-500 font-mono font-bold">p:</span>
                  <input
                    type="number"
                    value={block.period || '14'}
                    onChange={(e) => updateBlock(block.id, 'period', e.target.value)}
                    className="bg-transparent text-xs text-cyan-400 w-8 outline-none font-bold text-center"
                    min={1}
                  />
                </div>
              )}
            </div>

            {/* Verb operator */}
            <span className="text-xs text-gray-500 font-medium px-0.5">is</span>

            {/* Comparison Operator */}
            <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1">
              <select
                value={block.comparison}
                disabled={isPattern}
                onChange={(e) => updateBlock(block.id, 'comparison', e.target.value)}
                className="bg-transparent text-xs font-bold text-orange-400 outline-none cursor-pointer pr-1 disabled:opacity-80"
              >
                {isPattern ? (
                  <option value="Is" className="bg-[#161B22]">Is</option>
                ) : (
                  comparisons.filter(c => c !== 'Is').map(c => <option key={c} value={c} className="bg-[#161B22]">{c}</option>)
                )}
              </select>
            </div>

            {/* Right-hand Value logic */}
            {isPattern ? (
              /* Pre-baked Candlestick Pattern Select */
              <div className="flex items-center bg-cyan-950/40 border border-cyan-800/40 rounded-lg px-2.5 py-1 text-cyan-400">
                <span className="text-xs font-bold mr-1.5 font-mono text-cyan-500">Pattern:</span>
                <select
                  value={block.value}
                  onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                  className="bg-transparent text-xs font-bold text-cyan-400 outline-none cursor-pointer pr-1"
                >
                  {patterns.map(p => <option key={p} value={p} className="bg-[#161B22]">{p}</option>)}
                </select>
              </div>
            ) : (
              /* Flexible Number / Indicator Right value */
              <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-lg p-0.5">
                <select
                  value={block.valueType}
                  onChange={(e) => updateBlock(block.id, 'valueType', e.target.value)}
                  className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer px-2 border-r border-[#30363D] pr-1"
                >
                  {valueTypes.map(vt => <option key={vt} value={vt} className="bg-[#161B22]">{vt}</option>)}
                </select>

                {block.valueType === 'Indicator' ? (
                  <div className="flex items-center pl-2 pr-1.5 gap-1.5">
                    {/* Right Hand Indicator selection */}
                    <select
                      value={block.value.split(':')[0] || 'SMA'}
                      onChange={(e) => updateBlock(block.id, 'value', `${e.target.value}:20`)}
                      className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-1"
                    >
                      {indicators.filter(i => i !== 'Candlestick Pattern').map(i => <option key={i} value={i} className="bg-[#161B22]">{i}</option>)}
                    </select>
                    {/* Right Hand Period config */}
                    <span className="text-[10px] text-gray-500 font-mono pl-1 border-l border-[#30363D]">p:</span>
                    <input
                      type="number"
                      value={block.value.split(':')[1] || '20'}
                      onChange={(e) => {
                        const ind = block.value.split(':')[0] || 'SMA';
                        updateBlock(block.id, 'value', `${ind}:${e.target.value}`);
                      }}
                      className="bg-transparent text-xs text-cyan-400 w-8 outline-none font-bold text-center"
                      min={1}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                    className="bg-transparent text-xs text-white outline-none px-3.5 py-1 w-20 font-bold"
                  />
                )}
              </div>
            )}

            {/* Remove node action */}
            <button
              onClick={() => onRemoveBlock(block.id)}
              className="ml-auto text-gray-500 hover:text-red-400 p-1 rounded hover:bg-[#21262D] transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        );
      })}

      {/* Add node trigger */}
      <button
        onClick={onAddBlock}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-[#30363D] hover:border-gray-500 text-xs font-bold text-gray-400 hover:text-white transition-all bg-transparent hover:bg-[#161B22]/35"
      >
        <Plus size={14} />
        Add Conversational Strategy Condition Block
      </button>
    </div>
  );
};

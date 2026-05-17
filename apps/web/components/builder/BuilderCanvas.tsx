"use client";

import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  ReactFlowInstance,
  NodeChange,
  EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, Plus, Filter, ArrowRight, Zap, Target, ShieldAlert, Cpu } from 'lucide-react';

// Initial nodes to show on the canvas
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'TRIGGER: 09:15 AM' },
    position: { x: 250, y: 50 },
    style: { background: '#1C2128', color: '#58A6FF', border: '1px solid #388BFD', borderRadius: '8px', padding: '10px 15px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.05em' }
  },
  {
    id: '2',
    data: { label: 'CONDITION: EMA 9 > EMA 21' },
    position: { x: 100, y: 150 },
    style: { background: '#0D1117', color: 'white', border: '1px solid #30363D', borderRadius: '8px', padding: '10px 15px', fontSize: '12px' }
  },
  {
    id: '3',
    data: { label: 'CONDITION: RSI < 30' },
    position: { x: 400, y: 150 },
    style: { background: '#0D1117', color: 'white', border: '1px solid #30363D', borderRadius: '8px', padding: '10px 15px', fontSize: '12px' }
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'ACTION: BUY NIFTY FUT' },
    position: { x: 250, y: 250 },
    style: { background: '#238636', color: 'white', border: '1px solid #39D353', borderRadius: '8px', padding: '10px 15px', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 0 15px rgba(35, 134, 54, 0.4)' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#58A6FF' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#58A6FF' } },
  { id: 'e2-4', source: '2', target: '4', style: { stroke: '#8B949E' } },
  { id: 'e3-4', source: '3', target: '4', style: { stroke: '#8B949E' } },
];

export default function BuilderCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({...params, animated: true, style: { stroke: '#58A6FF' }}, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: `node_${nodes.length + 1}`,
        type,
        position,
        data: { label: `NEW ${type.toUpperCase()}` },
        style: type === 'input' 
          ? { background: '#1C2128', color: '#58A6FF', border: '1px solid #388BFD', borderRadius: '8px', padding: '10px 15px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.05em' }
          : type === 'output' 
          ? { background: '#238636', color: 'white', border: '1px solid #39D353', borderRadius: '8px', padding: '10px 15px', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 0 15px rgba(35, 134, 54, 0.4)' }
          : { background: '#0D1117', color: 'white', border: '1px solid #30363D', borderRadius: '8px', padding: '10px 15px', fontSize: '12px' }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes]
  );

  return (
    <div className="flex h-full w-full bg-[#0D1117]">
      {/* Sidebar - Node Library */}
      <div className="w-72 bg-[#161B22] border-r border-[#30363D] flex flex-col z-10 shadow-xl">
        <div className="p-4 border-b border-[#30363D]">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 tracking-wide">
            <Cpu size={16} className="text-[#58A6FF]" />
            NODE LIBRARY
          </h3>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              className="w-full bg-[#0D1117] border border-[#30363D] text-white text-xs rounded-md pl-9 pr-3 py-2 outline-none focus:border-[#58A6FF] transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Triggers */}
          <div>
            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 px-1">Triggers</h4>
            <div className="space-y-2">
              <div
                className="p-3 bg-[#1C2128] rounded-lg cursor-grab hover:bg-[#21262D] hover:border-[#58A6FF] transition-all border border-[#30363D] flex items-center gap-3 group"
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', 'input');
                  event.dataTransfer.effectAllowed = 'move';
                }}
                draggable
              >
                <div className="w-6 h-6 rounded bg-[#388BFD]/10 flex items-center justify-center text-[#58A6FF] group-hover:bg-[#388BFD]/20">
                  <Zap size={12} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Time Trigger</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Execute at specific time</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conditions */}
          <div>
            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 px-1">Conditions</h4>
            <div className="space-y-2">
              <div
                className="p-3 bg-[#1C2128] rounded-lg cursor-grab hover:bg-[#21262D] hover:border-gray-500 transition-all border border-[#30363D] flex items-center gap-3 group"
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', 'default');
                  event.dataTransfer.effectAllowed = 'move';
                }}
                draggable
              >
                <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-gray-700">
                  <Filter size={12} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Technical Indicator</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">RSI, MACD, EMA, etc.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 px-1">Actions</h4>
            <div className="space-y-2">
              <div
                className="p-3 bg-[#238636]/10 rounded-lg cursor-grab hover:bg-[#238636]/20 hover:border-[#39D353] transition-all border border-[#238636]/30 flex items-center gap-3 group"
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', 'output');
                  event.dataTransfer.effectAllowed = 'move';
                }}
                draggable
              >
                <div className="w-6 h-6 rounded bg-[#238636]/20 flex items-center justify-center text-[#39D353] group-hover:bg-[#238636]/30">
                  <Target size={12} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#39D353]">Execute Order</div>
                  <div className="text-[10px] text-green-500/60 mt-0.5">Buy/Sell Market or Limit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-[#0D1117]">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <div className="bg-[#161B22]/80 backdrop-blur border border-[#30363D] rounded-lg p-2 px-3 flex items-center gap-2 text-xs font-mono text-gray-400 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#D29922] animate-pulse"></span>
            VALIDATION PENDING
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          className="bg-[#0D1117]"
        >
          <Controls className="fill-white shadow-xl [&>button]:bg-[#1C2128] [&>button]:border-[#30363D] [&>button]:text-white hover:[&>button]:bg-[#30363D] hover:[&>button]:border-[#8B949E]" />
          <MiniMap 
            nodeColor={() => '#30363D'} 
            maskColor="rgba(13, 17, 23, 0.8)"
            className="bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl"
          />
          <Background color="#30363D" gap={24} size={1} />
        </ReactFlow>
      </div>

      {/* Inspector (Right Sidebar Placeholder) */}
      <div className="w-80 bg-[#161B22] border-l border-[#30363D] flex flex-col z-10 shadow-xl">
        <div className="p-4 border-b border-[#30363D]">
          <h3 className="font-bold text-white text-sm tracking-wide">NODE INSPECTOR</h3>
        </div>
        <div className="p-6 text-center flex flex-col items-center justify-center flex-1 text-gray-500">
          <div className="w-12 h-12 rounded-full bg-[#21262D] border border-[#30363D] flex items-center justify-center mb-4">
            <Filter size={20} className="text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-400">No node selected</p>
          <p className="text-xs mt-2 max-w-[200px] leading-relaxed">
            Click on any node in the canvas to configure its parameters, thresholds, and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

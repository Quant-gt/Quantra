"use client";

import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Signal: Moving Average Crossover (EMA 9 > EMA 21)' }, style: { background: '#2563eb', color: 'white', borderRadius: '8px', border: '1px solid #3b82f6' } },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'Condition: RSI(14) > 50' }, style: { background: '#1e293b', color: 'white' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'Condition: Volume > 1M' }, style: { background: '#1e293b', color: 'white' } },
  { id: '4', position: { x: 250, y: 250 }, data: { label: 'Action: BUY NIFTY 50' }, style: { background: '#16a34a', color: 'white', borderRadius: '8px', border: '1px solid #22c55e', fontWeight: 'bold' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#fff' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#22c55e' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#22c55e' } },
];

export default function WhiteBoxViewer() {
  return (
    <div className="h-[400px] w-full rounded-xl border border-white/10 overflow-hidden bg-black/40">
      <ReactFlow 
        nodes={initialNodes} 
        edges={initialEdges} 
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#ffffff" gap={16} size={1} />
        <Controls className="fill-white/80" />
      </ReactFlow>
    </div>
  );
}

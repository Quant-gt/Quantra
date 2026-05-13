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
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';

// Initial nodes to show on the canvas
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Trigger: 9:15 AM' },
    position: { x: 250, y: 50 },
    style: { background: '#1e293b', color: 'white', border: '1px solid #3b82f6', borderRadius: '8px' }
  },
  {
    id: '2',
    data: { label: 'Condition: EMA 9 > EMA 21' },
    position: { x: 100, y: 150 },
    style: { background: '#1e293b', color: 'white', border: '1px solid #64748b', borderRadius: '8px' }
  },
  {
    id: '3',
    data: { label: 'Condition: RSI < 30' },
    position: { x: 400, y: 150 },
    style: { background: '#1e293b', color: 'white', border: '1px solid #64748b', borderRadius: '8px' }
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Action: Buy Nifty Fut' },
    position: { x: 250, y: 250 },
    style: { background: '#065f46', color: 'white', border: '1px solid #10b981', borderRadius: '8px' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function BuilderCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
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
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
        style: { background: '#1e293b', color: 'white', border: '1px solid #64748b', borderRadius: '8px' }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes]
  );

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* Sidebar - Node Library */}
      <div className="w-64 bg-slate-900 border-r border-white/10 p-4 text-white">
        <h3 className="font-bold mb-4">Node Library</h3>
        <div className="space-y-2">
          <div
            className="p-3 bg-slate-800 rounded-lg cursor-grab hover:bg-slate-700 transition-colors border border-white/5"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'default');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            Logic Node
          </div>
          <div
            className="p-3 bg-blue-900/50 rounded-lg cursor-grab hover:bg-blue-900/70 transition-colors border border-blue-500/20"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'input');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            Trigger Node
          </div>
          <div
            className="p-3 bg-green-900/50 rounded-lg cursor-grab hover:bg-green-900/70 transition-colors border border-green-500/20"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'output');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            Action Node
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-slate-950 relative">
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
          className="text-white"
        >
          <Controls className="fill-white bg-slate-800 border-slate-700" />
          <MiniMap 
            nodeColor={() => '#3b82f6'} 
            maskColor="rgba(15, 23, 42, 0.8)"
            className="bg-slate-800 border-slate-700"
          />
          <Background color="#334155" gap={16} />
        </ReactFlow>
      </div>

      {/* Inspector (Right Sidebar Placeholder) */}
      <div className="w-64 bg-slate-900 border-l border-white/10 p-4 text-white">
        <h3 className="font-bold mb-4">Node Inspector</h3>
        <p className="text-sm text-slate-400">Select a node to configure its parameters.</p>
      </div>
    </div>
  );
}

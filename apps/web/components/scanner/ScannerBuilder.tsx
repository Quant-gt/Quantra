"use client";

import React, { useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node for Filters
const FilterNode = ({ data }: any) => {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3 min-w-[150px] shadow-lg">
      <div className="text-xs font-bold text-gray-400 mb-2 uppercase">{data.category}</div>
      <div className="text-white font-medium text-sm mb-1">{data.label}</div>
      <div className="text-xs text-[#58A6FF]">{data.condition}</div>
    </div>
  );
};

// Custom Node for Output
const OutputNode = ({ data }: any) => {
  return (
    <div className="bg-[#238636]/10 border border-[#238636] rounded-lg p-3 min-w-[150px] shadow-[0_0_15px_rgba(35,134,54,0.15)]">
      <div className="text-xs font-bold text-[#39D353] mb-1 text-center">SCAN RESULTS</div>
      <div className="text-white font-medium text-sm text-center">Nifty 500 Matches</div>
    </div>
  );
};

const nodeTypes = {
  filter: FilterNode,
  output: OutputNode,
};



export default function ScannerBuilder({
  nodes,
  setNodes,
  edges,
  setEdges,
}: {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}) {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#58A6FF' } }, eds)),
    [setEdges]
  );

  const addFilterNode = () => {
    const newId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: newId,
      type: 'filter',
      position: { x: 100, y: 100 + nodes.length * 40 },
      data: { category: 'Technical', label: `Filter ${newId}`, condition: 'Value > 0' }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="h-[500px] w-full bg-[#0D1117] relative">
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={addFilterNode}
            className="bg-[#1C2128]/90 backdrop-blur-md hover:bg-[#21262D] text-white border border-[#30363D] hover:border-[#8B949E] px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg flex items-center gap-2"
          >
            <span className="text-[#58A6FF] text-lg leading-none">+</span> Add Filter Node
          </button>
          <button className="bg-[#1C2128]/90 backdrop-blur-md hover:bg-[#21262D] text-white border border-[#30363D] hover:border-[#8B949E] px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg">
            Template Library
          </button>
        </div>
        
        <div className="pointer-events-auto bg-[#1C2128]/90 backdrop-blur-md border border-[#30363D] px-4 py-2 rounded-md text-sm font-medium text-gray-400 shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#39D353] animate-pulse" />
          Real-time Engine Active
        </div>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#0D1117]"
      >
        <Background color="#30363D" gap={24} size={1} />
        <Controls className="fill-white shadow-xl [&>button]:bg-[#1C2128] [&>button]:border-[#30363D] [&>button]:text-white hover:[&>button]:bg-[#30363D] hover:[&>button]:border-[#8B949E]" />
      </ReactFlow>
    </div>
  );
}

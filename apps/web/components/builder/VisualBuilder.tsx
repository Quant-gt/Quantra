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
  ReactFlowProvider,
  ReactFlowInstance,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Settings2, ShieldAlert, Target, Save, Zap, Clock, Activity, Cpu, GripHorizontal, Loader2, SaveAll } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// --- CUSTOM NODES ---

const CustomTriggerNode = React.memo(({ data }: NodeProps) => (
  <div className="bg-[#1C2128] border border-[#388BFD] rounded-xl shadow-lg w-[240px] overflow-hidden group">
    <div className="bg-[#388BFD]/10 px-4 py-2 border-b border-[#388BFD]/30 flex items-center gap-2">
      <Clock size={14} className="text-[#58A6FF]" />
      <span className="text-xs font-bold text-[#58A6FF] tracking-wider">TRIGGER</span>
    </div>
    <div className="p-4">
      <input 
        type="text" 
        defaultValue={data.label} 
        placeholder="e.g. 09:15 AM"
        className="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#58A6FF]"
      />
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#58A6FF] border-2 border-[#1C2128]" />
  </div>
));
CustomTriggerNode.displayName = 'CustomTriggerNode';

const CustomConditionNode = React.memo(({ data }: NodeProps) => (
  <div className="bg-[#161B22] border border-[#30363D] rounded-xl shadow-lg w-[240px] overflow-hidden group hover:border-[#8B949E] transition-colors">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#8B949E] border-2 border-[#161B22]" />
    <div className="bg-[#21262D] px-4 py-2 border-b border-[#30363D] flex items-center gap-2">
      <Activity size={14} className="text-white" />
      <span className="text-xs font-bold text-white tracking-wider">CONDITION</span>
    </div>
    <div className="p-4 flex flex-col gap-2">
      <input 
        type="text" 
        defaultValue={data.indicator} 
        placeholder="Indicator (e.g. RSI)"
        className="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
      />
      <div className="flex gap-2">
        <select className="bg-[#0D1117] border border-[#30363D] rounded-md px-2 py-2 text-sm text-white focus:outline-none flex-1">
          <option>{'>'}</option>
          <option>{'<'}</option>
          <option>{'=='}</option>
          <option>CROSSES ABOVE</option>
          <option>CROSSES BELOW</option>
        </select>
        <input 
          type="text" 
          defaultValue={data.value} 
          placeholder="Value"
          className="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm text-white focus:outline-none flex-1"
        />
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#8B949E] border-2 border-[#161B22]" />
  </div>
));
CustomConditionNode.displayName = 'CustomConditionNode';

const CustomActionNode = React.memo(({ data }: NodeProps) => (
  <div className="bg-[#0F1713] border border-[#238636] rounded-xl shadow-[0_0_15px_rgba(35,134,54,0.15)] w-[240px] overflow-hidden">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#39D353] border-2 border-[#0F1713]" />
    <div className="bg-[#238636]/20 px-4 py-2 border-b border-[#238636]/40 flex items-center gap-2">
      <Zap size={14} className="text-[#39D353]" />
      <span className="text-xs font-bold text-[#39D353] tracking-wider">EXECUTE ACTION</span>
    </div>
    <div className="p-4 flex flex-col gap-2">
      <div className="flex gap-2">
        <button className="flex-1 bg-[#238636] text-white text-xs font-bold py-2 rounded-md">BUY</button>
        <button className="flex-1 bg-[#161B22] border border-[#30363D] hover:bg-[#21262D] text-white text-xs font-bold py-2 rounded-md transition-colors">SELL</button>
      </div>
      <input 
        type="text" 
        defaultValue={data.symbol} 
        placeholder="Symbol (e.g. NIFTY)"
        className="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#39D353]"
      />
      <input 
        type="number" 
        defaultValue={data.quantity} 
        placeholder="Qty"
        className="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#39D353]"
      />
    </div>
  </div>
));
CustomActionNode.displayName = 'CustomActionNode';

const nodeTypes = {
  triggerNode: CustomTriggerNode,
  conditionNode: CustomConditionNode,
  actionNode: CustomActionNode,
};

// --- MAIN COMPONENT ---

function BuilderFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', type: 'triggerNode', data: { label: '09:15 AM' }, position: { x: 300, y: 50 } }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [strategyName, setStrategyName] = useState("My Momentum Strategy");
  
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({...params, animated: true, style: { stroke: '#8B949E', strokeWidth: 2 }}, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!rfInstance || !reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const newNode = {
        id: `node_${new Date().getTime()}`,
        type,
        position,
        data: { 
          label: '',
          indicator: type === 'conditionNode' ? 'RSI' : '',
          value: type === 'conditionNode' ? '30' : '',
          symbol: type === 'actionNode' ? 'NIFTY' : '',
          quantity: type === 'actionNode' ? '50' : '',
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  const handleSave = async () => {
    if (!rfInstance) return;
    setIsSaving(true);
    
    try {
      const flow = rfInstance.toObject();
      const supabase = createClient();
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('strategies')
        .insert({
          creator_id: session.user.id,
          name: strategyName,
          logic_graph: flow as any,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Strategy saved successfully!');
      
    } catch (err: any) {
      console.error("Save error:", JSON.stringify(err, null, 2));
      toast.error(`Failed to save strategy: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      
      {/* Top Builder Toolbar */}
      <div className="h-16 border-b border-[#30363D] bg-[#0B0F19] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#388BFD] to-[#238636] flex items-center justify-center shadow-lg">
            <Cpu size={16} className="text-white" />
          </div>
          <input 
            type="text" 
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            className="bg-transparent text-lg font-bold text-white outline-none border-b border-transparent hover:border-[#30363D] focus:border-[#58A6FF] transition-colors pb-1"
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <SaveAll size={16} />}
            Save Draft
          </button>
          <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-5 py-2 rounded-md text-sm font-bold transition-all shadow-lg flex items-center gap-2">
            <Play size={16} fill="currentColor" />
            Compile & Test
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar Palette */}
        <div className="w-64 bg-[#161B22] border-r border-[#30363D] p-4 flex flex-col gap-6 overflow-y-auto z-10 shadow-xl">
          <div>
            <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wider">EVENTS & TRIGGERS</h3>
            <div 
              className="bg-[#1C2128] border border-[#388BFD]/50 hover:border-[#388BFD] p-3 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3 transition-colors"
              onDragStart={(e) => { e.dataTransfer.setData('application/reactflow', 'triggerNode'); e.dataTransfer.effectAllowed = 'move'; }}
              draggable
            >
              <div className="w-8 h-8 rounded bg-[#388BFD]/20 flex items-center justify-center">
                <Clock size={14} className="text-[#58A6FF]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Time/Tick</div>
                <div className="text-xs text-gray-400">Schedule trigger</div>
              </div>
              <GripHorizontal size={14} className="text-gray-600 ml-auto" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wider">LOGIC & MATH</h3>
            <div 
              className="bg-[#21262D] border border-[#30363D] hover:border-[#8B949E] p-3 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3 transition-colors"
              onDragStart={(e) => { e.dataTransfer.setData('application/reactflow', 'conditionNode'); e.dataTransfer.effectAllowed = 'move'; }}
              draggable
            >
              <div className="w-8 h-8 rounded bg-[#30363D] flex items-center justify-center">
                <Activity size={14} className="text-gray-300" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Condition</div>
                <div className="text-xs text-gray-400">Compare indicators</div>
              </div>
              <GripHorizontal size={14} className="text-gray-600 ml-auto" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wider">EXECUTION</h3>
            <div 
              className="bg-[#0F1713] border border-[#238636]/50 hover:border-[#238636] p-3 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3 transition-colors"
              onDragStart={(e) => { e.dataTransfer.setData('application/reactflow', 'actionNode'); e.dataTransfer.effectAllowed = 'move'; }}
              draggable
            >
              <div className="w-8 h-8 rounded bg-[#238636]/20 flex items-center justify-center">
                <Zap size={14} className="text-[#39D353]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Order Action</div>
                <div className="text-xs text-gray-400">Place live trade</div>
              </div>
              <GripHorizontal size={14} className="text-gray-600 ml-auto" />
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0D1117]"
          >
            <Background color="#30363D" gap={20} size={1} />
            <Controls className="!bg-[#161B22] !border-[#30363D] !text-white fill-white" />
            <MiniMap 
              nodeColor={(node) => {
                if (node.type === 'triggerNode') return '#388BFD';
                if (node.type === 'actionNode') return '#238636';
                return '#8B949E';
              }}
              maskColor="rgba(13, 17, 23, 0.7)"
              className="!bg-[#161B22] !border-[#30363D]"
            />
          </ReactFlow>
        </div>
        
      </div>
    </div>
  );
}

export default function VisualBuilder() {
  return (
    <ReactFlowProvider>
      <BuilderFlow />
    </ReactFlowProvider>
  );
}

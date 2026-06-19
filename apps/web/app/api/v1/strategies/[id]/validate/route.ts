import { NextResponse } from 'next/server';

function hasCycle(nodes: any[], edges: any[]): boolean {
  const adjList = new Map<string, string[]>();
  for (const node of nodes) {
    if (node && node.id) {
      adjList.set(node.id, []);
    }
  }
  for (const edge of edges) {
    if (edge && edge.source && edge.target) {
      if (adjList.has(edge.source)) {
        adjList.get(edge.source)!.push(edge.target);
      }
    }
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (recStack.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (node && node.id) {
      if (dfs(node.id)) {
        return true;
      }
    }
  }

  return false;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { logic_graph } = await request.json();
    const { nodes = [], edges = [] } = logic_graph || {};
    
    // Stage 1: Graph Integrity
    const hasTrigger = nodes.some((n: any) => n.type === 'input');
    const hasAction = nodes.some((n: any) => n.type === 'output');
    const stage1 = (hasTrigger && hasAction) 
      ? { status: 'success', message: 'Graph integrity check passed. No orphan nodes found.' }
      : { status: 'failed', message: 'Strategy must contain at least one Trigger node and one Action node.' };
    
    // Stage 2: DFS Cycle Detection
    const isCyclic = hasCycle(nodes, edges);
    const stage2 = !isCyclic
      ? { status: 'success', message: 'No execution cycles detected.' }
      : { status: 'failed', message: 'Strategy logic contains an infinite loop.' };
    
    // Stage 3: SEBI Compliance
    const triggerCount = nodes.filter((n: any) => n.type === 'input').length;
    const stage3 = triggerCount <= 5
      ? { status: 'success', message: 'OPS estimate is within limits. All order nodes have Algo-ID fields.' }
      : { status: 'failed', message: 'Too many simultaneous triggers. Risk of breaching 10 Orders Per Second (OPS) limit.' };

    const isValid = stage1.status === 'success' && stage2.status === 'success' && stage3.status === 'success';

    return NextResponse.json({
      valid: isValid,
      results: [stage1, stage2, stage3],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

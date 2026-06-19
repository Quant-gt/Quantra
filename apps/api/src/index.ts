import express from 'express';
import redis from './lib/redis.js';
import { dailyAuthCheck, adminOnly } from './middleware/auth.js';
import { opsMonitor } from './middleware/ops.js';
import { killSwitchCheck } from './middleware/killswitch.js';
import creatorRoutes from './routes/creator.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware for brute-force rate limiting using Upstash Redis
const rateLimiter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.UPSTASH_REDIS_REST_URL) return next();

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const key = `ratelimit_${ip}`;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, 60); // 1 minute window
    }

    if (current > 100) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  } catch (error) {
    next();
  }
};

app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

// Auth webhook for logging login activity
app.post('/webhook/auth', express.json(), async (req, res) => {
  const webhookSecret = req.headers['x-webhook-secret'];
  if (!process.env.WEBHOOK_SECRET || webhookSecret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized webhook request' });
  }

  const { user_id, event, ip_address, user_agent } = req.body;
  
  if (event === 'SIGNED_IN') {
    // Ideally log to users_sessions table in Supabase
    console.log(`User ${user_id} signed in from ${ip_address} using ${user_agent}`);
  }
  
  res.json({ success: true });
});

// Protected route for strategy deployment (SEBI Compliance Check)
app.post('/api/strategy/deploy', dailyAuthCheck, killSwitchCheck, express.json(), async (req, res) => {
  res.json({
    success: true,
    message: 'Strategy deployment authorized. All SEBI daily compliance checks passed.'
  });
});

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

// Protected route for Strategy DAG Validation (Stage 1-3 validation)
app.post('/api/strategy/validate', dailyAuthCheck, express.json(), async (req, res) => {
  const { nodes, edges } = req.body;
  
  if (!nodes || !edges) {
    return res.status(400).json({ error: 'Nodes and edges are required for validation.' });
  }

  // Stage 1: Graph Integrity Check
  const hasTrigger = nodes.some((n: any) => n.type === 'input');
  const hasAction = nodes.some((n: any) => n.type === 'output');
  
  if (!hasTrigger || !hasAction) {
    return res.status(400).json({ 
      error: 'Graph Integrity Failed', 
      details: 'Strategy must contain at least one Trigger node and one Action node.' 
    });
  }

  // Stage 2: Cycle Detection
  const isCyclic = hasCycle(nodes, edges);
  if (isCyclic) {
    return res.status(400).json({ 
      error: 'Cycle Detected', 
      details: 'Strategy logic contains an infinite loop.' 
    });
  }

  // Stage 3: SEBI Compliance Mock Check
  const triggerCount = nodes.filter((n: any) => n.type === 'input').length;
  if (triggerCount > 5) {
    return res.status(400).json({ 
      error: 'SEBI Compliance Failed', 
      details: 'Too many simultaneous triggers. Risk of breaching 10 Orders Per Second (OPS) limit.' 
    });
  }

  res.json({
    success: true,
    message: 'Strategy passed all 3 validation stages successfully.',
    ops_estimate: triggerCount * 2
  });
});

// Protected route for order placement (SEBI OPS Check)
app.post('/api/trade/place', dailyAuthCheck, killSwitchCheck, opsMonitor, express.json(), async (req, res) => {
  res.json({
    success: true,
    message: 'Order placed successfully. OPS limits respected.'
  });
});

// Admin route to trigger Kill Switch (SEBI Compliance)
app.post('/api/admin/killswitch', dailyAuthCheck, adminOnly, express.json(), async (req, res) => {
  const { action, userId } = req.body;

  if (!action || !['activate', 'deactivate'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action. Must be activate or deactivate.' });
  }

  const isActivate = action === 'activate';
  const value = isActivate ? 'true' : 'false';

  try {
    if (userId) {
      // User-specific kill switch
      await redis.set(`killswitch:user:${userId}`, value);
      await redis.publish('killswitch', JSON.stringify({ target: 'user', userId, action }));
    } else {
      // Global kill switch
      await redis.set('killswitch:global', value);
      await redis.publish('killswitch', JSON.stringify({ target: 'global', action }));
    }

    res.json({
      success: true,
      message: `Kill switch ${action}d successfully.`,
      target: userId ? `user:${userId}` : 'global'
    });
  } catch (error) {
    console.error('Error triggering kill switch:', error);
    res.status(500).json({ error: 'Failed to trigger kill switch' });
  }
});

// Mount modular routes
app.use('/api/v1/creator', dailyAuthCheck, express.json(), creatorRoutes);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});


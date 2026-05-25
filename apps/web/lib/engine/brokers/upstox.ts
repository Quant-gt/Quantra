import { OrderPayload } from './zerodha';

export async function executeUpstoxOrder(payload: OrderPayload, apiKey: string) {
  // Simulate network latency to Upstox API
  await new Promise((resolve) => setTimeout(resolve, 120));

  console.log(`[UPSTOX] Executed ${payload.action} ${payload.quantity}x ${payload.asset} for user ${payload.userId}`);
  
  return {
    success: true,
    broker: 'Upstox',
    orderId: `UPS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toISOString()
  };
}

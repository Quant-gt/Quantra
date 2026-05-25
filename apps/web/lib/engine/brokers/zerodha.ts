export interface OrderPayload {
  userId: string;
  action: 'BUY' | 'SELL';
  asset: string;
  quantity: number;
}

export async function executeZerodhaOrder(payload: OrderPayload, apiKey: string) {
  // Simulate network latency to Zerodha API
  await new Promise((resolve) => setTimeout(resolve, 150));

  console.log(`[ZERODHA] Executed ${payload.action} ${payload.quantity}x ${payload.asset} for user ${payload.userId}`);
  
  return {
    success: true,
    broker: 'Zerodha',
    orderId: `ZER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toISOString()
  };
}

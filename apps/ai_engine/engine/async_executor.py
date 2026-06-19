import asyncio
from typing import List, Dict
import httpx
from datetime import datetime

async def run_execution_loop(order_queue: asyncio.Queue):
    """
    Persistent background worker that drains the queue every 200ms,
    nets the trades, and fires them to Fyers API.
    """
    print("Started In-Memory Async Execution Loop (200ms)")
    
    while True:
        try:
            await asyncio.sleep(0.2) # 200ms netting window
            
            if order_queue.empty():
                continue
                
            # 1. Drain the queue
            batch = []
            while not order_queue.empty():
                batch.append(order_queue.get_nowait())
                order_queue.task_done()
                
            # 2. Net the trades algebraically by symbol
            # Payload format expected: {"symbol": "NSE:RELIANCE-EQ", "quantity": 10, "side": 1} # 1 for Buy, -1 for Sell
            net_exposure: Dict[str, int] = {}
            
            for order in batch:
                symbol = order.get("symbol")
                qty = order.get("quantity", 0)
                side = order.get("side", 0) # 1 or -1
                
                if not isinstance(qty, (int, float)) or qty <= 0:
                    print(f"Skipping invalid order (qty must be > 0): {order}")
                    continue
                
                if symbol not in net_exposure:
                    net_exposure[symbol] = 0
                net_exposure[symbol] += (qty * side)
                
            # 3. Filter zeros and execute
            final_orders = []
            for symbol, net_qty in net_exposure.items():
                if net_qty == 0:
                    continue
                    
                side_str = "BUY" if net_qty > 0 else "SELL"
                abs_qty = abs(net_qty)
                final_orders.append({
                    "symbol": symbol,
                    "qty": abs_qty,
                    "type": 2, # Market order
                    "side": 1 if net_qty > 0 else -1,
                    "productType": "MARGIN",
                    "validity": "DAY"
                })
                
            if not final_orders:
                continue
                
            print(f"[{datetime.utcnow().isoformat()}] Netted {len(batch)} signals into {len(final_orders)} orders.")
            
            # 4. Broker Guardrails: 10-symbol basket split
            # Fyers API takes up to 10 orders in a single multi-order request
            chunks = [final_orders[i:i + 10] for i in range(0, len(final_orders), 10)]
            
            # We need the access token to place orders
            from fyers_auth import get_fyers_access_token
            import os
            
            app_id = os.getenv("FYERS_APP_ID", "")
            access_token = get_fyers_access_token()
            
            if not access_token:
                print("Cannot execute trades: Missing Fyers Access Token. Admin must login.")
                continue
                
            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"{app_id}:{access_token}",
                    "Content-Type": "application/json"
                }
                
                for chunk in chunks:
                    try:
                        res = await client.post(
                            "https://api-t1.fyers.in/api/v3/multi-order/sync",
                            headers=headers,
                            json=chunk
                        )
                        
                        if res.status_code == 200:
                            data = res.json()
                            print(f"Successfully sent {len(chunk)} orders to Fyers:", data)
                            # TODO: Log to Supabase master_execution_log asynchronously
                        else:
                            print(f"Fyers API Error: {res.status_code} - {res.text}")
                    except Exception as e:
                        print(f"Network error executing trades: {e}")
                    
                    # Small delay between chunks to respect rate limits
                    await asyncio.sleep(0.1)
        except Exception as loop_err:
            import traceback
            print(f"CRITICAL ERROR in execution loop: {loop_err}")
            traceback.print_exc()
            await asyncio.sleep(5) # Delay 5 seconds to prevent rapid crash loops

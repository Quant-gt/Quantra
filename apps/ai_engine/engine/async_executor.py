import asyncio
from typing import Dict
import httpx
from datetime import datetime
import os

async def log_order_to_supabase(
    supabase_url: str,
    supabase_key: str,
    symbol: str,
    order_type: str,
    quantity: int,
    fyers_order_id: str,
    strategy_allocations: Dict
):
    try:
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "symbol": symbol,
            "order_type": order_type,
            "quantity": quantity,
            "fyers_order_id": fyers_order_id,
            "status": "FILLED",
            "strategy_allocations": strategy_allocations
        }
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{supabase_url}/rest/v1/master_execution_log",
                headers=headers,
                json=payload
            )
            if res.status_code not in (200, 201):
                print(f"Failed to log order to Supabase: {res.status_code} - {res.text}")
            else:
                print(f"Successfully logged order {fyers_order_id} to Supabase master_execution_log.")
    except Exception as e:
        print(f"Error logging order to Supabase: {e}")

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
            allocations_per_symbol: Dict[str, Dict[str, int]] = {}
            
            for order in batch:
                symbol = order.get("symbol")
                qty = order.get("quantity", 0)
                side = order.get("side", 0) # 1 or -1
                strategy_id = order.get("strategy_id")
                
                if not isinstance(qty, (int, float)) or qty <= 0 or not symbol:
                    print(f"Skipping invalid order (qty must be > 0): {order}")
                    continue
                
                if symbol not in net_exposure:
                    net_exposure[symbol] = 0
                net_exposure[symbol] += (qty * side)
                
                if symbol not in allocations_per_symbol:
                    allocations_per_symbol[symbol] = {}
                strat_key = str(strategy_id) if strategy_id else "unknown"
                if strat_key not in allocations_per_symbol[symbol]:
                    allocations_per_symbol[symbol][strat_key] = 0
                val = qty * side
                allocations_per_symbol[symbol][strat_key] += int(val) if isinstance(qty, int) else val
                
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
                            
                            # Log to Supabase master_execution_log asynchronously
                            supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
                            supabase_key = os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
                            
                            fyers_responses = data.get("data", [])
                            if fyers_responses:
                                for i, order_res in enumerate(fyers_responses):
                                    status_code = order_res.get("statusCode")
                                    body = order_res.get("body", {})
                                    if status_code == 200 and body.get("s") == "ok":
                                        fyers_order_id = body.get("id")
                                        order_info = chunk[i]
                                        symbol = order_info["symbol"]
                                        qty = order_info["qty"]
                                        side = order_info["side"]
                                        order_type = "BUY" if side == 1 else "SELL"
                                        strategy_allocs = allocations_per_symbol.get(symbol, {})
                                        
                                        if supabase_url and supabase_key:
                                            asyncio.create_task(
                                                log_order_to_supabase(
                                                    supabase_url=supabase_url,
                                                    supabase_key=supabase_key,
                                                    symbol=symbol,
                                                    order_type=order_type,
                                                    quantity=qty,
                                                    fyers_order_id=fyers_order_id,
                                                    strategy_allocations=strategy_allocs
                                                )
                                            )
                            elif data.get("s") == "ok":
                                # Fallback for simpler responses (e.g. tests)
                                for order_info in chunk:
                                    symbol = order_info["symbol"]
                                    qty = order_info["qty"]
                                    side = order_info["side"]
                                    order_type = "BUY" if side == 1 else "SELL"
                                    strategy_allocs = allocations_per_symbol.get(symbol, {})
                                    
                                    if supabase_url and supabase_key:
                                        asyncio.create_task(
                                            log_order_to_supabase(
                                                supabase_url=supabase_url,
                                                supabase_key=supabase_key,
                                                symbol=symbol,
                                                order_type=order_type,
                                                quantity=qty,
                                                fyers_order_id="mock_order_id",
                                                strategy_allocations=strategy_allocs
                                            )
                                        )
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

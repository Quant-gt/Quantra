import asyncio
import pytest
from unittest.mock import patch, AsyncMock
from engine.async_executor import run_execution_loop

@pytest.mark.asyncio
async def test_run_execution_loop_netting():
    order_queue = asyncio.Queue()
    
    # Put some orders: Net exposure of RELIANCE is 10 (buy 20, sell 10), TCS is 0 (buy 5, sell 5)
    order_queue.put_nowait({"symbol": "NSE:RELIANCE-EQ", "quantity": 20, "side": 1})
    order_queue.put_nowait({"symbol": "NSE:RELIANCE-EQ", "quantity": 10, "side": -1})
    order_queue.put_nowait({"symbol": "NSE:TCS-EQ", "quantity": 5, "side": 1})
    order_queue.put_nowait({"symbol": "NSE:TCS-EQ", "quantity": 5, "side": -1})
    order_queue.put_nowait({"symbol": "NSE:INVALID-EQ", "quantity": -5, "side": 1}) # invalid
    order_queue.put_nowait({"symbol": "NSE:HDFCBANK-EQ", "quantity": 10, "side": -1}) # net sell 10

    call_count = [0]
    
    async def mock_sleep(delay):
        call_count[0] += 1
        if call_count[0] >= 2:
            raise asyncio.CancelledError()

    with patch('engine.async_executor.asyncio.sleep', side_effect=mock_sleep):
        with patch('fyers_auth.get_fyers_access_token', return_value="fake_token"):
            with patch('engine.async_executor.httpx.AsyncClient.post', new_callable=AsyncMock) as mock_post:
                mock_post.return_value.status_code = 200
                mock_post.return_value.json.return_value = {"s": "ok"}
                
                try:
                    await run_execution_loop(order_queue)
                except asyncio.CancelledError:
                    pass
                
                # Check that queue was drained
                assert order_queue.empty()
                
                # We expect httpx.post to be called once with a chunk of 2 netted orders
                # RELIANCE (10 buy), HDFCBANK (10 sell)
                mock_post.assert_called_once()
                args, kwargs = mock_post.call_args
                assert kwargs["json"] == [
                    {
                        "symbol": "NSE:RELIANCE-EQ",
                        "qty": 10,
                        "type": 2,
                        "side": 1,
                        "productType": "MARGIN",
                        "validity": "DAY"
                    },
                    {
                        "symbol": "NSE:HDFCBANK-EQ",
                        "qty": 10,
                        "type": 2,
                        "side": -1,
                        "productType": "MARGIN",
                        "validity": "DAY"
                    }
                ]

import os
import pyotp
import asyncio
from playwright.async_api import async_playwright
from urllib.parse import urlparse, parse_qs
from fyers_auth import get_fyers_login_url, generate_token_from_auth_code

async def run_automated_login():
    """
    Automated Headless Browser Agent using Playwright.
    Logs into Fyers API V3 by filling out the UI and capturing the auth_code.
    """
    client_id = os.getenv("FYERS_CLIENT_ID")
    totp_key = os.getenv("FYERS_TOTP_KEY")
    pin = os.getenv("FYERS_PIN")

    if not all([client_id, totp_key, pin]):
        print("Missing FYERS_CLIENT_ID, FYERS_TOTP_KEY, or FYERS_PIN in .env. Cannot run auto-auth.")
        return False

    login_url = get_fyers_login_url()
    if not login_url:
        print("Missing FYERS_APP_ID. Cannot generate login URL.")
        return False

    print("Launching Playwright Headless Browser...")
    async with async_playwright() as p:
        # Launch Chromium headless
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            print("Navigating to Fyers Login Page...")
            await page.goto(login_url, timeout=30000)

            # 1. Enter Client ID
            print("Entering Client ID...")
            await page.fill('input[id="fy_client_id"]', client_id)
            await page.click('button[id="clientIdSubmit"]')
            
            # Wait for TOTP screen
            await page.wait_for_selector('input[id="first"]', timeout=10000)

            # 2. Generate and Enter TOTP
            print("Generating and Entering TOTP...")
            totp_code = pyotp.TOTP(totp_key).now()
            
            # Fyers TOTP input has 6 individual boxes
            for i, digit in enumerate(totp_code):
                # The boxes usually have IDs like 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'
                # or we can just type it if the first box auto-advances
                box_selectors = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
                await page.fill(f'input[id="{box_selectors[i]}"]', digit)
                
            await page.click('button[id="confirmOtpSubmit"]')

            # Wait for PIN screen
            await page.wait_for_selector('input[id="first"]', timeout=10000)

            # 3. Enter PIN
            print("Entering PIN...")
            # Similarly, 4 boxes for PIN
            for i, digit in enumerate(pin):
                box_selectors = ['first', 'second', 'third', 'fourth']
                await page.fill(f'input[id="{box_selectors[i]}"]', digit)
                
            await page.click('button[id="verifyPinSubmit"]')

            # 4. Wait for redirection to our redirect_uri
            print("Waiting for OAuth Redirect...")
            
            # We wait for the URL to change to our callback URL
            await page.wait_for_url("**/api/v1/fyers/callback**", timeout=15000)
            
            final_url = page.url
            print(f"Intercepted Redirect URL: {final_url}")
            
            # Extract auth_code
            parsed_url = urlparse(final_url)
            query_params = parse_qs(parsed_url.query)
            
            auth_code = query_params.get("auth_code") or query_params.get("code")
            
            if auth_code:
                print("Extracted auth_code. Generating Final Access Token...")
                generate_token_from_auth_code(auth_code[0])
                print("Automated Auth Agent Finished Successfully!")
                return True
            else:
                print("Failed to find auth_code in the redirect URL.")
                return False

        except Exception as e:
            print(f"Playwright Automation Failed: {e}")
            return False
        finally:
            await browser.close()

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    asyncio.run(run_automated_login())

import base64
import os
import requests
import pyotp
import hashlib
from urllib.parse import urlparse, parse_qs
from fyers_apiv3 import fyersModel
from dotenv import load_dotenv

load_dotenv()

TOKEN_FILE = "fyers_access_token.txt"

def generate_fyers_access_token():
    app_id = os.getenv("FYERS_APP_ID")
    app_secret = os.getenv("FYERS_APP_SECRET")
    redirect_uri = os.getenv("FYERS_REDIRECT_URI", "http://127.0.0.1:8000/api/v1/fyers/callback")
    client_id = os.getenv("FYERS_CLIENT_ID")
    totp_key = os.getenv("FYERS_TOTP_KEY")
    pin = os.getenv("FYERS_PIN")

    if not all([app_id, app_secret, client_id, totp_key, pin]):
        raise Exception("Missing Fyers credentials in environment variables. Please check .env file.")

    try:
        # Step 1: Send OTP request
        req1 = requests.post(
            "https://api-t2.fyers.in/vagator/v2/send_login_otp_v2",
            json={"fy_id": base64.b64encode(client_id.encode()).decode(), "app_id": "2"}
        )
        if not req1.ok:
            raise Exception(f"Failed to send OTP: {req1.text}")
        request_key = req1.json()["request_key"]

        # Step 2: Verify TOTP
        totp = pyotp.TOTP(totp_key).now()
        req2 = requests.post(
            "https://api-t2.fyers.in/vagator/v2/verify_totp",
            json={"request_key": request_key, "otp": totp}
        )
        if not req2.ok:
            raise Exception(f"Failed to verify TOTP: {req2.text}")
        request_key = req2.json()["request_key"]

        # Step 3: Verify PIN
        req3 = requests.post(
            "https://api-t2.fyers.in/vagator/v2/verify_pin_v2",
            json={"request_key": request_key, "identity_type": "pin", "identifier": base64.b64encode(pin.encode()).decode()}
        )
        if not req3.ok:
            raise Exception(f"Failed to verify PIN: {req3.text}")
        access_token = req3.json()["data"]["access_token"]

        # Step 4: Generate Auth Code
        req4 = requests.post(
            "https://api-t1.fyers.in/api/v3/token",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "fyers_id": client_id,
                "app_id": app_id,
                "redirect_uri": redirect_uri,
                "appType": "100",
                "code_challenge": "",
                "state": "None",
                "scope": "",
                "nonce": "",
                "response_type": "code",
                "create_cookie": True
            }
        )
        if not req4.ok:
            raise Exception(f"Failed to generate auth code: {req4.text}")
        auth_code_url = req4.json()["Url"]
        parsed = urlparse(auth_code_url)
        auth_code = parse_qs(parsed.query)["auth_code"][0]

        # Step 5: Get Final Access Token
        session = fyersModel.SessionModel(
            client_id=app_id,
            secret_key=app_secret,
            redirect_uri=redirect_uri,
            response_type="code",
            grant_type="authorization_code"
        )
        session.set_token(auth_code)
        response = session.generate_token()
        if "access_token" in response:
            token = response["access_token"]
            with open(TOKEN_FILE, "w") as f:
                f.write(token)
            print("Successfully generated and saved Fyers Access Token.")
            return token
        else:
            raise Exception(f"Failed to get final access token: {response}")
    except Exception as e:
        print(f"Error in Fyers Auth Flow: {e}")
        return None

def get_fyers_access_token():
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            return f.read().strip()
    return generate_fyers_access_token()

if __name__ == "__main__":
    generate_fyers_access_token()

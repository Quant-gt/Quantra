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

import os
import requests
from urllib.parse import urlencode
from fyers_apiv3 import fyersModel
from dotenv import load_dotenv

load_dotenv()

TOKEN_FILE = "fyers_access_token.txt"

def get_fyers_login_url():
    """Generates the URL the Admin must visit to authorize the app"""
    app_id = os.getenv("FYERS_APP_ID")
    redirect_uri = os.getenv("FYERS_REDIRECT_URI", "http://127.0.0.1:8000/api/v1/fyers/callback")
    
    if not app_id:
        return None
        
    session = fyersModel.SessionModel(
        client_id=app_id,
        secret_key=os.getenv("FYERS_APP_SECRET"),
        redirect_uri=redirect_uri,
        response_type="code",
        grant_type="authorization_code"
    )
    return session.generate_authcode()

def generate_token_from_auth_code(auth_code: str):
    """Takes the auth_code from the callback URL and gets the final access token"""
    app_id = os.getenv("FYERS_APP_ID")
    app_secret = os.getenv("FYERS_APP_SECRET")
    redirect_uri = os.getenv("FYERS_REDIRECT_URI", "http://127.0.0.1:8000/api/v1/fyers/callback")

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

def get_fyers_access_token():
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            return f.read().strip()
    return None

if __name__ == "__main__":
    print("Login URL:", get_fyers_login_url())

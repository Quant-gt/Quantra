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
_IN_MEMORY_TOKEN = None

def encrypt_token(token: str, key: str) -> str:
    if not key:
        return token
    key_bytes = key.encode()
    token_bytes = token.encode()
    encrypted = bytes([token_bytes[i] ^ key_bytes[i % len(key_bytes)] for i in range(len(token_bytes))])
    return base64.b64encode(encrypted).decode()

def decrypt_token(encrypted_token: str, key: str) -> str:
    if not key:
        return encrypted_token
    try:
        encrypted_bytes = base64.b64decode(encrypted_token.encode())
        key_bytes = key.encode()
        decrypted = bytes([encrypted_bytes[i] ^ key_bytes[i % len(key_bytes)] for i in range(len(encrypted_bytes))])
        return decrypted.decode()
    except Exception:
        return None

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
    global _IN_MEMORY_TOKEN
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
        _IN_MEMORY_TOKEN = token
        
        # Save encrypted on disk
        encrypted = encrypt_token(token, app_secret)
        try:
            with open(TOKEN_FILE, "w") as f:
                f.write(encrypted)
        except Exception as write_err:
            print(f"Warning: could not write token to file: {write_err}")
            
        print("Successfully generated and saved Fyers Access Token (encrypted on disk).")
        return token
    else:
        raise Exception(f"Failed to get final access token: {response}")

def get_fyers_access_token():
    global _IN_MEMORY_TOKEN
    if _IN_MEMORY_TOKEN:
        return _IN_MEMORY_TOKEN
        
    if os.path.exists(TOKEN_FILE):
        try:
            with open(TOKEN_FILE, "r") as f:
                encrypted_token = f.read().strip()
            app_secret = os.getenv("FYERS_APP_SECRET")
            decrypted = decrypt_token(encrypted_token, app_secret)
            if decrypted:
                _IN_MEMORY_TOKEN = decrypted
                return decrypted
        except Exception as read_err:
            print(f"Warning: could not read/decrypt Fyers token from file: {read_err}")
    return None

if __name__ == "__main__":
    print("Login URL:", get_fyers_login_url())

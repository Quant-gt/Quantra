import base64
import os
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
            
        # Save to Supabase
        supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        if supabase_url and supabase_key:
            try:
                import urllib.request
                import json
                
                # Fetch first user_id
                user_id = None
                req = urllib.request.Request(
                    f"{supabase_url}/rest/v1/users?select=id&limit=1",
                    headers={
                        "apikey": supabase_key,
                        "Authorization": f"Bearer {supabase_key}"
                    }
                )
                with urllib.request.urlopen(req) as resp:
                    users = json.loads(resp.read().decode("utf-8"))
                    if users:
                        user_id = users[0]["id"]
                
                if user_id:
                    # Upsert connection details
                    payload = {
                        "user_id": user_id,
                        "broker_name": "fyers",
                        "encrypted_access_token": encrypted,
                        "status": "connected"
                    }
                    upsert_req = urllib.request.Request(
                        f"{supabase_url}/rest/v1/broker_connections",
                        headers={
                            "apikey": supabase_key,
                            "Authorization": f"Bearer {supabase_key}",
                            "Content-Type": "application/json",
                            "Prefer": "resolution=merge-duplicates"
                        },
                        data=json.dumps(payload).encode("utf-8"),
                        method="POST"
                    )
                    with urllib.request.urlopen(upsert_req) as resp:
                        print("Successfully saved Fyers Access Token to Supabase.")
            except Exception as db_err:
                print(f"Warning: could not write token to Supabase: {db_err}")
            
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
            
    # Fallback to Supabase
    supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if supabase_url and supabase_key:
        try:
            import urllib.request
            import json
            req = urllib.request.Request(
                f"{supabase_url}/rest/v1/broker_connections?broker_name=eq.fyers&select=encrypted_access_token&limit=1",
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}"
                }
            )
            with urllib.request.urlopen(req) as resp:
                conns = json.loads(resp.read().decode("utf-8"))
                if conns:
                    encrypted_token = conns[0]["encrypted_access_token"]
                    app_secret = os.getenv("FYERS_APP_SECRET")
                    decrypted = decrypt_token(encrypted_token, app_secret)
                    if decrypted:
                        _IN_MEMORY_TOKEN = decrypted
                        # Save it locally for future fast lookups
                        try:
                            with open(TOKEN_FILE, "w") as f:
                                f.write(encrypted_token)
                        except Exception:
                            pass
                        return decrypted
        except Exception as db_err:
            print(f"Warning: could not read Fyers token from Supabase: {db_err}")
            
    return None

if __name__ == "__main__":
    print("Login URL:", get_fyers_login_url())

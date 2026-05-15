import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def get_db() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        print("CRITICAL: SUPABASE_URL or SUPABASE_KEY not found in .env file!")
        return None
    
    try:
        supabase: Client = create_client(url, key)
        return supabase
    except Exception as e:
        print(f"CRITICAL: Failed to connect to Supabase! Error: {e}")
        return None

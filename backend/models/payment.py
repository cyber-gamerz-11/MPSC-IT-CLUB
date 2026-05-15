from backend.config.db import get_db
import datetime

class Payment:
    @staticmethod
    def create(data):
        db = get_db()
        if not db: return None
        
        # Mapping fields to SQL schema
        # In SQL: member_id is the user's UUID
        sql_data = {
            "event_id": data.get('event_id'),
            "member_id": data.get('user_id'), # Mapping user_id to member_id column
            "ref_email": data.get('ref_email'),
            "transaction_id": data.get('transaction_id'),
            "status": 'pending'
        }
        
        response = db.table("payments").insert(sql_data).execute()
        return response.data[0]['id'] if response.data else None

    @staticmethod
    def get_by_user(user_id):
        db = get_db()
        if not db: return []
        response = db.table("payments").select("*").eq("member_id", user_id).order("created_at", desc=True).execute()
        return response.data

    @staticmethod
    def get_all():
        db = get_db()
        if not db: return []
        response = db.table("payments").select("*").order("created_at", desc=True).execute()
        return response.data

    @staticmethod
    def verify(payment_id, status):
        db = get_db()
        if not db: return
        db.table("payments").update({"status": status}).eq("id", payment_id).execute()

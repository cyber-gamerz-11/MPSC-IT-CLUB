from backend.config.db import get_db

class Event:
    @staticmethod
    def get_all():
        db = get_db()
        if not db: return []
        response = db.table("events").select("*").order("date", desc=False).execute()
        return response.data

    @staticmethod
    def get_by_id(event_id):
        db = get_db()
        if not db: return None
        response = db.table("events").select("*").eq("id", event_id).execute()
        return response.data[0] if response.data else None

    @staticmethod
    def create(data):
        db = get_db()
        if not db: return None
        response = db.table("events").insert(data).execute()
        return response.data[0]['id'] if response.data else None

    @staticmethod
    def update_status(event_id, status):
        db = get_db()
        if not db: return
        db.table("events").update({"status": status}).eq("id", event_id).execute()

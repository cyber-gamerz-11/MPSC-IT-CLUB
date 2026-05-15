from flask import Blueprint, jsonify, request
from backend.models.event import Event
from flask_login import login_required, current_user

event_bp = Blueprint('events', __name__)

@event_bp.route('/', methods=['GET'])
def get_events():
    events = Event.get_all()
    return jsonify(events)

@event_bp.route('/register', methods=['POST'])
@login_required
def register_event():
    # Registration logic could be added here, currently handled via payment verification
    return jsonify({"success": "Registration initiated"}), 200

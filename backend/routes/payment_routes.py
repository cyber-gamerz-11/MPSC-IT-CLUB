from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.config.db import get_db
from backend.models.payment import Payment

payment_bp = Blueprint('payments', __name__)

@payment_bp.route('/submit', methods=['POST'])
@login_required
def submit_payment():
    data = request.form.to_dict()
    
    payment_data = {
        "user_id": current_user.id,
        "event_id": data.get('event_id'),
        "transaction_id": data.get('txid'),
        "ref_email": data.get('ref_email')
    }
    
    try:
        Payment.create(payment_data)
        return jsonify({"success": "Payment submitted for verification"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payment_bp.route('/history')
@login_required
def payment_history():
    history = Payment.get_by_user(current_user.id)
    return jsonify(history)

# Admin Routes
@payment_bp.route('/all_pending')
@login_required
def all_pending():
    if current_user.role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    payments = Payment.get_all()
    pending = [p for p in payments if p['status'] == 'pending']
    return jsonify(pending)

@payment_bp.route('/verify', methods=['POST'])
@login_required
def verify_payment():
    if current_user.role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.json
    Payment.verify(data['id'], data['status'])
    return jsonify({"success": "Payment status updated"}), 200

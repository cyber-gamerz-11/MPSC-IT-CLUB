from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
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
    status = data['status']
    payment_id = data['id']
    
    db = get_db()
    
    # If approving, add to permanent revenue
    if status == 'approved':
        # Get the payment and event fee
        p_res = db.table("payments").select("event_id, amount").eq("id", payment_id).execute()
        if p_res.data:
            payment = p_res.data[0]
            # Use event fee if amount not already set
            amount = payment.get('amount') or 0
            if amount == 0:
                e_res = db.table("events").select("fee").eq("id", payment['event_id']).execute()
                if e_res.data:
                    amount = int(e_res.data[0].get('fee', 0) or 0)
                    # Lock the amount in the payment record
                    db.table("payments").update({"amount": amount}).eq("id", payment_id).execute()
            
            # Increment total_revenue in club_stats
            db.rpc('increment_revenue', {'amount_to_add': amount}).execute()

    Payment.verify(payment_id, status)
    return jsonify({"success": "Payment status updated"}), 200

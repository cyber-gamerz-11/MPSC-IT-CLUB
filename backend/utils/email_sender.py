import resend
import os
from dotenv import load_dotenv

load_dotenv()

def send_reset_email(to_email, reset_link):
    api_key = os.getenv("RESEND_API_KEY")
    
    if not api_key:
        print("CRITICAL: RESEND_API_KEY missing in .env")
        return False

    resend.api_key = api_key

    html_content = f"""
    <html>
    <body style="background-color: #0a0a0a; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background: #111111; border: 1px solid #00ff88; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);">
            <h1 style="color: #00ff88; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 20px;">MPSC IT CLUB</h1>
            <div style="height: 1px; background: rgba(0, 255, 136, 0.2); margin-bottom: 30px;"></div>
            <p style="font-size: 1.1rem; line-height: 1.6; color: #e0e0e0;">Hello member,</p>
            <p style="font-size: 1rem; line-height: 1.6; color: #b0b0b0;">A password reset was requested for your account. If this was you, click the button below to secure your identity:</p>
            <a href="{reset_link}" style="display: inline-block; margin-top: 30px; padding: 15px 40px; background-color: #00ff88; color: #0a0a0a; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">RESET PASSWORD</a>
            <p style="margin-top: 40px; font-size: 0.85rem; color: #666666;">This link is valid for 1 hour.<br>If you didn't request this, ignore this email.</p>
            <div style="margin-top: 30px; font-size: 0.8rem; color: #444444;">
                © 2026 MPSC IT CLUB. Digital Excellence.
            </div>
        </div>
    </body>
    </html>
    """

    try:
        params = {
            "from": "MPSC IT CLUB <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Reset Your Password - MPSC IT CLUB",
            "html": html_content,
        }
        
        response = resend.Emails.send(params)
        print(f"RESEND SUCCESS: {response}")
        return True
    except Exception as e:
        print(f"RESEND ERROR: {e}")
        return False

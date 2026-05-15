# MPSC IT CLUB - Futuristic Full-Stack Platform

A premium, interactive, and futuristic website for MPSC IT CLUB built with Flask, MongoDB, and modern frontend technologies.

## Features
- **Cinematic Landing Page**: GSAP animations, typing effects, and interactive grid.
- **Circular Navigation**: Signature rotating semi-circle menu.
- **Full Authentication**: Secure signup/login with Member ID generation.
- **Glassmorphism Dashboard**: Personalized portal for members.
- **Digital Membership**: Automatic QR code generation and Digital ID card.
- **Event Management**: List, detail, and registration system.
- **bKash Payment**: Manual verification flow for event fees.
- **Admin Panel**: Full control over payments, users, and events.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS, JavaScript, GSAP.
- **Backend**: Python Flask.
- **Database**: MongoDB (Atlas/Local).
- **Auth**: Flask-Login.

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd MPSC-IT-CLUB
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup environment variables:
   - Copy `.env.example` to `.env`.
   - Update `MONGO_URI` and `SECRET_KEY`.

4. Run the application:
   ```bash
   python backend/app.py
   ```

## Folder Structure
- `frontend/`: All static files, styles, and scripts.
- `backend/`: Flask application, routes, models, and utils.

## Credits
Built with passion by MPSC IT CLUB.

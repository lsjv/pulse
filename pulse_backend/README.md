Pulse Django Backend
====================

This project was generated from the uploaded DJANGO_BACKEND.md.

Quick start:

    python -m venv venv
    source venv/bin/activate   # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

API base: /api/

Notes:
- Settings use SQLite by default.
- AUTH_USER_MODEL = 'api.User' is already configured.
- CORS allowed origins include localhost ports for common frontend dev setups.

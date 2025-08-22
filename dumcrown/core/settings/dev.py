from .base import *
import os

SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')


DEBUG = bool(int(os.getenv('DEBUG', 1)))

ALLOWED_HOSTS = [
    h.strip() for h in os.getenv('ALLOWED_HOSTS', '').split(',')
    if h.strip()
]


# Database
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'change-me'),
        'NAME': os.getenv('POSTGRES_DB', 'change-me'),
        'USER': os.getenv('POSTGRES_USER', 'change-me'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'change-me'),
        'HOST': os.getenv('POSTGRES_HOST', 'change-me'),
        'PORT': os.getenv('POSTGRES_PORT', 'change-me'),
    }
}

TEMPLATE_DEBUG = True
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
CORS_ALLOW_ALL_ORIGINS = True

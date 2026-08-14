
from .base import *
import os


SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')


DEBUG = bool(int(os.getenv('DEBUG', 0)))

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

TEMPLATE_DEBUG = False


CSRF_TRUSTED_ORIGINS = [
    'https://gabrielafonso.com.br',
    'https://www.gabrielafonso.com.br',
]
IN_PRODUCTION = True
SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO", "https") if IN_PRODUCTION else None
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CORS_ALLOW_ALL_ORIGINS = False

# App is served under https://gabrielafonso.com.br/dumcrown/ behind an nginx
# proxy_pass with a trailing slash, so Django receives paths without the
# /dumcrown prefix and has to re-add it when generating URLs.
FORCE_SCRIPT_NAME = '/dumcrown'
USE_X_FORWARDED_HOST = True

# The domain is shared with the portfolio, ipbcb, picpay and cobblemon apps,
# so cookies need their own path and name to avoid collisions.
CSRF_COOKIE_PATH = '/dumcrown/'
SESSION_COOKIE_PATH = '/dumcrown/'
CSRF_COOKIE_NAME = 'dumcrown_csrftoken'
SESSION_COOKIE_NAME = 'dumcrown_sessionid'

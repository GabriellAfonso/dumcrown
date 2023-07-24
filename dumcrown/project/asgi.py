"""
ASGI config for project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.urls import re_path
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing  import ProtocolTypeRouter, URLRouter

import dumcrown.routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
print('to aqui asgi')
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            dumcrown.routing.websocket_urlpatterns
        ),
    ),
})



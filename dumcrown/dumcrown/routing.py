# routing.py
from django.urls import re_path
from dumcrown.server import consumer

websocket_urlpatterns = [
    re_path(r'ws/game/$', consumer.PlayerConsumer.as_asgi()),
]

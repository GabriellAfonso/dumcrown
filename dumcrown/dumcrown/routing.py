# routing.py
from django.urls import re_path
from . import consumers

print(r'ws/game/$', consumers.PlayerConsumer.as_asgi())
websocket_urlpatterns = [
    re_path(r'ws/game/$', consumers.PlayerConsumer.as_asgi()),
]
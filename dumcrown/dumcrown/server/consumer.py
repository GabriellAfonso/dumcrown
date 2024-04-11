import logging
import json
import asyncio
from django.utils import timezone
from celery import current_app
from channels.generic.websocket import AsyncWebsocketConsumer

from .room import GameRoom
from .match import GameMatch
from .functions import get_player, save_player, get_online_players
from .codes import code_handlers


class PlayerConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            self.user = None

        except Exception as e:
            logging.error(f'Error in consumer init: {e}', exc_info=True)

    async def connect(self):
        try:
            await self.accept()
            self.user = self.scope["user"]

        except Exception as e:
            logging.error(f'Error in connect: {e}', exc_info=True)

    async def disconnect(self, message):
        try:

            pass
        except Exception as e:
            logging.error(f'Error in disconnect: {e}', exc_info=True)

    async def receive(self, text_data):
        try:
            message = json.loads(text_data)

            for code, handler in code_handlers.items():
                if code in message["code"]:
                    func = getattr(
                        handler['object'](self),
                        handler['method']
                    )
                    if message['data']:
                        await func(message['data'])
                    elif not message['data']:
                        await func()

        except Exception as e:
            logging.error(f'Error in receive: {e}', exc_info=True)

    # receive message from group

    async def send_to_client(self, code, data):
        message = {
            'code': code,
            'data': data,
        }
        await self.send(text_data=json.dumps(message))

    async def send_message(self, event):
        message_types = {'message',
                         'player_data',
                         'addexp',
                         'room_update',
                         'room_close',
                         'clear_room',
                         'start_match',
                         'match_update',
                         'player_pass',
                         'round_update',
                         'hp_update',
                         'energy_update',
                         'adversary_field',
                         'adversary_attack',
                         'adversary_defese',
                         'resolve',
                         'damage_Result',
                         }

        for message_type in message_types:
            if message_type in event:
                message_data = {message_type: event[message_type]}
                await self.send(text_data=json.dumps(message_data))
                break

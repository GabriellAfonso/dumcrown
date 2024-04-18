import logging
import json
import asyncio
from django.utils import timezone
from celery import current_app
from channels.generic.websocket import AsyncWebsocketConsumer

from .room import GameRoom
from .match import GameMatch
from .functions import player_connected, player_disconnected, player_is_online
from .codes import code_handlers


class DenyConnection(Exception):
    def __init__(self, message, code=1008):
        self.message = message
        self.code = code


class PlayerConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            self.user = None
            self.channel = None
            self.connection_denied = False

        except Exception as e:
            logging.error(f'Error in consumer init: {e}', exc_info=True)

    async def connect(self):
        try:
            self.user = self.scope["user"]
            self.channel = self.channel_name
            await self.accept()
            if await self.check_player_already_online():
                return

            print('continuou')
            await player_connected(self.user, self.channel)

        except Exception as e:
            logging.error(f'Error in connect: {e}', exc_info=True)

    async def disconnect(self, message):
        try:
            if self.connection_denied:
                return
            print('passou no disconnect')
            await player_disconnected(self.user)
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

    async def send_to_client(self, code, data=''):
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

    async def check_player_already_online(self):
        already_online = await player_is_online(self.user)

        if already_online:
            self.connection_denied = True
            await self.send_to_client('already_online')
            await self.close()
            return True

        return False

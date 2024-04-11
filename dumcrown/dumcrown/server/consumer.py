import logging
import json
import asyncio
from django.utils import timezone
from celery import current_app
from channels.generic.websocket import AsyncWebsocketConsumer

from .client import ClientData
from .validators import GameValidators
from .room import GameRoom
from .match import GameMatch
from .functions import get_player, save_player, get_online_players
from .codes import code_handlers


class PlayerConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            self.client_data = ClientData(self)
            self.game_validators = GameValidators(self)
            self.game_room = GameRoom(self)
            self.game_match = GameMatch(self)

            self.matches = self.game_match.matches
            self.rooms = self.game_room.rooms

        except Exception as e:
            logging.error(f'Error in consumer init: {e}', exc_info=True)

    async def connect(self):
        try:
            await self.accept()

            user = self.scope["user"]
            player = await get_player(user)
            player.is_online = True
            player.last_active = timezone.now()

            await save_player(player)

        except Exception as e:
            logging.error(f'Error in connect: {e}', exc_info=True)

    async def disconnect(self, message):
        # criar task pra ficar offline
        try:

            user = self.scope["user"]
            player = await get_player(user)

            # verifica se esta na queue
            for i, player_data in enumerate(self.game_room.queue):
                if player_data['nickname'] == player.nickname:
                    self.game_room.queue.pop(i)

                    break

            current_app.send_task(
                'dumcrown.tasks.disconnect_player',
                args=[player.nickname])

            # Verifica se está em uma partida
            for matchDB in self.matches.values():
                if self.channel_name in (matchDB['player1']['channel'], matchDB['player2']['channel']):
                    await self.game_match.give_up('', {'give_up': matchDB['match_id']})

                    current_app.send_task(
                        'dumcrown.tasks.disconnect_in_match',
                        args=[player.nickname])

            # Verifica se está em uma room

            for roomDB in self.rooms.values():
                if self.channel_name in (roomDB['player1']['channel'], roomDB['player2']['channel']):
                    await self.game_room.leave_room('', {'leave_room': roomDB['room_id']})

        except Exception as e:
            logging.error(f'Error in disconnect: {e}', exc_info=True)

    async def receive(self, text_data):
        try:
            user = self.scope["user"]
            message = json.loads(text_data)

            for code, handler_name in code_handlers.items():
                if code in message["code"]:
                    handler = getattr(self, handler_name)
                    await handler(user, message['data'])
        except Exception as e:
            logging.error(f'Error in receive: {e}', exc_info=True)

    # receive message from group

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

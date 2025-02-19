import logging
import json
import time
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

from .room import GameRoom
from .match import MatchManager
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
            # Dicionário para armazenar timestamps das últimas requisições
            self.last_request_times = {}
        except Exception as e:
            logging.error(f'Error in consumer init: {e}', exc_info=True)

    async def connect(self):
        try:
            print('conectando', self.user)

            self.user = self.scope["user"].id
            self.channel = self.channel_name
            self.game_room = GameRoom(self)
            self.match_manager = MatchManager(self)

            await self.accept()
            if await self.check_player_already_online():
                return

            await player_connected(self.user, self.channel)

        except Exception as e:
            logging.error(f'Error in connect: {e}', exc_info=True)

    async def disconnect(self, message):
        try:
            if self.connection_denied:
                return

            print('desconectando')
            await self.game_room.leave_room()
            await self.game_room.quit_from_queue()
            await self.match_manager.give_up()
            await player_disconnected(self.user)
        except Exception as e:
            logging.error(f'Error in disconnect: {e}', exc_info=True)

    async def receive(self, text_data):
        try:
            message = json.loads(text_data)
            code = message["code"]
            data = message.get("data", "")

            # Verifica se a requisição é gerenciada pelo match_manager
            if code in self.get_match_manager_codes():
                # Aplica a limitação de taxa apenas para ações do match_manager
                if not await self.is_request_allowed(code):
                    logging.warning(
                        f"Requisição ignorada: código {code} enviado repetidamente.")
                    return

            # Processa a requisição
            for handler_code, handler in code_handlers.items():
                if handler_code in code:
                    func = getattr(
                        handler['object'](self),
                        handler['method']
                    )
                    if data:
                        await func(data)
                    else:
                        await func()

        except Exception as e:
            logging.error(f'Error in receive: {e}', exc_info=True)

    async def is_request_allowed(self, code):
        """
        Verifica se a requisição é permitida com base no tempo desde a última requisição.
        """
        current_time = time.time()
        last_request_time = self.last_request_times.get(code, 0)

        # Intervalo mínimo entre requisições (em segundos)
        MIN_INTERVAL = 0.5  # 500ms

        if current_time - last_request_time < MIN_INTERVAL:
            return False  # Requisição não permitida
        else:
            # Atualiza o timestamp da última requisição
            self.last_request_times[code] = current_time
            return True  # Requisição permitida

    def get_match_manager_codes(self):
        """
        Retorna a lista de códigos de ação gerenciados pelo match_manager.
        """
        return [
            'is_player_in_match',
            'give_up',
            'start_match',
            'ready',
            'play_card',
            'play_spell',
            'player_pass',
            'offensive_card',
            'player_clash',
            'defensive_card',

            'save_deck',  # Provisorio
        ]

    async def receive_from_consumer(self, event):
        await self.send(text_data=json.dumps(event))

    async def send_to_client(self, code, data=''):
        message = {
            'code': code,
            'data': data,
        }
        await self.send(text_data=json.dumps(message))

    async def send_to_group(self, group, code, data=''):
        message = {
            'type': 'receive_from_consumer',
            'code': code,
            'data': data,
        }
        await self.channel_layer.group_send(group, message)

    async def send_to_channel(self, channel_name, code, data=''):
        """
        Envia uma mensagem diretamente para um canal específico.
        """
        channel_layer = get_channel_layer()
        message = {
            'type': 'receive_from_consumer',  # O handler dentro do consumidor que será chamado
            'code': code,
            'data': data,
        }
        await channel_layer.send(channel_name, message)

    async def check_player_already_online(self):
        already_online = await player_is_online(self.user)

        if already_online:
            self.connection_denied = True
            await self.send_to_client('already_online')
            await self.close()
            return True

        return False

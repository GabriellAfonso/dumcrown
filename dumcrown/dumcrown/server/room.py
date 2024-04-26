import json
import logging
import random
import asyncio
from .functions import get_player


class GameRoom:
    rooms = {}
    queue = []

    def __init__(self, consumer):
        self.consumer = consumer
        self.user = consumer.user
        self.channel = consumer.channel
        self.queue_lock = asyncio.Lock()

    async def match_making(self, user, data):
        try:
            player = await get_player(user)

            # Lógica para verificar se há outros jogadores na fila

            playerData = {'channel': self.consumer.channel_name,
                          'nickname': player.nickname,
                          'arena': player.arena,
                          'icon': player.icon,
                          'border': player.border,
                          'level': player.level,
                          'crown_points': player.crown_points,
                          }

            async with self.queue_lock:
                if playerData not in self.queue:
                    self.queue.append(playerData)

            if len(self.queue) >= 2:
                # Pareamento aleatório
                jogador1 = self.queue.pop(
                    random.randint(0, len(self.queue) - 1))
                jogador2 = self.queue.pop(
                    random.randint(0, len(self.queue) - 1))

                # Criar um canal para o grupo específico
                while True:
                    room_id = str(random.randint(1000, 9999))
                    if room_id not in self.rooms:
                        break

                await self.consumer.channel_layer.group_add(
                    room_id,
                    jogador1['channel'],
                )
                await self.consumer.channel_layer.group_add(
                    room_id,
                    jogador2['channel'],
                )

                self.rooms[room_id] = {
                    'room_id': room_id,
                    'player1': jogador1,
                    'player2': jogador2
                }

                await self.consumer.channel_layer.group_send(room_id, {
                    'type': 'send_message',
                    'room_update': self.rooms[room_id],
                })

                # mandar um pre start pros dois
                await self.consumer.send(text_data=json.dumps({'call_start': ''}))

        except Exception as e:
            logging.error(f'Error in match_making: {e}', exc_info=True)

    async def quit_from_queue(self, user, data):
        try:
            player = await get_player(user)

            for i, player_data in enumerate(self.queue):
                if player_data['nickname'] == player.nickname:
                    self.queue.pop(i)

                    break
        except Exception as e:
            logging.error(f'Error in quit_from_queue: {e}', exc_info=True)

    async def create_room(self):
        try:
            room_id = await self.generate_room_id()

            player = await get_player(self.user)
            await self.consumer.channel_layer.group_add(room_id, self.channel)

            self.rooms[room_id] = {'room_id': room_id, 'owner': self.user, }
            self.rooms[room_id]['player1'] = await self.get_player_data(player)

            await self.consumer.send_to_client('room_update', self.rooms[room_id])
            await self.consumer.send_to_client('room_open')
        except Exception as e:
            logging.error(f'Error in create_room: {e}', exc_info=True)

    async def join_room(self, data):
        try:
            room_id = data
            player = await get_player(self.user)
            room = self.rooms.get(room_id)

            if not room:
                await self.consumer.send_to_client('room_error_msg', 'Sala não encontrada')
                return

            if room.get('player2'):
                await self.consumer.send_to_client('room_error_msg', 'Sala cheia')
                return

            room['player2'] = await self.get_player_data(player)
            await self.consumer.channel_layer.group_add(room_id, self.channel)

            await self.consumer.channel_layer.group_send(room_id, {
                'type': 'receive_from_consumer',
                'code': 'room_update',
                'data': self.rooms[room_id],
            })

            await self.consumer.send_to_client('room_open')
        except Exception as e:
            logging.error(f'Error in join_room: {e}', exc_info=True)

    async def leave_room(self):
        try:
            # ver em qual sala eu estou e me desconectar dela
            room_id = await self.find_player_room(self.user)

            room = self.rooms.get(room_id)

            player1_channel = room.get('player1', {}).get('channel')
            player2_channel = room.get('player2', {}).get('channel')

            if room['owner'] == self.user:
                # TODO: clear room imbutido no room_close
                await self.consumer.send_to_client('room_close')
                await self.consumer.channel_layer.group_discard(room_id, self.consumer.channel_name)

                if room.get('player2'):
                    # faz o player 2 virar o player 1(dono da sala)
                    player2 = await get_player(room['player2']['id'])
                    self.rooms[room_id]['owner'] = player2.id
                    self.rooms[room_id]['player1'] = await self.get_player_data(player2)

                    del self.rooms[room_id]['player2']

                    await self.consumer.channel_layer.send(
                        player2_channel,
                        {
                            'type': 'receive_from_consumer',
                            'code': 'room_update',
                            'data': self.rooms[room_id],
                        })
                    return

                del self.rooms[room_id]
                return

        # if Not owner

            await self.consumer.send_to_client('room_close')
            await self.consumer.channel_layer.group_discard(room_id, self.channel)

            del self.rooms[room_id]['player2']

            await self.consumer.channel_layer.send(
                player1_channel,
                {
                    'type': 'receive_from_consumer',
                    'code': 'room_update',
                    'data': self.rooms[room_id],
                })

        except Exception as e:
            logging.error(f'Error in leave_room: {e}', exc_info=True)

    async def find_player_room(self, player_id):
        for room_id, room_info in self.rooms.items():
            if room_info['player1']['id'] == player_id:
                return room_id
            elif room_info['player2']['id'] == player_id:
                return room_id
        return None

    async def generate_room_id(self):
        while True:
            room_id = str(random.randint(1000, 9999))
            if room_id not in self.rooms:
                return room_id

    async def get_player_data(self, player):
        data = {'id': player.id,
                'channel': player.connection.channel,
                'nickname': player.nickname,
                'arena': player.arena,
                'icon': player.icon,
                'border': player.border,
                'level': player.level,
                'crown_points': player.crown_points, }
        return data

    async def delete_room(self, user='', data=''):
        try:
            room_id = data['delete_room']
            room = self.rooms.get(room_id)

            player1_channel = room['player1']['channel']
            player2_channel = room['player2']['channel']

            if player1_channel == self.consumer.channel_name or player2_channel == self.consumer.channel_name:

                await self.consumer.channel_layer.group_send(room_id, {
                    'type': 'send_message',
                    'clear_room': 'clear',
                })

                try:
                    await self.consumer.channel_layer.group_discard(room_id, player1_channel)
                except:
                    logging.error(
                        'player 1 provavelmente ja se desconectou', exc_info=True)

                try:
                    await self.consumer.channel_layer.group_discard(room_id, player2_channel)
                except:
                    logging.error(
                        'player 2 provavelmente ja se desconectou', exc_info=True)

                del self.rooms[room_id]

        except Exception as e:
            logging.error(f'Error in delete_room: {e}', exc_info=True)

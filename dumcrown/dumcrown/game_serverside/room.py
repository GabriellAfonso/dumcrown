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
                            'level':player.level,
                            'crown_points': player.crown_points,
                            }
                
           
            
            async with self.queue_lock:
                if playerData not in self.queue:
                    self.queue.append(playerData)
         

            if len(self.queue) >= 2:
                # Pareamento aleatório
                jogador1 = self.queue.pop(random.randint(0, len(self.queue) - 1))
                jogador2 = self.queue.pop(random.randint(0, len(self.queue) - 1))

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

                #mandar um pre start pros dois
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



    async def create_room(self, user, data):
        try:
            while True:
                room_id = str(random.randint(1000, 9999))
                if room_id not in self.rooms:
                    break

            player = await get_player(user)
            await self.consumer.channel_layer.group_add(room_id, self.consumer.channel_name)

            self.rooms[room_id] = {
                'room_id': room_id,
                'player1': {'channel': self.consumer.channel_name, 
                            'nickname': player.nickname,
                            'arena': player.arena,
                            'icon': player.icon,
                            'border': player.border,
                            'level':player.level,
                            'crown_points': player.crown_points,
                            },
                'player2': {'channel': '', 
                            'nickname': '', 
                            'arena': '',
                            'icon': 'empty',
                            'border': 'empty',
                            'level': '',
                            'crown_points': '',
                            }
    }
            
            await self.consumer.send(text_data=json.dumps({'room_update': self.rooms[room_id]}))
            await self.consumer.send(text_data=json.dumps({'room_open': 'open scene'}))
        except Exception as e:
            logging.error(f'Error in create_room: {e}', exc_info=True)



    async def join_room(self, user, data):
        try:
            room_id = data['join_room']
            player = await get_player(user)
            room = self.rooms.get(room_id)
            
            if not room:
                await self.consumer.send(text_data=json.dumps({'room_error_msg': 'Sala não encontrada'}))
                return


            if room['player2']['channel']:
                await self.consumer.send(text_data=json.dumps({'room_error_msg': 'Sala cheia'}))
                
            else:
                await self.consumer.channel_layer.group_add(room_id, self.consumer.channel_name)

                room['player2'] = {
                                'channel': self.consumer.channel_name,
                                'nickname': player.nickname,
                                'arena': player.arena,
                                'icon': player.icon,
                                'border': player.border,
                                'level': player.level,
                                'crown_points': player.crown_points,
                                }

                await self.consumer.channel_layer.group_send(room_id, {
                    'type': 'send_message', 
                    'room_update': self.rooms[room_id],
                })

                await self.consumer.send(text_data=json.dumps({'room_open': 'open scene'}))
        except Exception as e:
            logging.error(f'Error in join_room: {e}', exc_info=True)



    async def leave_room(self, user='', data=''):
        try:
            room_id = data['leave_room']
         
            room = self.rooms.get(room_id)
           

            player1_channel = room['player1']['channel']
            player2_channel = room['player2']['channel']

            if player1_channel == self.consumer.channel_name:
          
                await self.consumer.send(text_data=json.dumps({'room_close': 'close'}))
                await self.consumer.send(text_data=json.dumps({'clear_room': 'clear'}))
                await self.consumer.channel_layer.group_discard(room_id, self.consumer.channel_name)
        
                if player2_channel:
                    # faz o player 2 virar o player 1(dono da sala)
                    self.rooms[room_id]['player1'] = {
                        'channel': player2_channel, 
                        'nickname': room['player2']['nickname'],
                        'arena': room['player2']['arena'], 
                        'icon': room['player2']['icon'],
                        'border': room['player2']['border'],
                        'level': room['player2']['level'],
                        'crown_points': room['player2']['crown_points'],
                        }
                    
                    self.rooms[room_id]['player2'] = {
                        'channel': '', 
                        'nickname': '',
                        'arena': '', 
                        'icon': 'empty',
                        'border': 'empty',
                        'level': '',
                        'crown_points': '',
                        }
                    
                    await self.consumer.channel_layer.send(player2_channel,
                        {
                        'type': 'send_message', 
                        'room_update': self.rooms[room_id],
                        })
                else:               
                    del self.rooms[room_id]


            if player2_channel == self.consumer.channel_name:
                await self.consumer.send(text_data=json.dumps({'room_close': 'close scene'}))
                await self.consumer.send(text_data=json.dumps({'clear_room': 'clear'}))
                await self.consumer.channel_layer.group_discard(room_id, player2_channel)
    
                self.rooms[room_id]['player2'] = {
                    'channel': '',
                    'nickname': '',
                    'arena': '',
                    'icon': 'empty',
                    'border': 'empty',
                    'level': '',
                    'crown_points': '',
                    }
                await self.consumer.channel_layer.send(player1_channel,
                        {
                        'type': 'send_message', 
                        'room_update': self.rooms[room_id],
                        })

        except Exception as e:
            logging.error(f'Error in leave_room: {e}', exc_info=True)



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
                    logging.error('player 1 provavelmente ja se desconectou', exc_info=True)

                try:
                    await self.consumer.channel_layer.group_discard(room_id, player2_channel)
                except:
                    logging.error('player 2 provavelmente ja se desconectou', exc_info=True)

                del self.rooms[room_id]             
              
        except Exception as e:
            logging.error(f'Error in delete_room: {e}', exc_info=True)

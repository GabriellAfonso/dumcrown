import logging
import json
import asyncio
from django.utils import timezone
from celery import current_app
from channels.generic.websocket import AsyncWebsocketConsumer

from .game_serverside.client import ClientData
from .game_serverside.validators import GameValidators
from .game_serverside.room import GameRoom
from .game_serverside.match import GameMatch
from .game_serverside.functions import get_player, save_player, get_online_players



class PlayerConsumer(AsyncWebsocketConsumer):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            self.receive_called_event = asyncio.Event()
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

            self.check_online_task = asyncio.ensure_future(self.check_online())
        except Exception as e:
            logging.error(f'Error in connect: {e}', exc_info=True)    
        
        
    async def disconnect(self, message):
        # criar task pra ficar offline
        try:
        
            if hasattr(self, 'check_online_task'):
                self.check_online_task.cancel()

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
                if self.channel_name in (matchDB['player1']['channel'],matchDB['player2']['channel']):
                    await self.game_match.give_up('',{'give_up': matchDB['match_id']})

                    current_app.send_task(
                        'dumcrown.tasks.disconnect_in_match', 
                        args=[player.nickname])

            # Verifica se está em uma room
                    
            for roomDB in self.rooms.values():
                if self.channel_name in (roomDB['player1']['channel'],roomDB['player2']['channel']):
                    await self.game_room.leave_room('',{'leave_room':roomDB['room_id']})

        except Exception as e:
                    logging.error(f'Error in disconnect: {e}', exc_info=True)    
                
        
     
    async def check_online(self):
        try:
            while True:
                await asyncio.sleep(10)
                try:
                    players_online_count = await get_online_players()
                
                    await self.send(text_data=json.dumps({'is_online': players_online_count }))
                    
                    await asyncio.wait_for(self.receive_called_event.wait(), timeout=20) 
                    
                   
                except asyncio.TimeoutError:
                    
                    await self.close()
                    break
                finally:
                    self.receive_called_event.clear()

        except Exception as e:
           logging.error(f"Error in check_online: {e}", exc_info=True)




    async def receive(self, text_data):
        try:
            self.receive_called_event.set()
            user = self.scope["user"]
            text_data_json = json.loads(text_data)

            message_handlers = {
                'initialdata': self.client_data.initial_data,
                'update_data': self.client_data.update_data,
                'ranking_update': self.client_data.ranking_update,
                'add_experience': self.client_data.add_experience,
                'icon_change': self.client_data.icon_change,
                'border_change': self.client_data.border_change,
                'arena_change': self.client_data.arena_change,
                'sound_update': self.client_data.sound_update,

                'confirm_online': self.game_validators.confirm_online,
                'set_new_nickname': self.game_validators.set_new_nickname,

                'match_making':self.game_room.match_making,
                'quit_queue':self.game_room.quit_from_queue,
                'create_room': self.game_room.create_room,
                'join_room': self.game_room.join_room,
                'leave_room': self.game_room.leave_room,
                'delete_room': self.game_room.delete_room,
                
                'start_match': self.game_match.start_match,
                'ready': self.game_match.player_ready,
                'pass':self.game_match.player_pass,
                
                'energy_update':self.game_match.energy_update,
                'adversary_field':self.game_match.adversary_field,
                'adversary_attack':self.game_match.adversary_attack,
                'adversary_defese':self.game_match.adversary_defese,
                'match_update': self.game_match.match_update,
                'resolve': self.game_match.resolve,
                'damage_Result':self.game_match.damage_Result,
                'round_update':self.game_match.round_update,

                'gameWinner':self.game_match.game_winner,
                'gameLoser':self.game_match.game_loser,
                'give_up':self.game_match.give_up,
                'delete_match':self.game_match.delete_match,            
            }

            for tipo_mensagem, manipulador in message_handlers.items():
                if tipo_mensagem in text_data_json:
                    await manipulador(user, text_data_json)
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
        
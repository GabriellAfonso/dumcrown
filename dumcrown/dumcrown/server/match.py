import random
import json
import logging
import asyncio
from django.utils import timezone
from datetime import datetime
from celery import current_app
from .functions import get_player, save_player




class GameMatch:
    matches = {}

    def __init__(self, consumer):
        self.consumer = consumer



    async def start_match(self, user, data):
        try:
            room = data['start_match']
       
            match_id = room['id']
          
        
            player1_channel = room['player1']['channel']
            player2_channel = room['player2']['channel']

            cards = [f'c{i}' for i in range(1, 49)]

            cards1 = cards.copy()
            cards2 = cards.copy()

            random.shuffle(cards1)
            random.shuffle(cards2)

            who_start = ['player1','player2']
            random_number = random.random()
            player =  who_start[0] if random_number < 0.5 else  who_start[1]


            match_database = {
                'match_id': match_id,
                'round': 1,
                'phase': 1,
                'turn': player,
                'created_at': timezone.now().isoformat(),
                'attacking': player,
                    'player1': {
                        'channel': player1_channel,
                        'ready': False, 
                        'nickname': room['player1']['nickname'], 
                        'arena': room['player1']['arena'],
                        'icon': room['player1']['icon'],
                        'border': room['player1']['border'],
                        'level':room['player1']['level'],
                        'crown_points': room['player1']['crown_points'],
                        'hp': 50,
                        'energy': 0,
                        'deck': cards1,
                        },

                    'player2': {
                        'channel': player2_channel, 
                        'ready': False, 
                        'nickname': room['player2']['nickname'], 
                        'arena': room['player2']['arena'],
                        'icon': room['player2']['icon'],
                        'border': room['player2']['border'],
                        'level':room['player2']['level'],
                        'crown_points' :room['player2']['crown_points'],
                        'hp': 50,
                        'energy': 0,
                        'deck': cards2,
                        },
            }

            self.matches[match_id] = match_database
           
            await self.consumer.channel_layer.group_send(match_id, {
                'type': 'send_message',
                'start_match': match_database,
            })

        except Exception as e:
           logging.error(f'Error in start_match: {e}', exc_info=True)


    
    async def player_ready(self, user, data):
        try:
            match_id = data['ready']

            #provisorio
            player = await get_player(user)
            
            await save_player(player)

            player1_channel = self.matches[match_id]['player1']['channel']
            player2_channel = self.matches[match_id]['player2']['channel']


            if player1_channel == self.consumer.channel_name:
                self.matches[match_id]['player1']['ready'] = True

                await self.consumer.channel_layer.group_send(match_id,  
                    {'type': 'send_message', 
                    'match_update': self.matches[match_id],
                })

    

            if player2_channel == self.consumer.channel_name:
                self.matches[match_id]['player2']['ready'] = True

                await self.consumer.channel_layer.group_send(match_id,  
                    {'type': 'send_message', 
                    'match_update': self.matches[match_id],
                })
                
        except Exception as e:
            logging.error(f'Error in player_ready: {e}', exc_info=True)


    async def player_pass(self, user, data):
        try:
            match_id = data['pass']
          

            player1_channel = self.matches[match_id]['player1']['channel']
            player2_channel = self.matches[match_id]['player2']['channel']

            if  self.matches[match_id]['phase'] < 5:
                self.matches[match_id]['phase'] += 1
                

            if player1_channel == self.consumer.channel_name:
                self.matches[match_id]['turn'] = 'player2'
                

                
            if player2_channel == self.consumer.channel_name:
                self.matches[match_id]['turn'] = 'player1'

              

            await self.consumer.channel_layer.group_send(match_id,  
                    {'type': 'send_message', 
                    'player_pass': self.matches[match_id],
                })

        

        except Exception as e:
            logging.error(f'Error in player_pass: {e}', exc_info=True)




    async def round_update(self, user, data):
        try:
            match_id = data['round_update']
          
            self.matches[match_id]['round'] += 1
            self.matches[match_id]['phase'] = 1

            who_attacking = self.matches[match_id]['attacking']

            if who_attacking == 'player1':
                self.matches[match_id]['attacking'] = 'player2'
                self.matches[match_id]['turn'] = 'player2'
               
               

            elif who_attacking == 'player2':
                self.matches[match_id]['attacking'] = 'player1'
                self.matches[match_id]['turn'] = 'player1'
        

            await self.consumer.channel_layer.group_send(match_id,  
                    {'type': 'send_message', 
                    'round_update': self.matches[match_id],
                })
            
            
        except Exception as e:
            logging.error(f'Error in round_update: {e}', exc_info=True)



    async def energy_update(self, user, data):
        try:
            match_id, energy = data['energy_update']

            player1_channel = self.matches[match_id]['player1']['channel']
            player2_channel = self.matches[match_id]['player2']['channel']
          
            if player1_channel == self.consumer.channel_name:
                self.matches[match_id]['player1']['energy'] += int(energy)

                if self.matches[match_id]['player1']['energy'] > 10:
                    self.matches[match_id]['player1']['energy'] = 10

                await self.consumer.channel_layer.group_send(match_id,  
                    {'type': 'send_message', 
                    'energy_update': self.matches[match_id],
                })

            if player2_channel == self.consumer.channel_name:
                self.matches[match_id]['player2']['energy'] += int(energy)

                if self.matches[match_id]['player2']['energy'] > 10:
                    self.matches[match_id]['player2']['energy'] = 10
               
                await self.consumer.channel_layer.group_send(match_id,  
                        {'type': 'send_message', 
                        'energy_update': self.matches[match_id],
                    })

        except Exception as e:
            logging.error(f'Error in energy_update: {e}', exc_info=True)



    async def adversary_field(self, user, data):
        try:
            match_id, card = data['adversary_field']

            player1_channel = self.matches[match_id]['player1']['channel']
            player2_channel = self.matches[match_id]['player2']['channel']
          
            if player1_channel == self.consumer.channel_name:
                await self.consumer.channel_layer.send(player2_channel,  
                    {'type': 'send_message', 
                    'adversary_field': card,
                })


            if player2_channel == self.consumer.channel_name:
                await self.consumer.channel_layer.send(player1_channel,  
                    {'type': 'send_message', 
                    'adversary_field': card,
                })

        except Exception as e:
            logging.error(f'Error in adversary_field: {e}', exc_info=True)



    async def adversary_attack(self, user, data):
        try:
            match_id, attack_card = data['adversary_attack']

            player1_channel = self.matches[match_id]['player1']['channel']
            player2_channel = self.matches[match_id]['player2']['channel']
          
            if player1_channel == self.consumer.channel_name:
                await self.consumer.channel_layer.send(player2_channel,  
                    {'type': 'send_message', 
                    'adversary_attack': attack_card,
                })

            if player2_channel == self.consumer.channel_name:
                await self.consumer.channel_layer.send(player1_channel,  
                    {'type': 'send_message', 
                    'adversary_attack': attack_card,
                })

        except Exception as e:
            logging.error(f'Error in adversary_attack: {e}', exc_info=True)



    async def adversary_defese(self, user, data):
        try:
            match_id, defese_card = data['adversary_defese']

            player1_channel = self.matches[match_id]['player1']['channel']
            player2_channel = self.matches[match_id]['player2']['channel']
          
            if player1_channel == self.consumer.channel_name:                          
                await self.consumer.channel_layer.send(player2_channel,  
                    {'type': 'send_message', 
                    'adversary_defese': defese_card,
                })

            if player2_channel == self.consumer.channel_name:
                await self.consumer.channel_layer.send(player1_channel,  
                    {'type': 'send_message', 
                    'adversary_defese': defese_card,
                })

        except Exception as e:
            logging.error(f'Error in adversary_defese: {e}', exc_info=True)



    async def resolve(self, user ,data):
        try:
            match_id, resolveDict = data['resolve']
            result = {}

            who_attacking = self.matches[match_id]['attacking']
            if who_attacking == 'player1':
                who_defense = 'player2'
            elif who_attacking == 'player2':
                who_defense = 'player1'

            player_attack = resolveDict[who_attacking]
            player_defense = resolveDict[who_defense]
           
            for position, card_attack in player_attack.items():
                if position in player_defense:
                    # Se a posição existir em player_defense, realiza a operação
                    player_defense[position]['DEF'] -= card_attack['ATK']

            result[who_attacking] = player_attack
            result[who_defense] = player_defense

            await self.consumer.channel_layer.group_send(match_id,  
                        {'type': 'send_message', 
                        'resolve': result,
                    })
            
        except Exception as e:
            logging.error(f'Error in resolve: {e}', exc_info=True)



    async def damage_Result(self, user ,data):
        try:
            match_id, damage = data['damage_Result']

            who_attacking = self.matches[match_id]['attacking']

            if who_attacking == 'player1':
                self.matches[match_id]['player2']['hp'] += int(damage)
                if  self.matches[match_id]['player2']['hp'] < 1:
                    self.matches[match_id]['player2']['hp'] = 0

            elif who_attacking == 'player2':
                self.matches[match_id]['player1']['hp'] += int(damage)
                if  self.matches[match_id]['player1']['hp'] < 1:
                    self.matches[match_id]['player1']['hp'] = 0
                

            await self.consumer.channel_layer.group_send(match_id,  
                    {'type': 'send_message', 
                    'hp_update': self.matches[match_id],
                })

        except Exception as e:
            logging.error(f'Error in damage_Result: {e}', exc_info=True)



    async def match_update(self, user, data):
        try:
            match = data['match_update']

            self.matches[match['id']] = match
            
            await self.consumer.channel_layer.group_send(match['id'], {
                'type': 'send_message',
                'match_update': self.matches[match['id']],
            })

        except Exception as e:
            logging.error(f'Error in match_update: {e}', exc_info=True)



    async def game_winner(self,user,data):
         if user.is_authenticated:
            try:
                player = await get_player(user)
                match_id, defeat_player = data['gameWinner']

                created_at = self.matches[match_id]['created_at']
                created_formated = datetime.fromisoformat(created_at)
                duration = timezone.now() - created_formated
                duration_in_seconds = int(duration.total_seconds())
               
                
                current_app.send_task(
                            'dumcrown.tasks.save_match', 
                            args=[match_id,
                                  player.nickname,
                                  defeat_player,
                                  created_formated,
                                  duration_in_seconds,
                                  ])
        
                player.matches += 1
                player.victories += 1
                player.crystals += 50
                player.crown_points += 1
                await save_player(player)

            except Exception as e:
                logging.error(f'Error in game_winner {e}', exc_info=True)




    async def game_loser(self,user,data):
         if user.is_authenticated:
            try:
                player = await get_player(user)
                player.matches += 1
                player.defeats += 1
                player.crystals += 15
                if  player.crown_points > 0:
                    player.crown_points -= 1

                await save_player(player)

            except Exception as e:
                logging.error(f'Error in game_loser: {e}', exc_info=True)



    async def give_up(self,user,data):
        try:
            match_id = data['give_up']

            player1_channel = self.matches[match_id]['player1']['channel']
            player2_channel = self.matches[match_id]['player2']['channel']

            # vida vai pra 0 e da um match update
            if player1_channel == self.consumer.channel_name:
                self.matches[match_id]['player1']['hp'] = 0

            if player2_channel == self.consumer.channel_name:
                self.matches[match_id]['player2']['hp'] = 0
             
            await self.consumer.channel_layer.group_send(match_id,  
                    {'type': 'send_message', 
                    'hp_update': self.matches[match_id],
                })

        except Exception as e:
            logging.error(f'Error in give_up: {e}', exc_info=True)
    


    async def delete_match(self,user,data):
        try:
            match_id = data['delete_match']
            del self.matches[match_id]

        except Exception as e:
            logging.error(f'Error in delete_match: {e}', exc_info=True)
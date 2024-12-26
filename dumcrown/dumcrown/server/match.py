import random
import json
import logging
import asyncio
from dumcrown.match_objects.player import Player
from dumcrown.match_objects.match import Match
from django.utils import timezone
from datetime import datetime
from .functions import get_user, get_player, save_player, get_deck_cards


class MatchManager:
    matches = {}

    def __init__(self, consumer):
        self.consumer = consumer
        self.user = consumer.user
        self.channel = consumer.channel

# o dono da sala ou o escolhido caso seja queue, vai mandar o id dele e do adversario
# caso ele se desconecte tem que ter um jeito da partida continuar rodando
    async def start_match(self, data):
        try:
            print(data)
            match_id = data['id']
            player_x = await self.get_player_data(data['player_x'])
            player_y = await self.get_player_data(data['player_y'])

            players = [player_x, player_y]
            p1 = random.choice(players)
            p2 = player_y if p1 == player_x else player_x

            player1 = Player(p1, 1, self)
            player2 = Player(p2, 2, self)

            match = Match(player1, player2, match_id, self)

            self.matches[match_id] = match
            await self.consumer.send_to_group(match_id, 'start_match', self.matches[match_id].get_match_data())

            asyncio.create_task(self.initial_draw(match))

        except Exception as e:
            logging.error(f'Error in start_match: {e}', exc_info=True)

    async def get_player_data(self, id):
        player = await get_player(id)
        data = {'id': player.id,
                'channel': player.connection.channel,
                'nickname': player.nickname,
                'board': player.board,
                'icon': player.icon,
                'border': player.border,
                'deck': await get_deck_cards(player, player.current_deck.id),
                }
        return data

    async def initial_draw(self, match):
        await asyncio.sleep(6)
        match.inital_draw()
        await self.consumer.send_to_group(match.id, 'initial_draw', match.get_match_data())
        match.initial_auto_pass()
        asyncio.create_task(self.wait_ready(match))

    async def ready(self, data):
        match = self.matches[data['match_id']]
        player = match.who_i_am(self.user)
        player.cancel_auto_pass()

        player.button_wait()

        if not data['cards']:
            player.set_ready(True)

        if data['cards']:
            await self.swap_cards(player, data['cards'], match)

        await self.consumer.send_to_client('update_match_data', match.get_match_data())

    async def swap_cards(self, player, cards, match):
        print('swapou')
        player.hand.swap_cards(cards)
        await self.consumer.send_to_client('update_match_data', match.get_match_data())
        await self.consumer.send_to_client('swapped_cards')
        asyncio.create_task(self.swap_wait_to_ready(player))

    async def swap_wait_to_ready(self, player):
        await asyncio.sleep(3.5)
        player.set_ready(True)

    async def wait_ready(self, match):
        while not match.all_players_ready():
            await asyncio.sleep(1)
        asyncio.create_task(self.round1(match))

    async def round1(self, match):
        print('players prontos')
        match.new_round()
        await self.consumer.send_to_group(match.id, 'round_1', match.get_match_data())

    async def play_card(self, data):
        match = self.matches[data['match_id']]
        player = match.who_i_am(self.user)
        card = data['card_id']
        # fazer todas essas verificaçoes dentro de match e retornar a mensagem de error
        try:
            match.player_play_card(player, card)
            inf = {
                'who': player.im,
                'card_id': card,
                'data': match.get_match_data(),
            }
            await self.consumer.send_to_group(match.id, 'animate_card_to_bench', inf)

            # se passar fazer a animaçao pros dois jogadores
        except Exception as msg:
            message = str(msg)
            await self.consumer.send_to_client('invalid_move', message)

    async def player_pass(self, match_id):
        match = self.matches[match_id]
        player = match.who_i_am(self.user)
        try:
            match.player_pass(player)
            await self.consumer.send_to_group(match.id, 'update_match_data', match.get_match_data())
        except Exception as msg:
            message = str(msg)
            await self.consumer.send_to_client('invalid_move', message)

    async def update_to_players(self, match_id):
        match = self.matches[match_id]
        await self.consumer.send_to_group(match.id, 'update_match_data', match.get_match_data())

    async def new_round(self, match_id):
        match = self.matches[match_id]
        await self.consumer.send_to_group(match.id, 'new_round', match.get_match_data())

    async def message_to_player(self, channel, code, data=''):
        # TODO apos acabar a partida, deletar ela e todos os sistemas asyncronos vinculados
        await self.consumer.send_to_channel(channel, code, data)

    async def offensive_card(self, data):
        match = self.matches[data['match_id']]
        player = match.who_i_am(self.user)
        card = data['card_id']

        try:
            match.player_offensive_card(player, card)
            inf = {
                'who': player.im,
                'card_id': card,
                'data': match.get_match_data(),
            }
            await self.consumer.send_to_group(match.id, 'animate_card_to_attack', inf)

            # se passar fazer a animaçao pros dois jogadores
        except Exception as msg:
            message = str(msg)
            await self.consumer.send_to_client('invalid_move', message)

    async def player_attack(self, match_id):
        match = self.matches[match_id]
        player = match.who_i_am(self.user)
        match.player_clash(player)

    # async def game_winner(self, user, data):
    #     if user.is_authenticated:
    #         try:
    #             player = await get_player(user)
    #             match_id, defeat_player = data['gameWinner']

    #             created_at = self.matches[match_id]['created_at']
    #             created_formated = datetime.fromisoformat(created_at)
    #             duration = timezone.now() - created_formated
    #             duration_in_seconds = int(duration.total_seconds())

    #             current_app.send_task(
    #                 'dumcrown.tasks.save_match',
    #                 args=[match_id,
    #                       player.nickname,
    #                       defeat_player,
    #                       created_formated,
    #                       duration_in_seconds,
    #                       ])

    #             player.matches += 1
    #             player.victories += 1
    #             player.crystals += 50
    #             player.crown_points += 1
    #             await save_player(player)

    #         except Exception as e:
    #             logging.error(f'Error in game_winner {e}', exc_info=True)

    async def game_loser(self, user, data):
        if user.is_authenticated:
            try:
                player = await get_player(user)
                player.matches += 1
                player.defeats += 1
                player.crystals += 15
                if player.crown_points > 0:
                    player.crown_points -= 1

                await save_player(player)

            except Exception as e:
                logging.error(f'Error in game_loser: {e}', exc_info=True)

    async def give_up(self, user, data):
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

    async def delete_match(self, user, data):
        try:
            match_id = data['delete_match']
            del self.matches[match_id]

        except Exception as e:
            logging.error(f'Error in delete_match: {e}', exc_info=True)

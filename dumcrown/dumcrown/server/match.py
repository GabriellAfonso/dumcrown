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

    async def is_player_in_match(self):
        for match_id, match in self.matches.items():
            if self.user in [match.player1.user_id, match.player2.user_id]:
                await self.consumer.send_to_client('is_player_in_match', match_id)
                return match_id

        await self.consumer.send_to_client('is_player_in_match', False)
        return None

    async def start_match(self, data):
        try:
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

    async def play_spell(self, data):
        print('chamou play spell')
        match = self.matches[data['match_id']]
        player = match.who_i_am(self.user)
        spell = data['spell']
        target = data['target']
        # fazer todas essas verificaçoes dentro de match e retornar a mensagem de error
        try:
            match.player_play_spell(player, spell, target)

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

    async def send_to_players(self, match_id, code, data):
        print('send to payers')
        match = self.matches[match_id]
        await self.consumer.send_to_group(match.id, code, data)

    async def new_round(self, match_id):
        match = self.matches[match_id]
        await self.consumer.send_to_group(match.id, 'new_round', match.get_match_data())

    async def message_to_player(self, channel, code, data=''):
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

    async def defensive_card(self, data):
        match = self.matches[data['match_id']]
        player = match.who_i_am(self.user)
        card = data['card_id']
        pos = str(data['position'])
        print('chamou o defensive card')

        try:
            match.player_defensive_card(player, card, pos)
            inf = {
                'who': player.im,
                'card_id': card,
                'data': match.get_match_data(),
                'pos': pos,
            }
            await self.consumer.send_to_group(match.id, 'animate_card_to_defense', inf)

        except Exception as msg:
            message = str(msg)
            await self.consumer.send_to_client('invalid_move', message)

    async def player_clash(self, match_id):
        print('player clash')
        match = self.matches[match_id]
        player = match.who_i_am(self.user)
        match.player_clash(player)

    async def winner_gain(self, winner, pts):

        player = await get_player(winner.user_id)
        channel = player.connection.channel
        player.stats.matches += 1
        player.stats.victories += 1
        player.crystals += 50 * min(35, player.level)

        await save_player(player)
        await save_player(player.stats)

        data = {
            'exp': 85 + (player.level*14),
            'crystals': 50 * min(35, player.level),
            'points': pts,
        }
        print(data)
        await self.consumer.send_to_channel(channel, 'victory_match', data)

    async def defeated_gain(self, defeated, pts):

        player = await get_player(defeated.user_id)
        channel = player.connection.channel
        player.stats.matches += 1
        player.stats.defeats += 1
        player.crystals += 32 * min(35, player.level)
        await save_player(player)
        await save_player(player.stats)
        data = {
            'exp': 42 + (player.level*6),
            'crystals': 32 * min(35, player.level),
            'points': -pts,
        }
        print(data)
        await self.consumer.send_to_channel(channel, 'defeat_match', data)

    async def points_calculate(self, winner, defeated):
        win_player = await get_player(winner.user_id)
        def_player = await get_player(defeated.user_id)

        win_pts = win_player.crown_points
        def_pts = def_player.crown_points

        if def_pts == 0:
            points = 10 - round(win_pts*0.2)
            gain_points = max(1, points)
            loss_points = 0

            win_player.crown_points += gain_points
            def_player.crown_points -= loss_points
            await save_player(win_player)
            await save_player(def_player)
            return gain_points, loss_points

        gain_points = max(1, round(def_pts*0.28)+10)
        loss_points = max(1, round(def_pts*0.28))

        win_player.crown_points += gain_points
        def_player.crown_points -= loss_points
        await save_player(win_player)
        await save_player(def_player)

        return gain_points, loss_points

    async def give_up(self):
        match_id = await self.is_player_in_match()
        print(match_id)
        if not match_id:
            return

        match = self.matches[match_id]
        player = match.who_i_am(self.user)
        enemy = match.get_enemy(player)
        await match.finish_match(enemy, player)

    async def delete_match(self, match_id):
        del self.matches[match_id]
        print(self.matches)

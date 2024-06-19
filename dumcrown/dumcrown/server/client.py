import logging
import json
from .validators import validate_nickname
from .functions import get_player, save_player, ranking_list, my_ranking
from .cards_data.units import units_data
from .cards_data.spells import spells_data


class ClientData:

    def __init__(self, consumer):
        self.consumer = consumer
        self.user = consumer.user

    async def send_pong(self):
        await self.consumer.send_to_client('pong')

    async def get_player_data(self):
        try:
            player = await get_player(self.user)
            decks_data = [{'id': deck.id, 'name': deck.name, 'cards': list(
                deck.cards)} for deck in player.decks.all()]
            player_data = {
                'icon': player.icon,
                'border': player.border,
                'arena': player.arena,
                'nickname': player.nickname,
                'level': player.level,
                'experience': player.experience,
                'cards': player.cards,
                'decks': decks_data,
                'crystals': player.crystals,
                'crown_points': player.crown_points,
                'tier': player.tier,
                'matches': player.stats.matches,
                'victories': player.stats.victories,
                'defeats': player.stats.defeats,
                'volume_music': player.settings.volume_music,
                'soundsfx_volume': player.settings.soundsfx_volume,
            }
            await self.consumer.send_to_client('get_player_data', player_data)
        except Exception as e:
            logging.error(f'Error in get_player_data: {e}', exc_info=True)

    async def get_cards(self):
        await self.consumer.send_to_client('get_cards', {**units_data, **spells_data})

    async def set_new_nickname(self, data):
        player = await get_player(self.user)
        new_nickname = data
        response = await validate_nickname(data)
        if response == 'okay':
            player.nickname = new_nickname
            await save_player(player)
            await self.consumer.send_to_client('new_nickname_response', 'saved')
        else:
            await self.consumer.send_to_client('new_nickname_response', response)

    async def get_ranking(self):
        try:
            player = await get_player(self.user)
            ranking_players = await ranking_list()
            position = await my_ranking(self.user, player.id)

            player_data = {
                'position': position,
                'nickname': player.nickname,
                'level': player.level,
                'crown_points': player.crown_points,
                'tier': player.tier
            }

            ranking_players.append(player_data)
            await self.consumer.send_to_client('ranking', ranking_players)
        except Exception as e:
            logging.error(f'Error in ranking_update: {e}', exc_info=True)

    async def add_experience(self, data):
        try:
            player = await get_player(self.user)
            exp_to_up = player.level * 100
            player.experience += int(data)
            await save_player(player)
            if player.level < 1000:
                while player.experience >= exp_to_up:
                    player.level += 1
                    player.experience -= exp_to_up
                    exp_to_up = player.level * 100
                    await save_player(player)

        except Exception as e:
            logging.error(f'Error in add_experience: {e}', exc_info=True)

    async def icon_change(self, data):
        try:
            player = await get_player(self.user)
            new_icon = data

            player.icon = new_icon
            await save_player(player)

        except Exception as e:
            logging.error(f'Error in icon_change: {e}', exc_info=True)

    async def border_change(self, data):
        try:
            player = await get_player(self.user)
            new_border = data

            player.border = new_border
            await save_player(player)

        except Exception as e:
            logging.error(f'Error in border_change: {e}', exc_info=True)

    async def arena_change(self, data):
        try:
            player = await get_player(self.user)
            new_arena = data

            player.arena = new_arena
            await save_player(player)

        except Exception as e:
            logging.error(f'Error in arena_change: {e}', exc_info=True)

    async def sound_update(self, data):
        try:
            player = await get_player(self.user)
            volume_data = data
            music = volume_data['musicVolume']
            soundsfx = volume_data['sondsVolume']

            player.settings.volume_music = float(music)
            player.settings.soundsfx_volume = float(soundsfx)
            await save_player(player)

        except Exception as e:
            logging.error(f'Error in sound_update: {e}', exc_info=True)

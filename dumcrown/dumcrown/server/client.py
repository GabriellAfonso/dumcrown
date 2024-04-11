import logging
import json
from .validators import validate_nickname
from .functions import get_player, save_player, ranking_list, my_ranking


class ClientData:

    def __init__(self, consumer):
        self.consumer = consumer
        self.user = consumer.user

    async def get_player_data(self):
        try:
            player = await get_player(self.user)
            player_data = {
                'icon': player.icon,
                'border': player.border,
                'arena': player.arena,
                'nickname': player.nickname,
                'level': player.level,
                'experience': player.experience,
                'crystals': player.crystals,
                'matches': player.matches,
                'victories': player.victories,
                'defeats': player.defeats,
                'volume_music': player.volume_music,
                'soundsfx_volume': player.soundsfx_volume,
                'crown_points': player.crown_points,
                'tier': player.tier,
            }
            await self.consumer.send_to_client('get_player_data', player_data)
        except Exception as e:
            logging.error(f'Error in get_player_data: {e}', exc_info=True)

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

    async def ranking_update(self, user, data):
        if user.is_authenticated:
            try:

                player = await get_player(user)

                ranking_players = await ranking_list()

                position = await my_ranking(user, player.id)

                player_data = {
                    'position': position,
                    'nickname': player.nickname,
                    'level': player.level,
                    'crown_points': player.crown_points,
                    'tier': player.tier
                }

                ranking_players.append(player_data)

                await self.consumer.send(text_data=json.dumps({'ranking_update': ranking_players}))
            except Exception as e:
                logging.error(f'Error in ranking_update: {e}', exc_info=True)

    async def add_experience(self, user, data):
        if user.is_authenticated:
            try:
                player = await get_player(user)
                exp_to_up = player.level * 100
                player.experience += int(data['add_experience'])
                await save_player(player)
                if player.level < 1000:
                    while player.experience >= exp_to_up:
                        player.level += 1
                        player.experience -= exp_to_up
                        exp_to_up = player.level * 100
                        await save_player(player)

            except Exception as e:
                logging.error(f'Error in add_experience: {e}', exc_info=True)

    async def icon_change(self, user, data):
        if user.is_authenticated:
            try:
                player = await get_player(user)
                new_icon = data['icon_change']

                player.icon = new_icon
                await save_player(player)

            except Exception as e:
                logging.error(f'Error in icon_change: {e}', exc_info=True)

    async def border_change(self, user, data):
        if user.is_authenticated:
            try:
                player = await get_player(user)
                new_border = data['border_change']

                player.border = new_border
                await save_player(player)

            except Exception as e:
                logging.error(f'Error in border_change: {e}', exc_info=True)

    async def arena_change(self, user, data):
        if user.is_authenticated:
            try:
                player = await get_player(user)
                new_arena = data['arena_change']

                player.arena = new_arena
                await save_player(player)

            except Exception as e:
                logging.error(f'Error in arena_change: {e}', exc_info=True)

    async def sound_update(self, user, data):
        if user.is_authenticated:
            try:
                player = await get_player(user)
                volume_data = data['sound_update']
                music = volume_data['musicVolume']
                soundsfx = volume_data['sondsVolume']

                player.volume_music = float(music)
                player.soundsfx_volume = float(soundsfx)
                await save_player(player)

            except Exception as e:
                logging.error(f'Error in sound_update: {e}', exc_info=True)

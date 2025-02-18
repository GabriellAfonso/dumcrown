import logging
import json
import random
from .validators import validate_nickname, validate_deck_name
from .functions import get_player, save_player, save_deck, ranking_list, my_ranking, create_deck, delete_deck, get_deck
from .cards_data.units import units_data
from channels.db import database_sync_to_async
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

            player_data = {
                'id': player.id,
                'icon': player.icon,
                'border': player.border,
                'board': player.board,
                'nickname': player.nickname,
                'level': player.level,
                'experience': player.experience,
                'cards': player.cards,
                'decks': [deck.to_dict() for deck in player.decks.all()],
                'current_deck': player.current_deck.id if player.current_deck else None,
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

    async def board_change(self, data):
        try:
            player = await get_player(self.user)
            new_board = data

            player.board = new_board
            await save_player(player)

        except Exception as e:
            logging.error(f'Error in board_change: {e}', exc_info=True)

    async def sound_update(self, data):
        try:
            player = await get_player(self.user)
            volume_data = data
            music = volume_data['musicVolume']
            soundsfx = volume_data['sondsVolume']

            player.settings.volume_music = float(music)
            player.settings.soundsfx_volume = float(soundsfx)
            print('mudou o volume')
            # nao funciona, vai ter um botao pra salvar player.settings
            await save_player(player.settings)

        except Exception as e:
            logging.error(f'Error in sound_update: {e}', exc_info=True)

    async def save_deck(self, data):
        player = await get_player(self.user)

        deck = await get_deck(player, data['id'])
        # nao precisa pq o botao de criar mais deck some
        # print('sao os decks do player', len(player.decks.all()))
        # if len(player.decks.all()) >= 8:
        #     await self.consumer.send_to_client('deck_editor_error', 'Numero maximo de decks atingido!')
        #     return

        if len(data['cards']) != 30:
            await self.consumer.send_to_client('deck_editor_error', 'seu deck deve conter 30 cartas')
            return

        if deck:
            conflicting_deck = await validate_deck_name(player, deck.id, data['name'])
            if conflicting_deck:
                await self.consumer.send_to_client('deck_editor_error', 'Já existe um deck com esse nome')
                return

            deck.name = data['name']
            deck.cards = data['cards']
            await save_deck(deck)
            await self.get_player_data()
            await self.consumer.send_to_client('deck_editor_success', 'Deck salvo com Sucesso!')
            return

        await create_deck(player, data)
        await self.get_player_data()
        await self.consumer.send_to_client('deck_editor_success', 'Deck criado com Sucesso!')
        return

    async def delete_deck(self, data):
        player = await get_player(self.user)

        deck = None
        async for d in player.decks.filter(id=data['id']):
            deck = d
            break

        if deck:
            await delete_deck(player, deck.id)

    async def activate_deck(self, data):
        player = await get_player(self.user)
        deck = await get_deck(player, data['id'])
        player.current_deck = deck
        await save_player(player)

    async def buy_random_card(self):
        player = await get_player(self.user)
        all_cards = self.get_all_cards()
        player_cards = player.cards
        available_cards = list(set(all_cards) - set(player_cards))

        if player.crystals < 1000:
            await self.consumer.send_to_client('error_message_store', 'Crystais insuficientes')
            return
        if not available_cards:
            await self.consumer.send_to_client('error_message_store', 'Você já possui todas as cartas disponíveis')
            return

        random_card = random.choice(available_cards)
        print(random_card)
        player.crystals -= 1000
        player.cards.append(random_card)
        await save_player(player)
        await self.get_player_data()

    def get_all_cards(self):
        units_ids = [data["id"] for data in units_data.values()]
        spells_ids = [data["id"] for data in spells_data.values()]
        all_cards = units_ids + spells_ids
        return all_cards

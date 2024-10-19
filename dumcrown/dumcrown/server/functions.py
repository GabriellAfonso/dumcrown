from channels.db import database_sync_to_async


@database_sync_to_async
def get_player(user):
    from dumcrown.models.player import Player
    return Player.objects.select_related(
        'connection',
        'settings',
        'stats',
        'current_deck',
    ).prefetch_related(
        'decks',
    ).get(user=user)


@database_sync_to_async
def get_user(user_id):
    from django.contrib.auth.models import User
    return User.objects.get(id=user_id)


@database_sync_to_async
def get_online_players():
    from dumcrown.models.player import Player
    players_online_count = Player.objects.filter(is_online=True).count()
    return players_online_count


@database_sync_to_async
def ranking_list():
    from dumcrown.models.player import Player
    top_players = Player.objects.order_by('-crown_points')[:7]

    top7_players = [
        {'nickname': player.nickname,
         'level': player.level,
         'crown_points': player.crown_points,
         'tier': player.tier}
        for player in top_players
    ]

    while len(top7_players) < 7:
        top7_players.append({'nickname': '', 'level': '',
                            'crown_points': 0, 'tier': 'empty'})

    return top7_players


@database_sync_to_async
def my_ranking(user, id):
    from dumcrown.models.player import Player
    ordered_players = Player.objects.order_by('-crown_points')

    player_id = id  # Aguarde a conclusão da função assíncrona

    player_position = None

    for position, player_o in enumerate(ordered_players, start=1):
        if player_id == player_o.id:
            player_position = position
            break

    return player_position


@database_sync_to_async
def save_player(player):
    player.save()


@database_sync_to_async
def save_deck(deck):
    deck.save()


@database_sync_to_async
def create_deck(player, data):
    player.decks.create(name=data['name'], cards=data['cards'])


@database_sync_to_async
def delete_deck(player, deck_id):
    player.decks.filter(id=deck_id).delete()


@database_sync_to_async
def get_deck(player, deck_id):
    return player.decks.filter(id=deck_id).first()


@database_sync_to_async
def get_deck_cards(player, deck_id):
    deck = player.decks.filter(id=deck_id).first()
    dict = deck.get_to_match()
    cards = dict['cards']
    return cards


@database_sync_to_async
def nickname_exists(new_nickname):
    from dumcrown.models.player import Player
    return Player.objects.filter(nickname=new_nickname).exists()


async def player_connected(user, channel):
    player = await get_player(user)
    player.connection.channel = channel
    player.connection.is_online = True
    await save_player(player.connection)


async def player_is_online(user):
    player = await get_player(user)
    if player.connection.is_online:
        return True

    return False


async def player_disconnected(user):
    player = await get_player(user)
    player.connection.channel = ''
    player.connection.is_online = False
    await save_player(player.connection)

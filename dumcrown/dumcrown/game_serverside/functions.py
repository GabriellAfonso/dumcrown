from channels.db import database_sync_to_async


@database_sync_to_async
def get_player(user):
    from ..models import Player
    return Player.objects.get(user=user)

@database_sync_to_async
def get_online_players():
    from ..models import Player
    players_online_count = Player.objects.filter(is_online=True).count()
    return players_online_count



@database_sync_to_async
def ranking_list():
    from ..models import Player
    top_players = Player.objects.order_by('-crown_points')[:7]

    top7_players = [
    {'nickname': player.nickname, 
     'level': player.level, 
     'crown_points': player.crown_points,
     'tier': player.tier}
    for player in top_players
]
 
    while len(top7_players) < 7:
        top7_players.append({'nickname': '', 'level': '', 'crown_points': 0, 'tier': 'empty'})

    return top7_players



@database_sync_to_async
def my_ranking(user,id):
    from ..models import Player
    ordered_players = Player.objects.order_by('-crown_points')

    player_id = id # Aguarde a conclusão da função assíncrona

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
def nickname_exists(new_nickname):
    from ..models import Player
    return Player.objects.filter(nickname=new_nickname).exists()
          
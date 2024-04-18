from django.utils import timezone
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from dumcrown.models.player import Player
from time import sleep


@shared_task
def disconnect_in_match(player):
    player = Player.objects.get(nickname=player)
    player.defeats += 1
    player.matches += 1
    if player.crown_points > 0:
        player.crown_points -= 1
    player.save()


@shared_task
def disconnect_player(player):
    player = Player.objects.get(nickname=player)
    player.is_online = False
    player.save()


# @shared_task
# def save_match(match_id, winner_nick, loser_nick, created, duration_time):
#     winner_player = player = Player.objects.get(nickname=winner_nick)
#     loser_player = player = Player.objects.get(nickname=loser_nick)

#     new_match = Match(
#         client_match_id=match_id,
#         winner=winner_player,
#         loser=loser_player,
#         created_at=created,
#         duration=duration_time,
#     )
#     new_match.save()


@shared_task
def players_online_checker():

    try:
        time_limit = 15  # Tempo limite em segundos
        now = timezone.now()

        all_players = Player.objects.all()

        # Inicialize a variável antes do loop
        seconds_since_last_activity = 0
        lista = []

        # Itere sobre os jogadores online e verifique o tempo desde a última atividade
        for player in all_players:
            time_since_last_activity = now - player.last_active

            # Use apenas o total de segundos, independentemente de ser um timedelta negativo ou positivo
            seconds_since_last_activity = abs(
                time_since_last_activity.total_seconds())
            lista.append(seconds_since_last_activity)
            if seconds_since_last_activity > time_limit:
                player.is_online = False
                player.save()
            else:
                player.is_online = True
                player.save()

        # Retorne a diferença em segundos
        return lista
    except Exception as e:
        return str(e)

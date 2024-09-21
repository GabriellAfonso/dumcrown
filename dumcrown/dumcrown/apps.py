from django.apps import AppConfig


class DumcrownConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dumcrown'

    def ready(self):
        import dumcrown.signals
        disconnect_all_players()
        print('all players disconnected')


def disconnect_all_players():
    try:
        from .models.player import Player
        players = Player.objects.select_related(
            'connection',
        ).all()

        for player in players:
            player.connection.is_online = False
            player.connection.save()
    except Exception as e:
        print(f'error: {e}')

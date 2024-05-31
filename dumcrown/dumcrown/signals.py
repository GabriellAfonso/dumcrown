from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from dumcrown.models.player import Player, LoginHistory, Settings, Connection, Stats, Deck
from dumcrown.models.default_values import initial_deck


@receiver(post_save, sender=User)
def create_player(sender, instance, created, **kwargs):
    if created:
        player = Player.objects.create(user=instance)
        Settings.objects.create(player=player)
        Connection.objects.create(player=player)
        Stats.objects.create(player=player)
        Deck.objects.create(player=player, name='Default',
                            cards=initial_deck())


@receiver(post_save, sender=LoginHistory)
def update_last_login(sender, instance, created, **kwargs):
    if created:
        instance.player.last_login = instance.login_time
        instance.player.save()

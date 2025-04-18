from django.db import models
from collections import defaultdict
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
from django.contrib.postgres.fields import ArrayField
from django.utils.timezone import localtime

from .default_values import initial_cards


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=25, blank=True, default='')
    icon = models.CharField(max_length=40, default='chibi_khras')
    border = models.CharField(max_length=40, default='border01')
    board = models.CharField(max_length=40, default='default_board')
    level = models.PositiveIntegerField(default=1)
    cards = ArrayField(models.CharField(
        max_length=10), default=initial_cards())
    current_deck = models.ForeignKey('Deck', on_delete=models.SET_NULL, null=True,
                                     blank=True, related_name='current_deck')
    experience = models.PositiveBigIntegerField(default=0)
    crystals = models.PositiveBigIntegerField(default=0)
    tier = models.CharField(max_length=15, default='bronze')
    crown_points = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        if self.crown_points < 100:
            self.tier = 'bronze'
        elif self.crown_points < 200:
            self.tier = 'silver'
        elif self.crown_points < 300:
            self.tier = 'gold'
        elif self.crown_points < 500:
            self.tier = 'diamond'
        elif self.crown_points >= 500:
            self.tier = 'master'

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user}  id:{self.id}'


class LoginHistory(models.Model):
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name='login_history')
    login_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        login_time_local = localtime(self.login_time)
        return f'Nick: {self.player.nickname}  Time: {login_time_local.strftime("%H:%M %d/%m/%Y")}'


class Connection(models.Model):
    player = models.OneToOneField(
        Player, on_delete=models.CASCADE, related_name='connection')
    channel = models.CharField(max_length=1000, blank=True, default='')
    is_online = models.BooleanField(default=False)


class Settings(models.Model):
    player = models.OneToOneField(
        Player, on_delete=models.CASCADE, related_name='settings')
    volume_music = models.FloatField(
        validators=[MaxValueValidator(2)], default=1)
    soundsfx_volume = models.FloatField(
        validators=[MaxValueValidator(2)], default=1)


class Stats(models.Model):
    player = models.OneToOneField(
        Player, on_delete=models.CASCADE, related_name='stats')
    matches = models.PositiveBigIntegerField(default=0)
    victories = models.PositiveBigIntegerField(default=0)
    defeats = models.PositiveBigIntegerField(default=0)


class Deck(models.Model):
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name='decks')
    name = models.CharField(max_length=25)
    cards = ArrayField(models.CharField(max_length=10))

    def __str__(self):
        return f'Name: {self.name} - - - Player: {self.player.nickname}'

    def format_cards(self):
        card_count = defaultdict(int)
        formatted_cards = []
        for card in self.cards:
            card_count[card] += 1
            if card_count[card] == 1:
                formatted_cards.append(f'{card}')
            elif card_count[card] == 2:
                formatted_cards.append(f'{card}(A)')
            elif card_count[card] == 3:
                formatted_cards.append(f'{card}(B)')
            else:
                formatted_cards.append(
                    f'{card}({chr(65 + card_count[card] - 2)})')

        return formatted_cards

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'cards': self.cards,
            'player': self.player.id,
        }

    def get_to_match(self):
        return {
            'id': self.id,
            'name': self.name,
            'cards': self.format_cards(),
            'player': self.player.id,
        }

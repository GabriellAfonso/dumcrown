from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator,  MinValueValidator
from django.contrib.postgres.fields import ArrayField


class Duelist(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    nickname = models.CharField(max_length=50)
    deck_name = models.CharField(max_length=50)
    icon = models.CharField(max_length=50)
    border = models.CharField(max_length=50)

    health = models.PositiveIntegerField(default=20)
    energy = models.PositiveIntegerField(default=0)
    max_energy = models.PositiveIntegerField(default=10)
    deck_cards = ArrayField(models.JSONField())
    current_deck = ArrayField(models.JSONField())
    current_hand = ArrayField(models.JSONField())
    board = ArrayField(models.JSONField())
    action_log = ArrayField(models.JSONField())
    is_attack_turn = models.BooleanField(default=False)

    def __str__(self):
        return self.nickname


class Match(models.Model):
    round_number = models.PositiveIntegerField(default=1)
    player1 = models.ForeignKey(
        Duelist, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(
        Duelist, on_delete=models.CASCADE, related_name='player2',)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Match {self.id} - Round {self.round_number}"

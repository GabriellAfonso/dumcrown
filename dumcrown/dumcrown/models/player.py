from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
from django.contrib.postgres.fields import ArrayField


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=25, blank=True, default='')
    icon = models.CharField(max_length=40, default='chibi_khras')
    border = models.CharField(max_length=40, default='border01')
    arena = models.CharField(max_length=40, default='arena01')
    level = models.PositiveIntegerField(default=1)
    experience = models.PositiveBigIntegerField(default=0)
    crystals = models.PositiveBigIntegerField(default=0)
    tier = models.CharField(max_length=15, default='bronze')
    crown_points = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        if self.crown_points < 10:
            self.tier = 'bronze'
        elif self.crown_points < 20:
            self.tier = 'silver'
        elif self.crown_points < 30:
            self.tier = 'gold'
        elif self.crown_points < 50:
            self.tier = 'diamond'
        elif self.crown_points >= 50:
            self.tier = 'master'

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user}  id:{self.id}'


class LoginHistory(models.Model):
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name='login_history')
    login_time = models.DateTimeField(auto_now_add=True)


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

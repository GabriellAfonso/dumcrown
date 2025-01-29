from django.db import models
from dumcrown.models.player import Player


class Match(models.Model):
    winner = models.ForeignKey(
        Player, related_name='Match_winner', on_delete=models.PROTECT)
    loser = models.ForeignKey(
        Player, related_name='Match_loser', on_delete=models.PROTECT)
    duration = models.IntegerField()
    created_at = models.DateTimeField()
    history = models.TextField()

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f'id:{self.id} {self.winner.nickname} VS {self.loser.nickname}'

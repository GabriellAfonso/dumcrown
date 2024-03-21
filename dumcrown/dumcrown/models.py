from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
from django.contrib.postgres.fields import ArrayField

class Player(models.Model):
    
    ICONS_CHOICES = (
        ('chibi_khras', 'khras'),
        ('chibi_kronos', 'kronos'),
        ('chibi_lda', 'lda'),
    )
    BORDER_CHOICES = (
        ('border01', 'borda 1'),
        ('border02', 'borda 2'),
        ('border03', 'borda 3'),
    )
    ARENA_CHOICES = (
        ('arena01', 'arena 1'),
        ('arena02', 'arena 2'),
    )
  
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    icon = models.CharField(max_length=40, choices=ICONS_CHOICES, default='chibi_khras')
    border = models.CharField(max_length=40, choices=BORDER_CHOICES, default='border01')
    arena = models.CharField(max_length=40, choices=ARENA_CHOICES, default='arena01')
    nickname = models.CharField(max_length=25, blank=True, default='')
    level = models.PositiveIntegerField(validators=[MaxValueValidator(1000)], default=1)
    experience = models.PositiveBigIntegerField(default=0)
    is_online = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    crystals = models.PositiveBigIntegerField(default=0)
    crown_points = models.PositiveBigIntegerField(default=0)
    tier = models.CharField(max_length=15, default='bronze')
    friends_list = ArrayField(models.CharField(max_length=25), blank=True, default=list)
    volume_music = models.FloatField(validators=[MaxValueValidator(2)], default=1)
    soundsfx_volume = models.FloatField(validators=[MaxValueValidator(2)], default=1)
    matches = models.PositiveBigIntegerField(default=0)
    victories = models.PositiveBigIntegerField(default=0)
    defeats = models.PositiveBigIntegerField(default=0)


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
        return f'{self.user}  id:{self.id} online:{self.is_online}'
        
        
class Match(models.Model):
    client_match_id = models.CharField(max_length=10)
    winner = models.ForeignKey(Player, related_name='Match_winner',on_delete=models.PROTECT)
    loser = models.ForeignKey(Player, related_name='Match_loser',on_delete=models.PROTECT)
    duration = models.IntegerField()
    created_at = models.DateTimeField()

    

    class Meta:
        ordering = ['-id']  

    def __str__(self):
        return f'id:{self.id} Created: {self.created_at.isoformat()}'
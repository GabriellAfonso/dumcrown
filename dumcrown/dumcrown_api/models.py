from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator

class Player_data(models.Model):

    user = models.OneToOneField(User, on_delete=models.DO_NOTHING, related_name='dumcrown_api_player')
    icon = models.CharField(max_length=40, default='chibi_khras')
    border = models.CharField(max_length=40, default='border01')
    arena = models.CharField(max_length=40, default='arena01')
    nickname = models.CharField(max_length=25, blank=True, default='')
    level = models.PositiveIntegerField(validators=[MaxValueValidator(1000)], default=1)
    experience = models.PositiveBigIntegerField(default=0)
    is_online = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    crystals = models.PositiveBigIntegerField(default=0)
    patent_points = models.PositiveBigIntegerField(default=0)
    patent = models.CharField(max_length=15, default='bronze')
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    matches = models.PositiveBigIntegerField(default=0)
    victories = models.PositiveBigIntegerField(default=0)
    defeats = models.PositiveBigIntegerField(default=0)


    def __str__(self):
        return f'{self.user}  id:{self.id} online:{self.is_online}'
        
# class PlayerSettings(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     volume_music = models.FloatField(validators=[MaxValueValidator(2)], default=1)
#     soundsfx_volume = models.FloatField(validators=[MaxValueValidator(2)], default=1)
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    registred = models.BooleanField(default=False, blank=False) 
    nickname = models.CharField(max_length=25, unique=True)
    level = models.PositiveIntegerField(validators=[MaxValueValidator(100)])
    experience = models.PositiveBigIntegerField()

    def __str__(self):
        return f'{self.user}  id:{self.id}'
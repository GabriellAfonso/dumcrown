from django.contrib import admin
from .models import Player_data

@admin.register(Player_data)
class PlayerAdmin(admin.ModelAdmin):
 ...

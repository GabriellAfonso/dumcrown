from django.contrib import admin
from dumcrown.models import Player


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
 ...
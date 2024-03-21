from django.contrib import admin
from dumcrown.models import Player,Match


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
 ...
@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
 ...
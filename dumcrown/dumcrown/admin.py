from django.contrib import admin
from dumcrown.models.player import Player, Connection, LoginHistory


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    ...


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    ...


@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    ...


# @admin.register(Match)
# class MatchAdmin(admin.ModelAdmin):
#     ...

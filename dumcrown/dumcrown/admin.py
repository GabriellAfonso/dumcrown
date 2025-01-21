from django.contrib import admin
from dumcrown.models.player import Player, Connection, LoginHistory, Deck, Stats


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    ...


@admin.register(Stats)
class StatsAdmin(admin.ModelAdmin):
    ...


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    ...


@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    ...


@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    ...


# @admin.register(Match)
# class MatchAdmin(admin.ModelAdmin):
#     ...

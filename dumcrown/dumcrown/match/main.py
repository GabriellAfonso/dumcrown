from match import Match
from player import Player
import os
import json


def get_player(nome_arquivo):
    with open(nome_arquivo, 'r') as arquivo:
        return json.load(arquivo)


player1 = get_player('player1.json')
player2 = get_player('player2.json')

match_start = Match(player1, player2, 4256)

from match import Match
from player import Player
import os
import json


def get_player(nome_arquivo):
    with open(nome_arquivo, 'r') as arquivo:
        return json.load(arquivo)


player1_data = get_player('player1.json')
player2_data = get_player('player2.json')

player1 = Player(player1_data)
player2 = Player(player2_data)

partida = Match(player1, player2, 4256)

# partida.player1.hand.get_deck()

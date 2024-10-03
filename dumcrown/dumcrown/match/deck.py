import random

# as classes base nao vao executar nada sozinhas a classe Match que vai gerencialas

# a mao do jogador que vai ter acesso ao deck


class PlayerDeck:

    def __init__(self, player_deck):
        self.player_deck = player_deck

    def shuffle(self):
        random.shuffle(self.player_deck)

    def get_player_deck(self):
        return self.player_deck

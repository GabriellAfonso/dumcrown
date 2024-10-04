import random

# as classes base nao vao executar nada sozinhas a classe Match que vai gerencialas

# a mao do jogador que vai ter acesso ao deck


class PlayerDeck:

    def __init__(self, player_deck):
        self.player_deck = player_deck

    def shuffle(self):
        random.shuffle(self.player_deck)
        print('deck embaralhado')

    def get_deck(self):
        # print(self.player_deck)
        return self.player_deck

    def pop_card(self):
        self.player_deck.pop(0)

    def add_card(self, card):
        self.player_deck.append(card)

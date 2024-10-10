import random
import re
from .unit_card import UnitCard
from .spell_card import SpellCard
from dumcrown.server.cards_data.units import units_data
from dumcrown.server.cards_data.spells import spells_data
# as classes base nao vao executar nada sozinhas a classe Match que vai gerencialas

# a mao do jogador que vai ter acesso ao deck


class PlayerDeck:

    def __init__(self, deck):
        self._deck = deck
        print(deck)
        self.deck_obj = {}
        self.create_deck_obj(deck)

    def create_deck_obj(self, deck):
        for card in range(len(deck)):
            id = deck[card]
            obj = self.create_card(id)
            self.deck_obj[id] = obj

    def create_card(self, id):
        base_id = self.id_cleaner(id)
        if id[0] == 's':
            card = spells_data[base_id]
            card_obj = SpellCard(id, card)
            return card_obj

        card = units_data[base_id]
        card_obj = UnitCard(id, card)
        return card_obj

    def id_cleaner(self, id):
        return re.sub(r'\([A-Z]\)', '', id)

    def shuffle(self):
        random.shuffle(self._deck)
        print('deck embaralhado')

    def get_deck(self):
        # print(self.player_deck)
        return self._deck

    def get_deck_obj(self):
        deck = {}
        for id, card in self.deck_obj.items():
            deck[id] = card.get_data()

        print('aqui vai o deck', deck)
        print('-'*30)
        return deck

    def pop_card(self):
        self._deck.pop(0)

    def add_card(self, card):
        self._deck.append(card)

from .hand import PlayerHand
from .deck import PlayerDeck


class Player:

    def __init__(self, data):
        self.user_id = data['id']
        self.nickname = data['nickname']
        self.icon = data['icon']
        self.border = data['border']
        self.board = data['board']

        self.hp = 100
        self.energy = 0
        self.deck = PlayerDeck(data['deck'])
        self.hand = PlayerHand(self.deck)
        self.button_state = 0
        self.button_text = ''

    def add_hp(self, points):
        self.hp += points

    def remove_hp(self, points):
        self.hp -= points

    def add_energy(self, points):
        self.energy += points

    def remove_energy(self, points):
        self.energy -= points

    def change_button(self, state, text):
        self.button_state = state
        self.button_text = text

    def get_id(self):
        return self.user_id

    def get_player_data(self):
        player = {
            'id': self.user_id,
            'nickname': self.nickname,
            'icon': self.icon,
            'border': self.border,
            'board': self.board,

            'hp': self.hp,
            'energy': self.energy,
            'deck': self.deck.get_deck(),
            'deck_obj': self.deck.get_deck_obj(),
            'hand': self.hand.get_hand(),
            'button_state': self.button_state,
            'button_text': self.button_text,
        }
        return player

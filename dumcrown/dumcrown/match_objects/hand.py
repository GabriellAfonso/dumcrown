class PlayerHand:
    def __init__(self, deck):
        self.deck = deck
        self.player_hand = []
        pass

    def draw_card(self):
        card = self.deck.get_deck()[0]
        self.player_hand.append(card)
        self.deck.pop_card()

    def get_hand(self):

        return self.player_hand

    def swap_card(self, index):
        card = self.player_hand[index]
        self.deck.add_card(card)
        self.player_hand.pop(index)

        new_card = self.deck.get_deck()[0]
        self.player_hand.insert(index, new_card)

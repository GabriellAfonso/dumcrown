class PlayerHand:
    def __init__(self, deck):
        self.deck = deck
        self.hand = []
        pass

    def draw_card(self):
        if len(self.hand) <= 7:
            card = self.deck.get_deck()[0]
            self.hand.append(card)
            self.deck.pop_card()

    def get_hand(self):

        return self.hand

    def swap_cards(self, cards):
        for card_id in cards.values():
            print('mao', self.hand)
            index = self.hand.index(card_id)
            self.deck.add_card(card_id)
            self.hand.pop(index)
            new_card = self.deck.get_deck()[0]
            self.hand.insert(index, new_card)
            self.deck.pop_card()

    def pop_card(self, card):
        self.hand.remove(card)

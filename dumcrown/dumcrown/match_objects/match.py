from datetime import datetime
import asyncio
# vai receber os dados de player 1 e player2 e vai gerenciar a partida inteira


# se a pessoa nao tiver energia pra fazer nenhuma açao, passar a vez
# player 1 sempre começa, sera escolhido aleatoriamente quem sera o player1

# ou a partida vai se gerenciar ou vou fazer um matchManager
class Match:

    def __init__(self, player1, player2, match_id):
        self.id = match_id
        self.round = 0
        self.player1 = player1
        self.player2 = player2

        self.turn = 0  # Indica de quem é a vez (pode ser 1 ou 2).
        self.offensive_turn = 0  # Indica de quem é o turno ofensivo do round
        self.timestamp = datetime.now()

        self.history = []
        self.start_match()

    def start_match(self):
        print('Começou')
        self.shuffle_decks()
        # self.inital_draw()

    def shuffle_decks(self):
        self.player1.deck.shuffle()
        self.player2.deck.shuffle()

    def who_i_am(self, player_id):
        print('player id', self.player1.get_id())
        if self.player1.get_id() == player_id:
            return self.player1

        return self.player2

    def inital_draw(self):
        self.player1.change_button(1, 'PRONTO')
        self.player2.change_button(1, 'PRONTO')
        for i in range(0, 4):
            self.player1.hand.draw_card()
            self.player2.hand.draw_card()

    def initial_auto_pass(self):
        print('iniciou auto pass')
        asyncio.create_task(self.player1.set_auto_pass())
        asyncio.create_task(self.player2.set_auto_pass())

    def get_match_data(self):
        match = {
            'id': self.id,
            'round': self.round,
            'player1': self.player1.get_player_data(),
            'player2': self.player2.get_player_data(),

            'turn': self.turn,
            'offensive_turn': self.offensive_turn,
        }
        return match

    def record_action(self, action):
        self.history.append(action)

    def all_players_ready(self):
        p1 = self.player1.get_ready()
        p2 = self.player2.get_ready()
        return p1 and p2

    def set_turn(self, turn):
        self.turn = turn
        if turn == 1:
            self.player1.change_button(1, 'SUA VEZ')
            self.player2.change_button(0, 'TURNO DO OPONENTE')
        elif turn == 2:
            self.player2.change_button(1, 'SUA VEZ')
            self.player1.change_button(0, 'TURNO DO OPONENTE')

    def toggle_turn(self):
        if self.turn == 1:
            self.set_turn(2)
        else:
            self.set_turn(1)

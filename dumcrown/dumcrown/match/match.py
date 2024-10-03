from datetime import datetime
# vai receber os dados de player 1 e player2 e vai gerenciar a partida inteira


# se a pessoa nao tiver energia pra fazer nenhuma açao, passar a vez
# player 1 sempre começa, sera escolhido aleatoriamente quem sera o player1
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
        pass

    def record_action(self, action):
        self.history.append(action)

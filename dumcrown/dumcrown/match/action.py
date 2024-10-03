class Action:
    def __init__(self, player, action_type, card_played=None, target=None, result=None):
        """
        :param player: O jogador que realizou a ação (pode ser o objeto do jogador ou o ID do jogador).
        :param action_type: Tipo de ação (ex: 'play_card', 'attack', 'end_turn').
        :param card_played: A carta que foi jogada, se aplicável (pode ser um objeto de carta).
        :param target: O alvo da ação, se houver (pode ser um objeto de carta ou o jogador adversário).
        :param result: Resultado da ação (ex: 'success', 'failure', 'miss', etc.).
        """
        self.player = player
        self.action_type = action_type
        self.card_played = card_played
        self.target = target
        self.result = result
        self.timestamp = self.get_timestamp()

    def get_timestamp(self):
        from datetime import datetime
        return datetime.now()

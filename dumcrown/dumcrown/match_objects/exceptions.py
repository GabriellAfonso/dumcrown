class GameException(Exception):
    """Exceção base para o jogo."""
    pass


class OpponentTurnException(GameException):
    """Exceção levantada quando o jogador tenta jogar fora de sua vez."""
    pass


class OpponentOffensiveTurnException(GameException):
    """Exceção levantada quando o jogador tenta atacar sem ser o player ofensivo do round."""
    pass


class InsufficientEnergyException(GameException):
    """Exceção levantada quando o jogador não tem energia suficiente."""
    pass


class BenchFullException(GameException):
    """Exceção levantada quando o banco de cartas está cheio."""
    pass


class AttackZoneFullException(GameException):
    """Exceção levantada quando a zona de ataque esta cheia."""
    pass


class InvalidCardTypeForBenchException(GameException):
    """Exceção levantada quando uma carta mágica é colocada no banco, o que não é permitido."""
    pass


class InvalidPlayCardInCombatException(GameException):
    """Exceção levantada quando o jogador tenta adicionar uma carta ao banco enquanto ataca ou defende."""
    pass

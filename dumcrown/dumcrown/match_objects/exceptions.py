class GameException(Exception):
    """Exceção base para o jogo."""
    pass


class OpponentTurnException(GameException):
    """Exceção levantada quando o jogador tenta jogar fora de sua vez."""
    pass


class InsufficientEnergyException(GameException):
    """Exceção levantada quando o jogador não tem energia suficiente."""
    pass


class BenchFullException(GameException):
    """Exceção levantada quando o banco de cartas está cheio."""
    pass

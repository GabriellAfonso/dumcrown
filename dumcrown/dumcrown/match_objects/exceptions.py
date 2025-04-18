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


class InvalidPlaySpellInCombatException(GameException):
    """Exceção levantada quando o jogador tenta jogar uma spell invalida durante o combate"""
    pass


class NoTargetForSpellException(GameException):
    """A spell lançada não possui um alvo válido."""
    pass


class InvalidTargetForSpellException(GameException):
    """Alvo invalido"""
    pass


class SuicideSpellException(GameException):
    """Exceção levantada quando o jogador reduzira sua vida a 0 com a spell"""
    pass


class InvalidPlaySpellOutCombatException(GameException):
    """Exceção levantada quando o jogador tenta usar certas spell fora do modo de combate."""
    pass


class DefensivePositionTakenException(GameException):
    """Exceção levantada quando o jogador tenta colocar uma carta defensiva onde já existe outra."""
    pass

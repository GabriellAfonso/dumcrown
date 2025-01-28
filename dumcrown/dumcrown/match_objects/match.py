from datetime import datetime
import logging
import asyncio
import re
from .exceptions import (BenchFullException, OpponentTurnException,
                         InsufficientEnergyException, InvalidCardTypeForBenchException,
                         OpponentOffensiveTurnException, AttackZoneFullException,
                         InvalidPlayCardInCombatException, NoTargetForSpellException,
                         InvalidTargetForSpellException, InvalidPlaySpellInCombatException,
                         SuicideSpellException, InvalidPlaySpellOutCombatException)
# vai receber os dados de player 1 e player2 e vai gerenciar a partida inteira


# se a pessoa nao tiver energia pra fazer nenhuma açao, passar a vez
# player 1 sempre começa, sera escolhido aleatoriamente quem sera o player1

# ou a partida vai se gerenciar ou vou fazer um matchManager
class Match:

    def __init__(self, player1, player2, match_id, manager):
        self.id = match_id
        self.manager = manager
        self.round = 0
        self.winner = None
        self.defeated = None
        self.player1 = player1
        self.player2 = player2
        self.gameover = False
        self.turn = 0
        self.offensive_player = 0
        self.timestamp = datetime.now()
        self.combat_mode = False
        self.history = []
        self.logger = self.setup_logger()
        self.spell_effects = {
            's1': self.spell_s1,
            's2': self.spell_s2,
            's5': self.spell_s5,
            's7': self.spell_s7,
            's8': self.spell_s8,
        }
        self.start_match()

    def setup_logger(self):
        logger = logging.getLogger(f"match_{self.id}")
        logger.setLevel(logging.DEBUG)
        return logger

    def log(self, message):
        self.logger.info(message)
        self.history.append(message)

    def start_match(self):
        self.log('Chamou Start Match')
        self.shuffle_decks()

    def shuffle_decks(self):
        self.log('Chamou shuffle_decks')
        self.player1.deck.shuffle()
        self.player2.deck.shuffle()

    def who_i_am(self, player_id):
        if self.player1.get_id() == player_id:
            return self.player1

        return self.player2

    def get_enemy(self, player):
        if player.im == self.player1.im:
            return self.player2

        return self.player1

    def inital_draw(self):
        self.log('Chamou inital_draw')
        self.player1.change_button(1, 'PRONTO')
        self.player2.change_button(1, 'PRONTO')
        for i in range(0, 4):
            self.player1.hand.draw_card()
            self.player2.hand.draw_card()

    def initial_auto_pass(self):
        asyncio.create_task(self.player1.set_auto_ready())
        asyncio.create_task(self.player2.set_auto_ready())

    def get_match_data(self):
        match = {
            'id': self.id,
            'round': self.round,
            'player1': self.player1.get_player_data(),
            'player2': self.player2.get_player_data(),

            'turn': self.turn,
            'offensive_player': self.offensive_player,
            'combat_mode': self.combat_mode,
            'gameover': self.gameover,

        }
        return match

    def all_players_ready(self):
        self.log('Ambos jogadores estao prontos')
        p1 = self.player1.get_ready()
        p2 = self.player2.get_ready()
        return p1 and p2

    def new_round(self):
        self.round += 1
        self.log(f'Chamando novo round {self.round}')
        self.player1.hand.draw_card()
        self.player2.hand.draw_card()

        # self.player1.energy = 1
        # self.player2.energy = 1

        self.toggle_ofensive_player()
        self.refill_energy()
        if self.round > 1:
            asyncio.create_task(self.manager.new_round(self.id))

    def refill_energy(self):
        self.log('Energia dos jogadores recarregada')
        self.player1.add_energy(self.round)
        self.player2.add_energy(self.round)

    def set_turn(self, turn):
        self.turn = turn
        if turn == 1:
            asyncio.create_task(self.player1.set_auto_pass(self))
            self.player1.change_button(1, 'SUA VEZ')
            self.player2.change_button(0, 'TURNO DO OPONENTE')
        elif turn == 2:
            asyncio.create_task(self.player2.set_auto_pass(self))
            self.player2.change_button(1, 'SUA VEZ')
            self.player1.change_button(0, 'TURNO DO OPONENTE')

    def toggle_turn(self):
        self.log('Alternando turno dos jogadores')
        if self.turn == 1:
            self.set_turn(2)
        else:
            self.set_turn(1)

    def toggle_ofensive_player(self):
        self.log('Alternando player Ofensivo')
        if self.offensive_player == 1:
            self.set_ofensive_player(2)
            self.set_turn(2)
        else:
            self.set_ofensive_player(1)
            self.set_turn(1)

    def set_ofensive_player(self, player):
        self.offensive_player = player

    def player_pass(self, player):
        self.is_my_turn(player)
        player.cancel_auto_pass()
        player.set_passed(True)
        self.log(f'O player {player.nickname} Passou a vez')
        self.check_both_passed()

    def player_clash(self, player):
        self.is_my_turn(player)
        player.cancel_auto_pass()
        if player.im != self.offensive_player:
            self.log(f'O player {player.nickname} chamou clash_resolve')
            asyncio.create_task(self.clash_resolve(player))

            return
        self.log(f'O player {player.nickname} chamou player_clash')
        self.toggle_turn()
        enemy = self.get_enemy(player)
        enemy.change_button(1, 'DEFENDER')
        asyncio.create_task(self.manager.update_to_players(self.id))
        asyncio.create_task(self.manager.message_to_player(
            enemy.channel, 'defense_mode'))

    def finish_turn(self, player):
        player.cancel_auto_pass()
        player.set_passed(False)
        self.toggle_turn()
        asyncio.create_task(self.manager.update_to_players(self.id))

    def check_both_passed(self):
        if self.player1.passed == self.player2.passed:
            self.log('Ambos jogadores passaram a vez')
            self.player1.set_passed(False)
            self.player2.set_passed(False)
            self.new_round()
            return

        self.toggle_turn()
        asyncio.create_task(self.manager.update_to_players(self.id))

    def is_my_turn(self, player):
        if (player.im == self.turn):
            return True

        raise OpponentTurnException("Turno do oponente, aguarde sua vez")

    def useEnergy(self, player, card_id):
        card = player.deck.get_card_obj(card_id)
        if card.energy > player.energy:
            raise InsufficientEnergyException("Energia insuficiente")

        player.remove_energy(card.energy)

    def is_bench_full(self, player):
        if len(player.bench) < 5:
            return
        raise BenchFullException("O banco esta cheio")

    def check_card_type(self, card_id):
        if card_id[0] == 's':
            raise InvalidCardTypeForBenchException('Ação Inválida')

    def is_combat_mode(self):
        if self.combat_mode:
            raise InvalidPlayCardInCombatException('Ação Inválida em Combate')

    def player_play_card(self, player, card_id):

        self.is_my_turn(player)
        self.is_combat_mode()
        self.is_bench_full(player)
        self.check_card_type(card_id)
        self.useEnergy(player, card_id)

        player.add_to_bench(card_id)
        self.log(
            f'O player {player.nickname} colocou em campo a carta {card_id}')
        self.finish_turn(player)

    def is_player_offensive(self, player):
        if self.offensive_player != player.im:
            raise OpponentOffensiveTurnException(
                'Ação Valida apenas para o player atacante')

    def is_attack_zone_full(self, player):
        if len(player.attack_zone) >= 5:
            raise AttackZoneFullException('Zona de ataque cheia')

    def active_combat_mode(self, player):
        if self.combat_mode:
            return

        self.combat_mode = True
        player.change_button(1, 'ATACAR')

    def player_offensive_card(self, player, card_id):
        self.is_my_turn(player)
        self.is_player_offensive(player)
        self.is_attack_zone_full(player)
        player.add_to_attack_zone(card_id)
        self.active_combat_mode(player)
        self.log(
            f'O player {player.nickname} colocou a carta {card_id} em modo de ataque')

    def player_defensive_card(self, player, card_id, pos):
        self.is_my_turn(player)
        player.add_to_defense_zone(card_id, pos)
        self.log(
            f'O player {player.nickname} colocou a carta {card_id} em modo de defesa na posição {pos}')

    async def clash_resolve(self, player):
        attacker = self.get_enemy(player)
        defender = player

        for i in range(len(attacker.attack_zone)):
            atk_card = self.get_card(attacker, attacker.attack_zone[i])
            def_card = self.get_card(
                defender, defender.defense_zone.get(str(i)))

            diff = self.duel(atk_card, def_card)

            if diff < 0:
                self.log(
                    f'O player {defender.nickname} perdeu {diff} HP')
                defender.remove_hp(abs(diff))

            if def_card:
                if def_card.is_dead():
                    self.log(
                        f'A carta {def_card.id} foi adicionada ao cemiterio')
                    defender.add_graveyard(def_card.id, str(i))

            data = {
                'line': i,
                'diff': diff,
                'match': self.get_match_data(),
            }

            await self.manager.send_to_players(self.id, 'clash_line', data)
            await asyncio.sleep(1)

        if defender.hp < 1:
            self.log(
                f'O player {defender.nickname} foi eliminado')
            self.gameover = True
            asyncio.create_task(self.finish_match(attacker, defender))
            return

        await asyncio.sleep(1)
        self.combat_mode = False
        await self.return_cards_to_bench(attacker, defender)
        self.new_round()
        # devolver as cartas vivas ao banco dos seus donos

    async def return_cards_to_bench(self, attacker, defender):
        self.log('Retornando cartas ao banco')
        for card in attacker.attack_zone:
            attacker.bench.append(card)
            inf = {
                'who': attacker.im,
                'card_id': card,
                'data': self.get_match_data(),
            }
            await self.manager.send_to_players(self.id, 'return_card_to_bench', inf)

        for card in defender.defense_zone.values():
            defender.bench.append(card)
            inf = {
                'who': defender.im,
                'card_id': card,
                'data': self.get_match_data(),
            }
            await self.manager.send_to_players(self.id, 'return_card_to_bench', inf)

        attacker.attack_zone.clear()
        defender.defense_zone.clear()

    def get_card(self, player, card_id):
        if card_id:
            return player.deck.get_card_obj(card_id)
        return None

    def id_cleaner(self, id):
        return re.sub(r'\([A-Z]\)', '', id)

    def duel(self, atk_card, def_card):
        if not def_card:
            return -atk_card.attack

        diff = def_card.defense - atk_card.attack

        # se for invuneravel diff = 0
        if not def_card.is_vulnerable():
            self.log(f'A carta {def_card.id} está invulnerável')
            def_card.set_vulnerable(True)
            self.log(f'A carta {def_card.id} foi mudada pra vulneravel')
            return 0
        # diminui defesa da carta
        def_card.remove_defense(atk_card.attack)
        self.log(f'A carta {def_card.id} perdeu -{atk_card.attack} de defesa')

        if def_card.defense < 1:
            self.log(f'A carta {def_card.id} foi eliminada')
            def_card.set_defense(0)

        return diff

    async def finish_match(self, winner, defeated):
        self.log('chamou finish_match')
        self.log(f'O vencedor é {winner.nickname}')
        self.log(f'O perdedor é {defeated.nickname}')
        self.winner = winner
        self.defeated = defeated
        gain_points, loss_points = await self.manager.points_calculate(winner, defeated)
        await self.manager.winner_gain(winner, gain_points)
        await self.manager.defeated_gain(defeated, loss_points)

        ...

    def player_play_spell(self, player, spell_id, target):
        self.is_my_turn(player)
        id = self.id_cleaner(spell_id)
        spell = self.spell_effects.get(id)
        if spell:
            spell(player, spell_id, target)
            player.play_spell(spell_id)

    def spell_s1(self, player, spell_id, target):
        if not target:
            raise NoTargetForSpellException(
                'Esta spell precisa de uma carta alvo')

        if target['owner'] != player.im:
            raise InvalidTargetForSpellException(
                'Só funciona em cartas aliadas')

        self.useEnergy(player, spell_id)
        self.log(
            f'O player {player.nickname} jogo a Spell S1 na carta {target["id"]}')

        target_card = self.get_card(player, target['id'])
        target_card.add_defense(2)

        data = {
            'match': self.get_match_data(),
            'player': player.get_player_data(),
            'spell_id': spell_id,
            'target': target,
        }
        asyncio.create_task(self.manager.send_to_players(
            self.id, 'spell_s1', data))

    def spell_s2(self, player, spell_id, target):
        if not target:
            raise NoTargetForSpellException(
                'Esta spell precisa de uma carta alvo')
        if target['owner'] != player.im:
            raise InvalidTargetForSpellException(
                'Só funciona em cartas aliadas')

        self.useEnergy(player, spell_id)
        self.log(
            f'O player {player.nickname} jogo a Spell S2 na carta {target["id"]}')
        target_card = self.get_card(player, target['id'])
        target_card.set_vulnerable(False)

        data = {
            'match': self.get_match_data(),
            'player': player.get_player_data(),
            'spell_id': spell_id,
            'target': target,
        }
        asyncio.create_task(self.manager.send_to_players(
            self.id, 'spell_s2', data))

    def spell_s5(self, player, spell_id, target):
        if player.hp <= 8:
            raise SuicideSpellException('Suicidio evitado com sucesso!')

        if not self.combat_mode:
            raise InvalidPlaySpellOutCombatException(
                'ação valida apenas em combate')

        self.is_player_offensive(player)
        self.useEnergy(player, spell_id)
        self.log(f'O player {player.nickname} jogo a Spell S5')

        player.remove_hp(8)

        updated_cards = []

        for card_id in player.attack_zone:
            card_obj = self.get_card(player, card_id)
            card_obj.add_attack(3)
            updated_cards.append(card_id)

        data = {
            'match': self.get_match_data(),
            'player': player.get_player_data(),
            'spell_id': spell_id,
            'updated_cards': updated_cards,
        }
        asyncio.create_task(self.manager.send_to_players(
            self.id, 'spell_s5', data))

    def spell_s7(self, player, spell_id, target=None):
        self.useEnergy(player, spell_id)
        self.log(f'O player {player.nickname} jogo a Spell S7')
        player.add_hp(5)
        data = {
            'match': self.get_match_data(),
            'player': player.get_player_data(),
            'spell_id': spell_id,
            'target': target,
        }

        asyncio.create_task(self.manager.send_to_players(
            self.id, 'spell_s7', data))

    def spell_s8(self, player, spell_id, target):
        if not target:
            raise NoTargetForSpellException(
                'Esta spell precisa de uma carta alvo')

        if target['owner'] == player.im:
            raise InvalidTargetForSpellException(
                'Só funciona em cartas adversárias')
        if self.combat_mode:
            raise InvalidPlaySpellInCombatException(
                'Carta invalida em combate')

        self.useEnergy(player, spell_id)
        self.log(
            f'O player {player.nickname} jogo a Spell S8 na carta {target["id"]}')

        enemy = self.get_enemy(player)

        target_card = self.get_card(enemy, target['id'])

        if target_card.is_vulnerable():
            self.log(f'A carta {target_card.id} perdeu 3 de vida')
            target_card.remove_defense(3)
        else:
            target_card.set_vulnerable(True)
            self.log(f'A carta {target_card.id} foi mudada pra vulneravel')

        if target_card.defense < 1:
            target_card.set_defense(0)
            self.log(f'A carta {target_card.id} foi eliminada')
            enemy.kill_card(target['id'], target['zone'])

        data = {
            'match': self.get_match_data(),
            'player': player.get_player_data(),
            'spell_id': spell_id,
            'target': target,
        }
        asyncio.create_task(self.manager.send_to_players(
            self.id, 'spell_s8', data))

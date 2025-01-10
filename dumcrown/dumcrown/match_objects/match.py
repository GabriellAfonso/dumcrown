from datetime import datetime
import asyncio
from .exceptions import (BenchFullException, OpponentTurnException,
                         InsufficientEnergyException, InvalidCardTypeForBenchException,
                         OpponentOffensiveTurnException, AttackZoneFullException,
                         InvalidPlayCardInCombatException)
# vai receber os dados de player 1 e player2 e vai gerenciar a partida inteira


# se a pessoa nao tiver energia pra fazer nenhuma açao, passar a vez
# player 1 sempre começa, sera escolhido aleatoriamente quem sera o player1

# ou a partida vai se gerenciar ou vou fazer um matchManager
class Match:

    def __init__(self, player1, player2, match_id, manager):
        self.id = match_id
        self.manager = manager
        self.round = 0
        self.player1 = player1
        self.player2 = player2

        self.turn = 0  # Indica de quem é a vez (pode ser 1 ou 2).
        self.offensive_player = 0  # Indica de quem é o turno ofensivo do round
        self.timestamp = datetime.now()
        self.combat_mode = False
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
        # print('player id', self.player1.get_id())
        if self.player1.get_id() == player_id:
            return self.player1

        return self.player2

    def get_enemy(self, player):
        if player.im == self.player1.im:
            return self.player2

        return self.player1

    def inital_draw(self):
        self.player1.change_button(1, 'PRONTO')
        self.player2.change_button(1, 'PRONTO')
        for i in range(0, 4):
            self.player1.hand.draw_card()
            self.player2.hand.draw_card()

    def initial_auto_pass(self):
        print('iniciou auto pass')
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

        }
        return match

    def record_action(self, action):
        self.history.append(action)

    def all_players_ready(self):
        p1 = self.player1.get_ready()
        p2 = self.player2.get_ready()
        return p1 and p2

    def new_round(self):
        # TODO quando mudar o round mudar quem tem o turno ofensivo
        self.round += 1
        self.player1.hand.draw_card()
        self.player2.hand.draw_card()

        # self.player1.energy = 1
        # self.player2.energy = 1

        self.toggle_ofensive_player()
        if self.round > 1:
            self.refill_energy()
            asyncio.create_task(self.manager.new_round(self.id))

    def refill_energy(self):
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
        if self.turn == 1:
            self.set_turn(2)
        else:
            self.set_turn(1)

    def toggle_ofensive_player(self):
        if self.offensive_player == 1:
            print('vez do player 2')
            self.set_ofensive_player(2)
            self.set_turn(2)
        else:
            print('vez do player 1')
            self.set_ofensive_player(1)
            self.set_turn(1)

    def set_ofensive_player(self, player):
        self.offensive_player = player

    def player_pass(self, player):
        self.is_my_turn(player)
        player.cancel_auto_pass()
        player.set_passed(True)
        if self.combat_mode:
            # ???
            pass

        self.check_both_passed()

        print(f'O player {player.im}, passou a vez')

    def player_clash(self, player):
        self.is_my_turn(player)
        player.cancel_auto_pass()
        if player.im != self.offensive_player:
            print('chamou o resolve clash')
            asyncio.create_task(self.clash_resolve(player))

            return

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

        self.finish_turn(player)

    def is_player_offensive(self, player):
        if self.offensive_player != player.im:
            raise OpponentOffensiveTurnException('Ação Inválida')

    def is_attack_zone_full(self, player):
        if len(player.attack_zone) >= 5:
            raise AttackZoneFullException('Zona de ataque cheia')

    def active_combat_mode(self, player):
        self.combat_mode = True
        player.change_button(1, 'ATACAR')

    def player_offensive_card(self, player, card_id):
        self.is_my_turn(player)
        self.is_player_offensive(player)
        self.is_attack_zone_full(player)
        player.add_to_attack_zone(card_id)
        self.active_combat_mode(player)

    def player_defensive_card(self, player, card_id, pos):
        self.is_my_turn(player)
        player.add_to_defense_zone(card_id, pos)

    async def clash_resolve(self, player):
        attacker = self.get_enemy(player)
        defender = player

        for i in range(len(attacker.attack_zone)):
            atk_card = self.get_card(attacker, attacker.attack_zone[i])
            def_card = self.get_card(
                defender, defender.defense_zone.get(str(i)))

            diff = self.duel(atk_card, def_card)

            if diff < 0:
                defender.remove_hp(abs(diff))
                if def_card:
                    defender.add_graveyard(def_card.id)

            data = {
                'line': i,
                'diff': diff,
                'match': self.get_match_data(),
            }
            # print('mandou pro client ', data)

            await self.manager.send_to_players(self.id, 'clash_line', data)
            await asyncio.sleep(1)

    def get_card(self, player, card_id):
        if card_id:
            return player.deck.get_card_obj(card_id)
        return None

    def duel(self, atk_card, def_card):
        if not def_card:
            return -atk_card.attack

        diff = def_card.defense - atk_card.attack

        # diminui defesa da carta
        def_card.remove_defense(atk_card.attack)

        # verifica se a carta morreu
        if def_card.defense < 1:
            def_card.set_defense(0)

        return diff

    def update_card_data(self):
        pass

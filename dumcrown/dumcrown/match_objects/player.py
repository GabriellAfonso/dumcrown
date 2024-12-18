from .hand import PlayerHand
from .deck import PlayerDeck
import asyncio


class Player:

    def __init__(self, data, im, manager):
        self.user_id = data['id']
        self.im = im
        self.manager = manager
        self.channel = data['channel']
        self.nickname = data['nickname']
        self.icon = data['icon']
        self.border = data['border']
        self.board = data['board']
        self.bench = []
        self.hp = 30
        self.energy = 10
        self.deck = PlayerDeck(data['deck'])
        self.hand = PlayerHand(self.deck)
        self.ready = False
        self.passed = False
        self.button_state = 0
        self.button_text = ''
        self.auto_pass = None

    def add_hp(self, points):
        self.hp += points

    def remove_hp(self, points):
        self.hp -= points

    def add_energy(self, points):
        self.energy += points

    def remove_energy(self, points: int):
        self.energy -= points

    def set_passed(self, value: bool):
        self.passed = value

    def change_button(self, state, text):
        self.button_state = state
        self.button_text = text

    def button_wait(self):
        self.change_button(0, 'AGUARDE')

    def get_id(self):
        return self.user_id

    def get_ready(self):
        return self.ready

    def set_ready(self, value):
        self.ready = value

    async def set_auto_ready(self):
        task = asyncio.create_task(self.wait_for_ready())
        self.auto_pass = task

    async def set_auto_pass(self, match):
        task = asyncio.create_task(self.auto_pass_timer(match))
        self.auto_pass = task

    def cancel_auto_pass(self):
        self.auto_pass.cancel()
        self.auto_pass = None

    async def wait_for_ready(self):
        try:
            await asyncio.sleep(15)  # Espera 30 segundos
            print('esperou os 15 segundos')
            if not self.get_ready():
                print('player nao tava ready')
                self.set_ready(True)
        except asyncio.CancelledError:
            print('wait cancelado')
            pass

    async def auto_pass_timer(self, match):
        try:
            await asyncio.sleep(40)
            asyncio.create_task(self.message('Seu Tempo Esta Acabando'))

            await asyncio.sleep(10)
            asyncio.create_task(self.message('Tempo limite Esgotado'))

            match.player_pass(self)

        except asyncio.CancelledError:
            print('Auto passar cancelado')
            pass

    def add_to_bench(self, card_id):
        self.bench.append(card_id)

        self.hand.pop_card(card_id)
        print(f'carta do {self.im} id: {card_id} adicionada ao bench')

    async def message(self, msg):
        await self.manager.message_to_player(
            self.channel, msg)

    def get_player_data(self):
        player = {
            'id': self.user_id,
            'im': self.im,
            'nickname': self.nickname,
            'icon': self.icon,
            'border': self.border,
            'board': self.board,

            'hp': self.hp,
            'energy': self.energy,
            'deck': self.deck.get_deck(),
            'deck_obj': self.deck.get_deck_obj(),
            'hand': self.hand.get_hand(),
            'button_state': self.button_state,
            'button_text': self.button_text,

            'bench': self.bench,
        }
        return player

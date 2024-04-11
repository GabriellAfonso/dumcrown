import json
from django.utils import timezone
from .functions import get_player, save_player, nickname_exists


class InvalidNickname(Exception):
    def __init__(self, mensagem=""):
        self.error_message = mensagem
        super().__init__(self.error_message)


class GameValidators:

    def __init__(self, consumer):
        self.consumer = consumer

    async def set_new_nickname(self, user, data):
        if user.is_authenticated:
            try:
                player = await get_player(user)
                new_nickname = data['set_new_nickname']

                if await nickname_exists(new_nickname):
                    error_message = 'Nickname ja está em uso.'
                    raise InvalidNickname

                elif len(new_nickname) < 3:
                    error_message = 'Nickname muito curto.'
                    raise InvalidNickname

                elif len(new_nickname) > 25:
                    error_message = 'Nickname muito grande.'
                    raise InvalidNickname

                else:
                    player.nickname = new_nickname
                    await save_player(player)

                    await self.consumer.send(text_data=json.dumps({'nick_response': 'saved'}))

            except InvalidNickname:
                await self.consumer.send(text_data=json.dumps({'nick_response': error_message}))

            except Exception as e:
                print(f'Erro no set_new_nickname: {e}')

    async def confirm_online(self, user, data):
        try:
            player = await get_player(user)
            if player.is_online == False:
                player.is_online = True
                await save_player(player)
        except Exception as e:
            print(f'Erro no confirm_online: {e}')

import json
from django.utils import timezone
from channels.db import database_sync_to_async
from .functions import get_player, save_player, nickname_exists


class InvalidNickname(Exception):
    def __init__(self, mensagem=""):
        self.error_message = mensagem
        super().__init__(self.error_message)


async def validate_nickname(nickname):
    try:
        new_nickname = nickname

        if await nickname_exists(new_nickname):
            error_message = 'Nickname ja está em uso.'
            raise InvalidNickname

        elif len(new_nickname) < 3:
            error_message = 'Nickname muito curto.'
            raise InvalidNickname

        elif len(new_nickname) > 25:
            error_message = 'Nickname muito grande.'
            raise InvalidNickname

        return 'okay'

    except InvalidNickname:

        return error_message

    except Exception as e:
        print(f'Erro no set_new_nickname: {e}')


@database_sync_to_async
def validate_deck_name(player, deck_id, deck_name):
    return player.decks.filter(name=deck_name).exclude(id=deck_id).first()

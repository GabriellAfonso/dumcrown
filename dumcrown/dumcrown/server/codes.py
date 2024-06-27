from .client import ClientData
from .room import GameRoom
client_data = ClientData
game_room = GameRoom

code_handlers = {
    'get_cards': {'object': client_data, 'method': 'get_cards'},
    'get_player_data': {'object': client_data, 'method': 'get_player_data'},
    'set_new_nickname': {'object': client_data, 'method': 'set_new_nickname'},
    'get_ranking': {'object': client_data, 'method': 'get_ranking'},
    'save_deck': {'object': client_data, 'method': 'save_deck'},
    'delete_deck': {'object': client_data, 'method': 'delete_deck'},
    'add_experience': {'object': client_data, 'method': 'add_experience'},
    'icon_change': {'object': client_data, 'method': 'icon_change'},
    'border_change': {'object': client_data, 'method': 'border_change'},
    'arena_change': {'object': client_data, 'method': 'arena_change'},
    'sound_update': {'object': client_data, 'method': 'sound_update'},
    'ping': {'object': client_data, 'method': 'send_pong'},

    'create_room': {'object': game_room, 'method': 'create_room'},
    'join_room': {'object': game_room, 'method': 'join_room'},
    'leave_room': {'object': game_room, 'method': 'leave_room'},
}

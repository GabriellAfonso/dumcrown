from .client import ClientData
from .room import GameRoom
from .match import MatchManager
client_data = ClientData
game_room = GameRoom
match_manager = MatchManager

code_handlers = {
    'ping': {'object': client_data, 'method': 'send_pong'},
    'get_cards': {'object': client_data, 'method': 'get_cards'},
    'get_player_data': {'object': client_data, 'method': 'get_player_data'},
    'set_new_nickname': {'object': client_data, 'method': 'set_new_nickname'},
    'get_ranking': {'object': client_data, 'method': 'get_ranking'},
    'save_deck': {'object': client_data, 'method': 'save_deck'},
    'delete_deck': {'object': client_data, 'method': 'delete_deck'},
    'add_experience': {'object': client_data, 'method': 'add_experience'},
    'icon_change': {'object': client_data, 'method': 'icon_change'},
    'border_change': {'object': client_data, 'method': 'border_change'},
    'board_change': {'object': client_data, 'method': 'board_change'},
    'sound_update': {'object': client_data, 'method': 'sound_update'},
    'activate_deck': {'object': client_data, 'method': 'activate_deck'},

    'create_room': {'object': game_room, 'method': 'create_room'},
    'join_room': {'object': game_room, 'method': 'join_room'},
    'leave_room': {'object': game_room, 'method': 'leave_room'},

    'start_match': {'object': match_manager, 'method': 'start_match'},
    'ready': {'object': match_manager, 'method': 'ready'},
    'play_card': {'object': match_manager, 'method': 'play_card'},
    'player_pass': {'object': match_manager, 'method': 'player_pass'},
    'offensive_card': {'object': match_manager, 'method': 'offensive_card'},
    'player_clash': {'object': match_manager, 'method': 'player_clash'},
    'defensive_card': {'object': match_manager, 'method': 'defensive_card'},
}

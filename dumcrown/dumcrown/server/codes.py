from .client import ClientData
client_data = ClientData

code_handlers = {
    'get_player_data': {'object': client_data, 'method': 'get_player_data'},
    'set_new_nickname': {'object': client_data, 'method': 'set_new_nickname'},
    'get_ranking': {'object': client_data, 'method': 'get_ranking'},
    'add_experience': {'object': client_data, 'method': 'add_experience'},
    'icon_change': {'object': client_data, 'method': 'icon_change'},
    'border_change': {'object': client_data, 'method': 'border_change'},
    'arena_change': {'object': client_data, 'method': 'arena_change'},
    'sound_update': {'object': client_data, 'method': 'sound_update'},
    'ping': {'object': client_data, 'method': 'send_pong'},
}

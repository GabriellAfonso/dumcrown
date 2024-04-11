from .client import ClientData
client_data = ClientData

code_handlers = {
    'get_player_data': {'object': client_data, 'method': 'get_player_data'},
    'set_new_nickname': {'object': client_data, 'method': 'set_new_nickname'},

}

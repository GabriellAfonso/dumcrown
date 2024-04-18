# import logging
# import logging.config
# import os

# # Configurações de logging
# LOGGING_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
# if not os.path.exists(LOGGING_DIR):
#     os.makedirs(LOGGING_DIR)

# LOGGING_LEVEL = logging.DEBUG

# LOGGING_CONFIG = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'file': {
#             'level': 'WARNING',
#             'class': 'logging.FileHandler',
#             'filename': os.path.join(LOGGING_DIR, 'debug.log'),
#             'formatter': 'verbose',
#         },
#         'console': {
#             'level': 'DEBUG',
#             'class': 'logging.StreamHandler',
#             'formatter': 'verbose',
#         },
#     },
#     'loggers': {
#         '': {
#             'handlers': ['file', 'console'],
#             'level': LOGGING_LEVEL,
#             'propagate': True,
#         },
#     },
#     'formatters': {
#         'verbose': {
#             'format': '%(asctime)s - %(levelname)s - %(message)s',
#         },
#     },
# }

# # Configuração global de logging
# logging.config.dictConfig(LOGGING_CONFIG)

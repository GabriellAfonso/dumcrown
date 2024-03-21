from __future__ import absolute_import, unicode_literals
from . import logging


# Isso garante que o aplicativo Celery seja importado quando o Django for iniciado.
from .celery import app as celery_app

__all__ = ('celery_app',)

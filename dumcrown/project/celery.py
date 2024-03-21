from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Configurações do Django para Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

# Crie uma instância do Celery
app = Celery('project')

# Carregue as configurações do Django
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks no aplicativo
app.autodiscover_tasks()

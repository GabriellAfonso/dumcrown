from django.urls import path
from dumcrown import views


app_name = 'dumcrown'

urlpatterns = [
    path('', views.index, name='index'),
]

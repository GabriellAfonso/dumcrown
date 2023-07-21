from django.urls import path
from dumcrown import views


app_name = 'dumcrown'

urlpatterns = [
    path('', views.index, name='index'),
    path('register', views.register, name='register'),
    path('jogo', views.jogo, name='jogo'),
    path('logout', views.logout_view, name='logout'),
    path('save_nickname/', views.save_nickname, name='save_nickname'),
]

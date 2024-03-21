from django.urls import path, include
from django.shortcuts import render, get_object_or_404, redirect
from dumcrown_api import views
from django.contrib.auth import views as auth_views


app_name = 'dumcrown_api'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('singup/', views.singup, name='singup'),
    path('test_token/', views.test_token, name='test_token'),
    path('player_data/', views.player_data, name='player_data'),
 
]


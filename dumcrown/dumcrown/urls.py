from django.urls import path, include
from django.shortcuts import render, get_object_or_404, redirect
from dumcrown import views
from django.contrib.auth import views as auth_views


app_name = 'dumcrown'

urlpatterns = [
    path('', views.index, name='index'),
    path('guest/', views.guest_access, name='guest_access'),
    path('login/', views.user_login, name='login'),
    path('accounts/login/', views.redirect_login, name='redirect_login'),
    path('accounts/signup/', views.redirect_register, name='redirect_register'),
    path('register', views.register, name='register'),
    path('game', views.game, name='game'),
    path('logout/', views.logout_view, name='logout'),
    path('save_nickname/', views.save_nickname, name='save_nickname'),
    path('debug-log/', views.view_debug_log, name='debug_log'),
]

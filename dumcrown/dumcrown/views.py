from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, views
from django.shortcuts import render, redirect
from dumcrown.forms import RegisterForm
from .models import Player
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.http import JsonResponse
import traceback
from django.core.exceptions import ObjectDoesNotExist
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import HttpResponse



def index(request):
    form = AuthenticationForm(request)
    
    if request.method == 'POST':
       
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            print('entrou')
            user = form.get_user()
            auth.login(request,user)
            return redirect('dumcrown:jogo')

        else:
            print('errou')
            messages.error(request, 'Usuário ou senha inválidos.')
            print(messages.error)
            return redirect('dumcrown:index')

    else:
        form = AuthenticationForm()

    context = {
        'form': form,
    }

    return render(
        request,
        'dumcrown/index.html',
        context,
    )


def register(request):
    form = RegisterForm()
    conta_criada = False
    if request.method == 'POST':
        print(RegisterForm())
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            conta_criada = True
            context = {'conta_criada': conta_criada,}
            
            return render(
                request,
                'dumcrown/register.html',
                context,
            )

        else:
            print(form.errors)
            print('invalido')



    context = {
        'form': form,
        'conta_criada': conta_criada,
    }

    return render(
        request,
        'dumcrown/register.html',
        context,
    )

@login_required(login_url='dumcrown:index')
def jogo(request):

    if request.user.is_authenticated:
        # O usuário está logado, você pode acessar o objeto User assim:
        user = request.user
        
        # Verifica se o usuario ja existe
        try:
            player = Player.objects.get(user=user)
        except Player.DoesNotExist:
            player = None

        # Se o jogador ainda não estiver vinculado a um banco de dados, vincule-o
        if not player or not player.registred:
            if not player:
                player = Player(user=user)

            player.nickname = f"{user.username}"
            player.level = 0
            player.experience = 0
            player.registred = True
            player.save()

    player = Player.objects.get(user=user)
        

    print(player.nickname)
    context = {
        'nickname': player.nickname,
        'level': player.level,
        'id': player.id,
        'experience': player.experience,
    }

    return render(
        request,
        'dumcrown/jogo.html',
        context,
    )

def logout_view(request):
    logout(request)
    return redirect('dumcrown:index')

def save_nickname(request):
    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        user = request.user

        try:
            player = Player.objects.get(user=user)
            player.nickname = nickname
            player.save()
            return JsonResponse({'message': 'Nickname saved successfully.'})
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Player object not found.'}, status=404)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'message': f'Error saving nickname: {e}'}, status=500)

    return JsonResponse({'message': 'Invalid request.'})
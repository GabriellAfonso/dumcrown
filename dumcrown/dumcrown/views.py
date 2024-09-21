from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import authenticate, login, views
from django.shortcuts import render, redirect
from dumcrown.forms import RegisterForm
from dumcrown.models.player import Player, LoginHistory

from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.http import JsonResponse
import traceback
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from dumcrown.consumers import PlayerConsumer
from allauth.socialaccount.models import SocialAccount


def index(request):

    context = {

    }

    return render(
        request,
        'dumcrown/index.html',
        context,
    )


def login(request):
    form = AuthenticationForm(request)

    if request.method == 'POST':

        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            user = form.get_user()
            auth.login(request, user)

            return redirect('dumcrown:jogo')

        else:
            messages.error(request, 'Usuário ou senha inválidos.')
            return redirect('dumcrown:login')

    else:
        form = AuthenticationForm(request)

    context = {
        'form': form,
    }

    return render(
        request,
        'dumcrown/login.html',
        context,
    )


def redirect_login(request):

    return redirect('dumcrown:login')


def redirect_register(request):

    return redirect('dumcrown:register')


def register(request):
    form = RegisterForm()
    conta_criada = False

    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if form.is_valid():
            # Salve o formulário de registro
            user = form.save()
            conta_criada = True
            context = {'conta_criada': conta_criada}
            return render(
                request,
                'dumcrown/register.html',
                context,
            )

    context = {
        'form': form,
        'conta_criada': conta_criada,
    }

    return render(
        request,
        'dumcrown/register.html',
        context,
    )


@login_required(login_url='dumcrown:login')
def jogo(request):

    user = request.user
    player = Player.objects.get(user=user)

    login_history = LoginHistory.objects.create(
        player=player, login_time=timezone.now())
    login_history.save()

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
    # Faz logout do usuário Django, caso esteja autenticado
    if request.user.is_authenticated:
        logout(request)

    # Faz logout do usuário Google, caso esteja autenticado
    try:
        if request.user.is_authenticated:
            google_social_account = SocialAccount.objects.get(
                provider='google', user=request.user)
            adapter = google_social_account.get_adapter(request)
            provider_logout_url = adapter.logout(
                request, google_social_account)
            return redirect(provider_logout_url)
    except SocialAccount.DoesNotExist:
        pass

    # Redireciona para a página desejada após o logout
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


@login_required(login_url='dumcrown:login')
@staff_member_required(login_url='dumcrown:login')
def view_debug_log(request):
    # Leitura do conteúdo do arquivo debug.log
    with open(settings.BASE_DIR / 'project/logs/debug.log', 'r') as file:
        content = file.read()

    return render(
        request,
        'dumcrown/debug_log.html',
        {'content': content}
    )

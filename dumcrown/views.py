from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from dumcrown.forms import RegisterForm




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

def jogo(request):

    context = {

    }

    return render(
        request,
        'dumcrown/jogo.html',
        context,
    )
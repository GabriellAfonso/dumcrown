from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from dumcrown.forms import LoginForm




def index(request):
    # if request.method == 'POST':
    #     form = LoginForm(request, data=request.POST)
    #     if form.is_valid():
    #         username = form.cleaned_data['username']
    #         password = form.cleaned_data['password']
    #         user = authenticate(request, username=username, password=password)
    #         if user is not None:
    #             login(request, user)
    #             return redirect('pagina_principal')  # Redirecionar para a página principal após o login bem-sucedido
    #         else:
    #             form.add_error(None, 'Usuário ou senha inválidos.')
    # else:
    #     form = LoginForm()


    form = AuthenticationForm(request)
    
    if request.method == 'POST':
       
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            print('entrou')
            user = form.get_user()
            auth.login(request,user)
            messages.success(request, 'Logado com sucesso!')
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

    context = {
       
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
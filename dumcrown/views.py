from django.shortcuts import render

def index(request):

    context = {

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
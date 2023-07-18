from django.shortcuts import render

def index(request):

    context = {

    }

    return render(
        request,
        'dumcrown/index.html',
        context,
    )
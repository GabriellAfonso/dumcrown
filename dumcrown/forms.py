from django import forms
from django.contrib.auth.forms import AuthenticationForm

class LoginForm(AuthenticationForm):
    # Campos adicionais, se necessário
    ...

    # Definir atributos de widget ou validação personalizados, se necessário
    # ...

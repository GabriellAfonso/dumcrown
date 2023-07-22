from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.core.validators import validate_email


class RegisterForm(UserCreationForm):
    from django.conf import settings
    settings.AUTH_PASSWORD_VALIDATORS = []

    username = forms.CharField(
        required=True, 
        min_length=3,
        max_length=40,
        error_messages={
            'required': 'este campo é obrigatório.',
            'min_length': 'nome de usuário muito curto.',
            'max_length': 'nome de usuário muito grande.',
            'invalid': 'nome de usuário invalido, nao utilize espaços',
        }
)
    
    email = forms.EmailField(
        required=True, 
        max_length=100,
        error_messages={
            'required': 'este campo é obrigatório.',
            'invalid': 'utilize um e-mail valido',
    }
)   
    
    password1 = forms.CharField(
        required=True,
        label='password',
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
        error_messages={
            'required': 'este campo é obrigatório.',
    }
)

    password2 = forms.CharField(
        required=True,
        label='password2',
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
        error_messages={
            'required': 'este campo é obrigatório.',
        }
)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
    
    def clean_username(self):
        username = self.cleaned_data.get('username')

        # Verifica se ja existe esse usuario no banco de dados
        if User.objects.filter(username=username).exists():
         raise forms.ValidationError('Este nome de usuário já está em uso.')

        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        current_email = self.instance.email

        if current_email != email:

            if User.objects.filter(email=email).exists():
                self.add_error(
                    'email',
                    ValidationError('Ja existe este e-mail', code='invalid')
                )
        return email
    

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')

        if len(password1) < 6:
            raise forms.ValidationError('A senha deve ter pelo menos 6 caracteres.')
        return password1
    

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            print('senha nao sao iguais')
            raise forms.ValidationError('As senhas não correspondem.')
        return password2

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Player_data

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ['id', 'username', 'password', 'email']


class PlayerSerializer(serializers.ModelSerializer):
     class Meta(object):
        model = Player_data
        fields = ['icon', 'border', 'arena', 'nickname', 
                  'level', 'experience', 'is_online',
                   'crystals', 'patent_points', 'patent',
                    'friends', 'matches', 'victories', 'defeats',] 
from datetime import datetime
from calendar import timegm
import json

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import serializers
from django.utils.timezone import now
#from api.settings import AWS_S3_ENDPOINT_URL, AWS_STORAGE_BUCKET_NAME

from .models import (
    CustomUser
)

class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = (
            'id', 
            'name', 
            'profile_picture', 
            'home_number', 
            'office_number', 
            'mobile_number',
            'birth_date',
            'nric',
            'username',
            'is_active',
            'user_type',
            'created_date',
            'modified_date',
        )
        read_only_fields = ('email', 'id')


from django.contrib.auth import get_user_model
from rest_framework import viewsets

from .serializers import UserSerializer

User = get_user_model()


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer
from django.shortcuts import render

# Create your views here.

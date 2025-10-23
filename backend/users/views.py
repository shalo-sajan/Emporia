# users/views.py

from rest_framework import generics, permissions
from .serializers import UserRegistrationSerializer
from .models import CustomUser

class UserRegistrationView(generics.CreateAPIView):
    """
    A public endpoint for registering new users.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    
    # This is a public endpoint, so we allow anyone to access it.
    permission_classes = [permissions.AllowAny]
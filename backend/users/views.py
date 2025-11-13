# users/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, UserRegistrationSerializer # Update this import
from .models import CustomUser
from rest_framework import generics, permissions

class UserRegistrationView(generics.CreateAPIView):
    """
    A public endpoint for registering new users.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    
    # This is a public endpoint, so we allow anyone to access it.
    permission_classes = [permissions.AllowAny]
    
class MyTokenObtainPairView(TokenObtainPairView):
    """
    This custom view uses our custom serializer to include
    user data (email, role) in the token.
    """
    serializer_class = MyTokenObtainPairSerializer
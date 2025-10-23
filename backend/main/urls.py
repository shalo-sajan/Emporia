# main/urls.py

from django.contrib import admin
from django.urls import path, include # <-- Make sure 'include' is imported
from django.conf import settings # <-- Import this
from django.conf.urls.static import static # <-- Import this


# Import the JWT token views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- API Authentication Endpoints ---
    # When our React app wants to log in, it will POST to this URL.
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # This URL allows refreshing an expired access token using a refresh token.
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # --- Include our new 'users' app URLs ---
    # All URLs from 'users/urls.py' will be prefixed with 'api/auth/'
    path('api/auth/', include('users.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
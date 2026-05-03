# Project-level URL configuration
# Routes all /api/ requests to the chat app

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('chat.urls')),  # All chat endpoints at /api/
]

# urls.py - URL routing for the chat app
# Maps URL paths to view functions

from django.urls import path
from . import views

urlpatterns = [
    # POST /api/chat/ — send a message, get AI response
    path('chat/', views.chat, name='chat'),

    # GET /api/history/ — get all conversation sessions
    path('history/', views.history, name='history'),

    # DELETE /api/history/clear/ — clear all history
    path('history/clear/', views.clear_history, name='clear_history'),
]

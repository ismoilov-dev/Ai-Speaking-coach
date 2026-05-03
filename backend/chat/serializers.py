# serializers.py - Converts Django models to/from JSON
# This is how Django REST Framework communicates with the React frontend

from rest_framework import serializers
from .models import Message, Conversation


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializes a Message object to JSON format:
    {
        "id": 1,
        "role": "user",
        "content": "Hello!",
        "created_at": "2024-01-01T12:00:00Z"
    }
    """
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'created_at', 'conversation']
        read_only_fields = ['id', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    """
    Serializes a Conversation with all its messages included.
    """
    # Nest all messages inside the conversation object
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'created_at', 'messages']
        read_only_fields = ['id', 'created_at']

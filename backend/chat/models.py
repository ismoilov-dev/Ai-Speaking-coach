# models.py - Database models for the English Coach app
# This defines how chat messages are stored in SQLite

from django.db import models


class Conversation(models.Model):
    """
    A conversation session.
    Each time a user starts a new session, a new Conversation is created.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200, default="English Practice Session")

    def __str__(self):
        return f"Conversation {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-created_at']


class Message(models.Model):
    """
    A single message in a conversation.
    Role can be 'user' (human) or 'assistant' (AI).
    """
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,      # Delete messages when conversation is deleted
        related_name='messages',        # Access messages via conversation.messages.all()
        null=True,
        blank=True
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()                        # The actual message text
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when created

    def __str__(self):
        return f"[{self.role.upper()}] {self.content[:50]}..."

    class Meta:
        ordering = ['created_at']  # Oldest messages first

# views.py - API endpoint logic
# Handles chat messages and connects to AI (Ollama or HuggingFace)

import os
import json
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer


# ─────────────────────────────────────────────
#  AI Provider Functions
# ─────────────────────────────────────────────

def get_ai_response_ollama(messages: list) -> str:
    """
    Send conversation history to Ollama (local LLM) and get a response.
    Ollama must be running locally: https://ollama.ai
    Default model: llama3.2 (free, runs on your machine)
    """
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "llama3.2")

    # Build the prompt with conversation history
    system_prompt = """You are a friendly English language speaking coach. 
Your role is to:
1. Have natural conversations in English
2. Gently correct grammar mistakes when you notice them
3. Suggest better vocabulary when appropriate
4. Encourage the learner and keep the conversation flowing
5. Keep responses concise (2-4 sentences) for natural conversation flow
Be warm, encouraging, and educational without being too formal."""

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            *messages  # Include conversation history
        ],
        "stream": False
    }

    try:
        response = requests.post(
            f"{ollama_url}/api/chat",
            json=payload,
            timeout=60  # Give Ollama time to respond
        )
        response.raise_for_status()
        data = response.json()
        return data["message"]["content"]
    except requests.exceptions.ConnectionError:
        raise Exception(
            "Cannot connect to Ollama. Make sure Ollama is running: "
            "run 'ollama serve' in a terminal."
        )
    except Exception as e:
        raise Exception(f"Ollama error: {str(e)}")


def get_ai_response_huggingface(messages: list) -> str:
    """
    Send conversation to HuggingFace Inference API (free tier).
    Requires a free HuggingFace API key: https://huggingface.co/settings/tokens
    Set HF_API_KEY in your .env file.
    """
    api_key = os.getenv("HF_API_KEY", "")
    model = os.getenv("HF_MODEL", "mistralai/Mistral-7B-Instruct-v0.3")

    if not api_key:
        raise Exception(
            "HuggingFace API key not found. "
            "Set HF_API_KEY in your .env file. "
            "Get a free key at: https://huggingface.co/settings/tokens"
        )

    # Build a single prompt string from message history
    system_prompt = """You are a friendly English speaking coach. Have natural conversations, 
gently correct mistakes, and keep responses to 2-4 sentences."""

    # Format messages for HuggingFace instruction models
    prompt = f"<s>[INST] {system_prompt}\n\n"
    for msg in messages:
        if msg["role"] == "user":
            prompt += f"User: {msg['content']}\n"
        else:
            prompt += f"Assistant: {msg['content']}\n"
    prompt += "[/INST]"

    headers = {"Authorization": f"Bearer {api_key}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.7,
            "return_full_text": False
        }
    }

    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{model}",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()

        if isinstance(data, list) and len(data) > 0:
            return data[0].get("generated_text", "").strip()
        raise Exception("Unexpected response format from HuggingFace")
    except Exception as e:
        raise Exception(f"HuggingFace error: {str(e)}")


def get_ai_response(messages: list) -> str:
    """
    Main AI dispatcher — chooses provider based on AI_MODEL_PROVIDER env variable.
    Options: 'ollama' (default) or 'huggingface'
    """
    provider = os.getenv("AI_MODEL_PROVIDER", "ollama").lower()

    if provider == "huggingface":
        return get_ai_response_huggingface(messages)
    else:
        # Default to Ollama (fully free, runs locally)
        return get_ai_response_ollama(messages)


# ─────────────────────────────────────────────
#  API Views
# ─────────────────────────────────────────────

@api_view(['POST'])
def chat(request):
    """
    POST /api/chat/
    Body: { "message": "Hello!", "conversation_id": 1 (optional) }
    Returns: { "reply": "Hi there!", "conversation_id": 1, "messages": [...] }
    """
    user_message = request.data.get("message", "").strip()
    conversation_id = request.data.get("conversation_id")

    if not user_message:
        return Response(
            {"error": "Message cannot be empty."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get or create a conversation session
    if conversation_id:
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            conversation = Conversation.objects.create()
    else:
        # Start a new conversation
        conversation = Conversation.objects.create(
            title=f"Session: {user_message[:40]}..."
        )

    # Save the user's message to database
    Message.objects.create(
        conversation=conversation,
        role="user",
        content=user_message
    )

    # Build message history for AI context (last 20 messages)
    recent_messages = conversation.messages.order_by('created_at')[:20]
    ai_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in recent_messages
    ]

    # Get AI response
    try:
        ai_reply = get_ai_response(ai_messages)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    # Save AI's response to database
    Message.objects.create(
        conversation=conversation,
        role="assistant",
        content=ai_reply
    )

    # Return the reply and updated conversation
    all_messages = MessageSerializer(
        conversation.messages.all(), many=True
    ).data

    return Response({
        "reply": ai_reply,
        "conversation_id": conversation.id,
        "messages": all_messages
    })


@api_view(['GET'])
def history(request):
    """
    GET /api/history/
    Returns all conversation sessions with their messages.
    Optional query param: ?conversation_id=1 for a specific conversation.
    """
    conversation_id = request.query_params.get("conversation_id")

    if conversation_id:
        # Return a specific conversation
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            serializer = ConversationSerializer(conversation)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found."},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        # Return all conversations (summary, no messages)
        conversations = Conversation.objects.all()[:20]  # Last 20 sessions
        data = [
            {
                "id": c.id,
                "title": c.title,
                "created_at": c.created_at,
                "message_count": c.messages.count()
            }
            for c in conversations
        ]
        return Response(data)


@api_view(['DELETE'])
def clear_history(request):
    """
    DELETE /api/history/clear/
    Clears all conversation history (for testing/reset).
    """
    Message.objects.all().delete()
    Conversation.objects.all().delete()
    return Response({"message": "All history cleared."})

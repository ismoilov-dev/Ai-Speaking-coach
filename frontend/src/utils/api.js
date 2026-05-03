// utils/api.js - Functions to communicate with the Django backend

import axios from 'axios';

// Base URL — in development, Vite proxies /api to http://localhost:8000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for AI responses
});


/**
 * Send a chat message to the Django backend.
 * @param {string} message - The user's message text
 * @param {number|null} conversationId - Existing conversation ID (or null for new)
 * @returns {Promise<{ reply: string, conversation_id: number, messages: Array }>}
 */
export async function sendMessage(message, conversationId = null) {
  const response = await api.post('/api/chat/', {
    message,
    conversation_id: conversationId,
  });
  return response.data;
}


/**
 * Fetch conversation history from the backend.
 * @param {number|null} conversationId - If provided, fetch that specific conversation
 * @returns {Promise<Array>}
 */
export async function fetchHistory(conversationId = null) {
  const url = conversationId
    ? `/api/history/?conversation_id=${conversationId}`
    : '/api/history/';
  const response = await api.get(url);
  return response.data;
}


/**
 * Clear all conversation history.
 * @returns {Promise<void>}
 */
export async function clearHistory() {
  const response = await api.delete('/api/history/clear/');
  return response.data;
}

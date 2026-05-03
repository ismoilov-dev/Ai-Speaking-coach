// hooks/useChat.js - Manages conversation state and API communication

import { useState, useCallback, useRef, useEffect } from 'react';
import { sendMessage, fetchHistory, clearHistory } from '../utils/api';

export function useChat() {
  const [messages, setMessages] = useState([]);           // Current conversation messages
  const [conversationId, setConversationId] = useState(null); // Current session ID
  const [isLoading, setIsLoading] = useState(false);      // Waiting for AI response
  const [error, setError] = useState(null);               // Error message
  const [sessions, setSessions] = useState([]);           // All past sessions
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load past sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await fetchHistory();
      setSessions(data);
    } catch (err) {
      console.warn('Could not load history:', err.message);
    }
  };

  /**
   * Send a message and receive AI reply.
   * @param {string} text - The message to send
   * @returns {Promise<string>} - The AI's reply text
   */
  const send = useCallback(async (text) => {
    if (!text.trim() || isLoading) return null;

    setError(null);

    // Optimistically add user message to UI immediately
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await sendMessage(text, conversationId);

      // Update conversation ID for follow-up messages
      setConversationId(data.conversation_id);

      // Replace optimistic messages with server response
      setMessages(data.messages);

      // Refresh session list
      loadSessions();

      return data.reply;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to send message';
      setError(errorMsg);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isLoading]);

  /**
   * Load a specific past conversation.
   */
  const loadSession = useCallback(async (sessionId) => {
    try {
      setIsLoading(true);
      const data = await fetchHistory(sessionId);
      setMessages(data.messages || []);
      setConversationId(sessionId);
    } catch (err) {
      setError('Could not load session.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Start a fresh conversation.
   */
  const newConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  /**
   * Clear all history from database.
   */
  const clearAll = useCallback(async () => {
    try {
      await clearHistory();
      setMessages([]);
      setConversationId(null);
      setSessions([]);
    } catch (err) {
      setError('Could not clear history.');
    }
  }, []);

  return {
    messages,
    conversationId,
    isLoading,
    error,
    sessions,
    send,
    loadSession,
    newConversation,
    clearAll,
    messagesEndRef,
  };
}

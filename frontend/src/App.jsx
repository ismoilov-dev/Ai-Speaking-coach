import React, { useState } from 'react';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';
import { MessageBubble, ThinkingBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { HistoryPanel } from './components/HistoryPanel';

export default function App() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const { messages, conversationId, isLoading, error, sessions, send, loadSession, newConversation, clearAll, messagesEndRef } = useChat();

  const { isListening, isSpeaking, speechSupported, ttsSupported, startListening, stopListening, speak, stopSpeaking } = useSpeech({
    onTranscript: async (transcript) => {
      const reply = await send(transcript);
      if (reply && autoSpeak) speak(reply);
    },
    onError: (err) => console.warn('Speech error:', err),
  });

  const handleSend = async (text) => {
    const reply = await send(text);
    if (reply && autoSpeak && ttsSupported) speak(reply);
  };

  const starters = ["Tell me about yourself", "How was your day?", "Can you correct my grammar?", "Let's practice small talk"];

  return (
    <div style={{ display:'flex', height:'100vh', background:'var(--bg-main)', overflow:'hidden' }}>
      <HistoryPanel
        sessions={sessions} currentId={conversationId}
        onSelect={loadSession} onNew={newConversation} onClear={clearAll}
        isOpen={historyOpen} onClose={() => setHistoryOpen(false)}
      />

      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)', background:'var(--bg-main)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setHistoryOpen(true)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:8 }}>
              ☰
            </button>
            <div>
              <h1 style={{ margin:0, fontFamily:'"Playfair Display", serif', fontSize:22, color:'var(--text-primary)', fontWeight:400 }}>
                English <em style={{ color:'var(--accent-green)' }}>Coach</em>
              </h1>
              <p style={{ margin:0, fontSize:11, color:'var(--text-muted)' }}>AI-powered speaking practice</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {ttsSupported && (
              <button onClick={() => { setAutoSpeak(p => !p); if (isSpeaking) stopSpeaking(); }}
                style={{ padding:'6px 12px', borderRadius:20, fontSize:12, cursor:'pointer', border:`1px solid ${autoSpeak ? 'var(--accent-green)' : 'var(--border)'}`, background: autoSpeak ? 'rgba(93,143,107,0.15)' : 'var(--bg-card)', color: autoSpeak ? 'var(--accent-green-light)' : 'var(--text-muted)' }}>
                {autoSpeak ? '🔊 Voice On' : '🔇 Voice Off'}
              </button>
            )}
            <button onClick={newConversation} title="New conversation"
              style={{ padding:'6px 12px', borderRadius:20, fontSize:12, cursor:'pointer', border:'1px solid var(--border)', background:'var(--bg-card)', color:'var(--text-secondary)' }}>
              + New
            </button>
          </div>
        </header>

        {/* Messages area */}
        <main className="messages-scroll" style={{ flex:1, overflowY:'auto', padding:'24px 16px' }}>
          <div style={{ maxWidth:720, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

            {/* Welcome screen */}
            {messages.length === 0 && !isLoading && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 0', textAlign:'center' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(93,143,107,0.1)', border:'1px solid rgba(93,143,107,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, marginBottom:24 }}>
                  🎙️
                </div>
                <h2 style={{ fontFamily:'"Playfair Display", serif', fontSize:26, color:'var(--text-primary)', margin:'0 0 8px', fontWeight:400 }}>
                  Ready to practice?
                </h2>
                <p style={{ color:'var(--text-muted)', fontSize:14, maxWidth:340, lineHeight:1.6, margin:'0 0 32px' }}>
                  Chat in English with your AI coach. Type a message or use your microphone.
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, width:'100%', maxWidth:440 }}>
                  {starters.map(p => (
                    <button key={p} onClick={() => handleSend(p)}
                      style={{ padding:'12px 16px', textAlign:'left', fontSize:13, color:'var(--text-secondary)', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12, cursor:'pointer', transition:'border-color 0.2s' }}
                      onMouseOver={e => e.target.style.borderColor='var(--accent-green)'}
                      onMouseOut={e => e.target.style.borderColor='var(--border)'}>
                      → {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => <MessageBubble key={msg.id || i} message={msg} />)}
            {isLoading && <ThinkingBubble />}

            {error && (
              <div style={{ padding:16, background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.3)', borderRadius:12, color:'#e88' }}>
                <strong>⚠️ Error:</strong> {error}
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Make sure Django is running: <code>python manage.py runserver</code></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        <ChatInput
          onSend={handleSend} isLoading={isLoading}
          isListening={isListening} isSpeaking={isSpeaking}
          onVoiceStart={startListening} onVoiceStop={stopListening}
          speechSupported={speechSupported}
        />
      </div>
    </div>
  );
}

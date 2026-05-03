import React, { useState, useRef, useEffect } from 'react';
import { VoiceButton } from './VoiceButton';

export function ChatInput({ onSend, isLoading, isListening, isSpeaking, onVoiceStart, onVoiceStop, speechSupported }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }
  }, [text]);

  const handleSubmit = () => {
    if (text.trim() && !isLoading) { onSend(text.trim()); setText(''); }
  };

  const canSend = text.trim() && !isLoading && !isListening;

  return (
    <div style={{ borderTop:'1px solid var(--border)', background:'var(--bg-main)', padding:'12px 16px' }}>
      <div style={{ maxWidth:720, margin:'0 auto' }}>
        {isListening && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, fontSize:12, color:'#e88' }}>
            <span style={{ width:8, height:8, background:'var(--accent-red)', borderRadius:'50%', animation:'thinking 1s infinite' }} />
            Listening… speak now
          </div>
        )}
        {isSpeaking && !isListening && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, fontSize:12, color:'var(--accent-green-light)' }}>
            <span style={{ width:8, height:8, background:'var(--accent-green)', borderRadius:'50%', animation:'thinking 1s infinite' }} />
            AI is speaking…
          </div>
        )}

        <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
          <VoiceButton isListening={isListening} isSpeaking={isSpeaking} onStart={onVoiceStart} onStop={onVoiceStop} disabled={isLoading || !speechSupported} />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder={isListening ? 'Listening to your voice…' : 'Type your message or press the mic…'}
            disabled={isLoading || isListening}
            rows={1}
            style={{ flex:1, resize:'none', background:'var(--bg-input)', border:`1px solid ${isListening ? 'rgba(192,57,43,0.4)' : 'var(--border)'}`, borderRadius:16, padding:'12px 16px', fontSize:14, color:'var(--text-primary)', outline:'none', fontFamily:'inherit', lineHeight:1.5, maxHeight:120, overflowY:'auto' }}
          />

          <button
            onClick={handleSubmit}
            disabled={!canSend}
            style={{ width:48, height:48, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor: canSend ? 'pointer' : 'not-allowed', background: canSend ? 'var(--accent-green)' : 'var(--bg-card)', border: canSend ? 'none' : '1px solid var(--border)', color: canSend ? '#fff' : 'var(--text-muted)', opacity: canSend ? 1 : 0.5, transition:'all 0.2s' }}
          >
            {isLoading
              ? <svg style={{ width:18, height:18, animation:'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" /></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width:16, height:16 }}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            }
          </button>
        </div>

        <p style={{ margin:'6px 0 0', fontSize:11, color:'var(--text-muted)', paddingLeft:4 }}>
          Press Enter to send{speechSupported ? ' · Mic for voice input' : ''}
        </p>
      </div>
    </div>
  );
}

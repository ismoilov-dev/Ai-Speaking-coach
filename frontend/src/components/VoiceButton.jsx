import React from 'react';

export function VoiceButton({ isListening, isSpeaking, onStart, onStop, disabled }) {
  return (
    <button
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      title={isListening ? 'Stop recording' : 'Start voice input'}
      style={{
        position:'relative', width:48, height:48, borderRadius:'50%',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: isListening ? '2px solid var(--accent-red)' : '1px solid var(--border)',
        background: isListening ? 'rgba(192,57,43,0.2)' : 'var(--bg-card)',
        color: isListening ? '#e88' : 'var(--text-secondary)',
        opacity: disabled ? 0.4 : 1,
        transition:'all 0.2s',
        flexShrink: 0,
      }}
    >
      {isListening && (
        <span style={{ position:'absolute', inset:-6, borderRadius:'50%', border:'2px solid var(--accent-red)', opacity:0.4, animation:'thinking 1s ease-in-out infinite' }} />
      )}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width:20, height:20, position:'relative', zIndex:1 }}>
        {isListening
          ? <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
          : <>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </>
        }
      </svg>
      {isSpeaking && !isListening && (
        <span style={{ position:'absolute', top:0, right:0, width:10, height:10, background:'var(--accent-green)', borderRadius:'50%', border:'2px solid var(--bg-main)' }} />
      )}
    </button>
  );
}

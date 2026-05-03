import React from 'react';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.created_at).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });

  return (
    <div className="message-enter" style={{ display:'flex', gap:12, flexDirection: isUser ? 'row-reverse' : 'row' }}>
      {/* Avatar */}
      <div style={{ flexShrink:0, width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, background: isUser ? 'rgba(232,160,32,0.15)' : 'rgba(93,143,107,0.15)', border: `1px solid ${isUser ? 'rgba(232,160,32,0.3)' : 'rgba(93,143,107,0.3)'}`, color: isUser ? 'var(--accent-amber)' : 'var(--accent-green-light)' }}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth:'72%', display:'flex', flexDirection:'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap:4 }}>
        <div style={{ padding:'10px 16px', borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px', fontSize:14, lineHeight:1.6, background: isUser ? 'rgba(232,160,32,0.08)' : 'var(--bg-card)', border: `1px solid ${isUser ? 'rgba(232,160,32,0.2)' : 'var(--border)'}`, color:'var(--text-primary)' }}>
          {message.content}
        </div>
        <span style={{ fontSize:11, color:'var(--text-muted)', padding:'0 4px' }}>{time}</span>
      </div>
    </div>
  );
}

export function ThinkingBubble() {
  return (
    <div className="message-enter" style={{ display:'flex', gap:12 }}>
      <div style={{ flexShrink:0, width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, background:'rgba(93,143,107,0.15)', border:'1px solid rgba(93,143,107,0.3)', color:'var(--accent-green-light)' }}>AI</div>
      <div style={{ padding:'14px 18px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'4px 18px 18px 18px', display:'flex', gap:6, alignItems:'center' }}>
        <span className="thinking-dot" style={{ width:8, height:8, background:'var(--accent-green)', borderRadius:'50%', display:'inline-block' }} />
        <span className="thinking-dot" style={{ width:8, height:8, background:'var(--accent-green)', borderRadius:'50%', display:'inline-block' }} />
        <span className="thinking-dot" style={{ width:8, height:8, background:'var(--accent-green)', borderRadius:'50%', display:'inline-block' }} />
      </div>
    </div>
  );
}

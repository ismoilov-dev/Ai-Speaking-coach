import React from 'react';

export function HistoryPanel({ sessions, currentId, onSelect, onNew, onClear, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:20 }} />}
      <aside className="history-panel" style={{
        position:'fixed', top:0, left:0, height:'100%', width:272,
        background:'#110e0b', borderRight:'1px solid var(--border)',
        zIndex:30, display:'flex', flexDirection:'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        <div style={{ padding:'20px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h2 style={{ margin:0, fontFamily:'"Playfair Display", serif', fontSize:18, color:'var(--text-primary)', fontWeight:400 }}>Sessions</h2>
            <p style={{ margin:0, fontSize:11, color:'var(--text-muted)', marginTop:2 }}>Past conversations</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>

        <div style={{ padding:10, borderBottom:'1px solid var(--border)' }}>
          <button onClick={() => { onNew(); onClose(); }}
            style={{ width:'100%', padding:'10px 16px', background:'rgba(93,143,107,0.1)', border:'1px solid rgba(93,143,107,0.25)', borderRadius:10, color:'var(--accent-green-light)', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
            + New Conversation
          </button>
        </div>

        <div className="messages-scroll" style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {sessions.length === 0
            ? <div style={{ padding:'32px 16px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No sessions yet.<br/>Start chatting!</div>
            : sessions.map(s => (
                <button key={s.id} onClick={() => { onSelect(s.id); onClose(); }}
                  style={{ width:'100%', textAlign:'left', padding:'12px 16px', background: currentId === s.id ? 'rgba(93,143,107,0.1)' : 'none', border:'none', borderBottom:'1px solid var(--border)', color:'var(--text-primary)', cursor:'pointer', borderLeft: currentId === s.id ? '2px solid var(--accent-green)' : '2px solid transparent' }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.title}</p>
                  <p style={{ margin:'2px 0 0', fontSize:11, color:'var(--text-muted)' }}>
                    {new Date(s.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric' })} · {s.message_count} msgs
                  </p>
                </button>
              ))
          }
        </div>

        {sessions.length > 0 && (
          <div style={{ padding:10, borderTop:'1px solid var(--border)' }}>
            <button onClick={() => { if(window.confirm('Clear all history?')) { onClear(); onClose(); } }}
              style={{ width:'100%', padding:'8px', background:'none', border:'none', color:'var(--text-muted)', fontSize:12, cursor:'pointer' }}>
              🗑 Clear all history
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

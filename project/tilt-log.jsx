// Tilt — Log a Treat (modal-style flow)

function LogTreat({ onClose, onLog, tone }) {
  const [level, setLevel] = React.useState(50);
  const [emoji, setEmoji] = React.useState('🍝');
  const [note, setNote] = React.useState('');
  const [selected, setSelected] = React.useState(['alex', 'jamie']);
  const [showCelebrate, setShowCelebrate] = React.useState(false);
  const levelRef = React.useRef(null);

  React.useEffect(() => {
    if (!levelRef.current) return;
    const idx = TREAT_LEVELS.indexOf(level);
    const btn = levelRef.current.children[idx];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [level]);

  const toggleFriend = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submit = () => {
    setShowCelebrate(true);
    setTimeout(() => { onLog && onLog({ level, emoji, note, selected }); onClose(); }, 1500);
  };

  if (showCelebrate) {
    return <Celebration level={level} emoji={emoji} count={selected.length} />;
  }

  return (
    <div className="tilt-screen no-tabs" style={{
      background: 'var(--bg)', padding: 0,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '60px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onClose} style={{
          border: 'none', background: 'var(--bg-card)',
          width: 40, height: 40, borderRadius: 20,
          fontSize: 18, cursor: 'pointer',
          boxShadow: 'var(--shadow-1)',
        }}>✕</button>
        <div className="t-display" style={{ fontSize: 18 }}>spread a treat</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="scroll" style={{ flex: 1, padding: '12px 20px 32px' }}>
        {/* Emoji + level preview */}
        <div style={{
          textAlign: 'center', padding: '20px 0 16px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 116, height: 116, borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%',
            background: 'var(--peach-soft)',
            fontSize: 64,
            boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.05)',
            animation: 'pop 0.4s cubic-bezier(.34,1.56,.64,1)',
          }} key={emoji}>{emoji}</div>
          <div style={{ marginTop: 16, fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }} key={level}>
            +{level}
          </div>
          <div className="t-serif" style={{ fontSize: 18, color: 'var(--ink-2)', marginTop: 4 }}>treat units, vibes only</div>
        </div>

        {/* Treat level picker — horizontal snap scroll */}
        <div className="section-title" style={{ marginTop: 16 }}>treat level</div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(90deg, var(--bg) 40%, transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(270deg, var(--bg) 40%, transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <div ref={levelRef} style={{
            display: 'flex', gap: 8,
            overflowX: 'auto', scrollSnapType: 'x mandatory',
            paddingBottom: 4, paddingLeft: 4, paddingRight: 4,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {TREAT_LEVELS.map(v => (
              <button key={v} onClick={() => setLevel(v)} className="treat-pill" style={{
                scrollSnapAlign: 'center',
                flexShrink: 0,
                background: level === v ? 'var(--ink)' : 'var(--bg-card)',
                color: level === v ? '#FFF8EE' : 'var(--ink)',
                border: 'none', cursor: 'pointer',
                boxShadow: level === v ? 'var(--shadow-pop)' : 'var(--shadow-1)',
                transform: level === v ? 'scale(1.1)' : 'scale(1)',
                opacity: level === v ? 1 : 0.65,
                fontSize: level === v ? 15 : 14,
                fontWeight: level === v ? 800 : 600,
                transition: 'all 0.2s cubic-bezier(.34,1.56,.64,1)',
              }}>+{v}</button>
            ))}
          </div>
        </div>

        {/* Emoji picker */}
        <div className="section-title" style={{ marginTop: 22 }}>what was it</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
          {EMOJIS.map(({ e }) => (
            <button key={e} onClick={() => setEmoji(e)} style={{
              border: 'none',
              aspectRatio: '1 / 1',
              borderRadius: 14,
              background: emoji === e ? 'var(--peach-soft)' : 'var(--bg-card)',
              fontSize: 22, cursor: 'pointer',
              boxShadow: emoji === e ? 'inset 0 0 0 2px var(--peach-deep)' : 'var(--shadow-1)',
              transition: 'all 0.15s',
            }}>{e}</button>
          ))}
        </div>

        {/* Note */}
        <div className="section-title" style={{ marginTop: 22 }}>moment</div>
        <div style={{
          background: 'var(--bg-card)', borderRadius: 18, padding: 14,
          boxShadow: 'var(--shadow-1)',
        }}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="3am kebab rescue 🌯"
            style={{
              border: 'none', outline: 'none',
              width: '100%', fontSize: 15, fontFamily: 'var(--font-body)',
              background: 'transparent', color: 'var(--ink)',
            }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="chip" style={{ border: 'none', cursor: 'pointer' }}>📸 photo</button>
            <button className="chip" style={{ border: 'none', cursor: 'pointer' }}>📍 here</button>
          </div>
        </div>

        {/* Friends */}
        <div className="section-title" style={{ marginTop: 22 }}>
          treating · {selected.length} {selected.length === 1 ? 'friend' : 'friends'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FRIENDS.map(f => (
            <button key={f.id} onClick={() => toggleFriend(f.id)} style={{
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12,
              background: 'var(--bg-card)',
              borderRadius: 16,
              boxShadow: 'var(--shadow-1)',
              textAlign: 'left',
            }}>
              <FriendAvatar name={f.name} color={f.color} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{f.vibe}</div>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: selected.includes(f.id) ? 'var(--ink)' : 'transparent',
                border: selected.includes(f.id) ? 'none' : '2px solid var(--hairline-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFF8EE', fontSize: 14, fontWeight: 700,
              }}>{selected.includes(f.id) ? '✓' : ''}</div>
            </button>
          ))}
        </div>

        <div style={{ height: 16 }} />
      </div>

      {/* Bottom CTA */}
      <div style={{
        padding: '16px 20px 36px',
        background: 'linear-gradient(180deg, transparent 0%, var(--bg) 30%)',
      }}>
        <button onClick={submit} className="btn btn-primary btn-block" disabled={selected.length === 0}
          style={{ opacity: selected.length === 0 ? 0.5 : 1 }}>
          spread the +{level} {emoji} →
        </button>
      </div>
    </div>
  );
}

function Celebration({ level, emoji, count }) {
  const colors = ['#FFD66B', '#FFB59A', '#F49AC2', '#C9B8F0', '#B9E8C6', '#A8D9F0'];
  return (
    <div className="tilt-screen no-tabs no-status" style={{
      background: 'var(--celebrate)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* confetti */}
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="dot" style={{
          left: `${10 + (i * 73) % 80}%`,
          bottom: 100,
          background: colors[i % colors.length],
          animationDelay: `${(i % 8) * 0.07}s`,
          animationDuration: `${1.2 + (i % 4) * 0.2}s`,
        }} />
      ))}
      <Til mood="excited" size={200} color="#FFB59A" />
      <div className="t-display" style={{ fontSize: 36, marginTop: 24, textAlign: 'center', lineHeight: 1.05 }}>
        +{level} {emoji} sent!
      </div>
      <div className="t-serif" style={{ fontSize: 22, color: 'var(--ink-2)', marginTop: 8, textAlign: 'center' }}>
        the squad will remember this 💛
      </div>
      <div style={{ marginTop: 20, padding: '10px 16px', background: 'rgba(255,255,255,0.6)', borderRadius: 999, backdropFilter: 'blur(10px)' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>treating {count} {count === 1 ? 'friend' : 'friends'}</span>
      </div>
    </div>
  );
}

Object.assign(window, { LogTreat });

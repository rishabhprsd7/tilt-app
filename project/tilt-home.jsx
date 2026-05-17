// Tilt — Home screen (feed + your tilt status + mascot whisper)

function Home({ nav, tone }) {
  const tiltAmount = 80; // demo: you're slightly tilted toward Alex
  const towardName = 'Alex';
  const [whisper, whisperBg] = vibePhrase(tiltAmount, towardName);
  const [thanked, setThanked] = React.useState(false);

  return (
    <div className="tilt-screen">
      {/* Top: greeting + mascot whisper */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div className="t-serif" style={{ fontSize: 26, lineHeight: 1.15, color: 'var(--ink-2)', marginBottom: 2 }}>good evening,</div>
            <div className="t-display" style={{ fontSize: 36, lineHeight: 1, marginTop: 0 }}>Robin 👋</div>
          </div>
          <button onClick={() => nav('notifications')} style={{
            border: 'none', background: 'var(--bg-card)',
            width: 44, height: 44, borderRadius: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, cursor: 'pointer',
            boxShadow: 'var(--shadow-1)',
            position: 'relative',
          }}>
            <span>🔔</span>
            <span style={{
              position: 'absolute', top: 8, right: 10,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--peach-deep)',
              boxShadow: '0 0 0 2px var(--bg-card)',
            }} />
          </button>
        </div>

        {/* Whisper card from Til */}
        <div className="card screen-in" style={{
          background: 'var(--warm)',
          padding: 16,
          marginTop: 14,
          display: 'flex', alignItems: 'center', gap: 14,
          cursor: 'pointer',
        }} onClick={() => nav('mascot')}>
          <Til mood="curious" size={64} color="#FFB59A" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>til whispers</div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: 'var(--ink)' }}>{whisper}</div>
          </div>
        </div>

        {/* Spoiled-you moment — emotional hero */}
        <SpoiledCard thanked={thanked} setThanked={setThanked} />
      </div>

      {/* Your tilt summary — horizontal scroll of friend balances */}
      <div style={{ marginTop: 22 }}>
        <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="section-title">vibe balance</div>
          <button onClick={() => nav('friends')} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>see all</button>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflowX: 'auto' }} className="scroll">
          {FRIENDS.map(f => <FriendTilt key={f.id} friend={f} nav={nav} />)}
        </div>
      </div>

      {/* Groups */}
      <div style={{ marginTop: 22 }}>
        <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="section-title">your groups</div>
          <button onClick={() => nav('groups')} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>see all</button>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflowX: 'auto' }} className="scroll">
          {GROUPS.map(g => (
            <button key={g.id} onClick={() => nav('group', g.id)} style={{
              flexShrink: 0,
              width: 160,
              border: 'none', cursor: 'pointer',
              background: 'var(--bg-card)',
              borderRadius: 20,
              padding: 14,
              textAlign: 'left',
              boxShadow: 'var(--shadow-1)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{g.emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{g.members.length} people</div>
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', background: 'var(--bg)', padding: '4px 8px', borderRadius: 999, display: 'inline-block' }}>{g.vibe}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div style={{ marginTop: 24, padding: '0 20px' }}>
        <div className="section-title">recent treats</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FEED.map(item => <FeedItem key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}

function FriendTilt({ friend, nav }) {
  // demo: a deterministic tilt per friend
  const tilts = { alex: 70, jamie: -40, chris: 10, rae: -10, sam: 20, noor: 90 };
  const t = tilts[friend.id] || 0;
  const towardMe = t < 0;
  const mag = Math.min(Math.abs(t) / 150, 1);
  const label = Math.abs(t) < 20 ? 'balanced ✨' : towardMe ? 'spoil them' : 'they spoiled you';
  return (
    <button onClick={() => nav('friend', friend.id)} style={{
      flexShrink: 0,
      width: 132,
      border: 'none', cursor: 'pointer',
      background: 'var(--bg-card)',
      borderRadius: 20, padding: 12,
      boxShadow: 'var(--shadow-1)',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
    }}>
      <FriendAvatar name={friend.name} color={friend.color} size={44} />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{friend.name}</div>
      {/* Mini tilt indicator */}
      <div style={{ width: '100%', height: 6, background: 'var(--bg)', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          left: towardMe ? `${50 - mag * 50}%` : '50%',
          width: `${mag * 50}%`,
          top: 0, bottom: 0,
          background: towardMe ? 'var(--lavender-deep)' : 'var(--peach-deep)',
          borderRadius: 999,
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: -1, bottom: -1,
          width: 2, background: 'var(--ink-3)', opacity: 0.4,
        }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)' }}>{label}</div>
    </button>
  );
}

function FeedItem({ item }) {
  const who = findFriend(item.who);
  const isYou = item.who === 'me';
  const [reactions, setReactions] = React.useState([]);
  const [hearted, setHearted] = React.useState(false);

  const burst = () => {
    if (isYou) return; // can't react to your own
    const emojis = ['💛', '✨', '🥹', '🫶', '💫'];
    const e = emojis[Math.floor(Math.random() * emojis.length)];
    const id = Date.now() + Math.random();
    setReactions(prev => [...prev, { id, e, x: 20 + Math.random() * 16 }]);
    setHearted(true);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 1700);
  };

  return (
    <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, position: 'relative' }}>
      <FriendAvatar name={who.name} color={who.color} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{isYou ? 'You' : who.name}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>· {item.when}</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 8 }}>{item.note}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span className="treat-pill" style={{
            background: item.emoji ? 'var(--peach-soft)' : 'var(--bg)',
            color: 'var(--ink)',
            fontSize: 14, padding: '6px 12px',
          }}>
            <span>+{item.level}</span><span>{item.emoji}</span>
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>for {item.selected.map(id => findFriend(id).name).join(', ')}</span>
        </div>
      </div>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={burst} style={{
          border: 'none',
          background: hearted ? 'var(--peach-soft)' : 'var(--bg)',
          width: 36, height: 36, borderRadius: 18,
          fontSize: 16, cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(.34,1.56,.64,1)',
          transform: hearted ? 'scale(1.08)' : 'scale(1)',
        }}>💛</button>
        {reactions.map(r => (
          <span key={r.id} style={{
            position: 'absolute', bottom: 18, left: r.x,
            fontSize: 22, pointerEvents: 'none',
            animation: 'float-up 1.6s ease-out forwards',
          }}>{r.e}</span>
        ))}
      </div>
    </div>
  );
}

// "You've been spoiled" — emotional hero card that appears when someone
// has treated you recently. One-tap thanks reaction with mascot reaction.
function SpoiledCard({ thanked, setThanked }) {
  const [bursts, setBursts] = React.useState([]);

  const sayThanks = () => {
    if (thanked) return;
    const emojis = ['💛', '✨', '🫶', '🥹', '💫', '🌷'];
    const newBursts = emojis.map((e, i) => ({ id: Date.now() + i, e, x: 10 + i * 16, delay: i * 0.06 }));
    setBursts(newBursts);
    setThanked(true);
    setTimeout(() => setBursts([]), 1800);
  };

  return (
    <div style={{
      marginTop: 12,
      background: 'linear-gradient(135deg, #FFE3D4 0%, #FCD9E8 60%, #ECE3FF 100%)',
      borderRadius: 24,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-1)',
    }}>
      <div style={{ position: 'absolute', top: -10, right: -8, fontSize: 56, opacity: 0.18, transform: 'rotate(14deg)' }}>🍣</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
        <div style={{
          width: 52, height: 52, borderRadius: 18,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
          flexShrink: 0,
        }}>🍣</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 2 }}>you've been spoiled</div>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, color: 'var(--ink)' }}>Noor sent +130 🍣 your way</div>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>"post-breakup sushi mission" — 1h ago</div>
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8, position: 'relative' }}>
        <button onClick={sayThanks} style={{
          flex: 1,
          border: 'none', cursor: 'pointer',
          padding: '12px 14px', borderRadius: 999,
          background: thanked ? 'rgba(255,255,255,0.55)' : 'var(--ink)',
          color: thanked ? 'var(--ink)' : '#FFF8EE',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
          transform: thanked ? 'scale(0.98)' : 'scale(1)',
        }}>
          {thanked ? '💛 sent — Noor will feel it' : 'say thanks 🫶'}
        </button>
        <button style={{
          border: 'none', cursor: 'pointer',
          padding: '12px 16px', borderRadius: 999,
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(10px)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
        }}>spoil back</button>
        {bursts.map(b => (
          <span key={b.id} style={{
            position: 'absolute', bottom: 40, left: b.x,
            fontSize: 24, pointerEvents: 'none',
            animation: `float-up 1.7s ease-out ${b.delay}s forwards`,
            opacity: 0,
          }}>{b.e}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Home, FeedItem });

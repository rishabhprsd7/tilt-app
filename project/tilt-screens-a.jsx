// Tilt — secondary screens: Group, Friend, Mascot, Personality, Recap, Notifications

// ── Group detail ─────────────────────────────────────────────
function GroupDetail({ groupId, nav }) {
  const g = GROUPS.find(x => x.id === groupId) || GROUPS[0];
  const members = g.members.map(id => findFriend(id));
  // demo tilts
  const tiltMap = { alex: 50, jamie: 10, chris: -30, rae: -20, noor: 80, sam: 0 };

  const groupFeed = FEED.filter(f => f.group === g.id);

  return (
    <div className="tilt-screen" style={{ padding: 0 }}>
      {/* Hero header */}
      <div style={{
        background: 'var(--warm)',
        padding: '70px 20px 28px',
        borderRadius: '0 0 32px 32px',
        position: 'relative',
      }}>
        <button onClick={() => nav('home')} style={{
          border: 'none', background: 'rgba(255,255,255,0.7)',
          width: 40, height: 40, borderRadius: 20, fontSize: 18,
          cursor: 'pointer', backdropFilter: 'blur(10px)',
        }}>←</button>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 56 }}>{g.emoji}</div>
          <div>
            <div className="t-display" style={{ fontSize: 32, lineHeight: 1 }}>{g.name}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>{members.length} people · {g.vibe}</div>
          </div>
        </div>

        {/* members */}
        <div style={{ display: 'flex', gap: -8, marginTop: 16 }}>
          {members.map((m, i) => (
            <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -12, border: '3px solid var(--bg)', borderRadius: '50%' }}>
              <FriendAvatar name={m.name} color={m.color} size={40} />
            </div>
          ))}
          <button style={{
            marginLeft: 8, width: 40, height: 40,
            border: 'none', borderRadius: 20,
            background: 'rgba(255,255,255,0.7)',
            fontSize: 22, cursor: 'pointer',
            color: 'var(--ink-2)',
          }}>+</button>
        </div>
      </div>

      {/* Vibe board */}
      <div style={{ padding: '20px 20px 0' }}>
        <div className="section-title">vibe board</div>
        <div className="card" style={{ padding: 16 }}>
          {members.map(m => {
            const t = tiltMap[m.id] || 0;
            const phrase = Math.abs(t) < 20 ? '✨ balanced' : t > 0 ? 'spoiled the group' : 'has been spoiled';
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--hairline)' }}>
                <FriendAvatar name={m.name} color={m.color} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{phrase}</div>
                </div>
                <GroupTiltBar tilt={t} />
              </div>
            );
          })}
        </div>

        {/* Group whisper */}
        <div className="card" style={{
          background: 'var(--calm)',
          marginTop: 14,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 14,
        }}>
          <div style={{ fontSize: 28 }}>🍜</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>til whispers</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Noor's been carrying. Anyone got snack energy?</div>
          </div>
        </div>

        {/* feed */}
        <div className="section-title" style={{ marginTop: 22 }}>moments</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {groupFeed.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
              No moments yet. Be the first to spread a treat ✨
            </div>
          )}
          {groupFeed.map(item => <FeedItem key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}

function GroupTiltBar({ tilt }) {
  const mag = Math.min(Math.abs(tilt) / 100, 1);
  const towardThem = tilt > 0;
  return (
    <div style={{ width: 76, height: 6, background: 'var(--bg)', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        left: towardThem ? '50%' : `${50 - mag * 50}%`,
        width: `${mag * 50}%`,
        top: 0, bottom: 0,
        background: towardThem ? 'var(--peach-deep)' : 'var(--lavender-deep)',
        borderRadius: 999,
      }} />
      <div style={{ position: 'absolute', left: '50%', top: -1, bottom: -1, width: 1.5, background: 'rgba(0,0,0,0.2)' }} />
    </div>
  );
}

// ── Friend detail ────────────────────────────────────────────
function FriendDetail({ friendId, nav }) {
  const f = findFriend(friendId);
  const personality = findPersonality(f.personality);
  const tilts = { alex: 70, jamie: -40, chris: 10, rae: -10, sam: 20, noor: 90 };
  const t = tilts[f.id] || 0;
  const [phrase] = vibePhrase(t, f.name);
  const mag = Math.min(Math.abs(t) / 150, 1);
  const towardThem = t > 0;

  return (
    <div className="tilt-screen" style={{ padding: 0 }}>
      <div style={{
        background: f.color + '55',
        padding: '70px 20px 28px',
        borderRadius: '0 0 32px 32px',
      }}>
        <button onClick={() => nav('home')} style={{
          border: 'none', background: 'rgba(255,255,255,0.7)',
          width: 40, height: 40, borderRadius: 20, fontSize: 18,
          cursor: 'pointer', backdropFilter: 'blur(10px)',
        }}>←</button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 6 }}>
          <FriendAvatar name={f.name} color={f.color} size={84} />
          <div className="t-display" style={{ fontSize: 32, marginTop: 8 }}>{f.name}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
            <span>{personality.animal}</span><span>{personality.name}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Big tilt visual */}
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>balance vibes</div>
          <div className="t-display" style={{ fontSize: 24, marginTop: 6, lineHeight: 1.1 }}>{phrase}</div>
          <div style={{
            height: 18, marginTop: 16,
            background: 'var(--bg)', borderRadius: 999,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              left: towardThem ? '50%' : `${50 - mag * 50}%`,
              width: `${mag * 50}%`,
              top: 0, bottom: 0,
              background: towardThem ? 'linear-gradient(90deg, var(--peach), var(--peach-deep))' : 'linear-gradient(90deg, var(--lavender-deep), var(--lavender))',
              borderRadius: 999,
            }} />
            <div style={{ position: 'absolute', left: '50%', top: -2, bottom: -2, width: 2, background: 'var(--ink)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, fontWeight: 600, color: 'var(--ink-3)' }}>
            <span>your turn ←</span>
            <span>→ {f.name}'s turn</span>
          </div>
        </div>

        {/* streak */}
        <div className="card" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'var(--sunshine-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>12 week streak</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>you've spoiled each other for 12 weeks straight</div>
          </div>
        </div>

        <div className="section-title" style={{ marginTop: 18 }}>moments together</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FEED.slice(0, 4).map(item => <FeedItem key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}

// ── Mascot screen ───────────────────────────────────────────
function MascotScreen({ nav }) {
  const [mood, setMood] = React.useState('happy');
  const moods = ['happy', 'excited', 'sleepy', 'concerned', 'dramatic', 'proud', 'curious'];

  const stats = [
    { label: 'affection', value: 78, color: 'var(--peach-deep)', emoji: '💛' },
    { label: 'streak', value: 92, color: 'var(--sunshine-deep)', emoji: '🔥' },
    { label: 'squad vibes', value: 64, color: 'var(--mint-deep)', emoji: '✨' },
  ];

  return (
    <div className="tilt-screen" style={{ background: 'var(--warm)', padding: 0 }}>
      <div style={{ padding: '60px 20px 0', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => nav('home')} style={{
          border: 'none', background: 'rgba(255,255,255,0.7)',
          width: 40, height: 40, borderRadius: 20, fontSize: 18,
          cursor: 'pointer', backdropFilter: 'blur(10px)',
        }}>←</button>
        <button style={{
          border: 'none', background: 'rgba(255,255,255,0.7)',
          padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', backdropFilter: 'blur(10px)',
        }}>customize ✨</button>
      </div>

      {/* Mascot stage */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
        <div style={{
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Til mood={mood} size={200} color="#FFB59A" />
          <div className="sparkle" style={{ top: 24, left: 20, fontSize: 24 }}>✨</div>
          <div className="sparkle" style={{ bottom: 30, right: 20, fontSize: 18, animationDelay: '0.5s' }}>💛</div>
          <div className="sparkle" style={{ top: 60, right: 16, fontSize: 16, animationDelay: '1.2s' }}>·</div>
        </div>
        <div className="t-display" style={{ fontSize: 36, marginTop: 12 }}>Til</div>
        <div className="t-serif" style={{ fontSize: 20, color: 'var(--ink-2)', marginTop: 0 }}>your balance keeper</div>
      </div>

      {/* Til says */}
      <div style={{ padding: '20px 20px 0' }}>
        <div className="card" style={{
          padding: 16,
          background: 'var(--bg-card)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -8, left: 28,
            width: 16, height: 16, background: 'var(--bg-card)',
            transform: 'rotate(45deg)',
          }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>til says</div>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>You've been spreading +20s like confetti this week. The squad noticed 💛</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 24 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: s.color }}>{s.value}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${s.value}%`, height: '100%', background: s.color, borderRadius: 999 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* mood picker — demo */}
        <div className="section-title" style={{ marginTop: 18 }}>til's moods (try a few)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {moods.map(m => (
            <button key={m} onClick={() => setMood(m)} className="chip" style={{
              border: 'none', cursor: 'pointer',
              background: mood === m ? 'var(--ink)' : 'var(--bg-card)',
              color: mood === m ? '#FFF8EE' : 'var(--ink-2)',
            }}>{m}</button>
          ))}
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

Object.assign(window, { GroupDetail, FriendDetail, MascotScreen });

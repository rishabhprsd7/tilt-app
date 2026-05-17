// Tilt — Personality, Recap, Notifications, Friends list

// ── Personality card / archetype ─────────────────────────────
function PersonalityScreen({ nav }) {
  const mine = findPersonality('tiny-treat-dealer'); // demo: user's current
  const others = PERSONALITIES.filter(p => p.id !== mine.id);

  return (
    <div className="tilt-screen" style={{ padding: 0 }}>
      <div style={{ padding: '60px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => nav('home')} style={{
          border: 'none', background: 'var(--bg-card)',
          width: 40, height: 40, borderRadius: 20, fontSize: 18, cursor: 'pointer',
          boxShadow: 'var(--shadow-1)',
        }}>←</button>
        <div className="t-display" style={{ fontSize: 24 }}>your archetype</div>
      </div>

      {/* Big card */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{
          background: 'linear-gradient(155deg, ' + mine.color + ' 0%, var(--peach-soft) 100%)',
          borderRadius: 28,
          padding: 24,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-2)',
        }}>
          <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, fontWeight: 700, color: 'var(--ink-2)' }}>04 / 47</div>
          <div style={{ fontSize: 120, lineHeight: 1, animation: 'wiggle 3s ease-in-out infinite', display: 'inline-block', transformOrigin: 'center bottom' }}>{mine.animal}</div>
          <div className="t-display" style={{ fontSize: 38, marginTop: 12, letterSpacing: '-0.02em' }}>{mine.name}</div>
          <div className="t-serif" style={{ fontSize: 22, color: 'var(--ink-2)', marginTop: 2 }}>"{mine.tag}"</div>
          <div style={{
            marginTop: 16, padding: '8px 14px',
            background: 'rgba(255,255,255,0.6)', borderRadius: 999,
            display: 'inline-block', backdropFilter: 'blur(10px)',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>since may 2026</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          <Stat n="184" label="treats spread" />
          <Stat n="11" label="lucky friends" />
          <Stat n="3" label="archetypes unlocked" />
        </div>

        {/* Evolution hint */}
        <div className="card" style={{
          marginTop: 14, padding: 14,
          background: 'var(--calm)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ fontSize: 32 }}>🌱</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>5 more coffee runs and you'll evolve</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>→ Coffee Goblin ☕</div>
          </div>
        </div>

        <div className="section-title" style={{ marginTop: 22 }}>archetype collection</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {others.map((p, i) => (
            <div key={p.id} className="card" style={{
              padding: 14,
              textAlign: 'center',
              opacity: i < 2 ? 1 : 0.5,
              position: 'relative',
            }}>
              <div style={{ fontSize: 44, filter: i < 2 ? 'none' : 'grayscale(0.7)' }}>{i < 2 ? p.animal : '🔒'}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{i < 2 ? p.name : '???'}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{i < 2 ? p.tag : 'keep spreading vibes'}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="card" style={{ padding: 12, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24 }}>{n}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}

// ── Monthly Recap (story-style) ──────────────────────────────
function RecapScreen({ nav }) {
  const [slide, setSlide] = React.useState(0);
  const slides = [
    {
      bg: 'linear-gradient(160deg, #FFD66B 0%, #FFB59A 100%)',
      content: (
        <>
          <div className="t-serif" style={{ fontSize: 28, color: 'var(--ink-2)', textAlign: 'center' }}>your may was</div>
          <div className="t-display" style={{ fontSize: 76, textAlign: 'center', lineHeight: 0.95, marginTop: 4, letterSpacing: '-0.04em' }}>generous.</div>
          <div style={{ marginTop: 40 }}><Til mood="proud" size={180} /></div>
        </>
      ),
    },
    {
      bg: 'linear-gradient(160deg, #C9B8F0 0%, #ECE3FF 100%)',
      content: (
        <>
          <div style={{ fontSize: 92, textAlign: 'center' }}>☕</div>
          <div className="t-display" style={{ fontSize: 64, textAlign: 'center', lineHeight: 1 }}>42</div>
          <div className="t-serif" style={{ fontSize: 24, textAlign: 'center', color: 'var(--ink-2)' }}>coffees shared</div>
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--ink-2)', maxWidth: 240, lineHeight: 1.4 }}>
            mostly with Jamie. honestly, that's a Coffee Goblin friendship 💛
          </div>
        </>
      ),
    },
    {
      bg: 'linear-gradient(160deg, #B9E8C6 0%, #DEF5E4 100%)',
      content: (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            {['🥇','🥈','🥉'].map((m, i) => (
              <div key={i} style={{ width: 56, height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{m}</div>
            ))}
          </div>
          <div className="t-display" style={{ fontSize: 28, textAlign: 'center' }}>biggest treat energy</div>
          <div style={{ marginTop: 18 }}>
            {[
              { who: 'Chris', mood: '🐻', n: 312 },
              { who: 'You',   mood: '🍪', n: 248 },
              { who: 'Noor',  mood: '🌴', n: 206 },
            ].map((row, i) => (
              <div key={row.who} style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 14, padding: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, fontWeight: 700, fontFamily: 'var(--font-display)' }}>#{i + 1}</div>
                <div style={{ fontSize: 28 }}>{row.mood}</div>
                <div style={{ flex: 1, fontWeight: 700 }}>{row.who}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>+{row.n}</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      bg: 'linear-gradient(160deg, #F49AC2 0%, #FCD9E8 100%)',
      content: (
        <>
          <div style={{ fontSize: 92, textAlign: 'center' }}>🌙</div>
          <div className="t-display" style={{ fontSize: 32, textAlign: 'center', lineHeight: 1.1 }}>Alex carried late-night<br />survival this month.</div>
          <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.5)', borderRadius: 18, fontSize: 14, lineHeight: 1.5 }}>
            4 emergency taxi missions, 2 kebab rescues, and one mysterious "ice cream at 2am" event.
          </div>
          <div className="t-serif" style={{ fontSize: 22, textAlign: 'center', marginTop: 18, color: 'var(--ink-2)' }}>maybe spoil them back?</div>
        </>
      ),
    },
    {
      bg: 'var(--celebrate)',
      content: (
        <>
          <div className="t-display" style={{ fontSize: 36, textAlign: 'center', lineHeight: 1.1 }}>your may, in one word:</div>
          <div className="t-serif" style={{ fontSize: 72, textAlign: 'center', marginTop: 16, color: 'var(--ink)' }}>cozy.</div>
          <div style={{ marginTop: 32, padding: 16, background: 'rgba(255,255,255,0.6)', borderRadius: 18, backdropFilter: 'blur(10px)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>184 treats spread across 11 friends</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>that's a lot of vibes</div>
          </div>
          <button style={{
            marginTop: 28, width: '100%',
            padding: '16px 22px', borderRadius: 999,
            border: 'none', background: 'var(--ink)',
            color: '#FFF8EE', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
            cursor: 'pointer',
          }}>share my recap →</button>
        </>
      ),
    },
  ];

  return (
    <div className="tilt-screen no-tabs" style={{ padding: 0, background: slides[slide].bg, transition: 'background 0.5s' }}>
      {/* Progress bars */}
      <div style={{ display: 'flex', gap: 4, padding: '54px 16px 0' }}>
        {slides.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.4)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'rgba(42,31,26,0.7)',
              width: i < slide ? '100%' : i === slide ? '100%' : '0%',
              transition: 'width 0.4s',
            }} />
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 20px 0', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => nav('home')} style={{
          border: 'none', background: 'rgba(255,255,255,0.5)',
          width: 36, height: 36, borderRadius: 18, fontSize: 16, cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}>✕</button>
        <div className="chip" style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>may 2026 · recap</div>
      </div>

      <div className="screen-in" key={slide} style={{
        padding: '40px 28px 100px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        minHeight: 500,
      }}>
        {slides[slide].content}
      </div>

      {/* tap zones */}
      <div onClick={() => setSlide(Math.max(0, slide - 1))} style={{
        position: 'absolute', top: 80, bottom: 60, left: 0, width: '30%', zIndex: 10,
      }} />
      <div onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))} style={{
        position: 'absolute', top: 80, bottom: 60, right: 0, width: '70%', zIndex: 10,
      }} />
    </div>
  );
}

// ── Notifications ───────────────────────────────────────────
function NotificationsScreen({ nav }) {
  const items = [
    { id: 1, when: '2h', emoji: '🍝', title: 'Alex spread +50 🍝', sub: 'you, Jamie & Chris just got spoiled' },
    { id: 2, when: '6h', emoji: '🦝', title: 'Jamie has entered generous goblin mode', sub: '+20s flying in every direction', mascot: true },
    { id: 3, when: 'yest', emoji: '🌙', title: "we miss the squad energy 🥺", sub: 'Lisbon trip has been quiet for 3 days', mascot: true },
    { id: 4, when: 'yest', emoji: '💛', title: 'Sam liked your 3am kebab rescue', sub: '"actually iconic"' },
    { id: 5, when: '2d', emoji: '🍪', title: "tiny treat dealer in action", sub: 'you spread 7 +10s this week. iconic move' },
    { id: 6, when: '3d', emoji: '🍕', title: "Balance vibes are returning ✨", sub: 'Roomies group has rebalanced naturally' },
    { id: 7, when: '5d', emoji: '🍜', title: "okay okay someone buy Alex a snack already", sub: 'Til is dramatic on your behalf', mascot: true },
  ];

  return (
    <div className="tilt-screen" style={{ padding: 0 }}>
      <div style={{ padding: '60px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => nav('home')} style={{
          border: 'none', background: 'var(--bg-card)',
          width: 40, height: 40, borderRadius: 20, fontSize: 18, cursor: 'pointer',
          boxShadow: 'var(--shadow-1)',
        }}>←</button>
        <div className="t-display" style={{ fontSize: 24 }}>whispers</div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(n => (
          <div key={n.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 44, height: 44, flexShrink: 0,
              borderRadius: n.mascot ? '50% 60% 45% 55% / 55% 45% 60% 50%' : 14,
              background: n.mascot ? 'var(--peach-soft)' : 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>{n.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{n.sub}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', flexShrink: 0 }}>{n.when}</div>
          </div>
        ))}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

// ── Friends list ────────────────────────────────────────────
function FriendsScreen({ nav }) {
  return (
    <div className="tilt-screen" style={{ padding: 0 }}>
      <div style={{ padding: '60px 20px 12px' }}>
        <div className="t-display" style={{ fontSize: 36 }}>your people</div>
        <div className="t-serif" style={{ fontSize: 20, color: 'var(--ink-2)' }}>{FRIENDS.length} fellow generous beings</div>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FRIENDS.map(f => {
          const tilts = { alex: 70, jamie: -40, chris: 10, rae: -10, sam: 20, noor: 90 };
          const t = tilts[f.id] || 0;
          const [phrase] = vibePhrase(t, f.name);
          const p = findPersonality(f.personality);
          return (
            <button key={f.id} onClick={() => nav('friend', f.id)} style={{
              border: 'none', cursor: 'pointer', textAlign: 'left',
              background: 'var(--bg-card)', borderRadius: 20, padding: 14,
              boxShadow: 'var(--shadow-1)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <FriendAvatar name={f.name} color={f.color} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {p.animal} {p.name}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2, fontWeight: 500 }}>{phrase}</div>
              </div>
              <div style={{ color: 'var(--ink-3)', fontSize: 16 }}>›</div>
            </button>
          );
        })}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

// ── Groups list ─────────────────────────────────────────────
function GroupsScreen({ nav }) {
  return (
    <div className="tilt-screen" style={{ padding: 0 }}>
      <div style={{ padding: '60px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div className="t-display" style={{ fontSize: 36 }}>your groups</div>
          <div className="t-serif" style={{ fontSize: 20, color: 'var(--ink-2)' }}>little ecosystems of generosity</div>
        </div>
        <button style={{ border: 'none', background: 'var(--ink)', color: '#FFF8EE', width: 40, height: 40, borderRadius: 20, fontSize: 22, cursor: 'pointer' }}>+</button>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GROUPS.map(g => (
          <button key={g.id} onClick={() => nav('group', g.id)} style={{
            border: 'none', cursor: 'pointer', textAlign: 'left',
            background: 'var(--bg-card)', borderRadius: 20, padding: 16,
            boxShadow: 'var(--shadow-1)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: 'var(--warm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>{g.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{g.members.length} people · {g.vibe}</div>
            </div>
            <div style={{ display: 'flex' }}>
              {g.members.slice(0, 3).map((id, i) => {
                const m = findFriend(id);
                return (
                  <div key={id} style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--bg-card)', borderRadius: '50%' }}>
                    <FriendAvatar name={m.name} color={m.color} size={28} />
                  </div>
                );
              })}
            </div>
          </button>
        ))}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

Object.assign(window, { PersonalityScreen, RecapScreen, NotificationsScreen, FriendsScreen, GroupsScreen });

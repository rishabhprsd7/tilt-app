// Tilt mascot: "Til" — a soft blob creature drawn in pure CSS.
// Moods: happy | excited | sleepy | concerned | dramatic | proud | curious

function Til({ mood = 'happy', size = 120, color = '#FFB59A', accessory = null }) {
  const moods = {
    happy:     { mouth: 'smile',   brow: 'normal', tilt: 0,    eyes: 'bean' },
    excited:   { mouth: 'open',    brow: 'high',   tilt: -4,   eyes: 'star' },
    sleepy:    { mouth: 'tiny',    brow: 'normal', tilt: -8,   eyes: 'closed' },
    concerned: { mouth: 'wiggle',  brow: 'worry',  tilt: 0,    eyes: 'bean' },
    dramatic:  { mouth: 'open',    brow: 'high',   tilt: -12,  eyes: 'wide' },
    proud:     { mouth: 'smug',    brow: 'normal', tilt: 6,    eyes: 'closed' },
    curious:   { mouth: 'tiny',    brow: 'cocked', tilt: 8,    eyes: 'bean' },
  };
  const m = moods[mood] || moods.happy;

  return (
    <div className="mascot-stage" style={{ width: size, height: size }}>
      {/* shadow */}
      <div style={{
        position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
        width: size * 0.62, height: 8,
        background: 'rgba(42,31,26,0.12)', borderRadius: '50%',
        filter: 'blur(4px)',
      }} />
      <div className="mascot" style={{
        position: 'relative',
        width: size * 0.82, height: size * 0.86,
        transform: `rotate(${m.tilt}deg)`,
      }}>
        {/* Body — squircle with subtle gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 30% 25%, #FFF 0%, ${color} 55%, ${shade(color, -12)} 100%)`,
          borderRadius: '46% 54% 50% 50% / 54% 56% 44% 46%',
          boxShadow: `inset -6px -10px 0 rgba(0,0,0,0.06), 0 6px 18px ${color}55`,
        }} />
        {/* Antenna */}
        <div style={{
          position: 'absolute', top: -8, left: '52%',
          width: 2, height: 14,
          background: shade(color, -20),
          borderRadius: 2,
          transformOrigin: 'bottom',
          animation: 'wiggle 3s ease-in-out infinite',
        }}>
          <div style={{
            position: 'absolute', top: -8, left: -4,
            width: 10, height: 10, borderRadius: '50%',
            background: '#FFD66B',
            boxShadow: '0 0 0 2px rgba(255, 214, 107, 0.4)',
          }} />
        </div>
        {/* Eyes */}
        <Eyes kind={m.eyes} brow={m.brow} cx={size * 0.82} cy={size * 0.86} />
        {/* Blush */}
        <div style={dotStyle(size * 0.16, size * 0.5, 14, '#F49AC2', 0.55)} />
        <div style={dotStyle(size * 0.5, size * 0.5, 14, '#F49AC2', 0.55)} />
        {/* Mouth */}
        <Mouth kind={m.mouth} cx={size * 0.82} cy={size * 0.86} />
      </div>
      {accessory && (
        <div style={{ position: 'absolute', top: -6, right: 8, fontSize: 32 }}>{accessory}</div>
      )}
    </div>
  );
}

function Eyes({ kind, brow, cx, cy }) {
  const left = cx * 0.28, right = cx * 0.56, top = cy * 0.38;
  const ink = '#2A1F1A';
  if (kind === 'closed') {
    return (
      <>
        <div style={{ position: 'absolute', left, top: top + 4, width: 14, height: 4, borderRadius: 4, background: ink, transform: 'rotate(8deg)' }} />
        <div style={{ position: 'absolute', left: right, top: top + 4, width: 14, height: 4, borderRadius: 4, background: ink, transform: 'rotate(-8deg)' }} />
      </>
    );
  }
  if (kind === 'star') {
    return (
      <>
        <div style={{ position: 'absolute', left: left - 2, top: top - 2, fontSize: 18 }}>✨</div>
        <div style={{ position: 'absolute', left: right - 2, top: top - 2, fontSize: 18 }}>✨</div>
      </>
    );
  }
  // bean / wide
  const w = kind === 'wide' ? 14 : 10;
  const h = kind === 'wide' ? 16 : 14;
  return (
    <>
      <div style={{
        position: 'absolute', left, top, width: w, height: h, borderRadius: '50%',
        background: ink, animation: 'blink 5s infinite',
      }}>
        <div style={{ position: 'absolute', top: 2, left: 2, width: 4, height: 4, borderRadius: '50%', background: '#FFF' }} />
      </div>
      <div style={{
        position: 'absolute', left: right, top, width: w, height: h, borderRadius: '50%',
        background: ink, animation: 'blink 5.2s infinite',
      }}>
        <div style={{ position: 'absolute', top: 2, left: 2, width: 4, height: 4, borderRadius: '50%', background: '#FFF' }} />
      </div>
      {brow === 'worry' && (
        <>
          <div style={{ position: 'absolute', left: left - 2, top: top - 8, width: 14, height: 3, borderRadius: 3, background: ink, transform: 'rotate(-14deg)' }} />
          <div style={{ position: 'absolute', left: right - 2, top: top - 8, width: 14, height: 3, borderRadius: 3, background: ink, transform: 'rotate(14deg)' }} />
        </>
      )}
      {brow === 'high' && (
        <>
          <div style={{ position: 'absolute', left: left + 2, top: top - 10, width: 12, height: 3, borderRadius: 3, background: ink }} />
          <div style={{ position: 'absolute', left: right + 2, top: top - 10, width: 12, height: 3, borderRadius: 3, background: ink }} />
        </>
      )}
      {brow === 'cocked' && (
        <div style={{ position: 'absolute', left: right + 2, top: top - 10, width: 12, height: 3, borderRadius: 3, background: ink, transform: 'rotate(-10deg)' }} />
      )}
    </>
  );
}

function Mouth({ kind, cx, cy }) {
  const left = cx * 0.36, top = cy * 0.6;
  const ink = '#2A1F1A';
  if (kind === 'smile') {
    return (
      <div style={{
        position: 'absolute', left, top,
        width: 26, height: 14,
        borderBottom: `3px solid ${ink}`,
        borderRadius: '0 0 26px 26px',
      }} />
    );
  }
  if (kind === 'open') {
    return (
      <div style={{
        position: 'absolute', left: left + 4, top,
        width: 18, height: 14,
        background: ink,
        borderRadius: '8px 8px 14px 14px',
      }}>
        <div style={{
          position: 'absolute', bottom: 1, left: 3, right: 3, height: 4,
          background: '#F49AC2', borderRadius: 4,
        }} />
      </div>
    );
  }
  if (kind === 'tiny') {
    return (
      <div style={{
        position: 'absolute', left: left + 10, top: top + 2,
        width: 8, height: 4, borderRadius: 4, background: ink,
      }} />
    );
  }
  if (kind === 'smug') {
    return (
      <div style={{
        position: 'absolute', left: left + 4, top,
        width: 18, height: 8,
        borderTop: `3px solid ${ink}`,
        borderRadius: '18px 18px 0 0',
        transform: 'translateY(-1px)',
      }} />
    );
  }
  if (kind === 'wiggle') {
    return (
      <svg style={{ position: 'absolute', left: left + 2, top: top + 2 }} width="22" height="6" viewBox="0 0 22 6">
        <path d="M1 3 Q 5 0, 8 3 T 15 3 T 22 3" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
}

function dotStyle(x, y, size, color, opacity) {
  return {
    position: 'absolute',
    left: x, top: y,
    width: size, height: size * 0.7,
    background: color,
    opacity,
    borderRadius: '50%',
    filter: 'blur(1px)',
  };
}

function shade(hex, percent) {
  // very small darken/lighten
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16, G = (f >> 8) & 0xff, B = f & 0xff;
  const r = Math.round((t - R) * p) + R;
  const g = Math.round((t - G) * p) + G;
  const b = Math.round((t - B) * p) + B;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Friend avatars (rounded squares with initial + colored bg + small face)
function FriendAvatar({ name, color, size = 40, mood = 'happy' }) {
  const initial = (name || '?')[0].toUpperCase();
  return (
    <div className="avatar" style={{
      width: size, height: size,
      background: color,
      fontSize: size * 0.46,
      boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.08)',
      position: 'relative',
    }}>
      <span>{initial}</span>
    </div>
  );
}

Object.assign(window, { Til, FriendAvatar });

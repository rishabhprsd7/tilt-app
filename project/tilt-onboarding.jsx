// Tilt — Onboarding screens

function Onboarding({ onDone, tone }) {
  const [step, setStep] = React.useState(0);
  const steps = [
    {
      mood: 'happy',
      title: 'meet Til.',
      sub: 'your soft little balance keeper.',
      body: "Tilt isn't about debt. It's about keeping generosity fun.",
      cta: 'continue',
      bg: 'var(--warm)',
    },
    {
      mood: 'excited',
      title: 'no exact money.',
      sub: 'no math. no guilt.',
      body: 'You pick a fuzzy treat level — like +10 ☕ or +50 🍝 — and Til feels the vibes for you.',
      cta: 'love it',
      bg: 'var(--calm)',
    },
    {
      mood: 'proud',
      title: 'the squad tilts.',
      sub: 'back and forth, gently.',
      body: 'When one friend has been carrying lately, Til whispers — never nags. You spoil them back when you want.',
      cta: 'let me in',
      bg: 'var(--celebrate)',
    },
  ];
  const s = steps[step];
  return (
    <div className="tilt-screen no-tabs no-status" style={{
      background: s.bg,
      paddingTop: 100,
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>
      {/* progress dots */}
      <div style={{
        position: 'absolute', top: 64, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 8,
      }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 28 : 8, height: 8,
            background: i <= step ? 'var(--ink)' : 'rgba(42,31,26,0.18)',
            borderRadius: 999,
            transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
          }} />
        ))}
      </div>

      {/* Mascot */}
      <div className="screen-in" key={step} style={{
        display: 'flex', justifyContent: 'center', marginTop: 40,
      }}>
        <Til mood={s.mood} size={180} color="#FFB59A" />
      </div>

      {/* Text */}
      <div className="screen-in" key={'t' + step} style={{
        padding: '40px 32px 0', textAlign: 'center',
      }}>
        <div className="t-display" style={{ fontSize: 44, marginBottom: 4 }}>{s.title}</div>
        <div className="t-serif" style={{ fontSize: 26, color: 'var(--ink-2)', marginBottom: 18 }}>{s.sub}</div>
        <div style={{ fontSize: 16, lineHeight: 1.45, color: 'var(--ink-2)', maxWidth: 300, margin: '0 auto' }}>{s.body}</div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '0 24px 60px' }}>
        <button className="btn btn-primary btn-block" onClick={() => {
          if (step < steps.length - 1) setStep(step + 1);
          else onDone();
        }}>{s.cta}</button>
        {step < steps.length - 1 && (
          <button onClick={onDone} style={{
            display: 'block', margin: '14px auto 0',
            background: 'none', border: 'none',
            color: 'var(--ink-2)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}>skip the intro</button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding });

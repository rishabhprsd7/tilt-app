// Tilt — main app + tab bar + navigation

function TabBar({ active, nav, openLog }) {
  const tabs = [
    { id: 'home',         glyph: '🏠', label: 'home' },
    { id: 'friends',      glyph: '👯', label: 'friends' },
    { id: 'log',          glyph: '+',  label: '', fab: true },
    { id: 'personality',  glyph: '🐹', label: 'you' },
    { id: 'recap',        glyph: '✨', label: 'recap' },
  ];
  return (
    <div className="tab-bar">
      {tabs.map(t => {
        if (t.fab) {
          return (
            <button key={t.id} onClick={openLog} className="tab-item fab" aria-label="log a treat">
              <span className="glyph">{t.glyph}</span>
            </button>
          );
        }
        return (
          <button key={t.id} onClick={() => nav(t.id)} className={'tab-item' + (active === t.id ? ' active' : '')}>
            <span className="glyph" style={{
              filter: active === t.id ? 'none' : 'grayscale(0.6)',
              transform: active === t.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(.34,1.56,.64,1)',
            }}>{t.glyph}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "peach",
  "tone": "soft",
  "density": "cozy",
  "startScreen": "home"
}/*EDITMODE-END*/;

function App() {
  // simulate: skip onboarding by default since user wants to see the app
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState({ screen: t.startScreen || 'home', param: null });
  const [showLog, setShowLog] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  // Sync palette to CSS
  React.useEffect(() => {
    const root = document.documentElement;
    const palettes = {
      peach:    { primary: '#F08562', soft: '#FFE3D4', bg: '#FAF4EC' },
      lavender: { primary: '#8B6FD9', soft: '#ECE3FF', bg: '#F5F1FA' },
      mint:     { primary: '#4FB077', soft: '#DEF5E4', bg: '#F0F7F2' },
      berry:    { primary: '#D9568F', soft: '#FCD9E8', bg: '#FAF1F5' },
      sunshine: { primary: '#E8A93B', soft: '#FFF1C9', bg: '#FAF6E8' },
    };
    const p = palettes[t.palette] || palettes.peach;
    root.style.setProperty('--peach-deep', p.primary);
    root.style.setProperty('--peach-soft', p.soft);
    root.style.setProperty('--bg', p.bg);
  }, [t.palette]);

  const nav = (screen, param = null) => {
    if (screen === 'log') { setShowLog(true); return; }
    setRoute({ screen, param });
  };

  const screens = {
    home:        <Home nav={nav} tone={t.tone} />,
    friends:     <FriendsScreen nav={nav} />,
    friend:      <FriendDetail friendId={route.param || 'alex'} nav={nav} />,
    groups:      <GroupsScreen nav={nav} />,
    group:       <GroupDetail groupId={route.param || 'roomies'} nav={nav} />,
    mascot:      <MascotScreen nav={nav} />,
    personality: <PersonalityScreen nav={nav} />,
    recap:       <RecapScreen nav={nav} />,
    notifications: <NotificationsScreen nav={nav} />,
  };

  // Determine if current screen should show the tab bar
  const screensWithTabs = ['home', 'friends', 'personality', 'groups'];
  const showTabs = screensWithTabs.includes(route.screen);

  // Active tab mapping
  const tabMap = { home: 'home', friends: 'friends', personality: 'personality', recap: 'recap' };
  const activeTab = tabMap[route.screen] || 'home';

  return (
    <>
      {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} tone={t.tone} />}
      {!showOnboarding && (
        <>
          <div key={route.screen + route.param} className="screen-in" style={{ width: '100%', height: '100%' }}>
            {screens[route.screen] || screens.home}
          </div>
          {showTabs && !showLog && <TabBar active={activeTab} nav={nav} openLog={() => setShowLog(true)} />}
          {/* Log treat overlay */}
          {showLog && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 100,
              animation: 'screen-fade 0.32s cubic-bezier(.2,.8,.2,1)',
            }}>
              <LogTreat onClose={() => setShowLog(false)} />
            </div>
          )}
        </>
      )}

      <TiltTweaks t={t} setTweak={setTweak} restart={() => setShowOnboarding(true)} nav={nav} />
    </>
  );
}

function TiltTweaks({ t, setTweak, restart, nav }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="palette">
        <TweakColor
          label="theme"
          value={t.palette}
          options={[
            ['#F08562','#FFE3D4','#FAF4EC'],
            ['#8B6FD9','#ECE3FF','#F5F1FA'],
            ['#4FB077','#DEF5E4','#F0F7F2'],
            ['#D9568F','#FCD9E8','#FAF1F5'],
            ['#E8A93B','#FFF1C9','#FAF6E8'],
          ]}
          onChange={(v) => {
            // Map array back to name
            const map = { '#F08562': 'peach', '#8B6FD9': 'lavender', '#4FB077': 'mint', '#D9568F': 'berry', '#E8A93B': 'sunshine' };
            setTweak('palette', map[v[0]] || 'peach');
          }} />
      </TweakSection>
      <TweakSection label="copy tone">
        <TweakSelect
          label="how Til talks"
          value={t.tone}
          options={[
            { value: 'soft',    label: 'soft & sweet' },
            { value: 'goblin',  label: 'goblin chaos' },
            { value: 'zen',     label: 'zen monk' },
          ]}
          onChange={(v) => setTweak('tone', v)} />
      </TweakSection>
      <TweakSection label="density">
        <TweakRadio
          label="spacing"
          value={t.density}
          options={[{value:'cozy', label:'cozy'}, {value:'compact', label:'compact'}]}
          onChange={(v) => setTweak('density', v)} />
      </TweakSection>
      <TweakSection label="jump to screen">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            ['home', 'home'],
            ['friends', 'friends'],
            ['groups', 'groups'],
            ['mascot', 'mascot'],
            ['personality', 'archetype'],
            ['recap', 'recap'],
            ['notifications', 'whispers'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => nav(id)} style={{
              border: 'none', cursor: 'pointer',
              padding: '8px 10px', borderRadius: 10,
              background: '#1a1a1a', color: '#eee',
              fontSize: 12, fontFamily: 'inherit',
            }}>{label}</button>
          ))}
        </div>
        <div style={{ height: 6 }} />
        <TweakButton label="replay onboarding" onClick={restart} />
      </TweakSection>
    </TweaksPanel>
  );
}

Object.assign(window, { App, TabBar });

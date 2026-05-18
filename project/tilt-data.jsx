// Tilt — data, domain model, and calculation logic
//
// PHILOSOPHY: This is a social memory app, not an accounting app.
// - Internal scores are NEVER exposed directly to users
// - All UI uses TILT_STATE buckets and human-readable phrases
// - Time decay prevents permanent "debt" accumulation
// - Treat levels are symbolic — not financial denominations

// ── Treat levels (symbolic only — not currency) ──────────────────
const TREAT_LEVELS = [10, 20, 30, 50, 75, 100, 130, 150, 180, 200, 225, 250, 280, 300];

// ── Emoji palette ─────────────────────────────────────────────────
const EMOJIS = [
  { e: '🍝', label: 'pasta' },
  { e: '🍕', label: 'pizza' },
  { e: '🍣', label: 'sushi' },
  { e: '🌯', label: 'kebab' },
  { e: '☕', label: 'coffee' },
  { e: '🍻', label: 'drinks' },
  { e: '🍦', label: 'icecream' },
  { e: '🚕', label: 'taxi' },
  { e: '🎬', label: 'movie' },
  { e: '🌙', label: 'late nite' },
  { e: '🛒', label: 'groceries' },
  { e: '🍜', label: 'noodles' },
  { e: '🧋', label: 'boba' },
  { e: '🍩', label: 'donut' },
  { e: '🥐', label: 'pastry' },
  { e: '✈️', label: 'travel' },
];

// ── Personality archetypes (descriptive, not hierarchical) ────────
// Archetypes describe tendencies — no archetype is "better" than another.
// They are earned by behavior patterns, not by spending more.
const PERSONALITIES = [
  { id: 'snack-sponsor',     name: 'Snack Sponsor',         animal: '🐹', tag: 'keeps the little treats flowing',  color: '#FFD66B' },
  { id: 'chaos-feeder',      name: 'Chaos Feeder',          animal: '🦝', tag: 'will buy 3am food. no questions',   color: '#C9B8F0' },
  { id: 'taxi-hero',         name: 'Taxi Hero',             animal: '🚕', tag: 'rescues the squad from rain',        color: '#FFB59A' },
  { id: 'coffee-goblin',     name: 'Coffee Goblin',         animal: '☕', tag: 'fueled the entire group chat',       color: '#B9E8C6' },
  { id: 'midnight-provider', name: 'Midnight Provider',     animal: '🌙', tag: 'shows up when nobody else can',      color: '#A8D9F0' },
  { id: 'sugar-parent',      name: 'Vacation Sugar Parent', animal: '🌴', tag: 'a vibe upgrade everywhere',          color: '#F49AC2' },
  { id: 'group-dad',         name: 'Group Dad',             animal: '🐻', tag: 'has the cards, has the plan',        color: '#FFB59A' },
  { id: 'tiny-treat-dealer', name: 'Tiny Treat Dealer',     animal: '🍪', tag: 'a +10 a day keeps the gloom away',   color: '#FFE3D4' },
];

// ── Friends ───────────────────────────────────────────────────────
const FRIENDS = [
  { id: 'alex',  name: 'Alex',  color: '#FFB59A', personality: 'taxi-hero',         vibe: 'carrying the vibe' },
  { id: 'jamie', name: 'Jamie', color: '#C9B8F0', personality: 'chaos-feeder',      vibe: 'in goblin mode' },
  { id: 'chris', name: 'Chris', color: '#B9E8C6', personality: 'group-dad',         vibe: 'feeling balanced' },
  { id: 'rae',   name: 'Rae',   color: '#FFD66B', personality: 'coffee-goblin',     vibe: 'caffeinated' },
  { id: 'sam',   name: 'Sam',   color: '#A8D9F0', personality: 'midnight-provider', vibe: 'glowing soft' },
  { id: 'noor',  name: 'Noor',  color: '#F49AC2', personality: 'sugar-parent',      vibe: 'showing up for everyone' },
];

// ── Groups ────────────────────────────────────────────────────────
const GROUPS = [
  { id: 'roomies',  name: 'Roomies',     emoji: '🏠', members: ['alex','jamie','chris','rae'], vibe: 'tilted toward Alex lately' },
  { id: 'lisbon',   name: 'Lisbon trip', emoji: '🌴', members: ['alex','noor','sam'],          vibe: 'nicely balanced' },
  { id: 'gym-crew', name: 'Gym crew',    emoji: '🥤', members: ['chris','rae','sam'],          vibe: 'Chris has been picking it up' },
];

// ── Feed ──────────────────────────────────────────────────────────
// daysAgo is used for decay calculations. Never expose this to users.
const FEED = [
  { id: 1, who: 'alex',  level: 50,  emoji: '🍝', note: 'spaghetti night',            when: '2h',   daysAgo: 0, group: 'roomies', selected: ['jamie','chris','rae'] },
  { id: 2, who: 'jamie', level: 20,  emoji: '☕', note: 'office runs ☕☕☕',             when: '6h',   daysAgo: 0, group: null,      selected: ['alex','chris'] },
  { id: 3, who: 'noor',  level: 130, emoji: '🍣', note: 'post-breakup sushi mission',  when: 'yest', daysAgo: 1, group: 'lisbon',  selected: ['alex','sam'] },
  { id: 4, who: 'me',    level: 30,  emoji: '🌯', note: '3am kebab rescue 🌯',         when: 'yest', daysAgo: 1, group: null,      selected: ['jamie'] },
  { id: 5, who: 'sam',   level: 10,  emoji: '🍪', note: 'tiny treat dealer in action', when: '2d',   daysAgo: 2, group: null,      selected: ['noor','rae'] },
  { id: 6, who: 'chris', level: 75,  emoji: '🍕', note: 'movie + pizza',               when: '3d',   daysAgo: 3, group: 'roomies', selected: ['alex','jamie','rae'] },
];


// ── TILT STATE SYSTEM ─────────────────────────────────────────────
//
// Core invariant: raw scores are NEVER shown to users.
// All UI uses these state labels. States describe recent patterns,
// never obligations. Both "theirs" and "yours" states are framed
// warmly — generosity is celebrated regardless of direction.
//
// Convention: "theirs" = they have been more generous recently
//             "yours"  = you have been more generous recently
//             Neither direction implies the other person "owes" anything.

const TILT_STATES = {
  DEEPLY_THEIRS: 'deeply_theirs',   // they've been especially generous lately
  THEIRS:        'theirs',           // they've picked up more recently
  GENTLY_THEIRS: 'gently_theirs',   // slight lean their way
  BALANCED:      'balanced',         // roughly even — celebrate this
  GENTLY_YOURS:  'gently_yours',    // slight lean your way
  YOURS:         'yours',            // you've been picking it up
  DEEPLY_YOURS:  'deeply_yours',    // you've been especially generous lately
};

// Bar widths for tilt visualisation — fractions, never shown as numbers.
// Balanced = no fill. States grow toward edges. No "100% = you owe everything".
const TILT_BAR_WIDTHS = {
  [TILT_STATES.DEEPLY_THEIRS]: 0.82,
  [TILT_STATES.THEIRS]:        0.55,
  [TILT_STATES.GENTLY_THEIRS]: 0.28,
  [TILT_STATES.BALANCED]:      0,
  [TILT_STATES.GENTLY_YOURS]:  0.28,
  [TILT_STATES.YOURS]:         0.55,
  [TILT_STATES.DEEPLY_YOURS]:  0.82,
};

// Demo states for friends — replaces scattered tiltMap/tilts objects.
// Using named states prevents magic numbers leaking into UI code.
const DEMO_FRIEND_STATES = {
  alex:  TILT_STATES.THEIRS,
  jamie: TILT_STATES.GENTLY_YOURS,
  chris: TILT_STATES.BALANCED,
  rae:   TILT_STATES.BALANCED,
  sam:   TILT_STATES.GENTLY_THEIRS,
  noor:  TILT_STATES.DEEPLY_THEIRS,
};

// Demo group states per member — for GroupDetail vibe board.
const DEMO_GROUP_MEMBER_STATES = {
  alex:  TILT_STATES.THEIRS,
  jamie: TILT_STATES.GENTLY_THEIRS,
  chris: TILT_STATES.GENTLY_YOURS,
  rae:   TILT_STATES.GENTLY_YOURS,
  noor:  TILT_STATES.DEEPLY_THEIRS,
  sam:   TILT_STATES.BALANCED,
};


// ── Time-decay model ──────────────────────────────────────────────
//
// Entries fade naturally over time. No single entry persists forever
// as a "debt." This is the core mechanic that prevents the app from
// becoming an accounting ledger.
//
// Weights are intentionally imprecise — close enough to feel fair,
// fuzzy enough to prevent users from reverse-engineering exact values.

const DECAY_TIERS = [
  { maxDays: 7,  weight: 1.00 },  // this week: full weight
  { maxDays: 30, weight: 0.60 },  // this month: substantial
  { maxDays: 60, weight: 0.30 },  // last month: fading
  { maxDays: 90, weight: 0.10 },  // two months ago: a whisper
  // > 90 days: no contribution — acts as a natural soft reset
];

function getDecayWeight(daysAgo) {
  for (const tier of DECAY_TIERS) {
    if (daysAgo <= tier.maxDays) return tier.weight;
  }
  return 0;
}

// Compute a decayed tilt score between two people.
// Positive = other person has been more generous recently.
// Negative = you have been more generous recently.
// INTERNAL ONLY — never display this number in the UI.
function computeTiltScore(entries, fromId, toId) {
  let score = 0;
  for (const entry of entries) {
    const decay = getDecayWeight(entry.daysAgo || 0);
    if (decay === 0) continue;
    const perPerson = entry.level / Math.max(entry.selected.length, 1);
    if (entry.who === fromId && entry.selected.includes(toId)) {
      score -= perPerson * decay;  // fromId treated toId (generous to them)
    }
    if (entry.who === toId && entry.selected.includes(fromId)) {
      score += perPerson * decay;  // toId treated fromId (generous to me)
    }
  }
  return score;
}

// Map a raw decayed score to a state bucket.
// Thresholds are deliberately fuzzy — not mathematically precise.
// Same score can land differently at different times (healthy ambiguity).
function scoreToState(score) {
  const abs = Math.abs(score);
  const sign = score >= 0 ? 1 : -1;
  if (abs < 10)  return TILT_STATES.BALANCED;
  if (abs < 28)  return sign > 0 ? TILT_STATES.GENTLY_THEIRS : TILT_STATES.GENTLY_YOURS;
  if (abs < 65)  return sign > 0 ? TILT_STATES.THEIRS        : TILT_STATES.YOURS;
  return sign > 0 ? TILT_STATES.DEEPLY_THEIRS : TILT_STATES.DEEPLY_YOURS;
}


// ── Vibe phrase system ────────────────────────────────────────────
//
// All phrases describe recent patterns — NEVER obligations or debt.
// Rules for writing new phrases:
//   ✓ Describe what has happened recently
//   ✓ Celebrate generosity in both directions warmly
//   ✗ Never say "you owe", "they owe", "your turn", "pay back"
//   ✗ Never use language that implies the other person is waiting
//   ✗ Never create urgency or guilt

const VIBE_PHRASES = {
  [TILT_STATES.BALANCED]: [
    'vibes are mutual lately ✨',
    'nice and even right now',
    'roughly balanced — lovely ✨',
  ],
  [TILT_STATES.GENTLY_THEIRS]: [
    '{name} has been picking things up lately',
    'a gentle lean toward {name} lately',
    '{name} has been in a generous mood',
  ],
  [TILT_STATES.THEIRS]: [
    '{name} has been carrying the vibe 🍜',
    '{name} has been showing up lately',
    '{name} has been generous lately',
  ],
  [TILT_STATES.DEEPLY_THEIRS]: [
    '{name} has entered generous goblin mode 🦝',
    '{name} has really been showing up for you 💛',
    '{name} is carrying hard lately',
  ],
  [TILT_STATES.GENTLY_YOURS]: [
    "you've been picking things up lately",
    "a gentle lean your way lately",
    "you've been in a giving mood",
  ],
  [TILT_STATES.YOURS]: [
    "you've been carrying the vibe lately",
    "you've been showing up ✨",
    "your generosity is felt 💛",
  ],
  [TILT_STATES.DEEPLY_YOURS]: [
    "you've really been showing up lately 💛",
    "the squad noticed your energy",
    "you've been in full treat mode",
  ],
};

const STATE_BG_HINTS = {
  [TILT_STATES.BALANCED]:      'calm',
  [TILT_STATES.GENTLY_THEIRS]: 'warm',
  [TILT_STATES.THEIRS]:        'warm',
  [TILT_STATES.DEEPLY_THEIRS]: 'celebrate',
  [TILT_STATES.GENTLY_YOURS]:  'warm',
  [TILT_STATES.YOURS]:         'warm',
  [TILT_STATES.DEEPLY_YOURS]:  'celebrate',
};

// Returns [phrase, bgHint].
// state: a TILT_STATES value. name: the other person's name.
function getVibePhrase(state, name = 'them') {
  const opts = VIBE_PHRASES[state] || VIBE_PHRASES[TILT_STATES.BALANCED];
  // Deterministic phrase choice per name — varied but stable across renders.
  const idx = (name.length + (name.charCodeAt(0) || 0)) % opts.length;
  const phrase = opts[idx].replace(/\{name\}/g, name);
  return [phrase, STATE_BG_HINTS[state] || 'warm'];
}

// Legacy shim — callers that pass a raw numeric tiltAmount.
// Maps to a state bucket first, so raw numbers never reach UI copy.
function vibePhrase(tiltAmount, otherName) {
  const state = scoreToState(tiltAmount);
  return getVibePhrase(state, otherName);
}


// ── Helpers ───────────────────────────────────────────────────────
function findFriend(id) {
  if (id === 'me') return { id: 'me', name: 'You', color: '#FFE3D4' };
  return FRIENDS.find(f => f.id === id) || { id, name: id, color: '#EEE' };
}

function findPersonality(id) {
  return PERSONALITIES.find(p => p.id === id) || PERSONALITIES[0];
}

// Guardrail: only approved symbolic treat levels are valid.
// Prevents exact-currency amounts from entering the system.
function validateTreatLevel(level) {
  if (!TREAT_LEVELS.includes(level)) {
    console.warn('[Tilt guardrail] Rejected treat level:', level,
      '— only symbolic levels are allowed:', TREAT_LEVELS.join(', '));
    return false;
  }
  return true;
}

// Guardrail: only selected participants are affected by an entry.
// Ensures group entries don't silently affect all members.
function validateParticipantScope(entry) {
  if (!entry.selected || entry.selected.length === 0) {
    console.warn('[Tilt guardrail] Entry has no selected participants — tilt has no effect.');
    return false;
  }
  if (!Array.isArray(entry.selected)) {
    console.warn('[Tilt guardrail] entry.selected must be an array.');
    return false;
  }
  return true;
}


Object.assign(window, {
  TREAT_LEVELS, EMOJIS, PERSONALITIES, FRIENDS, GROUPS, FEED,
  TILT_STATES, TILT_BAR_WIDTHS, DEMO_FRIEND_STATES, DEMO_GROUP_MEMBER_STATES,
  DECAY_TIERS, getDecayWeight, computeTiltScore, scoreToState,
  getVibePhrase, vibePhrase,
  findFriend, findPersonality,
  validateTreatLevel, validateParticipantScope,
});

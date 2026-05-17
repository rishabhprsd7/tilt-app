// Tilt — data + helpers

const TREAT_LEVELS = [10, 20, 30, 50, 75, 100, 130, 150, 180, 200, 225, 250, 280, 300];

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

const PERSONALITIES = [
  { id: 'snack-sponsor',     name: 'Snack Sponsor',      animal: '🐹', tag: 'keeps the little treats flowing', color: '#FFD66B' },
  { id: 'chaos-feeder',      name: 'Chaos Feeder',       animal: '🦝', tag: 'will buy 3am food. no questions', color: '#C9B8F0' },
  { id: 'taxi-hero',         name: 'Taxi Hero',          animal: '🚕', tag: 'rescues the squad from rain', color: '#FFB59A' },
  { id: 'coffee-goblin',     name: 'Coffee Goblin',      animal: '☕', tag: 'fueled the entire group chat', color: '#B9E8C6' },
  { id: 'midnight-provider', name: 'Midnight Provider',  animal: '🌙', tag: 'shows up when nobody else can', color: '#A8D9F0' },
  { id: 'sugar-parent',      name: 'Vacation Sugar Parent', animal: '🌴', tag: 'a vibe upgrade everywhere', color: '#F49AC2' },
  { id: 'group-dad',         name: 'Group Dad',          animal: '🐻', tag: 'has the cards, has the plan', color: '#FFB59A' },
  { id: 'tiny-treat-dealer', name: 'Tiny Treat Dealer',  animal: '🍪', tag: 'a +10 a day keeps the gloom away', color: '#FFE3D4' },
];

// Friends — mock social graph
const FRIENDS = [
  { id: 'alex',   name: 'Alex',   color: '#FFB59A', personality: 'taxi-hero',         vibe: 'carrying the vibe' },
  { id: 'jamie',  name: 'Jamie',  color: '#C9B8F0', personality: 'chaos-feeder',      vibe: 'in goblin mode' },
  { id: 'chris',  name: 'Chris',  color: '#B9E8C6', personality: 'group-dad',         vibe: 'feeling balanced' },
  { id: 'rae',    name: 'Rae',    color: '#FFD66B', personality: 'coffee-goblin',     vibe: 'caffeinated' },
  { id: 'sam',    name: 'Sam',    color: '#A8D9F0', personality: 'midnight-provider', vibe: 'glowing soft' },
  { id: 'noor',   name: 'Noor',   color: '#F49AC2', personality: 'sugar-parent',      vibe: 'spoiled the squad' },
];

const GROUPS = [
  { id: 'roomies',    name: 'Roomies',     emoji: '🏠', members: ['alex','jamie','chris','rae'], vibe: 'tilted toward Alex' },
  { id: 'lisbon',     name: 'Lisbon trip', emoji: '🌴', members: ['alex','noor','sam'],           vibe: 'wildly balanced' },
  { id: 'gym-crew',   name: 'Gym crew',    emoji: '🥤', members: ['chris','rae','sam'],           vibe: 'Chris is carrying' },
];

// Feed — synthesized events
const FEED = [
  { id: 1, who: 'alex',  level: 50,  emoji: '🍝', note: 'spaghetti night',         when: '2h',  group: 'roomies', selected: ['jamie','chris','rae'] },
  { id: 2, who: 'jamie', level: 20,  emoji: '☕', note: 'office runs ☕☕☕',          when: '6h',  group: null,     selected: ['alex','chris'] },
  { id: 3, who: 'noor',  level: 130, emoji: '🍣', note: 'post-breakup sushi mission', when: 'yest', group: 'lisbon', selected: ['alex','sam'] },
  { id: 4, who: 'me',    level: 30,  emoji: '🌯', note: '3am kebab rescue 🌯',      when: 'yest', group: null,     selected: ['jamie'] },
  { id: 5, who: 'sam',   level: 10,  emoji: '🍪', note: 'tiny treat dealer in action', when: '2d',  group: null,     selected: ['noor','rae'] },
  { id: 6, who: 'chris', level: 75,  emoji: '🍕', note: 'movie + pizza',            when: '3d',  group: 'roomies', selected: ['alex','jamie','rae'] },
];

// Vibe phrases — choose by tilt direction
function vibePhrase(tiltAmount, otherName, youName = 'you') {
  if (Math.abs(tiltAmount) < 20) return [`Balance vibes are returning ✨`, 'calm'];
  if (tiltAmount > 100) return [`${otherName} has entered generous goblin mode 🦝`, 'dramatic'];
  if (tiltAmount > 50)  return [`${otherName} has been carrying the vibe lately 🍜`, 'warm'];
  if (tiltAmount > 0)   return [`Tilted toward ${otherName}`, 'warm'];
  if (tiltAmount > -50) return [`Your turn to spoil ${otherName} 🍕`, 'warm'];
  if (tiltAmount > -100) return [`You've been carrying the vibe ✨`, 'celebrate'];
  return [`Okay okay someone buy ${youName} a snack already 🍜😤`, 'dramatic'];
}

function findFriend(id) {
  if (id === 'me') return { id: 'me', name: 'You', color: '#FFE3D4' };
  return FRIENDS.find(f => f.id === id) || { id, name: id, color: '#EEE' };
}

function findPersonality(id) {
  return PERSONALITIES.find(p => p.id === id) || PERSONALITIES[0];
}

Object.assign(window, {
  TREAT_LEVELS, EMOJIS, PERSONALITIES, FRIENDS, GROUPS, FEED,
  vibePhrase, findFriend, findPersonality,
});

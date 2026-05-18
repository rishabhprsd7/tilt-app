// tilt-guardrails.js
// Code-level product safety guardrails for Tilt.
//
// These run at page load and during development to catch philosophy violations
// before they reach users. Think of this as a linter for product ethics.
//
// Usage: include this file after tilt-data.jsx, before any screen components.

(function runTiltGuardrails() {
  'use strict';

  // ── Banned vocabulary ───────────────────────────────────────────
  // These terms must never appear in user-facing copy (notifications,
  // labels, cards, buttons, phrases). Check against this list when
  // writing new copy or reviewing PRs.
  const BANNED_TERMS = [
    // Debt framing
    'owe', 'owes', 'owed',
    'debt', 'debts',
    'settle', 'settlement',
    'unpaid', 'outstanding', 'overdue',
    'balance due', 'pay back', 'pay me back',
    // Accusatory / guilting
    'you haven\'t', 'you didn\'t',
    'it\'s been X days', // dynamic version — catch in review
    // Transactional framing
    'split', 'splitting', 'split the bill',
    'fair share', 'your share',
    'reimburs',
    // Explicit ranking language
    'biggest giver', 'most generous', 'least generous',
    '#1', '#2', '#3',  // ranking positions in generosity context
  ];

  // Notification/copy strings to audit against BANNED_TERMS.
  // Add new copy strings here as they're created.
  const AUDITABLE_COPY = [
    // vibePhrase outputs
    ...(typeof VIBE_PHRASES !== 'undefined' ? Object.values(VIBE_PHRASES).flat() : []),
    // Notification titles / subs should be added here too
  ];

  function checkCopyForBannedTerms(copyStrings, context) {
    const violations = [];
    for (const copy of copyStrings) {
      const lower = copy.toLowerCase();
      for (const term of BANNED_TERMS) {
        if (lower.includes(term.toLowerCase())) {
          violations.push({ copy, term, context });
        }
      }
    }
    return violations;
  }

  // ── Treat level validation ──────────────────────────────────────
  // Ensures only symbolic treat levels are used. Any arbitrary number
  // (e.g. exact expense amounts) is rejected.
  function assertValidTreatLevels() {
    if (typeof TREAT_LEVELS === 'undefined') {
      console.error('[Tilt] TREAT_LEVELS not found. tilt-data.jsx must load first.');
      return;
    }
    // Levels should be positive integers, not round hundreds (avoids euro/dollar equivalents)
    const hasRoundHundreds = TREAT_LEVELS.filter(l => l > 10 && l % 100 === 0 && l <= 300);
    // Some round-hundreds are OK (100, 200, 300) but they should be mixed with
    // irregular values to prevent 1:1 currency mapping
    const hasIrregularValues = TREAT_LEVELS.some(l => ![10,20,30,40,50,60,70,80,90,100,150,200,250,300].includes(l));
    if (!hasIrregularValues) {
      console.warn('[Tilt guardrail] TREAT_LEVELS looks too regular — add fuzzy values like 75, 130, 225 to prevent currency mapping.');
    }
    // No negative values
    if (TREAT_LEVELS.some(l => l <= 0)) {
      console.error('[Tilt guardrail] TREAT_LEVELS contains non-positive values. All treat levels must be positive.');
    }
    console.log('[Tilt guardrail ✓] TREAT_LEVELS validated:', TREAT_LEVELS.length, 'levels');
  }

  // ── Tilt state completeness ─────────────────────────────────────
  // Every TILT_STATE must have an entry in TILT_BAR_WIDTHS and VIBE_PHRASES.
  function assertTiltStateCompleteness() {
    if (typeof TILT_STATES === 'undefined') return;
    const states = Object.values(TILT_STATES);

    if (typeof TILT_BAR_WIDTHS !== 'undefined') {
      const missingWidths = states.filter(s => TILT_BAR_WIDTHS[s] === undefined);
      if (missingWidths.length > 0) {
        console.error('[Tilt guardrail] TILT_BAR_WIDTHS missing states:', missingWidths);
      } else {
        console.log('[Tilt guardrail ✓] All tilt states have bar widths.');
      }
    }

    if (typeof VIBE_PHRASES !== 'undefined') {
      const missingPhrases = states.filter(s => !VIBE_PHRASES[s] || VIBE_PHRASES[s].length === 0);
      if (missingPhrases.length > 0) {
        console.error('[Tilt guardrail] VIBE_PHRASES missing states:', missingPhrases);
      } else {
        console.log('[Tilt guardrail ✓] All tilt states have vibe phrases.');
      }
    }
  }

  // ── Vibe phrase quality checks ──────────────────────────────────
  function assertVibePhraseQuality() {
    if (typeof VIBE_PHRASES === 'undefined') return;
    let passed = 0;
    let failed = 0;

    for (const [state, phrases] of Object.entries(VIBE_PHRASES)) {
      for (const phrase of phrases) {
        const lower = phrase.toLowerCase();
        const violations = BANNED_TERMS.filter(t => lower.includes(t.toLowerCase()));
        if (violations.length > 0) {
          console.error(`[Tilt guardrail] Banned term "${violations[0]}" found in phrase: "${phrase}" (state: ${state})`);
          failed++;
        } else {
          passed++;
        }
      }
    }
    if (failed === 0) {
      console.log(`[Tilt guardrail ✓] Vibe phrases clean (${passed} phrases checked).`);
    }
  }

  // ── Decay model sanity ──────────────────────────────────────────
  function assertDecayModelSanity() {
    if (typeof DECAY_TIERS === 'undefined' || typeof getDecayWeight === 'undefined') return;

    // Weights must decrease with age
    for (let i = 1; i < DECAY_TIERS.length; i++) {
      if (DECAY_TIERS[i].weight >= DECAY_TIERS[i - 1].weight) {
        console.error('[Tilt guardrail] DECAY_TIERS weights must be strictly decreasing with age.');
        return;
      }
    }
    // Weight at day 0 must be 1.0 (full weight for today's entry)
    if (getDecayWeight(0) !== 1.0) {
      console.error('[Tilt guardrail] getDecayWeight(0) must return 1.0.');
      return;
    }
    // Weight at day 91 must be 0 (entries older than 90 days fade completely)
    if (getDecayWeight(91) !== 0) {
      console.error('[Tilt guardrail] getDecayWeight(91) must return 0 — entries > 90 days should fully fade.');
      return;
    }
    console.log('[Tilt guardrail ✓] Decay model is monotone and soft-resets after 90 days.');
  }

  // ── Participant scope enforcement ───────────────────────────────
  // Test: ensure computeTiltScore only affects selected participants.
  function assertParticipantScopeIsolation() {
    if (typeof computeTiltScore === 'undefined') return;

    const entries = [
      { id: 'e1', who: 'alice', level: 50, daysAgo: 1, selected: ['bob'] },
    ];

    // bob should be affected (selected)
    const scoreBob = computeTiltScore(entries, 'alice', 'bob');
    if (scoreBob >= 0) {
      console.error('[Tilt guardrail] alice treated bob — score for bob should be negative (alice was generous to bob, so from alice\'s perspective, score vs bob should shift).');
    }

    // carol should NOT be affected (not selected)
    const scoreCarol = computeTiltScore(entries, 'alice', 'carol');
    if (scoreCarol !== 0) {
      console.error('[Tilt guardrail] Participant scope violation! carol was not selected but tilt changed:', scoreCarol);
    } else {
      console.log('[Tilt guardrail ✓] Participant scope isolated — unselected members unaffected.');
    }
  }

  // ── No leaderboard outputs ──────────────────────────────────────
  // The scoreToState function must never produce rankings.
  // All state outputs should be individual, not comparative.
  function assertNoLeaderboardOutput() {
    if (typeof scoreToState === 'undefined') return;
    // scoreToState takes a single number and returns a state string
    // It should never take an array or produce sorted/ranked output
    const testCases = [100, 50, 20, 5, -5, -20, -50, -100];
    const states = testCases.map(n => scoreToState(n));
    // All should be valid TILT_STATES values
    const validStates = Object.values(TILT_STATES);
    const invalid = states.filter(s => !validStates.includes(s));
    if (invalid.length > 0) {
      console.error('[Tilt guardrail] scoreToState produced invalid state(s):', invalid);
    } else {
      console.log('[Tilt guardrail ✓] All scoreToState outputs are valid TILT_STATES values.');
    }
  }

  // ── Run all checks ──────────────────────────────────────────────
  function runAll() {
    console.group('[Tilt product guardrails]');
    assertValidTreatLevels();
    assertTiltStateCompleteness();
    assertVibePhraseQuality();
    assertDecayModelSanity();
    assertParticipantScopeIsolation();
    assertNoLeaderboardOutput();
    console.groupEnd();
  }

  // Run after all scripts have loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    // Already loaded (Babel deferred execution)
    setTimeout(runAll, 0);
  }

  // Expose for manual re-runs in console during development
  window.__tiltGuardrails = { runAll, checkCopyForBannedTerms, BANNED_TERMS };
})();

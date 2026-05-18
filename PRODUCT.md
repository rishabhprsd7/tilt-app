# Tilt — Product Philosophy & Guardrails

> "The wholesome anti-Splitwise."

---

## What Tilt Is

Tilt is a **social memory app** for generous people. It helps close relationships stay emotionally fair without turning into accounting. It celebrates generosity as a social act, not a financial transaction.

Users log symbolic "treat moments" — *sushi night, 3am kebab rescue, airport coffee* — and Tilt gently tracks whether the giving has been roughly mutual lately. It never tells anyone what they owe.

---

## What Tilt Is NOT

| ❌ What it must never become | Why this matters |
|---|---|
| An expense tracker | Creates financial anxiety in relationships |
| A debt ledger | "You owe me" poisons friendships |
| A payment reminder | Guilt is antithetical to generosity |
| A bill splitter | Splitwise already exists — this is different |
| A social pressure engine | Obligations ruin organic reciprocity |
| A generosity leaderboard | Ranking who gave most punishes low earners |
| Cute Splitwise | The app must be emotionally distinct, not just cosmetically softer |

---

## Core Product Invariants

These rules must never be broken, regardless of feature requests:

1. **Never present imbalance as debt.** Tilt describes *recent patterns*, not obligations. "Alex has been generous lately" ≠ "You owe Alex."

2. **Never use "owe", "debt", "settle up", "unpaid", "overdue", or "outstanding"** in any user-facing copy, notification, or UI state.

3. **Never rank friends by generosity.** No leaderboards, no #1/#2/#3, no "biggest giver" lists. Generosity is not a competition.

4. **Never expose internal numeric scores.** Users see states and phrases, not numbers. A score of 73 tells someone nothing useful but invites obsession.

5. **Old generosity does not create permanent obligation.** The decay system ensures that entries fade over time. A friend who paid for dinner 4 months ago is not owed a dinner forever.

6. **Treat all tilt directions equally.** Whether you've been giving more OR receiving more — both are described with warmth. Never make either party feel guilty.

7. **Streaks must not create anxiety.** If rhythm-tracking is shown, frame it as "a nice pattern together" not "N days/weeks straight" with a fire emoji. Never show streak loss.

8. **Never notify about inactivity in ways that imply failure.** "The squad has been quiet" is fine. "You haven't treated anyone in 5 days 😤" is not.

9. **Protect low-frequency users.** Someone who only logs once a month should not see alarming states. The app should feel cozy regardless of frequency.

10. **Only selected participants are affected by a treat.** An entry logged for B and C must never affect D and E's balance.

---

## Emotional Risks

These are the ways Tilt can turn toxic if not actively guarded against:

### Social Pressure
- Showing exact treat amounts (+130 🍣) in public feed items invites comparison
- "Spoil them back" buttons create explicit reciprocity pressure
- Notification nudges about inactivity can feel like nagging

### Financial Asymmetry
- High earners can log +300 treats without thinking. Low earners logging +10 may feel embarrassed.
- Solution: Never comment on treat size. All treat levels are equally valid.
- The app celebrates *frequency* of generosity (small regular treats), not *magnitude*.

### Accountability Creep
- If users can see exact scores, they will try to "settle" them
- If phrases are too precise ("you're 73 units behind"), users will obsess
- Solution: Use state buckets with fuzzy language. Never show numbers.

### Couples Mode Risk
- Tilt can become surveillance in relationships under tension
- Solution: Couples mode should emphasize shared memories over balance states
- During a rough patch, the app should offer warmth, not score recaps

### Archetype Hierarchy
- If archetypes have a "best" one, users will try to achieve it
- Solution: All archetypes are equally valid behavioral descriptions, not ranks

---

## Logic Guardrails

### Data Model Rules
- `TREAT_LEVELS` is the only valid input set — arbitrary numbers are rejected by `validateTreatLevel()`
- `entry.selected` must be a non-empty array — `validateParticipantScope()` enforces this
- Raw tilt scores (`computeTiltScore()`) must never appear in JSX or notification templates
- All UI must route through `getVibePhrase(state, name)` — never construct phrases from raw scores

### State System
- `TILT_STATES` enum is the interface between logic and UI
- `TILT_BAR_WIDTHS` provides visual magnitudes — fractions, never shown as numbers
- `DEMO_FRIEND_STATES` and `DEMO_GROUP_MEMBER_STATES` replace all hardcoded `tiltMap` objects
- `scoreToState()` is the only place that maps numbers to states

### Decay Requirements
- No entry should ever contribute weight after 90 days
- Decay weights should stay intentionally imprecise (not round numbers like 0.5, 0.25)
- Never add a "disable decay" feature — that would recreate permanent debt

---

## Language Guide

### Phrases to use
| Situation | Good language |
|---|---|
| They've been generous | "Alex has been carrying the vibe 🍜" |
| You've been generous | "You've been showing up lately ✨" |
| Balanced | "Vibes are mutual lately ✨" |
| Someone's had a giving month | "In generous goblin mode 🦝" |
| Tilt between two friends | "A gentle lean toward [name]" |
| Logging a treat | "treating" / "spreading a treat" / "picking it up" |

### Phrases to avoid
| ❌ Avoid | ✅ Replace with |
|---|---|
| "You owe" | Never show this |
| "They owe you" | Never show this |
| "Spoil them back" | "Treat them too 🍜" |
| "Spoil them" (as obligation) | "Maybe treat them soon?" |
| "They spoiled you" | "They've been generous" |
| "Settle up" | Remove entirely |
| "Overdue" | Remove entirely |
| "12-week streak" + 🔥 | "Been treating each other for 3 months 🌱" |
| "We miss you 😢" | "The squad's been cozy lately — anyone got treat energy?" |
| "#1 biggest giver" | Replace with vibe story, no rank |

---

## Future Feature Red Lines

These features must never be built without significant ethical review:

- **"Settle" or "clear balance" flows** — adds financial settlement logic
- **Payment integration** — turns symbolic treats into real money obligations
- **Public leaderboards** — ranks generosity, punishes low earners
- **Hard streak tracking with loss penalties** — creates Duolingo-style anxiety
- **"They haven't treated you in X days" notifications** — passive-aggressive by design
- **Automatic balance summaries sent to group** — exposes individual tilt to group, creates shame
- **"Fair share" calculator** — re-introduces exact accounting
- **Negative balance states shown in red** — debt framing, punitive visual language

---

## For Future Contributors

**If you're adding a feature, ask:**
1. Does this feature make relationships more transactional?
2. Does it expose numbers where states should be?
3. Could it be used to guilt someone?
4. Does it rank or compare people?
5. Does it punish users for low frequency?

If any answer is yes — redesign before shipping.

**The test:** Would you be comfortable if your best friend used this to track treats with you? If the feature would feel weird between close friends, it doesn't belong in Tilt.

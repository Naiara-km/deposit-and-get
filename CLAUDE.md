# Deposit & Get with Pool — Prototype

This is a **throwaway prototype** validating the *mechanic* of a new promotion type for SuperSportBet (SA & ZM). It is not production code and will not ship to users. Engineers will rebuild the validated patterns inside the Kingmakers monorepo using the real design system later.

Owner: Naiara (Product Designer, Engagement Squad, BetKing).

---

## What this prototype is for

Validating the **Deposit & Get with Pool** mechanic with stakeholders (Growth, Marketing, PMs, Eng).

The new mechanic: players opt into a promotion, then earn a fixed reward (Free Spins) for each qualifying deposit during the campaign window, up to a personal redemption cap, while a global pool of redemptions decrements across all users.

The two things this prototype must prove:
1. **Dual-counter clarity** — users understand both their personal progress and the global pool without feeling pressured.
2. **State coverage** — every lifecycle state (7 of them) is handled on both the Promo Card and the Promo Details page with no dead ends.

---

## Mocked promo (use these exact values everywhere)

- **Name:** Spins of Olympus
- **Mechanic:** Deposit R200–R2,000 → Get 100 Free Spins (R1 each)
- **Max redemptions per user:** 5
- **Pool (global cap):** 5,000 redemptions
- **Eligible game:** Gates of Olympus Super Scatter
- **Campaign window:** 7 days
- **Wagering on winnings:** 1x deposit
- **Market:** South Africa (ZAR), with Zambia (ZMW) variant toggleable in debug panel

Single source of truth: `src/mocks/spinsOfOlympus.ts`. Components consume via `usePromo()` hook. Do not hardcode "100 Free Spins" or "R200" in components.

---

## The 7 promo states (must all be reachable via DebugPanel)

| State | Card | Details |
|---|---|---|
| `available` | "Join Promo" CTA active | "Join Promo" sticky CTA, no progress section |
| `available_pool_exhausted` | CTA disabled, "Promotion full" | CTA disabled, copy explains pool is full |
| `active` | In Active Promos section, redemptions + pool + "Deposit Now" | Full progress section, "Deposit Now" sticky CTA |
| `active_deposit_pending` | Counter holds last value + subtle "Processing..." | Same — async update |
| `completed` | Shows "Completed" briefly | Rewards summary, CTA = "Play with Free Spins now" |
| `ended_pool_exhausted` | "Ended" state | Summary + "pool was reached" copy |
| `ended_campaign_closed` | "Ended" state | Summary, T&Cs visible |

**Critical async rule:** never show contradictory counters, never flicker, never roll back. Optional "Processing..." indicator is acceptable.

---

## Screens (10)

1. Home — Deposit & Get hero banner
2. Promotions — tabbed list (All / Casino / Sports / Virtuals), Active Promos at top
3. Promo Details — Available (not opted-in)
4. Promo Details — Active (opted-in, with step tracker)
5. Promo Details — Completed
6. Promo Details — Ended
7. Deposit Page — amount input with eligibility signal
8. Deposit Confirmation toast
9. Casino Lobby — active Free Spins banner
10. Game entry — Free Spins ready (mocked)

Routes mirror the journey order — see `src/App.tsx` router.

---

## Tech stack

- **Vite + React 18 + TypeScript** — fast HMR, no SSR overhead
- **Tailwind CSS** + design tokens bound to BetKing CSS variables (see `src/styles/tokens.css`)
- **shadcn/ui** primitives for accordion, sheet, toast (only when they match a real Figma component)
- **react-router-dom** for the full journey
- **lucide-react** for icons
- No backend, no auth, no API calls, no real payments

---

## Design tokens

Authoritative source: `src/styles/tokens.css` (the Figma-generated BetKing light tokens file). Tailwind theme in `tailwind.config.ts` maps to these CSS variables — never use hex codes in components.

Semantic aliases for prototype use:
- `bg-brand-navy` → `--ui-primary-main` (#001041)
- `bg-brand-yellow` → `--ui-value-main` (#f1c72f)
- `bg-brand-blue` → `--ui-secondary-main` (#255dbd)
- `bg-brand-cyan` → `--ui-highlight-main` (#1affff)
- `text-emphasis` → `--ui-text-emphasis`
- `text-primary` → `--ui-text-primary` (87% navy)
- `text-secondary` → `--ui-text-secondary` (60% navy)
- `bg-surface` → `--ui-background-paper`
- `bg-app` → `--ui-background-default`
- `text-success` → `--ui-semantic-colours-success-main`
- `text-warning` → `--ui-semantic-colours-warning-main`
- `text-error` → `--ui-notification-main`

---

## Component naming (match Figma)

`PromoCard`, `PromoDetails`, `HowItWorksWizard`, `CriteriaTable`, `ProgressTracker`, `StickyCTA`, `DepositSignal`, `CasinoLobbyBanner`, `RewardsBadge`, `PoolIndicator`, `PersonalCounter`.

---

## Do NOT

- Use `localStorage` or `sessionStorage` — keep all state in React context.
- Build real auth, real APIs, real payments, real game logic.
- Write custom CSS files for components — Tailwind utilities only. Tokens live in `src/styles/tokens.css` and are referenced via Tailwind.
- Add multi-language. English only.
- Build the FTD welcome variant, bonus wallet rewards, or My Account voucher integration.
- Use "only 3 left!" scarcity copy or countdown banners on the pool — compliance risk in SA/ZM.
- Over-engineer with state machines, Redux, or Zustand. React Context + useState is sufficient for a prototype.
- Add animations beyond Tailwind's built-in transitions.
- Install heavy libraries — confirm with Naiara before adding anything beyond the listed stack.

---

## Design principles (constraints, not suggestions)

1. **Dual-counter clarity, no overload** — personal counter (actionable) gets more visual weight than pool counter (contextual). Pool must not dominate the card.
2. **Both surfaces, all states** — every state must work on both PromoCard and PromoDetails.
3. **Async-tolerant UI** — never contradictory, never flicker, never roll back. "Processing..." indicator allowed.
4. **Compliance-safe scarcity** — no manufactured urgency. Pool messaging stays neutral unless genuinely close to empty.
5. **Bridge the casino dependency** — Free Spins delivery works via Casino Lobby banner + Promo Details CTA today; My Account voucher comes later but should not block UI now.

---

## Progress visualization

Use a **horizontal step tracker**: 5 segments, filled = redemptions earned, empty = remaining. Label format: "X/5". Same pattern on both Card (compact) and Details (full). This is the only progress pattern this iteration.

---

## Deposit Page eligibility signal

Subtle inline signal that responds to the amount input:
- Amount < R200: `⚠ Deposit at least R200 to earn 100 Free Spins`
- R200–R2,000: `✓ This deposit will earn you 100 Free Spins`
- > R2,000: `✓ This deposit will earn you 100 Free Spins (max R2,000 qualifies)`
- No active opt-in: small inline link `Active promo available — Join now`
- Cap reached or pool exhausted: hidden

Informational nudge, never blocking.

---

## Out of scope (do not build)

- Reward toast/notification visual polish (assume it works)
- Real deposit flow end-to-end (use the mock)
- Actual casino game UI
- My Account voucher integration
- Final copy for pool indicator and scarcity
- Welcome Offer (FTD) variant
- Bonus wallet funds reward type
- Multi-language
- Refund / deposit reversal edge cases

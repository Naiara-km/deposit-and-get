# DECISIONS — locked defaults for the Day-1 build

These are the calls I made before the demo. Each one is reversible — flag any you want flipped before the stakeholder walkthrough.

## 1. PoolIndicator: one design, not three variants
- **What**: A single `PoolIndicator` component, not an A/B/C set.
- **Why**: `CLAUDE.md` is the authoritative brief and only specifies one neutral-messaging treatment. The "three variants to A/B" line in `README.md` next-steps is stale. Building three doubles the surface area we'd debate in the demo and dilutes the dual-counter validation.
- **Flip cost**: ~2h to branch into 3 variants behind the debug panel.

## 2. `isOptedIn` split into two derived flags
- **What**: `PromoContext` now exposes `isOptedIn` (user joined at any point) and `isActivelyEarning` (user can still progress — `active` or `active_deposit_pending` only).
- **Why**: The original `isOptedIn` flagged `ended_pool_exhausted` as opted-in, which would surface an *ended* promo in the Promotions "Active Promos" rail — wrong. Splitting lets the Active rail use `isActivelyEarning` while the Details page can still show a "your summary" view for users who joined an ended promo via `isOptedIn`.
- **Flip cost**: low — single context file.

## 3. Pool empties mid-progress → user keeps earned rewards
- **What**: If a user is on `active` (e.g., 2/5 redemptions) when the pool hits zero, they transition to `ended_pool_exhausted` with their earned rewards preserved. The Details screen shows the summary of what they got.
- **Why**: The brief is silent. User-friendly behavior is the safer demo default — easier for Growth/Marketing to defend than "we took back what they earned."
- **Demo handle**: Set Personal redemptions to 2 + State to `ended_pool_exhausted` in the debug panel to surface this case.

## 4. Low-pool threshold = 5%, copy = "Limited rewards left"
- **What**: `isPoolLow` triggers at <5% (was <5% in code already, but debug panel "Low" shortcut was 4% — both now at 5%). Copy: `Limited rewards left` (or similar neutral phrasing).
- **Why**: Compliance-safe scarcity. No numbers, no countdown, no "only X left." `CLAUDE.md` says "neutral unless genuinely close to empty" — 5% is the documented dial.
- **Flip cost**: trivial — single threshold + one string.

## 5. ZM market toggle swaps currency symbol AND numerics
- **What**: ZA shows R200 / R2,000. ZM shows K200 / K2,000. Same numerics, currency swap only. The mock and eligibility-signal copy both honor this via `currencySymbol`.
- **Why**: The market toggle exists in the debug panel — making it meaningful is more useful than decorative. Same numerics keeps the demo simple without a separate FX mock.
- **Flip cost**: low — only the displayed values change; `promo.minDeposit`/`maxDeposit` stay numeric.

## 6. `active_deposit_pending` driven primarily by the debug panel
- **What**: Stakeholders see the pending state by flipping the debug panel. The Deposit page's submit *also* triggers `active_deposit_pending` → `active` (redemptions+1) on a short timer, so a live walkthrough hits it organically too.
- **Why**: Debug-panel-first guarantees the state is demoable even if we don't want to walk through deposit. The Deposit wiring sells the async story when we do.
- **Flip cost**: zero — both paths coexist.

## 7. Brand: SuperSportBet global header, BetKing promo section
- **Update (2026-05-27):** Implemented the SuperSportBet global header + product switcher from Figma (node 3559-20966) on the Promotions page via `SiteHeader.tsx`. This resolves the earlier brand ambiguity — the global chrome is now SuperSportBet, while the "BetKing Promos" section label remains (matches the reference image, where BetKing is a section within the SuperSportBet shell).
- **Header tokens**: SuperSportBet chrome uses a separate `ssb` palette in `tailwind.config.ts` (light-on-dark: `ssb-fg #e3f1fd`, tints) — distinct from the BetKing body tokens. The navy backdrop `#001041` coincides with `brand-navy`.
- **Deviation from Figma**: the Figma is the Nigeria (NGN) build. The currency badge uses the prototype `currencySymbol` (R/K) and live-updates with the market toggle instead of hardcoding ₦; the balance figure (122,122.00) is kept as the Figma mock. Assets (`logo`, `cached`, `person` icons) downloaded to `public/figma/`.

---

## Out of scope for today, on purpose
- Real deposit flow validation (we have a mock + a toast)
- My Account voucher integration
- FTD welcome variant, bonus-wallet rewards
- Multi-language
- Refund/reversal edge cases
- shadcn primitives — built lightweight equivalents to avoid the install churn for a 1-day build

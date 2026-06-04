# Deposit & Get with Pool — Prototype

Standalone prototype validating the **Deposit & Get with Pool** mechanic for SuperSportBet (SA & ZM). Not production code — engineers will rebuild validated patterns inside the Kingmakers monorepo using the real design system.

See `CLAUDE.md` for the full brief, constraints, and mocked data. Open Claude Code in this folder and it will load that context automatically.

---

## Run it

```bash
npm install
npm run dev          # localhost:5173
npm run dev:host     # exposed on LAN — open on your phone
```

Build for deployment:

```bash
npm run build
npm run preview
```

Deploy to Vercel (fastest stakeholder share):

```bash
npx vercel
```

---

## How the prototype works

Open the app and you'll see a centered mobile frame (max-width 28rem). Click the **gear icon (bottom-right)** to open the debug panel, then flip:

- **Promo state** — Available / Pool exhausted / Active / Deposit pending / Completed / Ended (pool) / Ended (campaign)
- **Personal redemptions used** — 0 to 5
- **Pool remaining** — 0 to 5,000, with shortcut buttons for Full / Low (4%) / Empty
- **Market** — South Africa (ZAR) or Zambia (ZMW)

Components read from `PromoContext` so flipping the panel updates every screen consistently.

---

## Project structure

```
src/
  App.tsx                  # Router — 10 screen routes
  main.tsx                 # Entry, providers, BrowserRouter
  styles/
    tokens.css             # BetKing Figma-generated tokens (do not edit)
    globals.css            # Tailwind layers + app-frame
  mocks/
    spinsOfOlympus.ts      # Single source of truth for promo data
  context/
    PromoContext.tsx       # State for state/redemptions/pool/market
  components/
    AppHeader.tsx          # Sticky back-button header
    DebugPanel.tsx         # Demo controls (gear icon)
    StubScreen.tsx         # Placeholder for unbuilt sections
    # TODO — to be built:
    # PromoCard.tsx
    # ProgressTracker.tsx
    # HowItWorksWizard.tsx
    # CriteriaTable.tsx
    # PoolIndicator.tsx
    # PersonalCounter.tsx
    # StickyCTA.tsx
    # DepositSignal.tsx
    # CasinoLobbyBanner.tsx
  pages/
    Home.tsx
    Promotions.tsx
    PromoDetailsPage.tsx
    Deposit.tsx
    CasinoLobby.tsx
    Game.tsx
```

---

## Next steps (what to build first)

1. **`PromoCard`** with all 7 states — single component that reads `state` from context and renders accordingly. Place in `Promotions` page.
2. **`ProgressTracker`** — 5-segment horizontal bar driven by `redemptions` from context.
3. **`PoolIndicator`** — three variants to A/B with stakeholders (per the brief). Branch each variant.
4. **`HowItWorksWizard`** + **`CriteriaTable`** + **`FAQAccordion`** for the Details page.
5. **Toast** for deposit confirmation.

---

## Conventions

- Component names mirror Figma layer names (`PromoCard`, `StickyCTA`, etc.).
- All colors come from Tailwind theme bound to `tokens.css` — never use hex codes.
- Mobile-first. Desktop renders the same mobile frame centered.
- No `localStorage`, no real backend, no auth, no API calls.
- Tailwind utilities only — no component CSS files.

---

## Deploying for stakeholder review

```bash
npx vercel --prod
```

Send the resulting URL in Slack. They can open it on phone or desktop.

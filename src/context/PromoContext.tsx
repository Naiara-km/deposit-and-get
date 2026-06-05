import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SPINS_OF_OLYMPUS, MARKETS, type Market, type PromoMock } from "@/mocks/spinsOfOlympus";

/**
 * Lifecycle states for the Deposit & Get with Pool promo.
 * Every state must be reachable via the DebugPanel.
 * `active_deposit_pending` was removed per the Claude Design handoff (2026-05-29).
 */
export type PromoState =
  | "available"
  | "available_pool_exhausted"
  | "active"
  | "completed"
  | "ended_pool_exhausted"
  | "ended_campaign_closed";

export const PROMO_STATE_LABELS: Record<PromoState, string> = {
  available: "Available",
  available_pool_exhausted: "Available — pool full",
  active: "Active (opted-in)",
  completed: "Completed (user finished)",
  ended_pool_exhausted: "Ended — pool exhausted",
  ended_campaign_closed: "Ended — campaign closed",
};

/**
 * The Claude Design handoff defines 8 visual variants on top of the 6 lifecycle
 * states above. The extra variants (active-start / active / active-low) are
 * parameterized by `redemptions` and `isPoolLow`.
 */
export type CardVariant =
  | "available"
  | "available-full"
  | "active-start"
  | "active"
  | "active-low"
  | "ended-time"
  | "ended-pool"
  | "completed";

export const MAX_REDEMPTIONS_RANGE = { min: 1, max: 10 } as const;

interface PromoContextValue {
  promo: PromoMock;
  state: PromoState;
  setState: (s: PromoState) => void;
  redemptions: number; // personal redemptions used (0..maxRedemptionsPerUser)
  setRedemptions: (n: number) => void;
  /** Configure the max redemptions per user (1-10). Drives the donut ring,
   *  the "x{n}" chip on the headline, and clamps `redemptions` if needed. */
  setMaxRedemptions: (n: number) => void;
  poolRemaining: number; // pool redemptions remaining (0..poolTotal)
  setPoolRemaining: (n: number) => void;
  market: Market;
  setMarket: (m: Market) => void;
  currencySymbol: string;
  // derived
  redemptionsRemaining: number;
  isOptedIn: boolean; // user joined at any point (incl. completed / ended)
  isActivelyEarning: boolean; // user can still progress right now
  isPoolLow: boolean;
  // actions
  isJoining: boolean; // opt-in in flight (spinner)
  joinPromo: () => void;
  // debug — render the whole prototype in B&W (filter: grayscale(1))
  monochrome: boolean;
  setMonochrome: (b: boolean) => void;
  // Permanent opt-out: when true the promo is hidden from every surface
  // (Home banner, Promotions list, Active Promos). Any state change via
  // Debug clears the flag so reviewers don't dead-end after testing.
  hasOptedOut: boolean;
  optOut: () => void;
  resetOptOut: () => void;
}

const PromoContext = createContext<PromoContextValue | null>(null);

export function PromoProvider({ children }: { children: ReactNode }) {
  const promoBase = SPINS_OF_OLYMPUS;
  const [state, setStateRaw] = useState<PromoState>("available");
  const [redemptions, setRedemptionsRaw] = useState(0);
  const [maxRedemptions, setMaxRedemptionsRaw] = useState(
    promoBase.maxRedemptionsPerUser,
  );
  const [poolRemaining, setPoolRemaining] = useState(promoBase.poolTotal);
  const [market, setMarket] = useState<Market>("ZA");
  const [isJoining, setIsJoining] = useState(false);
  const [monochrome, setMonochrome] = useState(false);
  const [hasOptedOut, setHasOptedOut] = useState(false);

  /** Opt out of the promo permanently (until reset). Wipes progress and
   *  drops the user out of every promo surface. */
  function optOut() {
    setHasOptedOut(true);
    setRedemptionsRaw(0);
    setStateRaw("available");
  }
  function resetOptOut() {
    setHasOptedOut(false);
  }

  // Apply / remove grayscale on <html> so the whole prototype switches
  // between full colour and B&W. Used from the Debug panel.
  useEffect(() => {
    const root = document.documentElement;
    root.style.transition = "filter 0.25s ease";
    root.style.filter = monochrome ? "grayscale(1)" : "";
    return () => {
      root.style.filter = "";
    };
  }, [monochrome]);

  /** Clamp redemptions so it never exceeds the current max. */
  function setRedemptions(n: number) {
    setRedemptionsRaw(Math.max(0, Math.min(maxRedemptions, n)));
  }

  /**
   * Smart wrapper around setState — entering `completed` auto-snaps redemptions
   * to max so the visual is consistent (donut ring shows ✓, earned spins = full).
   *
   * Any state change from the Debug panel also clears the hasOptedOut flag so
   * reviewers can re-enter the promo from any state without restarting.
   */
  function setState(next: PromoState) {
    setStateRaw(next);
    if (next === "completed") {
      setRedemptionsRaw(maxRedemptions);
    }
    if (hasOptedOut) setHasOptedOut(false);
  }

  /**
   * Live-configurable max redemptions. When the user lowers max below the
   * current `redemptions`, clamp it down. When in `completed`, re-snap so
   * the visual ("all N done") stays truthful.
   *
   * Also: when dropping to max=1 the "pool" concept disappears (a single-
   * redemption promo is a one-shot per user, not a campaign with a shared
   * pool). If the state is one of the pool-only variants, migrate it to its
   * non-pool equivalent so we never sit in an invalid combo.
   */
  function setMaxRedemptions(n: number) {
    const { min, max } = MAX_REDEMPTIONS_RANGE;
    const clamped = Math.max(min, Math.min(max, n));
    setMaxRedemptionsRaw(clamped);
    if (state === "completed") {
      setRedemptionsRaw(clamped);
    } else if (redemptions > clamped) {
      setRedemptionsRaw(clamped);
    }
    if (clamped === 1) {
      if (state === "available_pool_exhausted") setStateRaw("available");
      else if (state === "ended_pool_exhausted")
        setStateRaw("ended_campaign_closed");
    }
  }

  function joinPromo() {
    if (isJoining) return;
    setIsJoining(true);
    window.setTimeout(() => {
      // Fresh opt-in: always start the journey at 0/N redemptions, regardless
      // of whatever the Debug panel had configured. Keeps the prototype's
      // JOIN PROMO → "0/N Deposits" flow consistent for reviewers.
      setStateRaw("active");
      setRedemptionsRaw(0);
      setIsJoining(false);
    }, 900);
  }

  /**
   * Wrapped promo with the configurable `maxRedemptionsPerUser`. All consumers
   * read `promo.maxRedemptionsPerUser` (already) — the only thing they need
   * is for that value to be live.
   */
  const promo = useMemo<PromoMock>(
    () => ({ ...promoBase, maxRedemptionsPerUser: maxRedemptions }),
    [promoBase, maxRedemptions],
  );

  const value = useMemo<PromoContextValue>(() => {
    const redemptionsRemaining = maxRedemptions - redemptions;
    const isOptedIn =
      state === "active" ||
      state === "completed" ||
      state === "ended_pool_exhausted" ||
      state === "ended_campaign_closed";
    const isActivelyEarning = state === "active";
    // "Almost gone" per the Claude Design handoff — absolute <500 threshold.
    const isPoolLow = poolRemaining > 0 && poolRemaining < 500;

    return {
      promo,
      state,
      setState,
      redemptions,
      setRedemptions,
      setMaxRedemptions,
      poolRemaining,
      setPoolRemaining,
      market,
      setMarket,
      currencySymbol: MARKETS[market].symbol,
      redemptionsRemaining,
      isOptedIn,
      isActivelyEarning,
      isPoolLow,
      isJoining,
      joinPromo,
      monochrome,
      setMonochrome,
      hasOptedOut,
      optOut,
      resetOptOut,
    };
  }, [
    promo,
    state,
    redemptions,
    maxRedemptions,
    poolRemaining,
    market,
    isJoining,
    monochrome,
    hasOptedOut,
  ]);

  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>;
}

export function usePromo() {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error("usePromo must be used within PromoProvider");
  return ctx;
}

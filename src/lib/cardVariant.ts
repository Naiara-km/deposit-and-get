import type { CardVariant, PromoState } from "@/context/PromoContext";

/**
 * Map the 6 lifecycle states + (redemptions, isPoolLow) onto the 8 visual
 * variants from the Claude Design handoff.
 *
 *   active + redemptions === 0          → active-start
 *   active + redemptions > 0 + low pool → active-low
 *   active + redemptions > 0            → active
 */
export function cardVariant(
  state: PromoState,
  redemptions: number,
  isPoolLow: boolean,
): CardVariant {
  switch (state) {
    case "available":
      return "available";
    case "available_pool_exhausted":
      return "available-full";
    case "active":
      if (redemptions === 0) return "active-start";
      if (isPoolLow) return "active-low";
      return "active";
    case "completed":
      return "completed";
    case "ended_pool_exhausted":
      return "ended-pool";
    case "ended_campaign_closed":
      return "ended-time";
  }
}

export function isActiveVariant(v: CardVariant): boolean {
  return v === "active-start" || v === "active" || v === "active-low";
}

export function isEndedVariant(v: CardVariant): boolean {
  return v === "ended-time" || v === "ended-pool";
}

export function isAvailableVariant(v: CardVariant): boolean {
  return v === "available" || v === "available-full";
}

/**
 * "Engaged" — the user already knows the mechanic because they've opted in
 * at some point (active right now, finished, or the campaign closed on them).
 * Surfaces use this to decide whether to collapse repeating reference content
 * (e.g. the Promo details + How it works accordion on the Details page).
 *
 * Excludes `ended-pool` for now — the pool-exhausted state has its own
 * celebratory "Bonus Spins Earned" treatment and we may want to handle it
 * separately. Add to this union if the same accordion behaviour is wanted.
 */
export function isEngagedVariant(v: CardVariant): boolean {
  return isActiveVariant(v) || v === "completed" || v === "ended-time";
}

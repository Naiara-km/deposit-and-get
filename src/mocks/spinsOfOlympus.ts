/**
 * Mocked promo: Spins of Olympus
 * Single source of truth for the prototype. Do not duplicate these values.
 */

export type Market = "ZA" | "ZM";

export const MARKETS: Record<Market, { label: string; currency: string; symbol: string }> = {
  ZA: { label: "South Africa", currency: "ZAR", symbol: "R" },
  ZM: { label: "Zambia", currency: "ZMW", symbol: "K" },
};

export const SPINS_OF_OLYMPUS = {
  id: "spins-of-olympus",
  name: "Spins of Olympus",
  subtitle: "Deposit R2,000",
  reward: "100 Free Spins",
  rewardLabel: "R100 FREE SPINS", // headline copy per handoff
  rewardCount: 100,
  rewardUnitValue: 1,
  minDeposit: 2000,
  maxDeposit: 4000,
  maxRedemptionsPerUser: 5,
  poolTotal: 5000,
  campaignDays: 14,
  campaignWindowLabel: "24th July - 10th August 2026", // per handoff info row
  wageringRequirement: "1x deposit",
  spinExpiryDays: 7,
  eligibleGame: {
    name: "Gates of Olympus Super Scatter",
    provider: "Pragmatic Play",
    thumbnail: "/games/gates-of-olympus.png", // mocked
  },
  eligiblePaymentMethods: ["EFT", "Card", "Instant EFT"],
  exclusions: "If deposit is refunded, reward will be removed",
  category: "casino" as const,
  // Campaign end is computed at module load — 14 days + 9 hours from now —
  // so the available-state footer reads "Ends on 14 days 9h" by default
  // (per Figma 78:5744). The countdown then ticks down naturally while the
  // prototype is open.
  campaignEndsAt: new Date(
    Date.now() + 14 * 86_400_000 + 9 * 3_600_000,
  ),
};

export type PromoMock = typeof SPINS_OF_OLYMPUS;

import { Gift } from "lucide-react";
import { usePromo } from "@/context/PromoContext";

interface DepositSignalProps {
  amount: number;
  /** When provided, every active-state signal renders a clickable
   *  "Promo details" link that opens the PromoBottomSheet. */
  onShowPromoDetails?: () => void;
}

/**
 * Inline eligibility nudge below the Deposit-page amount input.
 *
 * Only renders for opted-in / actively-earning states. The available-state
 * "Join now" prompt has moved up to the top-of-form PromoAwarenessBanner —
 * we no longer surface two awareness signals at once.
 *
 * Branches:
 *   amount = 0   + active → "Deposit & Get active. This deposit will earn 100 Bonus Spins"
 *   amount < min + active → warning ("deposit at least Rmin to earn N spins")
 *   min..max     + active → success ("this deposit will earn you N spins")
 *   amount > max + active → success (max-cap note hidden for now — we'll
 *                            revisit messaging around the cap)
 *   cap reached / pool exhausted / ended / completed / available → hidden
 *
 * Every visible branch shows a "Promo details" trailing link when
 * `onShowPromoDetails` is provided, so the user can re-open the bottom
 * sheet at any point during the deposit.
 */
export function DepositSignal({ amount, onShowPromoDetails }: DepositSignalProps) {
  const {
    promo,
    state,
    currencySymbol,
    isActivelyEarning,
    redemptionsRemaining,
  } = usePromo();

  // Hidden states — nothing to nudge about.
  const capReached = isActivelyEarning && redemptionsRemaining <= 0;
  if (
    !isActivelyEarning ||
    capReached ||
    state === "available" ||
    state === "available_pool_exhausted" ||
    state === "completed" ||
    state === "ended_pool_exhausted" ||
    state === "ended_campaign_closed"
  ) {
    return null;
  }

  // Opted in / actively earning.
  if (amount <= 0) {
    return (
      <Signal tone="success" icon={<Gift size={16} />}>
        Qualifying {currencySymbol}
        {promo.minDeposit.toLocaleString()} deposits will earn you{" "}
        <strong>{promo.rewardCount} Bonus Spins</strong>.
        <DetailsLink onClick={onShowPromoDetails} />
      </Signal>
    );
  }
  if (amount < promo.minDeposit) {
    return (
      <Signal tone="warning" icon="⚠">
        Deposit at least {currencySymbol}
        {promo.minDeposit.toLocaleString()} to earn {promo.rewardCount} Bonus
        Spins.
        <DetailsLink onClick={onShowPromoDetails} />
      </Signal>
    );
  }
  // amount > promo.maxDeposit branch intentionally falls through to the
  // default in-band success copy — the "(max Rxxxx qualifies)" suffix is
  // hidden until we revisit how to surface the cap.
  return (
    <Signal tone="success" icon="✓">
      This deposit will earn you {promo.rewardCount} Bonus Spins.
      <DetailsLink onClick={onShowPromoDetails} />
    </Signal>
  );
}

function DetailsLink({ onClick }: { onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <>
      {" "}
      <button
        type="button"
        onClick={onClick}
        className="text-brand-blue underline underline-offset-2"
      >
        Promo details
      </button>
    </>
  );
}

function Signal({
  tone,
  icon,
  children,
}: {
  tone: "success" | "warning";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const cls =
    tone === "success"
      ? "border-success/30 bg-success/10 text-success"
      : "border-warning/40 bg-warning/10 text-warning";
  return (
    <div
      role="status"
      className={`mt-3 flex items-start gap-2 rounded-card border px-3 py-2 text-sm motion-safe:animate-[fadeInUp_220ms_ease-out] ${cls}`}
    >
      <span aria-hidden className="flex shrink-0 items-center font-bold">
        {icon}
      </span>
      <span className="text-text-primary">{children}</span>
    </div>
  );
}

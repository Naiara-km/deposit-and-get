import { Link } from "react-router-dom";
import { Gift } from "lucide-react";
import { usePromo } from "@/context/PromoContext";

interface DepositSignalProps {
  amount: number;
}

/**
 * Inline eligibility nudge on the Deposit page. Informational only — never blocking.
 *
 * Branches (per CLAUDE.md + handoff iteration 2026-05-29):
 *   amount = 0   + actively earning → "You have a Deposit & Get promo active"
 *   amount = 0   + state available  → "Active promo available — Join now"
 *   amount < min + actively earning → warning ("deposit at least Rmin to earn N spins")
 *   min..max     + actively earning → success ("this deposit will earn you N spins")
 *   amount > max + actively earning → success with "(max Rmax qualifies)" note
 *   amount > 0   + state available  → "Active promo available — Join now"
 *   cap reached / pool exhausted / ended / completed → hidden
 */
export function DepositSignal({ amount }: DepositSignalProps) {
  const {
    promo,
    state,
    currencySymbol,
    isActivelyEarning,
    redemptionsRemaining,
  } = usePromo();

  // Hidden states (terminal / cap)
  const capReached = isActivelyEarning && redemptionsRemaining <= 0;
  if (
    capReached ||
    state === "available_pool_exhausted" ||
    state === "completed" ||
    state === "ended_pool_exhausted" ||
    state === "ended_campaign_closed"
  ) {
    return null;
  }

  // Not opted in yet — same prompt regardless of amount.
  if (state === "available") {
    return (
      <Signal tone="info" icon="→">
        Active promo available —{" "}
        <Link to={`/promotions/${promo.id}`} className="underline">
          Join now
        </Link>
      </Signal>
    );
  }

  // Opted in / actively earning.
  if (amount <= 0) {
    return (
      <Signal tone="info" icon={<Gift size={16} className="text-brand-blue" />}>
        You have a <strong>Deposit &amp; Get</strong> promo active
      </Signal>
    );
  }
  if (amount < promo.minDeposit) {
    return (
      <Signal tone="warning" icon="⚠">
        Deposit at least {currencySymbol}
        {promo.minDeposit.toLocaleString()} to earn {promo.rewardCount} Free Spins
      </Signal>
    );
  }
  if (amount > promo.maxDeposit) {
    return (
      <Signal tone="success" icon="✓">
        This deposit will earn you {promo.rewardCount} Free Spins (max{" "}
        {currencySymbol}
        {promo.maxDeposit.toLocaleString()} qualifies)
      </Signal>
    );
  }
  return (
    <Signal tone="success" icon="✓">
      This deposit will earn you {promo.rewardCount} Free Spins
    </Signal>
  );
}

function Signal({
  tone,
  icon,
  children,
}: {
  tone: "success" | "warning" | "info";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const cls =
    tone === "success"
      ? "border-success/30 bg-success/10 text-success"
      : tone === "warning"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-brand-blue/30 bg-brand-blue/10 text-brand-blue";
  return (
    <div
      role="status"
      className={`mt-3 flex items-start gap-2 rounded-card border px-3 py-2 text-sm ${cls}`}
    >
      <span aria-hidden className="flex shrink-0 items-center font-bold">
        {icon}
      </span>
      <span className="text-text-primary">{children}</span>
    </div>
  );
}

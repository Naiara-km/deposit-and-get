import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { usePromo } from "@/context/PromoContext";

/**
 * Visible in the Casino lobby when the user has earned Free Spins on this promo.
 * Bridges the casino dependency mentioned in CLAUDE.md design principle #5.
 */
export function CasinoLobbyBanner() {
  const { promo, redemptions, isOptedIn } = usePromo();

  // Free Spins live on the user's account from the first redemption,
  // and remain playable even after the promo ends.
  if (!isOptedIn || redemptions <= 0) return null;

  const totalSpins = redemptions * promo.rewardCount;
  const gameSlug = promo.eligibleGame.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/casino/${gameSlug}`}
      className="flex items-center justify-between gap-3 bg-brand-yellow px-4 py-3 text-brand-navy hover:bg-brand-yellow-dark"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-navy text-brand-yellow">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide">
            Free Spins ready
          </p>
          <p className="text-sm font-semibold">
            {totalSpins.toLocaleString()} on {promo.eligibleGame.name}
          </p>
        </div>
      </div>
      <span aria-hidden className="text-lg font-bold">
        →
      </span>
    </Link>
  );
}

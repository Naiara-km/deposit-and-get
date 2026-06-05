import { Link } from "react-router-dom";
import { usePromo } from "@/context/PromoContext";
import { asset } from "@/lib/asset";

/**
 * SuperSportBet header — single-row AppBar.
 * Figma: 46:3473 (latest, supersedes the earlier 3559-20966 design which
 * also included a product-switcher row beneath the AppBar).
 *
 * Shared across Home, Promotions list, and Promo Details. Sticky top, navy
 * background, with logo + balance pill + account icon.
 *
 * The currency badge uses the prototype `currencySymbol` (R / K) so the
 * debug-panel market toggle keeps the header live.
 */

const MOCK_BALANCE = "1,000";

export function SiteHeader() {
  const { currencySymbol } = usePromo();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-ssb-bg py-1 pl-5 pr-3 shadow-md">
      {/* Logo */}
      <Link to="/" aria-label="SuperSportBet home" className="px-1">
        <span className="block h-8 w-[140px]">
          <img
            src={asset("figma/supersportbet-logo.svg")}
            alt="SuperSportBet"
            className="h-full w-full object-contain object-left"
          />
        </span>
      </Link>

      {/* Right-hand side */}
      <div className="flex items-center gap-1">
        {/* Balance pill — clicking it takes the user to the Deposit page. */}
        <Link
          to="/deposit"
          aria-label="Deposit"
          className="flex items-center overflow-hidden rounded-full bg-ssb-tint-12 transition-colors hover:bg-ssb-tint-24"
        >
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ssb-fg text-[11px] font-bold leading-none text-ssb-bg">
            {currencySymbol}
          </span>
          <span className="flex items-center gap-1 px-1">
            <span className="whitespace-nowrap text-[11px] leading-[14px] text-ssb-fg">
              {MOCK_BALANCE}
            </span>
            <img
              src={asset("figma/icon-cached.svg")}
              alt=""
              aria-hidden
              className="h-3.5 w-3.5"
            />
          </span>
        </Link>

        {/* Account icon */}
        <button
          type="button"
          aria-label="Account"
          className="grid place-items-center rounded-full p-3 hover:bg-ssb-tint-12"
        >
          <img
            src={asset("figma/icon-person.svg")}
            alt=""
            aria-hidden
            className="size-6"
          />
        </button>
      </div>
    </header>
  );
}

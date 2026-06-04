import type { ReactNode } from "react";

/**
 * Site footer — Claude Design handoff (detail-page.jsx SiteFooter).
 * SuperSportBet wordmark + socials + link columns + payment-logo placeholders
 * + 18+ + responsible-gaming + KingMakers attribution.
 */
export function SiteFooter() {
  return (
    <footer className="bg-dg-lavender px-[18px] pt-7">
      <div className="flex justify-center">
        <Logo dark />
      </div>

      <div className="my-5 flex justify-center gap-3">
        {SOCIAL_PATHS.map((d, i) => (
          <Social key={i} d={d} />
        ))}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-y-1.5 gap-x-4">
        {COLS_TOP.map((label) => (
          <FLink key={label}>{label}</FLink>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-y-1.5 gap-x-4">
        {COLS_HELP.map((label) => (
          <FLink key={label}>{label}</FLink>
        ))}
      </div>

      {/* Payment / partner placeholders */}
      <div className="flex flex-wrap justify-center gap-2 border-t border-[#DAD6EA] py-4">
        {PARTNER_COLORS.map((c, i) => (
          <span
            key={i}
            className="h-[22px] w-[34px] rounded-[4px] opacity-85"
            style={{ background: c }}
            aria-hidden
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2.5 py-2">
        <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-dg-navy text-[10px] font-extrabold text-dg-navy">
          18+
        </span>
        <span className="text-[13px] font-bold text-dg-navy">
          Play Responsibly
        </span>
      </div>
      <div className="px-2 pb-3.5 text-center text-[11px] leading-[1.5] text-dg-ink-sub">
        Discover more about our responsible gaming initiatives.
      </div>
      <div className="border-t border-[#DAD6EA] px-2 py-3.5 text-center text-[10.5px] leading-[1.5] text-dg-ink-sub">
        © 2024 SV Gaming Limited T/A BetKing RC 1419108. All Rights Reserved by
        SV Gaming Limited T/A BetKing.
      </div>
      <div className="flex items-center justify-center gap-1.5 pb-5 pt-1 text-[11px] text-dg-ink-sub">
        Powered by <b className="text-dg-ink-dark">KingMakers</b>
      </div>
    </footer>
  );
}

const COLS_TOP = [
  "Sports",
  "Jackpot Bets",
  "Live Sports",
  "App",
  "Virtual",
  "Blog",
  "Casino",
  "Promotions",
];

const COLS_HELP = [
  "My Account",
  "About",
  "Contact Us",
  "Search",
  "Help",
  "Become an Agent",
  "Casino Help",
  "Affiliates",
  "FAQs",
  "Feedback",
  "Casino Rules",
  "Terms & Conditions",
];

const SOCIAL_PATHS = [
  "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  "M18 2h3l-7 8 8 12h-6l-5-7-5 7H2l8-11L2 2h6l4 6z",
  "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zm3 15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z",
  "M23 7a3 3 0 0 0-2-2c-2-.5-9-.5-9-.5s-7 0-9 .5a3 3 0 0 0-2 2 31 31 0 0 0 0 10 3 3 0 0 0 2 2c2 .5 9 .5 9 .5s7 0 9-.5a3 3 0 0 0 2-2 31 31 0 0 0 0-10zM10 15V9l5 3z",
  "M16 2c.3 2.5 1.8 4.2 4 4.5v3c-1.5 0-2.9-.5-4-1.3V15a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V2z",
];

const PARTNER_COLORS = [
  "#E94B3C",
  "#F5A623",
  "#2E7D32",
  "#1565C0",
  "#7B1FA2",
  "#00897B",
];

function Logo({ dark }: { dark?: boolean }) {
  return (
    <span
      className={`text-xl font-extrabold italic tracking-[-0.02em] ${
        dark ? "text-dg-navy" : "text-white"
      }`}
    >
      SuperSport<span className="text-dg-gold">BET</span>
    </span>
  );
}

function Social({ d }: { d: string }) {
  return (
    <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(20,20,60,0.1)]">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#161C7A" aria-hidden>
        <path d={d} />
      </svg>
    </span>
  );
}

function FLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="block py-1 text-[13px] text-[#3A3A52] no-underline"
    >
      {children}
    </a>
  );
}

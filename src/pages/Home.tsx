import { Link } from "react-router-dom";
import {
  Bookmark,
  ChevronRight,
  Plane,
  Radio,
  Trophy,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { usePromo, type CardVariant } from "@/context/PromoContext";
import {
  cardVariant,
  isActiveVariant,
  isEndedVariant,
} from "@/lib/cardVariant";
import { asset } from "@/lib/asset";

/**
 * Home page — SuperSportBet sportsbook landing (Figma node 44:23241).
 *
 * Replaces the prior stub. The Banner Carousel's center banner is the live
 * Deposit & Get promo entry: tapping it routes to /promotions/:promoId.
 * The rest (Quicklinks, Live Now, Boosted) uses static mock data per the
 * Figma — visual context for the promo, not a real sportsbook.
 */
export function Home() {
  return (
    <main className="bg-dg-lavender pb-10 text-dg-ink-dark">
      <SiteHeader />
      <ProductSwitcher />
      <BannerCarousel />
      <CategoryCarousel />
      <Quicklinks />
      <LiveNowWidget />
      <BoostedWidget />
    </main>
  );
}

/* ============================================================ Banner    */

function BannerCarousel() {
  // Deposit & Get sits first so it's the primary visible entry. The two
  // placeholder banners scroll into view on swipe — they only exist for
  // visual context per the Figma carousel.
  return (
    <section className="bg-dg-navy py-1.5">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <DepositGetBanner />
        <PlaceholderBanner color="from-[#3aa6f0] to-[#1c6cb3]" />
        <PlaceholderBanner color="from-[#ff7a59] to-[#c44a30]" />
      </div>
    </section>
  );
}

/**
 * DepositGetBanner — the live promo entry on the Home carousel. Reflects
 * the current promo state with a top-right pill + variant-specific content
 * so the banner stays in sync as the user opts in / progresses / finishes.
 */
function DepositGetBanner() {
  const { promo, currencySymbol, state, redemptions, isPoolLow } = usePromo();
  const variant = cardVariant(state, redemptions, isPoolLow);
  const isEnded = isEndedVariant(variant);

  return (
    <Link
      to={`/promotions/${promo.id}`}
      aria-label={`Open Deposit & Get promo — ${state}`}
      className="relative h-[100px] w-[320px] shrink-0 snap-center overflow-hidden rounded-[14px] shadow-[0_6px_18px_rgba(8,10,50,0.25)]"
    >
      <div
        aria-hidden
        className={`absolute inset-0 bg-cover bg-center ${isEnded ? "[filter:grayscale(0.6)]" : ""}`}
        style={{ backgroundImage: `url("${asset("figma/bg-available.png")}")` }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(18,22,108,0.92) 0%, rgba(18,22,108,0.66) 55%, rgba(18,22,108,0.20) 100%)",
        }}
      />

      {/* Top-right state pill */}
      <BannerBadge variant={variant} endsAt={promo.campaignEndsAt} />

      <div className="relative h-full px-4 py-3.5">
        <BannerContent
          variant={variant}
          rewardCount={promo.rewardCount}
          max={promo.maxRedemptionsPerUser}
          redemptions={redemptions}
          minDeposit={promo.minDeposit}
          currencySymbol={currencySymbol}
        />
      </div>
    </Link>
  );
}

function BannerBadge({
  variant,
  endsAt,
}: {
  variant: CardVariant;
  endsAt: Date;
}) {
  // White-pill states (ACTIVE / COMPLETED)
  if (
    variant === "active" ||
    variant === "active-start" ||
    variant === "active-low"
  ) {
    return <Pill bg="bg-white" text="text-dg-card">ACTIVE</Pill>;
  }
  if (variant === "completed") {
    return <Pill bg="bg-white" text="text-dg-card">COMPLETED</Pill>;
  }
  // Dark-pill states (PROMO FULL / POOL CLOSED / ENDED ON X)
  if (variant === "available-full") {
    return <Pill bg="bg-[#0E1466]" text="text-white">PROMO FULL</Pill>;
  }
  if (variant === "ended-pool") {
    return <Pill bg="bg-[#0E1466]" text="text-white">POOL CLOSED</Pill>;
  }
  if (variant === "ended-time") {
    return (
      <Pill bg="bg-[#0E1466]" text="text-white">
        ENDED ON{" "}
        {endsAt
          .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          .toUpperCase()}
      </Pill>
    );
  }
  return null; // available has no pill
}

function Pill({
  bg,
  text,
  children,
}: {
  bg: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`absolute right-2.5 top-2.5 z-[2] whitespace-nowrap rounded-[5px] ${bg} px-[7px] py-[3px] text-[9px] font-extrabold uppercase tracking-[0.04em] ${text}`}
      style={{ boxShadow: "0 2px 6px rgba(8,10,50,0.25)" }}
    >
      {children}
    </span>
  );
}

function BannerContent({
  variant,
  rewardCount,
  max,
  redemptions,
  minDeposit,
  currencySymbol,
}: {
  variant: CardVariant;
  rewardCount: number;
  max: number;
  redemptions: number;
  minDeposit: number;
  currencySymbol: string;
}) {
  const totalSpins = rewardCount * max;
  const earned = redemptions * rewardCount;
  const isActive = isActiveVariant(variant);
  const isEnded = isEndedVariant(variant);
  const isCompleted = variant === "completed";

  // ── Active states: show progress (earned / total + deposits)
  if (isActive) {
    return (
      <>
        <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
          Earned Spins
        </div>
        <div className="mt-0.5 flex items-baseline gap-1 leading-none">
          <span
            className="text-[26px] font-extrabold text-dg-gold tabular-nums"
            style={{ textShadow: "0 2px 8px rgba(8,10,50,0.5)" }}
          >
            {earned}
          </span>
          <span className="text-[15px] font-semibold text-white/65 tabular-nums">
            /{totalSpins}
          </span>
        </div>
        <div className="mt-1 text-[11px] font-semibold text-white/85 tabular-nums">
          {redemptions}/{max} Deposits of {currencySymbol}
          {minDeposit.toLocaleString()}
        </div>
      </>
    );
  }

  // ── Completed: celebratory
  if (isCompleted) {
    return (
      <>
        <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
          You earned
        </div>
        <div
          className="mt-0.5 text-[26px] font-extrabold uppercase leading-none text-dg-gold tabular-nums"
          style={{ textShadow: "0 2px 8px rgba(8,10,50,0.5)" }}
        >
          {earned} Bonus Spins
        </div>
        <div className="mt-1 text-[11px] font-semibold text-white/85 tabular-nums">
          {max}/{max} Deposits done!
        </div>
      </>
    );
  }

  // ── Ended-* — frozen at last value, muted treatment
  if (isEnded) {
    return (
      <>
        <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/65">
          Promo Ended
        </div>
        <div
          className="mt-0.5 text-[22px] font-extrabold uppercase leading-none text-white/90 tabular-nums"
          style={{ textShadow: "0 2px 8px rgba(8,10,50,0.5)" }}
        >
          You earned {earned}
        </div>
        <div className="mt-1 text-[11px] font-semibold text-white/65 tabular-nums">
          Bonus Spins · tap to see details
        </div>
      </>
    );
  }

  // ── Available / Available-full: current teaser copy
  return (
    <>
      <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
        Deposit &amp; Get
      </div>
      <div
        className="mt-0.5 text-2xl font-extrabold uppercase leading-none text-dg-gold"
        style={{ textShadow: "0 2px 8px rgba(8,10,50,0.5)" }}
      >
        {totalSpins} Bonus Spins
      </div>
      <div className="mt-1 text-[11px] font-medium text-white/75">
        {max} {max === 1 ? "deposit" : "deposits"} of {currencySymbol}
        {minDeposit.toLocaleString()} to win
      </div>
    </>
  );
}

function PlaceholderBanner({ color }: { color: string }) {
  return (
    <div
      className={`relative h-[100px] w-[320px] shrink-0 snap-center overflow-hidden rounded-[14px] bg-gradient-to-r ${color} shadow-[0_6px_18px_rgba(8,10,50,0.25)]`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.25),transparent_55%)]" />
      <div className="relative h-full px-4 py-3.5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
          Bet &amp; Get
        </div>
        <div
          className="mt-1 text-2xl font-extrabold leading-none text-white"
          style={{ textShadow: "0 2px 8px rgba(8,10,50,0.4)" }}
        >
          Over ₦600K
        </div>
        <div className="mt-1 text-[12px] text-white/85">In Free Bets</div>
      </div>
    </div>
  );
}

/* ============================================================ Category  */

const CATEGORIES: Array<{ label: string; icon: JSX.Element; active?: boolean; dot?: boolean }> = [
  { label: "Live", icon: <Radio size={22} className="text-dg-coral" />, active: true, dot: true },
  { label: "Football", icon: <FootballGlyph />, },
  { label: "Today", icon: <CalendarGlyph /> },
  { label: "Code Zone", icon: <FlagGlyph /> },
  { label: "Aviator", icon: <Plane size={22} className="text-white" /> },
  { label: "Kings", icon: <CrownGlyph /> },
  { label: "Casino", icon: <ChipGlyph /> },
  { label: "Virtuals", icon: <CycleGlyph /> },
];

function CategoryCarousel() {
  return (
    <nav
      aria-label="Categories"
      className="flex gap-3 overflow-x-auto bg-dg-navy px-3 pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {CATEGORIES.map((c) => (
        <div
          key={c.label}
          className="flex w-[56px] shrink-0 flex-col items-center gap-1.5"
        >
          <span
            className={`relative grid h-10 w-10 place-items-center rounded-full ${
              c.active
                ? "border-2 border-dg-coral bg-white/[0.06]"
                : "bg-white/[0.06]"
            }`}
          >
            {c.icon}
            {c.dot && (
              <span
                aria-hidden
                className="absolute right-1 top-1 inline-block h-1.5 w-1.5 rounded-full bg-dg-coral"
              />
            )}
          </span>
          <span
            className={`text-[10px] font-semibold ${
              c.active ? "text-dg-coral" : "text-white/85"
            }`}
          >
            {c.label}
          </span>
        </div>
      ))}
    </nav>
  );
}

/* ============================================================ Quicklinks */

function Quicklinks() {
  const items = [
    { label: "Today's Football", icon: <FootballGlyph size={20} dark /> },
    { label: "Top Competitions", icon: <Trophy size={20} className="text-dg-card" /> },
    { label: "Premier League", icon: <FlagSquare /> },
    { label: "NBA Playoffs", icon: <BasketballGlyph /> },
  ];
  return (
    <section className="bg-dg-lavender">
      <h2 className="px-4 pt-5 text-[18px] font-extrabold text-dg-card">
        Quicklinks
      </h2>
      <div className="grid grid-cols-2 gap-3 px-3 pb-2 pt-3">
        {items.map((it) => (
          <button
            key={it.label}
            type="button"
            className="flex items-center gap-2.5 rounded-[10px] bg-white px-3 py-3 text-left text-[14px] font-semibold text-dg-ink-dark shadow-[0_1px_2px_rgba(20,20,60,0.06)]"
          >
            <span className="inline-flex shrink-0">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ============================================================ Live Now  */

const MARKET_TABS = ["1X2", "Next Goal", "Total Goals", "GG/NG"] as const;

function LiveNowWidget() {
  return (
    <section className="bg-dg-lavender">
      <header className="flex items-center justify-between px-4 pb-2 pt-5">
        <h2 className="flex items-center gap-2 text-[18px] font-extrabold text-dg-card">
          <LiveBadge /> Live Now
        </h2>
        <div className="flex gap-2 text-dg-ink-sub">
          <SportTabIcon active={true} kind="ball" />
          <SportTabIcon kind="basket" />
          <SportTabIcon kind="globe" />
          <SportTabIcon kind="globe2" />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MARKET_TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            className={`whitespace-nowrap rounded-pill px-4 py-1.5 text-[13px] font-bold ${
              i === 0
                ? "bg-dg-card text-white"
                : "bg-white text-dg-ink-dark shadow-[0_1px_2px_rgba(20,20,60,0.06)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white">
        <div className="flex items-center justify-between border-b border-[#ECEAF4] px-3 py-2 text-[12px] font-bold text-dg-ink-dark">
          <span>Football</span>
          <div className="flex gap-2 text-dg-ink-sub">
            <span className="grid w-[42px] place-items-center">1</span>
            <span className="grid w-[42px] place-items-center">X</span>
            <span className="grid w-[42px] place-items-center">2</span>
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <EventRow key={i} />
        ))}
        <Link
          to="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center justify-end gap-1 px-4 py-3 text-[13px] font-bold text-dg-card"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function EventRow() {
  return (
    <div className="px-3 py-2.5">
      <div className="flex items-center gap-2 text-[11px] text-dg-ink-sub">
        <span className="grid h-[18px] place-items-center rounded-[3px] bg-dg-coral px-1 text-[10px] font-bold text-white">
          78'
        </span>
        <span className="text-dg-ink-sub">England · Premier League</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-[13px] font-semibold text-dg-ink-dark">
            <span>Wolverhampton</span>
            <span className="font-bold text-dg-coral">2</span>
          </div>
          <div className="mt-0.5 flex justify-between text-[13px] font-semibold text-dg-ink-dark">
            <span>Leicester</span>
            <span className="font-bold text-dg-coral">0</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <OddsButton value="1.22" />
          <OddsButton value="1.22" />
          <OddsButton value="1.22" />
        </div>
      </div>
    </div>
  );
}

function OddsButton({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="grid h-9 w-[42px] place-items-center rounded-[6px] bg-dg-lavender text-[13px] font-bold tabular-nums text-dg-card"
    >
      {value}
    </button>
  );
}

/* ============================================================ Boosted   */

function BoostedWidget() {
  return (
    <section className="bg-dg-lavender pt-2">
      <header className="px-4 pb-2 pt-3">
        <BoostedLogo />
      </header>
      <div className="flex gap-3 overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <BoostedCard
          event="Arsenal v Sevilla"
          time="Today 20:00"
          plus={49}
          selections={["Arsenal to Win", "Over 3 Goals", "Over 2.5 Total Goals"]}
          oldOdds="8.00"
          newOdds="9.00"
        />
        <BoostedCard
          event="Man City v Liverpool"
          time="Today 22:30"
          plus={42}
          selections={["Both teams to score", "Over 2.5 Goals", "Salah to score"]}
          oldOdds="6.50"
          newOdds="7.40"
        />
      </div>
    </section>
  );
}

function BoostedLogo() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-dg-card px-2 py-1 text-[14px] font-extrabold tracking-tight text-white">
      <Zap size={14} className="text-dg-gold" fill="#FFC72C" /> BET
      <span className="text-dg-gold">+</span>
      BUILDER
    </span>
  );
}

function BoostedCard({
  event,
  time,
  plus,
  selections,
  oldOdds,
  newOdds,
}: {
  event: string;
  time: string;
  plus: number;
  selections: string[];
  oldOdds: string;
  newOdds: string;
}) {
  return (
    <article className="w-[300px] shrink-0 snap-center rounded-[12px] bg-white p-4 shadow-[0_1px_4px_rgba(20,20,60,0.06)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[14px] font-bold text-dg-ink-dark">{event}</div>
          <div className="text-[12px] text-dg-ink-sub">{time}</div>
        </div>
        <span className="rounded-[4px] bg-dg-lavender px-1.5 py-0.5 text-[12px] font-bold text-dg-card">
          +{plus}
        </span>
      </div>
      <div className="my-3 border-t border-[#ECEAF4]" />
      <ul className="space-y-1 text-[13px] text-dg-ink-dark">
        {selections.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <BulletGlyph />
            <span>{s}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-[6px] bg-dg-gold py-2.5 text-[14px] font-extrabold text-dg-card"
      >
        <span className="line-through opacity-70">{oldOdds}</span>
        <Zap size={14} fill="#1A1F8C" />
        <span>{newOdds}</span>
      </button>
    </article>
  );
}

/* ============================================================ Glyphs    */

function LiveBadge() {
  return (
    <span aria-hidden className="relative inline-flex">
      <Radio size={20} className="text-dg-coral" />
      <span className="absolute right-0 top-0 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-dg-coral" />
    </span>
  );
}

function SportTabIcon({ kind, active }: { kind: string; active?: boolean }) {
  const cls = `grid h-9 w-9 place-items-center rounded-full ${
    active ? "bg-dg-card text-white" : "text-dg-ink-sub"
  }`;
  return (
    <span className={cls}>
      {kind === "ball" && <FootballGlyph size={18} light={active} />}
      {kind === "basket" && <BasketballGlyph size={18} small />}
      {kind === "globe" && <GlobeGlyph />}
      {kind === "globe2" && <GlobeGlyph faded />}
    </span>
  );
}

function FootballGlyph({
  size = 22,
  dark = false,
  light = false,
}: {
  size?: number;
  dark?: boolean;
  light?: boolean;
}) {
  const color = dark ? "#1A1F8C" : light ? "#fff" : "#fff";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path
        d="M12 3l2 4.5L17 8l-3.5 3 1 5-4.5-2.5L5.5 16l1-5L3 8l3-.5L12 3z"
        fill={color}
        opacity=".85"
      />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="#fff" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FlagGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 21V4l8 2 6-2v11l-6 2-8-2v6"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrownGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z"
        fill="#FFC72C"
        stroke="#FFC72C"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChipGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" fill="#fff" />
    </svg>
  );
}

function CycleGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 11a7 7 0 0 1 12-5l3-1v6h-6l2-2a4 4 0 0 0-7 2H5zm14 2a7 7 0 0 1-12 5l-3 1v-6h6l-2 2a4 4 0 0 0 7-2h4z"
        fill="#fff"
      />
    </svg>
  );
}

function BasketballGlyph({ size = 20, small = false }: { size?: number; small?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      strokeWidth={small ? 1.5 : 1.8}
    >
      <circle cx="12" cy="12" r="9" fill="#FF7A2B" />
      <path
        d="M3 12h18M12 3v18M5 5l14 14M19 5L5 19"
        stroke="#7a3300"
        strokeWidth="1.4"
        fill="none"
      />
    </svg>
  );
}

function GlobeGlyph({ faded }: { faded?: boolean }) {
  const cls = faded ? "text-dg-ink-sub/40" : "text-dg-ink-sub";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FlagSquare() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-[3px] bg-white">
      <span className="block h-5 w-5 bg-gradient-to-b from-[#cf142b] to-[#00247d]" />
    </span>
  );
}

function BulletGlyph() {
  return (
    <span
      aria-hidden
      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-dg-coral"
    />
  );
}

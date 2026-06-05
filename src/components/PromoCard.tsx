import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { usePromo, type CardVariant } from "@/context/PromoContext";
import {
  cardVariant,
  isActiveVariant,
  isAvailableVariant,
} from "@/lib/cardVariant";
import { SegmentedRing } from "@/components/SegmentedRing";
import { Countdown } from "@/components/Countdown";
import { asset } from "@/lib/asset";

/**
 * PromoCard — Progress 1 redesign (Figma 71/75 cluster + 78:5776).
 *
 * Layout:
 *   - Fixed-ish card (min-h 280) with the hero image always visible
 *   - Title block + badge stack at the top
 *   - One unified BottomPanel docked to the card's bottom edge:
 *       · rounded-top corners only (12px), hard bottom edge
 *       · semi-transparent white (12%) over backdrop-blur — glass effect
 *       · thin top border (0.5px, rgba(227,241,253,0.3))
 *       · 16px padding inside
 *     Holds (depending on variant):
 *       · Progress block (SegmentedRing + counter copy) when opted-in
 *       · Footer row (countdown+CTA / "Ends on" + JOIN / "You earned" / ...)
 *
 * The old separate footer band is gone — Figma 78:5776 spec replaces it.
 */
export function PromoCard() {
  const {
    promo,
    state,
    redemptions,
    poolRemaining,
    isPoolLow,
    isJoining,
    joinPromo,
    currencySymbol,
  } = usePromo();

  const variant = cardVariant(state, redemptions, isPoolLow);
  const isAvailable = isAvailableVariant(variant);
  const isActiveOrCompleted =
    isActiveVariant(variant) || variant === "completed";
  const earned = redemptions * promo.rewardCount;
  const max = promo.maxRedemptionsPerUser;
  const totalSpins = promo.rewardCount * max;

  return (
    <article
      aria-label={`${promo.name} promo — ${state}`}
      className="relative flex min-h-[280px] w-full flex-col overflow-hidden rounded-[18px] bg-dg-card text-white shadow-[0_12px_30px_rgba(10,10,40,0.18)]"
    >
      {/* Background art — always visible. Single hero across every variant. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${asset("figma/bg-active.png")}")` }}
      />
      {/* Top-only scrim so the title text at the top stays legible while the
          rest of the hero art (Gates of Olympus characters) reads CRISP —
          per Figma 78:5744. Opted-in states get their own dark backgrounds
          from the glass progress panel + solid footer, so no middle scrim
          is needed. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,17,90,0.85) 0%, rgba(13,17,90,0.25) 22%, rgba(13,17,90,0) 38%)",
        }}
      />

      {/* Top-right badge stack: state pill + optional pool chip.
          Pool chip is hidden when max === 1 — a single-redemption promo is a
          one-shot per user, not a campaign with a shared pool, so "X rewards
          left" doesn't apply. */}
      <div className="absolute right-3 top-3 z-[5] flex flex-col items-end gap-1.5">
        <Badge variant={variant} endsAt={promo.campaignEndsAt} />
        {isActiveOrCompleted && max > 1 && (
          <PoolChip poolRemaining={poolRemaining} />
        )}
      </div>

      {/* Full-card click target — absolute Link covering the entire card so
          taps anywhere (hero, title, progress) route to Details. Footer
          buttons sit above this layer (z-[5]+) and `stopPropagation` so they
          fire their own actions without also triggering this Link. */}
      <Link
        to={`/promotions/${promo.id}`}
        aria-label={`View ${promo.name} details`}
        className="absolute inset-0 z-[2]"
      />

      {/* Title block — pointer-events-none so the underlying Link still
          receives clicks on the title area. */}
      <div className="pointer-events-none relative z-[3] block px-4 pt-4">
        <TitleBlock
          currencySymbol={currencySymbol}
          minDeposit={promo.minDeposit}
          max={max}
          totalSpins={totalSpins}
          showSubtitle={isAvailable}
        />
      </div>

      {/* Flex spacer — pushes the glass progress panel + solid footer to the
          card's bottom edge for short variants (available / available-full). */}
      <div aria-hidden className="flex-1" />

      {/* Progress panel — GLASS BLUR, opted-in states only. Rounded top corners,
          hard bottom edge; the solid Footer below docks directly against it.
          Per Figma 78:5776. */}
      {!isAvailable && (
        <ProgressPanel>
          <SegmentedRing
            segments={max}
            filled={redemptions}
            completed={variant === "completed"}
            size={72}
          />
          <PanelCopy
            variant={variant}
            earned={earned}
            redemptions={redemptions}
            max={max}
            totalSpins={totalSpins}
            currencySymbol={currencySymbol}
            minDeposit={promo.minDeposit}
          />
        </ProgressPanel>
      )}

      {/* Footer — SOLID navy band at the card's bottom edge. No blur, no
          transparency. Renders for every state (variant-specific content). */}
      <Footer
        variant={variant}
        endsAt={promo.campaignEndsAt}
        promoId={promo.id}
        earned={earned}
        totalSpins={totalSpins}
        isJoining={isJoining}
        onJoin={joinPromo}
      />
    </article>
  );
}

/* ============================================================ Title       */

function TitleBlock({
  currencySymbol,
  minDeposit,
  max,
  totalSpins,
  showSubtitle,
}: {
  currencySymbol: string;
  minDeposit: number;
  max: number;
  totalSpins: number;
  showSubtitle: boolean;
}) {
  const depositWord = max === 1 ? "deposit" : "deposits";
  // pr-32 reserves enough width on the right for the longest top-right badge
  // stack (ACTIVE pill + "🎁 X,XXX Rewards left" chip).
  return (
    <div className="pr-32">
      <div className="text-[13px] font-semibold leading-tight text-white">
        Deposit &amp; Get
      </div>
      <div
        className="mt-[2px] text-[26px] font-extrabold leading-[1.05] tracking-[-0.01em] text-dg-gold"
        style={{ textShadow: "0 1px 8px rgba(8,10,50,0.45)" }}
      >
        {totalSpins} Bonus Spins
      </div>
      {showSubtitle && (
        <div className="mt-1 text-[13px] font-medium text-white/80">
          {max} {depositWord} of {currencySymbol}
          {minDeposit.toLocaleString()} to win
        </div>
      )}
    </div>
  );
}

/* ============================================================ Badges     */

function Badge({
  variant,
  endsAt,
}: {
  variant: CardVariant;
  endsAt: Date;
}) {
  // ACTIVE-style badges — white background, navy text.
  if (
    variant === "active" ||
    variant === "active-start" ||
    variant === "active-low"
  ) {
    return (
      <span
        className="whitespace-nowrap rounded-[6px] bg-white px-[10px] py-[5px] text-[10.5px] font-extrabold uppercase tracking-[0.04em] text-dg-card"
        style={{ boxShadow: "0 2px 8px rgba(8,10,50,0.25)" }}
      >
        ACTIVE
      </span>
    );
  }
  // Completed — same white pill, "COMPLETED" copy.
  if (variant === "completed") {
    return (
      <span
        className="whitespace-nowrap rounded-[6px] bg-white px-[10px] py-[5px] text-[10.5px] font-extrabold uppercase tracking-[0.04em] text-dg-card"
        style={{ boxShadow: "0 2px 8px rgba(8,10,50,0.25)" }}
      >
        COMPLETED
      </span>
    );
  }
  // Dark-pill badges for paused / ended states.
  if (variant === "available-full") {
    return <DarkPill>PROMO FULL</DarkPill>;
  }
  if (variant === "ended-pool") {
    return <DarkPill>POOL CLOSED</DarkPill>;
  }
  if (variant === "ended-time") {
    return <DarkPill>ENDED ON {formatEndDate(endsAt)}</DarkPill>;
  }
  return null; // available has no badge
}

function DarkPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="whitespace-nowrap rounded-[6px] bg-[#0E1466] px-[10px] py-[5px] text-[10.5px] font-extrabold uppercase tracking-[0.04em] text-white"
      style={{ boxShadow: "0 2px 8px rgba(8,10,50,0.35)" }}
    >
      {children}
    </span>
  );
}

function PoolChip({ poolRemaining }: { poolRemaining: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#0E1466]/85 px-2 py-[3px] text-[10px] font-bold leading-none text-white backdrop-blur-sm">
      <Gift size={11} className="text-dg-gold" />
      <span className="tabular-nums">{poolRemaining.toLocaleString()}</span>
      <span className="font-medium text-white/80">Rewards left</span>
    </span>
  );
}

/**
 * Brand mark — SuperSportBet "S" inside a dashed/segmented gold ring.
 * Same source SVG (Vector.svg) used in SegmentedRing's centre, so the
 * "You earned" footer mirrors the ring's brand mark exactly.
 */
function BrandMark({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 30 30"
      width={size}
      height={size}
      aria-hidden
      className="flex-none"
      fill="#F1C72F"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 14.7617C0 6.60929 6.60929 0 14.7617 0C22.9141 0 29.5233 6.60929 29.5233 14.7617C29.5233 22.9141 22.9141 29.5233 14.7617 29.5233C6.60929 29.5233 0 22.9141 0 14.7617ZM2.12174 16.7299H4.11516C3.99786 16.0914 3.93723 15.434 3.93723 14.7617C3.93723 14.0893 3.99864 13.4319 4.11595 12.7935H2.12174C2.02255 13.4351 1.97059 14.0925 1.97059 14.7617C1.97059 15.4309 2.02255 16.0883 2.12174 16.7299ZM14.7617 1.97137C14.0925 1.97137 13.4351 2.02255 12.7935 2.12174V4.11595C13.4319 3.99864 14.0893 3.93723 14.7617 3.93723C15.434 3.93723 16.0914 3.99864 16.7299 4.11595V2.12174C16.0883 2.02333 15.4309 1.97137 14.7617 1.97137ZM14.7617 23.6187C19.6531 23.6187 23.6187 19.6531 23.6187 14.7617C23.6187 9.87025 19.6531 5.90467 14.7617 5.90467C9.87025 5.90467 5.90467 9.87025 5.90467 14.7617C5.90467 19.6531 9.87025 23.6187 14.7617 23.6187ZM8.62633 5.84247L7.21708 4.43323C6.15188 5.21264 5.21264 6.15267 4.43323 7.21708L5.84247 8.62633C6.59355 7.53751 7.53751 6.59276 8.62633 5.84247ZM4.43323 22.3063C5.21264 23.3715 6.15267 24.3107 7.21708 25.0901L8.62633 23.6809C7.53751 22.9298 6.59276 21.9858 5.84247 20.897L4.43323 22.3063ZM14.7617 27.552C15.4309 27.552 16.0883 27.5008 16.7299 27.4016V25.4074C16.0914 25.5247 15.434 25.5861 14.7617 25.5861C14.0893 25.5861 13.4319 25.5247 12.7935 25.4074V27.4016C13.4351 27.5 14.0925 27.552 14.7617 27.552ZM20.8978 23.6809L22.3071 25.0901C23.3715 24.3107 24.3115 23.3707 25.0909 22.3063L23.6817 20.897C22.9306 21.9858 21.9866 22.9306 20.8978 23.6809ZM23.6806 8.62586C22.9303 7.53724 21.9857 6.59344 20.897 5.84247L22.3063 4.43323C23.3707 5.21264 24.3107 6.15188 25.0893 7.21708L23.6806 8.62586ZM25.5869 14.7617C25.5869 15.434 25.5255 16.0914 25.4082 16.7299H27.4024C27.5008 16.0883 27.5528 15.4309 27.5528 14.7617C27.5528 14.0925 27.5016 13.4351 27.4024 12.7935H25.4082C25.5255 13.4319 25.5869 14.0893 25.5869 14.7617Z"
      />
      <path d="M20.5729 9.82322C20.5729 9.28961 20.0571 8.857 19.4206 8.857C18.7841 8.857 18.2683 9.28961 18.2683 9.82322C18.2683 10.3568 18.7841 10.7894 19.4206 10.7894C20.0571 10.7894 20.5729 10.3568 20.5729 9.82322Z" />
      <path d="M17.1232 14.2032C16.0949 13.2033 12.6552 13.877 11.3646 13.668C10.7387 13.5665 10.3269 13.3329 10.3269 12.8382C10.3269 10.7677 15.8667 9.49824 16.6829 9.51746C16.9388 9.52355 17.2266 9.65549 17.3541 9.76844C17.6765 10.0543 17.9055 10.4516 17.8663 10.7595C17.8663 11.0733 17.4687 11.2523 17.0712 11.2523C14.7017 11.2523 12.8942 11.8736 12.4356 12.2176C12.421 12.2317 12.4124 12.2502 12.4124 12.2701C12.4124 12.3142 12.455 12.35 12.5075 12.35C12.9907 12.35 16.0659 11.7656 17.8727 12.605C18.657 12.9696 19.0697 13.7324 19.0662 14.5524C19.0662 15.1275 18.6402 15.6604 18.1923 16.0354C17.4094 16.6915 15.76 17.3498 13.9427 18.2272C12.1593 19.0877 10.3731 19.9783 9.39889 20.4144C9.16595 20.5187 8.92317 20.5909 8.86997 20.477C8.8217 20.3748 8.91965 20.2337 8.9766 20.1639C9.40288 19.641 11.5146 18.462 13.4951 17.3536C15.1678 16.4178 16.8821 15.5643 17.2512 14.9508C17.2999 14.8688 17.3273 14.7746 17.3273 14.6766C17.3273 14.5203 17.2364 14.3134 17.1232 14.2032Z" />
    </svg>
  );
}

/* ============================================================ Progress panel */

/**
 * ProgressPanel — the GLASS BLUR container that holds the ring + counter copy.
 *
 * Per Figma 78:5776:
 *   - bg: rgba(255,255,255,0.12) — semi-transparent white
 *   - border-t: 0.5px solid rgba(227,241,253,0.3) — bluish-white hairline
 *   - rounded-tl/tr: 12px ONLY — no bottom corners; the solid Footer docks
 *     directly against the panel's hard bottom edge below.
 *   - p: 16px all sides
 *   - backdrop-blur — the "glass" effect blurring the hero art behind
 *
 * Holds the progress block (ring + variant copy) ONLY. Footer content
 * (countdown, CTA, "You earned", etc.) lives in the solid Footer below.
 */
function ProgressPanel({ children }: { children: React.ReactNode }) {
  return (
    // pointer-events-none so taps on the panel pass through to the full-card
    // Link beneath. The panel content is informational only.
    <div
      className="pointer-events-none relative z-[3] flex items-center gap-3 rounded-tl-[12px] rounded-tr-[12px] border-t-[0.5px] border-[rgba(227,241,253,0.3)] bg-white/[0.12] p-4 backdrop-blur-md"
    >
      {children}
    </div>
  );
}

function PanelCopy({
  variant,
  earned,
  redemptions,
  max,
  totalSpins,
  currencySymbol,
  minDeposit,
}: {
  variant: CardVariant;
  earned: number;
  redemptions: number;
  max: number;
  totalSpins: number;
  currencySymbol: string;
  minDeposit: number;
}) {
  // Active-start (opted in, no deposits yet) now falls through to the same
  // counter readout as active — per Figma 97:7953 the card shows the
  // "Earned Spins / 0 /{total} / 0/{max} Deposits of R{min}" format from
  // the moment the user opts in, instead of the previous "You are in!" copy.
  // Completed — celebratory copy, no counters.
  if (variant === "completed") {
    return (
      <div className="min-w-0 flex-1">
        <div className="text-[15.5px] font-extrabold leading-tight text-white">
          You completed the <span className="text-dg-gold">promo!</span>
        </div>
        <div className="mt-1 text-[12.5px] text-white/85 tabular-nums">
          {max}/{max} Deposits done!
        </div>
      </div>
    );
  }
  // Active / active-low / ended-* — earned counter + deposit progress.
  return (
    <div className="min-w-0 flex-1">
      <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-white/70">
        Earned Spins
      </div>
      <div className="mt-[2px] flex items-baseline gap-1">
        <span className="text-[28px] font-extrabold leading-none text-dg-gold tabular-nums">
          {earned}
        </span>
        <span className="text-[15px] font-semibold text-white/60 tabular-nums">
          /{totalSpins}
        </span>
      </div>
      <div className="mt-1 text-[12px] font-semibold text-white tabular-nums">
        {redemptions}/{max} Deposits of {currencySymbol}
        {minDeposit.toLocaleString()}
      </div>
    </div>
  );
}

/* ============================================================ Footer     */

/**
 * Footer — SOLID navy band at the card's bottom edge. No blur, no
 * transparency. Docks directly against the ProgressPanel's hard bottom edge
 * when one is present; otherwise sits beneath the hero spacer.
 */
function Footer({
  variant,
  endsAt,
  promoId,
  earned,
  totalSpins,
  isJoining,
  onJoin,
}: {
  variant: CardVariant;
  endsAt: Date;
  promoId: string;
  earned: number;
  totalSpins: number;
  isJoining: boolean;
  onJoin: () => void;
}) {
  // Footer sits at z-[5] above the full-card Link (z-[2]) so the JOIN PROMO /
  // DEPOSIT buttons receive their own clicks.
  const wrapCls =
    "relative z-[5] flex items-center justify-between gap-3 bg-[#0B1259] px-4 py-3.5";

  // ── Available: "Ends on Xd Yh / Learn more" + JOIN PROMO ─────────────
  if (variant === "available") {
    return (
      <div className={wrapCls}>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="text-[13px] text-white/85">
            Ends on{" "}
            <span className="font-bold text-dg-gold">
              <CompactEnds endsAt={endsAt} />
            </span>
          </div>
          <Link
            to={`/promotions/${promoId}`}
            className="self-start text-[12.5px] text-white/70 underline underline-offset-[3px]"
          >
            Learn more
          </Link>
        </div>
        <OutlineButton
          label="JOIN PROMO"
          loading={isJoining}
          loadingLabel="JOINING…"
          onClick={onJoin}
        />
      </div>
    );
  }

  // ── Available-full: "Sign-ups paused" + Learn more, no CTA ────────────
  if (variant === "available-full") {
    return (
      <div className={wrapCls}>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="text-[13px] text-white/85">
            Sign-ups paused · reward pool is full
          </div>
          <Link
            to={`/promotions/${promoId}`}
            className="self-start text-[12.5px] text-white/70 underline underline-offset-[3px]"
          >
            Learn more
          </Link>
        </div>
      </div>
    );
  }

  // ── Active states: countdown + DEPOSIT ────────────────────────────────
  if (
    variant === "active" ||
    variant === "active-start" ||
    variant === "active-low"
  ) {
    return (
      <div className={wrapCls}>
        <Countdown target={endsAt} />
        <DepositCTA />
      </div>
    );
  }

  // ── Completed + Ended-* — "You earned: N Spins" with coin glyph ───────
  // Use earned for ended-* (whatever they reached); use totalSpins for completed.
  const earnedLabel = variant === "completed" ? totalSpins : earned;
  return (
    <div className={wrapCls}>
      <div className="text-[14px] text-white/85">You earned:</div>
      <div className="flex items-center gap-2">
        <BrandMark size={18} />
        <span className="text-[16px] font-extrabold text-white tabular-nums">
          {earnedLabel} Spins
        </span>
      </div>
    </div>
  );
}

function DepositCTA() {
  const navigate = useNavigate();
  return (
    <OutlineButton label="DEPOSIT" onClick={() => navigate("/deposit")} />
  );
}

/**
 * Outline pill button — the new design uses an outlined CTA (not the filled
 * gold pill from the previous iteration). White border, white text, transparent
 * background. PillButton's filled style was too heavy against the new layout.
 */
function OutlineButton({
  label,
  onClick,
  loading,
  loadingLabel,
}: {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  loadingLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        // Stop the click bubbling up to the full-card Link so the button's
        // own action (Join / Deposit) is the only thing that fires.
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      disabled={loading}
      className="whitespace-nowrap rounded-full border border-white/85 px-5 py-2 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-white transition hover:bg-white/10 disabled:opacity-70"
    >
      {loading ? loadingLabel ?? label : label}
    </button>
  );
}

/** "14 days 9h"-style compact remaining for the available footer. */
function CompactEnds({ endsAt }: { endsAt: Date }) {
  const [, force] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => force((n) => n + 1), 60_000);
    return () => window.clearInterval(t);
  }, []);
  const diff = Math.max(0, endsAt.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hrs = Math.floor((diff % 86_400_000) / 3_600_000);
  return (
    <>
      {days} days {hrs}h
    </>
  );
}

/** "15 Jun"-style end date for the ENDED ON badge. */
function formatEndDate(d: Date): string {
  return d
    .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    .toUpperCase();
}

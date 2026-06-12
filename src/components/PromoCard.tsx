import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { usePromo, type CardVariant } from "@/context/PromoContext";
import {
  cardVariant,
  isActiveVariant,
  isAvailableVariant,
  isEndedVariant,
} from "@/lib/cardVariant";
import { ProgressBar } from "@/components/ProgressBar";
import { Countdown } from "@/components/Countdown";
import { asset } from "@/lib/asset";

/**
 * PromoCard — Figma 128:27463 / 128:28210 / 128:28531 (2026-06-12 redesign).
 *
 * Layout (top → bottom):
 *   1. hero image background + scrim
 *   2. title block       "Deposit & Get" / "{totalSpins} Bonus Spins"
 *      + top-right badge (ACTIVE / COMPLETED / EXPIRED) and optional PoolChip
 *   3. glass progress panel — holds the new ProgressBar
 *      (sub-label + counter + segmented/continuous bar + 0/max labels)
 *   4. solid navy footer — variant-specific:
 *        active*       → Countdown + DEPOSIT
 *        completed     → "{earned} / Bonus spins" + VIEW
 *        ended-*       → "{earned} / Bonus spins" + VIEW
 *        available     → "Ends on Xd Yh" / Learn more + JOIN PROMO
 *        available-full → "Sign-ups paused" + Learn more (no CTA)
 *
 * Whole card is a Link to /promotions/{id} (z-[2] overlay); footer buttons
 * sit at z-[5] and stopPropagation so they fire their own actions.
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
  const max = promo.maxRedemptionsPerUser;
  const earned = redemptions * promo.rewardCount;
  const totalSpins = promo.rewardCount * max;
  const depositWord = max === 1 ? "deposit" : "deposits";
  const subLabel = `${redemptions}/${max} ${depositWord} of ${currencySymbol}${promo.minDeposit.toLocaleString()}`;

  return (
    <article
      aria-label={`${promo.name} promo — ${state}`}
      className="relative flex min-h-[280px] w-full flex-col overflow-hidden rounded-[18px] bg-dg-card text-white shadow-[0_12px_30px_rgba(10,10,40,0.18)]"
    >
      {/* Background art */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${asset("figma/bg-active.png")}")` }}
      />
      {/* Top-only scrim so the title text stays legible */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,17,90,0.85) 0%, rgba(13,17,90,0.25) 22%, rgba(13,17,90,0) 38%)",
        }}
      />

      {/* Top-right badge stack: state pill + optional pool chip (max>1 only) */}
      <div className="absolute right-3 top-3 z-[5] flex flex-col items-end gap-1.5">
        <Badge variant={variant} />
        {isActiveOrCompleted && max > 1 && (
          <PoolChip poolRemaining={poolRemaining} />
        )}
      </div>

      {/* Whole-card click target */}
      <Link
        to={`/promotions/${promo.id}`}
        aria-label={`View ${promo.name} details`}
        className="absolute inset-0 z-[2]"
      />

      {/* Title block */}
      <div className="pointer-events-none relative z-[3] block px-4 pt-4">
        <TitleBlock
          currencySymbol={currencySymbol}
          minDeposit={promo.minDeposit}
          max={max}
          totalSpins={totalSpins}
          showSubtitle={isAvailable}
        />
      </div>

      {/* Spacer pushes glass panel + footer to the bottom edge */}
      <div aria-hidden className="flex-1" />

      {/* Glass progress panel — opted-in (active / completed / ended-*) only.
          Available variants skip the panel and go straight to the footer. */}
      {!isAvailable && (
        <ProgressPanel>
          <ProgressBar
            done={redemptions}
            max={max}
            earned={earned}
            total={totalSpins}
            subLabel={subLabel}
          />
        </ProgressPanel>
      )}

      {/* Solid footer band */}
      <Footer
        variant={variant}
        endsAt={promo.campaignEndsAt}
        promoId={promo.id}
        earned={earned}
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
  // pr-32 reserves space for the badge stack on the right.
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

function Badge({ variant }: { variant: CardVariant }) {
  // ACTIVE / COMPLETED / EXPIRED → white pill, navy text (per new design).
  // available-full → keeps existing dark "PROMO FULL" pill (out of redesign scope).
  // available → no badge.
  const whiteLabel = badgeLabel(variant);
  if (whiteLabel) {
    return (
      <span
        className="whitespace-nowrap rounded-[6px] bg-white px-[10px] py-[5px] text-[10.5px] font-extrabold uppercase tracking-[0.04em] text-dg-card"
        style={{ boxShadow: "0 2px 8px rgba(8,10,50,0.25)" }}
      >
        {whiteLabel}
      </span>
    );
  }
  if (variant === "available-full") {
    return <DarkPill>PROMO FULL</DarkPill>;
  }
  return null;
}

/** Returns the white-pill label for the variants covered by the new design. */
function badgeLabel(variant: CardVariant): string | null {
  if (
    variant === "active" ||
    variant === "active-start" ||
    variant === "active-low"
  ) {
    return "ACTIVE";
  }
  if (variant === "completed") return "COMPLETED";
  if (isEndedVariant(variant)) return "EXPIRED";
  return null;
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

/* ============================================================ Progress panel */

/**
 * ProgressPanel — semi-transparent white + backdrop blur, rounded top corners
 * only. The solid footer docks against its hard bottom edge. Per Figma
 * 78:5776; the inner content is now the new ProgressBar primitive (replacing
 * the SegmentedRing + PanelCopy side-by-side layout).
 */
function ProgressPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none relative z-[3] rounded-tl-[12px] rounded-tr-[12px] border-t-[0.5px] border-[rgba(227,241,253,0.3)] bg-white/[0.12] p-4 backdrop-blur-md">
      {children}
    </div>
  );
}

/* ============================================================ Footer     */

function Footer({
  variant,
  endsAt,
  promoId,
  earned,
  isJoining,
  onJoin,
}: {
  variant: CardVariant;
  endsAt: Date;
  promoId: string;
  earned: number;
  isJoining: boolean;
  onJoin: () => void;
}) {
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

  // ── Completed + ended-* (EXPIRED): "{earned} / Bonus spins" + VIEW ───
  // Both states route to the Details page via VIEW.
  return (
    <div className={wrapCls}>
      <EarnedAmount earned={earned} />
      <ViewCTA promoId={promoId} />
    </div>
  );
}

function EarnedAmount({ earned }: { earned: number }) {
  return (
    <div className="leading-none">
      <div className="text-[22px] font-extrabold text-dg-gold tabular-nums">
        {earned}
      </div>
      <div className="mt-1 text-[12px] font-medium text-white/85">
        Bonus spins
      </div>
    </div>
  );
}

function ViewCTA({ promoId }: { promoId: string }) {
  const navigate = useNavigate();
  return (
    <OutlineButton
      label="VIEW"
      onClick={() => navigate(`/promotions/${promoId}`)}
    />
  );
}

function DepositCTA() {
  const navigate = useNavigate();
  return (
    <OutlineButton label="DEPOSIT" onClick={() => navigate("/deposit")} />
  );
}

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

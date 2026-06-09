import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Gift, X } from "lucide-react";
import { usePromo, type CardVariant } from "@/context/PromoContext";
import { cardVariant, isActiveVariant, isAvailableVariant, isEndedVariant } from "@/lib/cardVariant";
import { SegmentedRing } from "@/components/SegmentedRing";
import { BonusSpinsEarnedCard } from "@/components/BonusSpinsEarnedCard";
import { EarnedRewardsCard } from "@/components/EarnedRewardsCard";
import { SiteHeader } from "@/components/SiteHeader";
import { HowItWorksWizard } from "@/components/HowItWorksWizard";
import { EligibleGames } from "@/components/EligibleGames";
import { CriteriaTable } from "@/components/CriteriaTable";
import { FAQAccordion } from "@/components/FAQAccordion";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyDetailsCTA } from "@/components/StickyDetailsCTA";
import { asset } from "@/lib/asset";

/**
 * Promotion Details page — Claude Design handoff (detail-page.jsx).
 *
 * Single page; the StatusCard, CTA and How-it-works step-3 ring reflect the
 * current lifecycle state. Behavior (joinPromo, deposit nav) wired through
 * PromoContext.
 */
export function PromoDetailsPage() {
  const {
    promo,
    state,
    redemptions,
    poolRemaining,
    isPoolLow,
    isJoining,
    joinPromo,
    hasOptedOut,
    optOut,
  } = usePromo();
  const variant = cardVariant(state, redemptions, isPoolLow);
  const navigate = useNavigate();
  const [showOptOutModal, setShowOptOutModal] = useState(false);

  // If the user previously opted out and lands on Details (e.g. via a
  // direct URL or browser back), bounce them back to the promo list.
  useEffect(() => {
    if (hasOptedOut) navigate("/promotions", { replace: true });
  }, [hasOptedOut, navigate]);

  function handleConfirmOptOut() {
    optOut();
    setShowOptOutModal(false);
    navigate("/promotions");
  }

  // Bottom padding to clear the sticky CTA. Hidden states get less padding.
  // Completed has no sticky CTA (per user, the journey is done — no "play now"
  // or any other action that needs to follow you), so it doesn't need the pad.
  const hasStickyCta =
    variant !== "completed" && variant !== "ended-pool";
  const padBottom = hasStickyCta ? "pb-[180px]" : "pb-12";

  return (
    <main className={`bg-dg-lavender text-dg-ink-dark ${padBottom}`}>
      {/* Shared site header — single-row AppBar (Figma 46:3473). */}
      <SiteHeader />

      {/* Dark top section */}
      <div className="bg-dg-navy pb-4">
        <BackNav />
        <Hero variant={variant} />
        {/* StatusCard (glass progress panel — SegmentedRing + counter) —
            shown for active states (per Figma 72:7965 + 75:9683) AND completed
            (per Figma 75:10482, where the ring switches to the green-check
            completed variant and the copy becomes "You completed the promo!").
            Ended states skip the StatusCard — the BonusSpinsEarnedCard below
            carries the celebratory beat instead. */}
        {(isActiveVariant(variant) || variant === "completed") && (
          <StatusCard variant={variant} />
        )}
        {/* "What you've earned" small white card with empty/won states —
            shown for ACTIVE states (Figma 72:7965 / 75:9683) AND COMPLETED
            (Figma 78:7599 — completed uses this smaller card, not the big
            celebratory one). */}
        {(isActiveVariant(variant) || variant === "completed") && (
          <EarnedRewardsCard earned={redemptions * promo.rewardCount} />
        )}
        {/* Big celebratory "N BONUS SPINS EARNED" card — for ENDED states
            (ended-pool, ended-time) only. */}
        {isEndedVariant(variant) && (
          <BonusSpinsEarnedCard
            earned={redemptions * promo.rewardCount}
          />
        )}
        <InfoRows />
      </div>

      {/* Light body */}
      {/* How it works — for active variants, the timeline lives inside
          the "Promo details" accordion (rendered up in the dark area by
          InfoRows). For every other variant it stays here, expanded,
          re-pitching the mechanic. */}
      {!isActiveVariant(variant) && <HowItWorksWizard />}
      <EligibleGames />
      <CriteriaTable />
      <FAQAccordion />
      {/* OPT-OUT — ACTIVE states only (active, active-start, active-low).
          Hidden on available, available-full, completed, ended-*. Click opens
          a confirmation modal so the user understands they'll lose progress. */}
      {isActiveVariant(variant) && (
        <div className="px-[18px] pb-6 pt-2">
          <button
            type="button"
            onClick={() => setShowOptOutModal(true)}
            className="w-full rounded-full border border-dg-ink-dark/30 bg-white px-4 py-3 text-[13px] font-bold uppercase tracking-[0.05em] text-dg-ink-dark transition hover:bg-dg-ink-dark/5"
          >
            Opt-Out
          </button>
        </div>
      )}
      <SiteFooter />

      {showOptOutModal && (
        <OptOutModal
          earned={redemptions * promo.rewardCount}
          onCancel={() => setShowOptOutModal(false)}
          onConfirm={handleConfirmOptOut}
        />
      )}

      {/* Sticky bottom CTA — hidden for completed (journey done) and
          ended-pool (already had no CTA per existing logic). */}
      {hasStickyCta && (
        <StickyDetailsCTA
          variant={variant}
          endsAt={promo.campaignEndsAt}
          isJoining={isJoining}
          onJoin={joinPromo}
          onDeposit={() => navigate("/deposit")}
          onPlay={() => navigate("/casino")}
        />
      )}
    </main>
  );
}

/* =========================================================== BackNav    */

function BackNav() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/promotions")}
      aria-label="Back to Promotions"
      className="flex items-center gap-2.5 px-4 py-2.5 text-white"
    >
      <BackIcon />
      <span className="text-sm text-white/85">Sports/ Promotions</span>
    </button>
  );
}

/* =========================================================== Hero       */

function Hero({ variant }: { variant: CardVariant }) {
  const bw = isEndedVariant(variant);
  const { currencySymbol, promo, poolRemaining } = usePromo();
  const badge = badgeForVariant(variant);
  const isBW = isEndedVariant(variant);
  const isActive = isActiveVariant(variant);
  const max = promo.maxRedemptionsPerUser;
  const totalSpins = promo.rewardCount * max;
  const depositWord = max === 1 ? "deposit" : "deposits";

  return (
    <div className="relative mx-3.5 mt-3 h-[170px] overflow-hidden rounded-[14px]">
      <div
        aria-hidden
        className={`absolute inset-0 bg-cover bg-center ${bw ? "[filter:grayscale(1)]" : ""}`}
        style={{ backgroundImage: `url("${asset("figma/bg-available.png")}")` }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,22,108,0.78), rgba(18,22,108,0.30) 55%, rgba(18,22,108,0.20))",
        }}
      />
      {/* Top-right stack: status badge + pool badge (active only) */}
      <div className="absolute right-3 top-3 z-[5] flex flex-col items-end gap-1.5">
        {badge && (
          <div
            className={`whitespace-nowrap rounded-[7px] bg-white px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.06em] ${
              isBW ? "text-[#3a3a3a]" : "text-dg-card"
            }`}
            style={{ boxShadow: "0 2px 8px rgba(8,10,50,0.25)" }}
          >
            {badge}
          </div>
        )}
        {/* Pool chip — active states only, AND only when the promo allows
            multiple redemptions. A single-redemption promo doesn't have a
            meaningful "rewards left" concept (one-shot per user). */}
        {isActive && max > 1 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold leading-none text-white backdrop-blur-sm">
            <Gift size={11} className="text-dg-gold" />
            <span className="tabular-nums">
              {poolRemaining.toLocaleString()}
            </span>
            <span className="font-medium text-white/80">Rewards left</span>
          </span>
        )}
      </div>
      <div className="relative px-[18px] py-4 pr-24">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
          DEPOSIT &amp; GET
        </div>
        <div
          className={`mt-1 text-[26px] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] ${
            bw ? "text-white/90" : "text-dg-gold"
          }`}
          style={{ textShadow: "0 2px 10px rgba(8,10,50,0.5)" }}
        >
          {totalSpins} Bonus Spins
        </div>
        <div className="mt-1 text-[12px] font-medium text-white/75">
          {max} {depositWord} of {currencySymbol}
          {promo.minDeposit.toLocaleString()} to win
        </div>
      </div>
    </div>
  );
}

function badgeForVariant(variant: CardVariant): string | null {
  switch (variant) {
    case "active":
    case "active-low":
    case "active-start":
      return "ACTIVE";
    case "ended-time":
      return "ENDED";
    case "ended-pool":
      return "POOL CLOSED";
    case "completed":
      return "COMPLETED";
    default:
      return null;
  }
}

/* =========================================================== StatusCard */

/**
 * StatusCard — Details glass progress panel.
 *
 * Active variants — Figma 72:7965 (active-start, 0 spins) and 75:9683
 * (active, 100 spins): SegmentedRing with brand-mark centre + counter copy
 * ("Earned Spins / N /total / N/M Deposits of Rmin").
 *
 * Completed variant — Figma 75:10482: SegmentedRing in `completed` mode
 * (solid green ring + check) + copy "You completed the promo! / N/M
 * Deposits done!".
 *
 * Container is constant: glass (semi-transparent white + backdrop blur),
 * rounded all four corners, sits in the dark navy section above
 * BonusSpinsEarnedCard / EarnedRewardsCard.
 */
function StatusCard({ variant }: { variant: CardVariant }) {
  const { promo, redemptions, currencySymbol } = usePromo();
  const earned = redemptions * promo.rewardCount;
  const max = promo.maxRedemptionsPerUser;
  const totalSpins = promo.rewardCount * max;
  const isCompleted = variant === "completed";

  return (
    <section
      className="mx-3.5 mt-3 flex items-center gap-4 rounded-2xl border-t-[0.5px] border-[rgba(227,241,253,0.3)] bg-white/[0.12] p-4 backdrop-blur-md"
      aria-label="Progress"
    >
      <SegmentedRing
        segments={max}
        filled={redemptions}
        size={72}
        completed={isCompleted}
      />
      <div className="min-w-0 flex-1">
        {isCompleted ? (
          <>
            <div className="text-[17px] font-extrabold leading-tight text-white">
              You completed the promo!
            </div>
            <div className="mt-1 text-[13px] font-semibold text-white/85 tabular-nums">
              {max}/{max} Deposits done!
            </div>
          </>
        ) : (
          <>
            <div className="text-[14px] font-medium leading-tight text-white/85">
              Earned Spins
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-[26px] font-extrabold leading-none text-dg-gold tabular-nums">
                {earned}
              </span>
              <span className="text-[15px] font-semibold text-white/55 tabular-nums">
                /{totalSpins}
              </span>
            </div>
            <div className="mt-1 text-[12.5px] font-semibold text-white tabular-nums">
              {redemptions}/{max} Deposits of {currencySymbol}
              {promo.minDeposit.toLocaleString()}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* =========================================================== InfoRows  */

function InfoRows() {
  const { promo, state, redemptions, isPoolLow, currencySymbol } = usePromo();
  const variant = cardVariant(state, redemptions, isPoolLow);
  // Collapse the info rows by default when the user is already opted in —
  // they know the terms; the rows are a "tap to remind me" rather than a
  // primary read. Available states still surface the rows directly because
  // the user is using them to decide whether to join.
  const collapsible = isActiveVariant(variant);
  const [open, setOpen] = useState(false);
  const max = promo.maxRedemptionsPerUser;
  const totalSpins = promo.rewardCount * max;
  const minDeposit = `${currencySymbol}${promo.minDeposit.toLocaleString()}`;
  const isSingleDeposit = max === 1;

  // Single-redemption (max=1) per Figma 78:6094 — only 2 rows; the "Unlock
  // up to N spins rewards" gift row only applies to multi-redemption promos.
  // Row 1 copy emphasises the one-shot nature ("One deposit...").
  const rows: Array<{ icon: JSX.Element; text: React.ReactNode }> = isSingleDeposit
    ? [
        {
          icon: <BallIcon />,
          text: (
            <>
              One deposit of <b>{minDeposit}</b> and you get {totalSpins} Bonus
              Spins
            </>
          ),
        },
        { icon: <ClockIcon />, text: <>{promo.campaignWindowLabel}</> },
      ]
    : [
        {
          icon: <BallIcon />,
          text: (
            <>
              On every <b>{minDeposit}</b> deposit you get {promo.rewardCount}{" "}
              Bonus Spins
            </>
          ),
        },
        {
          icon: <GiftIcon />,
          text: (
            <>
              Unlock up to {max} spins rewards, up to {totalSpins} Bonus spins.
            </>
          ),
        },
        { icon: <ClockIcon />, text: <>{promo.campaignWindowLabel}</> },
      ];
  const list = (
    <div role={collapsible ? "region" : undefined} id="promo-info-rows">
      {rows.map((r, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-1 py-3.5 ${
            i === 0 && !collapsible ? "" : "border-t border-white/[0.12]"
          }`}
        >
          <span className="inline-flex shrink-0">{r.icon}</span>
          <span className="text-[13.5px] leading-[1.35] text-white/90">
            {r.text}
          </span>
        </div>
      ))}
    </div>
  );

  if (!collapsible) {
    return <div className="mx-3.5 mt-4">{list}</div>;
  }

  // Active states — collapse into an accordion so the page leads with the
  // progress card and lets the user pull the conditions back up on demand.
  // The "How it works" timeline also nests inside this accordion (embedded
  // mode) so there's a single "more info" surface instead of two.
  return (
    <div className="mx-3.5 mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="promo-info-rows"
        className="flex w-full items-center justify-between gap-2 px-1 py-3 text-left"
      >
        <span className="text-[13.5px] font-semibold leading-[1.35] text-white">
          Promo details
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/80 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      {open && (
        <>
          {list}
          <div className="mt-4 border-t border-white/[0.12] pt-4">
            <h3 className="m-0 mb-3 px-1 text-[14px] font-bold leading-[1.3] text-white">
              How it works
            </h3>
            <HowItWorksWizard embedded />
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================== Icons     */

/**
 * DepositIcon — the InfoRows "on every deposit..." icon. Source SVG provided
 * by the user (/Users/.../Desktop/deposit icon.svg) — circle-with-plus on the
 * lower-left, stack of coins on the upper-right. Filled in brand gold.
 */
function BallIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="#F1C72F"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.54828 6.65923C9.54828 4.95595 12.3472 3.69046 15.7741 3.69046C19.201 3.69046 22 4.95595 22 6.65923C22 7.03869 21.8608 7.39652 21.6065 7.72349C21.8627 8.05358 21.9991 8.4117 21.9991 8.78585C21.9991 9.16984 21.8566 9.53167 21.5965 9.8618C21.8526 10.1914 21.989 10.5508 21.989 10.9243C21.989 11.3034 21.8502 11.6609 21.5964 11.9876C21.8597 12.3196 21.9991 12.6818 21.9991 13.0592C21.9991 13.4425 21.8571 13.8037 21.5979 14.1334C21.859 14.4667 21.9982 14.8277 21.9982 15.2041C21.9982 15.5853 21.8577 15.9447 21.6011 16.273C21.8602 16.6048 21.9982 16.9655 21.9982 17.3417C21.9982 19.0436 19.1982 20.3095 15.7723 20.3095C14.2553 20.3095 12.8259 20.0588 11.7108 19.6079C11.5646 19.5487 11.494 19.3823 11.5531 19.236C11.6123 19.0898 11.7787 19.0192 11.9249 19.0783C12.9684 19.5003 14.3254 19.7384 15.7723 19.7384C18.9187 19.7384 21.427 18.6043 21.427 17.3417C21.427 17.1224 21.3507 16.9028 21.1976 16.687C20.1271 17.5914 18.0932 18.1729 15.7723 18.1729C14.9328 18.1729 14.1182 18.096 13.3658 17.9482C13.2111 17.9178 13.1103 17.7676 13.1407 17.6129C13.1711 17.4581 13.3212 17.3573 13.476 17.3877C14.1915 17.5283 14.9692 17.6017 15.7723 17.6017C18.1194 17.6017 20.1117 16.9701 20.9723 16.1249C20.9852 16.1028 21.0013 16.0821 21.0206 16.0634C21.0344 16.0501 21.0492 16.0384 21.0648 16.0284C21.2991 15.7678 21.427 15.4892 21.427 15.2041C21.427 14.9844 21.3495 14.7639 21.1937 14.5461C20.122 15.4482 18.0907 16.028 15.7732 16.028C15.2668 16.028 14.7715 16.0003 14.2941 15.9457C14.1374 15.9278 14.0249 15.7862 14.0428 15.6295C14.0607 15.4728 14.2023 15.3603 14.359 15.3782C14.8146 15.4303 15.2883 15.4568 15.7732 15.4568C18.148 15.4568 20.1597 14.8102 21.0032 13.95C21.0094 13.9427 21.016 13.9357 21.023 13.9289L21.0281 13.9241C21.2863 13.6521 21.4279 13.3592 21.4279 13.0592C21.4279 12.839 21.3505 12.6181 21.1955 12.4011C20.1275 13.3089 18.0895 13.8931 15.7634 13.8931C15.3362 13.8935 14.9092 13.8732 14.4839 13.8324C14.3269 13.8173 14.2118 13.6778 14.2269 13.5208C14.2419 13.3638 14.3814 13.2488 14.5384 13.2638C14.9454 13.3029 15.3541 13.3223 15.7632 13.3219C18.9092 13.3219 21.4179 12.1872 21.4179 10.9243C21.4179 10.7067 21.3424 10.4881 21.1916 10.2737C20.1193 11.1756 18.0893 11.7546 15.7736 11.7546C15.1562 11.7555 14.5395 11.7124 13.9282 11.6257C13.772 11.6035 13.6634 11.4589 13.6855 11.3028C13.7077 11.1466 13.8523 11.038 14.0084 11.0602C14.5929 11.1431 15.1825 11.1843 15.7732 11.1834C18.9192 11.1834 21.4279 10.0487 21.4279 8.78585C21.4279 8.56888 21.3533 8.35213 21.2034 8.13868C20.1341 9.04503 18.098 9.628 15.7741 9.628C12.3472 9.628 9.54828 8.36251 9.54828 6.65923ZM21.4288 6.65923C21.4288 6.94586 21.2996 7.22589 21.063 7.48756C21.0514 7.49572 21.0403 7.50484 21.0298 7.51494C21.0127 7.53125 20.9982 7.54917 20.9861 7.56822C20.1321 8.41931 18.1321 9.05682 15.7741 9.05682C12.6268 9.05682 10.1195 7.92319 10.1195 6.65923C10.1195 5.39526 12.6268 4.26164 15.7741 4.26164C18.9215 4.26164 21.4288 5.39526 21.4288 6.65923Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.71181 19.7114C4.55726 19.7114 2 17.1541 2 13.9996C2 10.845 4.55726 8.28778 7.71181 8.28778C10.8663 8.28778 13.4236 10.845 13.4236 13.9996C13.4236 17.1541 10.8663 19.7114 7.71181 19.7114ZM11.3034 13.3471C11.3034 13.0766 11.0841 12.8572 10.8135 12.8572H8.69332V10.737C8.69332 10.4665 8.47399 10.2472 8.20348 10.2472H7.22562C6.95511 10.2472 6.73577 10.4665 6.73577 10.737V12.8572H4.61555C4.34504 12.8572 4.12571 13.0766 4.12571 13.3471V14.3249C4.12571 14.5954 4.34504 14.8148 4.61555 14.8148H6.73577V16.935C6.73577 17.2055 6.95511 17.4248 7.22562 17.4248H8.20348C8.47399 17.4248 8.69332 17.2055 8.69332 16.935V14.8148H10.8135C11.0841 14.8148 11.3034 14.5954 11.3034 14.3249V13.3471Z"
      />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFC72C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFC72C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

/* =========================================================== OptOutModal */

/**
 * Confirmation modal for the OPT-OUT action. Lists what the user will lose
 * (progress + future spins) so they make an informed decision before
 * permanently leaving the promo.
 */
function OptOutModal({
  earned,
  onCancel,
  onConfirm,
}: {
  earned: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // Esc to dismiss.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="opt-out-title"
      className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"
      onClick={onCancel}
    >
      <div
        // stop the backdrop click from closing when the user clicks inside
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[360px] rounded-2xl bg-white p-5 text-dg-ink-dark shadow-[0_24px_60px_rgba(8,10,50,0.3)]"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-dg-ink-sub hover:bg-dg-ink-dark/5"
        >
          <X size={18} />
        </button>
        <h2
          id="opt-out-title"
          className="pr-6 text-[18px] font-extrabold leading-tight"
        >
          Opt out of this promotion?
        </h2>
        <p className="mt-2 text-[14px] leading-snug text-dg-ink-sub">
          You'll lose all your progress and won't benefit from any further
          rewards.
          {earned > 0 ? (
            <>
              {" "}You'll keep the <b className="text-dg-ink-dark">{earned}</b>{" "}
              Bonus Spins you've already earned.
            </>
          ) : null}{" "}
          This can't be undone from the app.
        </p>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-dg-ink-dark/20 bg-white px-4 py-2.5 text-[13px] font-bold text-dg-ink-dark transition hover:bg-dg-ink-dark/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-dg-coral px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white transition hover:opacity-90"
          >
            Opt out
          </button>
        </div>
      </div>
    </div>
  );
}

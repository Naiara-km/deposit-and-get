import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { CardVariant } from "@/context/PromoContext";
import { isActiveVariant, isAvailableVariant, isEndedVariant } from "@/lib/cardVariant";

/**
 * Sticky bottom CTA for the Promo Details page.
 * Figma: 40:2768 (active) + 40:2485 (available).
 *
 * Fixed to the bottom of the app-frame; content above scrolls behind it.
 * The cyan-outline pill replaces the previous gold full-width CTA.
 */
interface StickyDetailsCTAProps {
  variant: CardVariant;
  endsAt: Date;
  isJoining: boolean;
  onJoin: () => void;
  onDeposit: () => void;
  onPlay: () => void;
}

export function StickyDetailsCTA({
  variant,
  endsAt,
  isJoining,
  onJoin,
  onDeposit,
  onPlay,
}: StickyDetailsCTAProps) {
  // Hidden states: ended-pool + completed (per handoff — no CTA, just summary).
  if (variant === "ended-pool") return null;

  const { label, action, enabled } = ctaConfig(variant, {
    onJoin,
    onDeposit,
    onPlay,
  });

  return (
    <footer
      role="region"
      aria-label="Promo actions"
      className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-4 bg-dg-sticky px-4 pb-8 pt-6"
    >
      <TopContent variant={variant} endsAt={endsAt} />
      <button
        type="button"
        onClick={action}
        disabled={!enabled || isJoining}
        aria-label={label}
        className={`flex w-full items-center justify-center gap-2 rounded-pill border-2 px-4 py-1.5 text-sm font-medium uppercase tracking-[0.04em] transition-colors ${
          enabled
            ? "border-brand-cyan text-white hover:bg-brand-cyan/10"
            : "cursor-not-allowed border-white/25 text-white/40"
        } ${isJoining ? "opacity-80" : ""}`}
      >
        {isJoining ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            JOINING…
          </>
        ) : (
          <span className="py-[6px]">{label}</span>
        )}
      </button>
    </footer>
  );
}

/* ============================================================ Top row   */

function TopContent({
  variant,
  endsAt,
}: {
  variant: CardVariant;
  endsAt: Date;
}) {
  if (isActiveVariant(variant)) {
    return <InlineCountdown target={endsAt} />;
  }
  if (isAvailableVariant(variant) || variant === "ended-time") {
    return <EndsLine endsAt={endsAt} />;
  }
  return null;
}

function EndsLine({ endsAt }: { endsAt: Date }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  const diff = Math.max(0, endsAt.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hrs = Math.floor((diff % 86_400_000) / 3_600_000);
  return (
    <p className="text-base leading-[1.75] text-white tracking-[0.15px]">
      Ends in{" "}
      <strong className="text-[14px] font-bold tracking-[0.1px] text-[#f8b635]">
        {days} days {hrs}h
      </strong>
    </p>
  );
}

/* ============================================================ Countdown */

/**
 * Inline `6 days : 9 hrs : 45 min : 5 sec` countdown, animated every second.
 * Same Date target as the card's Countdown component, so the numbers match
 * frame-for-frame.
 */
function InlineCountdown({ target }: { target: Date }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hrs = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  return (
    <div className="flex items-start">
      <Segment value={days} label="days" />
      <Colon />
      <Segment value={hrs} label="hrs" />
      <Colon />
      <Segment value={mins} label="min" />
      <Colon />
      <Segment value={secs} label="sec" />
    </div>
  );
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center whitespace-nowrap">
      <p
        className="text-base font-medium leading-[1.5] text-white tracking-[0.15px]"
        style={{ fontVariantNumeric: "tabular-nums", marginBottom: -4 }}
      >
        {value}
      </p>
      <p className="text-xs font-medium leading-4 tracking-[0.4px] text-white/60">
        {label}
      </p>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex h-9 w-5 items-center justify-center">
      <span className="text-xs font-medium leading-4 text-white">:</span>
    </div>
  );
}

/* ============================================================ Config    */

function ctaConfig(
  variant: CardVariant,
  handlers: { onJoin: () => void; onDeposit: () => void; onPlay: () => void },
): { label: string; action?: () => void; enabled: boolean } {
  switch (variant) {
    case "available":
      return { label: "JOIN PROMO", action: handlers.onJoin, enabled: true };
    case "available-full":
      return { label: "PROMOTION FULL", enabled: false };
    case "active":
    case "active-low":
    case "active-start":
      return { label: "DEPOSIT", action: handlers.onDeposit, enabled: true };
    case "ended-time":
      return { label: "PROMO EXPIRED", enabled: false };
    case "completed":
      return { label: "PLAY NOW", action: handlers.onPlay, enabled: true };
    default:
      return { label: "", enabled: false };
  }
}

/* Allow consumers to know if a variant shows a sticky CTA so they can
 * adjust their bottom padding accordingly. */
export function hasStickyCTA(variant: CardVariant): boolean {
  if (variant === "ended-pool") return false;
  // Hide for completed if you want pure summary; keeping PLAY NOW as a stretch.
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _markIsEndedUsed = isEndedVariant;

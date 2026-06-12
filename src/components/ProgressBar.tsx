/**
 * ProgressBar — the new progress visualisation that replaces SegmentedRing
 * across both PromoCard and the Details StatusCard.
 *
 * Layout (top → bottom):
 *   1. sub-label    "0/5 deposits of R2,000"
 *   2. counter row  "{earned} / {total}"     +   "bonus spins won"
 *   3. bar          (segmentation rules below)
 *   4. axis labels  "0"                       +   "{max}"
 *
 * Bar segmentation rules (per design handoff, 2026-06-12):
 *   • max === 1            → single continuous bar (fill proportional)
 *   • 2 <= max <= 9        → N discrete segments (each segment = one redemption)
 *   • max >= 10            → single continuous bar (fill proportional)
 *
 * Gold = filled / earned, dg-rail (~16% white) = unfilled.
 */
interface ProgressBarProps {
  /** Redemptions completed (X in X/N deposits). */
  done: number;
  /** Maximum redemptions configured (N in X/N deposits). 1–10 supported. */
  max: number;
  /** Cumulative spins earned across the promo (typically done × rewardCount). */
  earned: number;
  /** Total spins available across the promo (typically max × rewardCount). */
  total: number;
  /** Sub-label shown above the counter, e.g. "0/5 deposits of R2,000". */
  subLabel?: string;
}

export function ProgressBar({ done, max, earned, total, subLabel }: ProgressBarProps) {
  return (
    <div>
      {subLabel && (
        <div className="text-[13px] leading-tight text-dg-ink-dim">
          {subLabel}
        </div>
      )}
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline">
          <span className="text-[28px] font-extrabold leading-none text-dg-gold">
            {earned}
          </span>
          <span className="text-[20px] font-bold leading-none text-dg-ink-dim">
            /{total}
          </span>
        </div>
        <span className="text-[13px] text-dg-ink-dim">bonus spins won</span>
      </div>
      <Bar done={done} max={max} />
      <div className="mt-1.5 flex justify-between text-[11px] text-dg-ink-mute">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Bar({ done, max }: { done: number; max: number }) {
  const isSegmented = max >= 2 && max <= 9;
  const safeDone = Math.max(0, Math.min(done, max));

  if (isSegmented) {
    return (
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full ${
              i < safeDone ? "bg-dg-gold" : "bg-dg-rail"
            }`}
          />
        ))}
      </div>
    );
  }

  // Continuous bar — used for max === 1 and max >= 10.
  // Fill is proportional to done/max so single-redemption (0/1 vs 1/1) and
  // long-tail promos (e.g. 7/10) both read correctly.
  const pct = max > 0 ? (safeDone / max) * 100 : 0;
  return (
    <div className="relative mt-2 h-[3px] w-full overflow-hidden rounded-full bg-dg-rail">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-dg-gold transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

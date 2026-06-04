/**
 * BonusSpinsEarnedCard — Details page rewards summary card.
 *
 * Per Figma 75:13326 (Pool Exhausted), 75:10422 (Completed), and 75:9634
 * (Active with earned spins). Renders only when `earned > 0`.
 *
 * Composition: white card, rounded, with a green check disc on the left and
 * "{N} BONUS SPINS / EARNED" copy stacked on the right.
 */

interface BonusSpinsEarnedCardProps {
  /** Total Bonus Spins earned so far (= redemptions × rewardCount). */
  earned: number;
}

export function BonusSpinsEarnedCard({ earned }: BonusSpinsEarnedCardProps) {
  if (earned <= 0) return null;

  return (
    <section
      className="mx-3.5 mt-3 flex items-center gap-4 rounded-2xl bg-white px-5 py-4"
      style={{ boxShadow: "0 1px 4px rgba(20,20,60,0.08)" }}
      aria-label="Bonus Spins earned"
    >
      {/* Green check disc */}
      <span
        className="grid h-11 w-11 flex-none place-items-center rounded-full"
        style={{ background: "#3DD17A" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 12.5 L10 17.5 L19 7"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Earned amount + label */}
      <div className="min-w-0 flex-1">
        <div
          className="text-[17px] font-extrabold leading-[1.1] tracking-[-0.01em] tabular-nums"
          style={{ color: "#1B1B2B" }}
        >
          {earned.toLocaleString()} BONUS SPINS
        </div>
        <div
          className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "#6B6B85" }}
        >
          EARNED
        </div>
      </div>
    </section>
  );
}

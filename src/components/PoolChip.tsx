/**
 * PoolChip — the shared-pool pill on the promo card body and Details StatusCard.
 *
 * Compliance-safe scarcity: neutral white treatment by default, switches to a
 * coral "Almost gone" treatment ONLY when `count < 500` (per the Claude Design
 * handoff). No countdowns, no warning icons.
 */
interface PoolChipProps {
  count: number;
  total?: number;
}

export function PoolChip({ count, total = 5000 }: PoolChipProps) {
  const low = count < 500;
  const pct = Math.max(0, Math.min(100, (count / total) * 100));

  return (
    <div className="flex">
      <div
        className={`flex w-full items-center gap-[9px] rounded-pill px-[14px] py-2 ${
          low
            ? "border border-dg-coral/50 bg-dg-coral/15 text-dg-coral"
            : "border border-transparent bg-white/10 text-white/80"
        }`}
      >
        <span className={`inline-flex shrink-0 ${low ? "text-dg-coral" : "text-white/60"}`}>
          <UsersIcon />
        </span>
        <span
          className={`relative h-[5px] w-[30px] shrink-0 overflow-hidden rounded-[3px] ${
            low ? "bg-dg-coral/30" : "bg-white/20"
          }`}
        >
          <span
            aria-hidden
            className={`absolute inset-y-0 left-0 rounded-[3px] ${
              low ? "bg-dg-coral" : "bg-white/65"
            }`}
            style={{ width: `${pct}%` }}
          />
        </span>
        <span
          className="whitespace-nowrap text-[12.5px] font-semibold tabular-nums"
        >
          {low
            ? `Almost gone · ${count.toLocaleString()} left`
            : `${count.toLocaleString()} left rewards for all players`}
        </span>
      </div>
    </div>
  );
}

function UsersIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

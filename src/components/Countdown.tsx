import { useEffect, useState } from "react";

/**
 * Countdown — granular `days : hrs : min : sec`, segmented value-over-label
 * with thin dot separators. Tabular numerals so digits don't jitter on tick.
 *
 * From the Claude Design handoff (variant-f.jsx). Used in the active-state
 * footer of the promo card.
 */
interface CountdownProps {
  target: Date;
  /** Tick interval ms. Defaults to 1s. Use 30_000 for screenshot-stable demos. */
  intervalMs?: number;
}

export function Countdown({ target, intervalMs = 1000 }: CountdownProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hrs = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  return (
    <div className="flex items-start gap-1.5">
      <Segment value={days} label="days" />
      <Dot />
      <Segment value={hrs} label="hrs" />
      <Dot />
      <Segment value={mins} label="min" />
      <Dot />
      <Segment value={secs} label="sec" />
    </div>
  );
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[26px] flex-col items-center">
      <div
        className="text-xl font-extrabold leading-none text-dg-ink"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
      <div className="mt-[3px] text-[9px] font-semibold tracking-[0.08em] text-dg-ink-mute">
        {label}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <div
      className="self-start px-px text-base font-bold text-dg-ink-mute"
      style={{ marginTop: 2 }}
      aria-hidden
    >
      :
    </div>
  );
}

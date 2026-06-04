import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Flame } from "lucide-react";

/**
 * Active Promos accordion. Header layout from Figma node 3559-24218 ("Card
 * Title"), now restyled to the Claude Design handoff palette (lavender card,
 * dark-ink text, brand-navy flame, gold count). Renders its children (the
 * active PromoCard) in the expanded body. Mounted whenever the user has opted
 * in — active + completed + both ended states.
 */
export function ActivePromosAccordion({
  count,
  defaultOpen = true,
  children,
}: {
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-[14px] bg-dg-lavender shadow-[0_1px_4px_rgba(20,20,60,0.06)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5"
      >
        <span className="flex items-center gap-2.5">
          <Flame size={20} className="text-dg-card" aria-hidden />
          <span className="text-base font-bold tracking-[0.01em] text-dg-ink-dark">
            Active Promos
          </span>
          <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-[4px] bg-white px-1.5 text-xs font-bold text-dg-ink-dark">
            {count}
          </span>
        </span>
        {open ? (
          <ChevronUp size={18} className="text-dg-ink-sub" aria-hidden />
        ) : (
          <ChevronDown size={18} className="text-dg-ink-sub" aria-hidden />
        )}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </section>
  );
}

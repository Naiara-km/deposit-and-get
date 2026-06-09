import { useState } from "react";

/**
 * Frequently Asked Questions — 8 single-open accordion items.
 * Per the Claude Design handoff (detail-page.jsx FAQ).
 */
const FAQS: Array<[string, string]> = [
  [
    "Do I need to Join the promo before I make a deposit?",
    "Yes — opt in first, then any qualifying deposit during the campaign counts toward your bonus spins.",
  ],
  [
    "What deposits qualify for the promo?",
    "Deposits between R2,000 and R10,000 made during the campaign window.",
  ],
  [
    "How much will I receive?",
    "100 bonus spins per qualifying deposit, up to 5 deposits (500 spins total).",
  ],
  [
    "When will I receive my Rewards?",
    "Bonus spins are credited as soon as each deposit is processed.",
  ],
  [
    "How can I track my progress?",
    "Your progress ring on the promo card updates with every qualifying deposit.",
  ],
  [
    "When will my progress update?",
    'Immediately after a deposit clears. Counters may briefly show "Processing".',
  ],
  [
    "Can I cash out my deposit and still qualify?",
    "Withdrawing or refunding a qualifying deposit removes its reward.",
  ],
  [
    "When does the promotion end?",
    "On 10 August 2026, or earlier if the shared reward pool is fully claimed.",
  ],
];

export function FAQAccordion() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="px-[18px] pb-6 pt-[18px]">
      <h2 className="m-0 mb-4 text-[21px] font-extrabold text-dg-ink-dark">
        Frequently Ask Questions
      </h2>
      <div className="flex flex-col gap-2.5">
        {FAQS.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div
              key={q}
              className="rounded-[12px] bg-white shadow-[0_1px_4px_rgba(20,20,60,0.06)]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-[13.5px] font-semibold leading-tight text-dg-ink-dark">
                  {q}
                </span>
                <ChevronDown rotated={isOpen} />
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 text-[12.5px] leading-[1.45] text-dg-ink-sub">
                  {a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChevronDown({ rotated }: { rotated: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 transition-transform duration-200 ${
        rotated ? "rotate-180" : ""
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6B6B85"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  );
}

import { usePromo } from "@/context/PromoContext";
import { DonutRing } from "@/components/DonutRing";

/**
 * How it works? — vertical timeline. Two variants driven by maxRedemptions:
 *   - max > 1  — 4 steps (Join → Deposit → Track Progress → Instant Spins)
 *                per Figma detail-page.jsx; step 3 uses a live DonutRing icon.
 *   - max === 1 — 3 steps (Join → Deposit → Instant Spins) per Figma 78:6116.
 *                The Track Progress step is dropped because there's no
 *                progress to track on a single-deposit promo.
 */
export function HowItWorksWizard() {
  const { promo, redemptions, currencySymbol } = usePromo();
  const max = promo.maxRedemptionsPerUser;
  const isSingleDeposit = max === 1;
  const totalSpins = promo.rewardCount * max;

  type Step =
    | { kind: "join"; title: string; body: string }
    | { kind: "deposit"; title: string; body?: string }
    | { kind: "track"; title: string; body: string }
    | { kind: "spins"; title: string; body: string };

  const steps: Step[] = [
    {
      kind: "join",
      title: "Join Promo!",
      body: 'Click the "Join Promo" to activate the promo!',
    },
    isSingleDeposit
      ? {
          kind: "deposit",
          title: `Make one Deposit of ${currencySymbol}${promo.minDeposit.toLocaleString()} to get ${totalSpins} Bonus spins.`,
        }
      : {
          kind: "deposit",
          title: `Make your 1st Deposit of ${currencySymbol}${promo.minDeposit.toLocaleString()} to get ${promo.rewardCount} spins.`,
          body: `Up to ${max} times.`,
        },
    // Track Progress step — only when max > 1.
    ...(isSingleDeposit
      ? []
      : [
          {
            kind: "track" as const,
            title: "Track your Progress!",
            body: "Every time you make a deposit the counter will update!",
          },
        ]),
    {
      kind: "spins",
      title: "Instant Free Spins!",
      body: "When deposit is processed you will receive your free spins!",
    },
  ];

  return (
    <section className="px-[18px] pb-2 pt-6">
      <h2 className="m-0 text-[21px] font-extrabold text-dg-ink-dark">
        How it works?
      </h2>
      <div className="relative mt-[18px]">
        {/* Vertical timeline rail behind the steps */}
        <div
          aria-hidden
          className="absolute bottom-3.5 left-[13px] top-3.5 w-0.5 bg-[#D7D3E8]"
        />
        <ol className="flex flex-col gap-4">
          {steps.map((s, i) => (
            <li
              key={i}
              className="relative flex items-center gap-3.5"
            >
              <span className="z-[1] inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dg-navy text-[13px] font-extrabold text-white">
                {i + 1}
              </span>
              <div className="flex flex-1 items-center gap-3 rounded-[12px] bg-white px-3.5 py-3 shadow-[0_1px_4px_rgba(20,20,60,0.06)]">
                <StepIcon
                  kind={s.kind}
                  done={redemptions}
                  max={promo.maxRedemptionsPerUser}
                />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold leading-tight text-dg-ink-dark">
                    {s.title}
                  </div>
                  {s.body && (
                    <div className="mt-0.5 text-xs leading-[1.3] text-dg-ink-sub">
                      {s.body}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --- step icons -------------------------------------------------------- */

type StepKind = "join" | "deposit" | "track" | "spins";

function StepIcon({
  kind,
  done,
  max,
}: {
  kind: StepKind;
  done: number;
  max: number;
}) {
  return (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[#13235e]">
      {kind === "join" && <JoinGlyph />}
      {kind === "deposit" && <DepositGlyph />}
      {kind === "track" && (
        <DonutRing
          done={done}
          max={max}
          size={40}
          stroke={5}
          fontSize={13}
          color="#FFC72C"
        />
      )}
      {kind === "spins" && <SpinsGlyph />}
    </span>
  );
}

const goldStroke = {
  fill: "none",
  stroke: "#FFC72C",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function JoinGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...goldStroke}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function DepositGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...goldStroke}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  );
}

function SpinsGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...goldStroke}>
      <polygon points="12 2 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9 12 2" />
    </svg>
  );
}

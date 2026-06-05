import { useState } from "react";
import { Minus, Plus, Settings, X } from "lucide-react";
import {
  usePromo,
  PROMO_STATE_LABELS,
  MAX_REDEMPTIONS_RANGE,
  type PromoState,
} from "@/context/PromoContext";

/**
 * Floating dev panel for stakeholder demos. Flip lifecycle state, redemptions,
 * pool, and market without clicking through the journey.
 *
 * Hidden in production by URL flag — show ?debug=1 or toggle the gear icon.
 */
export function DebugPanel() {
  const [open, setOpen] = useState(false);
  const {
    promo,
    state,
    setState,
    redemptions,
    setRedemptions,
    setMaxRedemptions,
    poolRemaining,
    setPoolRemaining,
    market,
    setMarket,
    monochrome,
    setMonochrome,
    hasOptedOut,
    optOut,
    resetOptOut,
  } = usePromo();

  // Per the handoff-iteration request: when the promo is Completed the
  // numbers are frozen — redemptions snap to max in context, sliders go
  // disabled here so the demo state stays consistent.
  const isCompleted = state === "completed";

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Open debug panel"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-brand-navy text-white shadow-lg hover:bg-brand-navy-dark"
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-card border border-divider bg-surface p-4 shadow-xl"
      aria-label="Debug panel"
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-emphasis">Debug · Demo controls</h2>
        <button
          type="button"
          aria-label="Close debug panel"
          onClick={() => setOpen(false)}
          className="grid h-7 w-7 place-items-center rounded-full text-text-secondary hover:bg-surface-muted"
        >
          <X size={16} />
        </button>
      </header>

      <div className="space-y-4 text-sm">
        <Field label="Promo state">
          <select
            value={state}
            onChange={(e) => setState(e.target.value as PromoState)}
            className="w-full rounded-md border border-outline bg-surface px-2 py-1.5 text-text-primary"
          >
            {(Object.entries(PROMO_STATE_LABELS) as Array<
              [PromoState, string]
            >)
              // Hide pool-only variants when max=1 — a single-redemption promo
              // has no shared-pool concept so these states don't apply.
              .filter(([key]) =>
                promo.maxRedemptionsPerUser > 1 ||
                (key !== "available_pool_exhausted" &&
                  key !== "ended_pool_exhausted"),
              )
              .map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
        </Field>

        <Field label={`Max redemptions (${promo.maxRedemptionsPerUser})`}>
          <div className="flex items-center gap-2">
            <StepperBtn
              ariaLabel="Decrease max redemptions"
              onClick={() =>
                setMaxRedemptions(promo.maxRedemptionsPerUser - 1)
              }
              disabled={
                promo.maxRedemptionsPerUser <= MAX_REDEMPTIONS_RANGE.min
              }
            >
              <Minus size={14} />
            </StepperBtn>
            <span className="grid min-w-[28px] place-items-center text-base font-semibold tabular-nums text-emphasis">
              {promo.maxRedemptionsPerUser}
            </span>
            <StepperBtn
              ariaLabel="Increase max redemptions"
              onClick={() =>
                setMaxRedemptions(promo.maxRedemptionsPerUser + 1)
              }
              disabled={
                promo.maxRedemptionsPerUser >= MAX_REDEMPTIONS_RANGE.max
              }
            >
              <Plus size={14} />
            </StepperBtn>
            <span className="text-[11px] text-text-secondary">
              ({MAX_REDEMPTIONS_RANGE.min}–{MAX_REDEMPTIONS_RANGE.max})
            </span>
          </div>
        </Field>

        <Field
          label={`Personal redemptions used (${redemptions}/${promo.maxRedemptionsPerUser})${
            isCompleted ? " · locked" : ""
          }`}
        >
          <input
            type="range"
            min={0}
            max={promo.maxRedemptionsPerUser}
            step={1}
            value={redemptions}
            disabled={isCompleted}
            onChange={(e) => setRedemptions(Number(e.target.value))}
            className="w-full accent-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
          />
        </Field>

        <Field
          label={`Pool remaining (${poolRemaining.toLocaleString()} / ${promo.poolTotal.toLocaleString()})${
            isCompleted ? " · locked" : ""
          }`}
        >
          <input
            type="range"
            min={0}
            max={promo.poolTotal}
            step={50}
            value={poolRemaining}
            disabled={isCompleted}
            onChange={(e) => setPoolRemaining(Number(e.target.value))}
            className="w-full accent-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
          />
          <div
            className={`mt-1 flex justify-between text-[11px] text-text-secondary ${
              isCompleted ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <button
              type="button"
              disabled={isCompleted}
              onClick={() => setPoolRemaining(promo.poolTotal)}
              className="hover:text-brand-blue"
            >
              Full
            </button>
            <button
              type="button"
              disabled={isCompleted}
              onClick={() => setPoolRemaining(Math.round(promo.poolTotal * 0.04))}
              className="hover:text-brand-blue"
              title="Snaps below the 500-rewards low-pool threshold"
            >
              Low
            </button>
            <button
              type="button"
              disabled={isCompleted}
              onClick={() => setPoolRemaining(0)}
              className="hover:text-brand-blue"
            >
              Empty
            </button>
          </div>
        </Field>

        <Field label="Display">
          <div className="flex gap-2">
            {([
              { v: false, label: "Colour" },
              { v: true, label: "B&W" },
            ] as const).map(({ v, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setMonochrome(v)}
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium ${
                  monochrome === v
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-outline text-text-secondary hover:border-brand-blue"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        {/* Promo visibility — for demos. After an opt-out the promo hides
            everywhere; this toggle brings it back without needing to change
            the lifecycle state. */}
        <Field label="Promo visibility">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetOptOut}
              className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium ${
                !hasOptedOut
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-outline text-text-secondary hover:border-brand-blue"
              }`}
            >
              Visible
            </button>
            <button
              type="button"
              onClick={optOut}
              className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium ${
                hasOptedOut
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-outline text-text-secondary hover:border-brand-blue"
              }`}
            >
              Opted out
            </button>
          </div>
        </Field>

        <Field label="Market">
          <div className="flex gap-2">
            {(["ZA", "ZM"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMarket(m)}
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium ${
                  market === m
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-outline text-text-secondary hover:border-brand-blue"
                }`}
              >
                {m === "ZA" ? "South Africa" : "Zambia"}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <p className="mt-4 text-[11px] leading-snug text-text-secondary">
        Prototype demo controls — not visible in the real product.
      </p>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}

function StepperBtn({
  ariaLabel,
  onClick,
  disabled,
  children,
}: {
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="grid h-7 w-7 place-items-center rounded-md border border-outline text-text-primary hover:border-brand-blue hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

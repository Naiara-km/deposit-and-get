import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

/**
 * Outlined white pill — the CTA on the promo card footer.
 * Per the Claude Design handoff (variant-f.jsx).
 */
type PillButtonProps = {
  label: string;
  enabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
};

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  function PillButton(
    { label, enabled = true, loading = false, loadingLabel, onClick, type = "button" },
    ref,
  ) {
    const disabled = !enabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill border-[1.5px] px-5 py-[11px] text-[13px] font-bold tracking-[0.06em] transition-colors ${
          enabled
            ? "border-dg-ink text-dg-ink hover:bg-dg-ink/10"
            : "cursor-not-allowed border-white/25 text-white/35"
        } ${loading ? "opacity-80" : ""}`}
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {loadingLabel ?? label}
          </>
        ) : (
          label
        )}
      </button>
    );
  },
);

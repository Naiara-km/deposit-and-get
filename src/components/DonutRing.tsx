/**
 * DonutRing — segmented progress ring, the centerpiece of the promo card.
 * Matches the Claude Design handoff (variant-f.jsx).
 *
 * Used on the promo card body, the Details page StatusCard, and inside the
 * "How it works?" step-3 icon tile.
 */
interface DonutRingProps {
  done: number;
  max: number;
  size?: number;
  stroke?: number;
  fontSize?: number;
  /** Override the fill color (defaults to gold). */
  color?: string;
  /** Override the center text (e.g. "5×" for the available preview, "✓" for completed). */
  label?: string;
  /** Small uppercase label below the main number (e.g. "DEPOSITS"). */
  subLabel?: string;
}

export function DonutRing({
  done,
  max,
  size = 64,
  stroke = 7,
  fontSize = 18,
  color = "#FFC72C",
  label,
  subLabel,
}: DonutRingProps) {
  const r = (size - stroke) / 2 - 1;
  const c = 2 * Math.PI * r;
  const safeDone = Math.max(0, Math.min(done, max));
  const dash = (safeDone / max) * c;
  const center = `${size / 2}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      role="meter"
      aria-label="Rewards earned"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={safeDone}
    >
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth={stroke}
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: "stroke-dasharray .35s" }}
      />
      {label != null || !subLabel ? (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.34em"
          fill="#fff"
          fontSize={fontSize}
          fontWeight={800}
          style={{ fontVariantNumeric: "tabular-nums", fontFamily: "inherit" }}
        >
          {label ?? `${safeDone}/${max}`}
        </text>
      ) : (
        <>
          <text
            x="50%"
            y="46%"
            textAnchor="middle"
            dy="0.34em"
            fill="#fff"
            fontSize={fontSize}
            fontWeight={800}
            style={{ fontVariantNumeric: "tabular-nums", fontFamily: "inherit" }}
          >
            {`${safeDone}/${max}`}
          </text>
          <text
            x="50%"
            y="68%"
            textAnchor="middle"
            dy="0.34em"
            fill="rgba(255,255,255,0.6)"
            fontSize={Math.max(7, Math.round(fontSize * 0.42))}
            fontWeight={700}
            letterSpacing="0.06em"
            style={{ fontFamily: "inherit" }}
          >
            {subLabel}
          </text>
        </>
      )}
    </svg>
  );
}

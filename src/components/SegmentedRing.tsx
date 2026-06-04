/**
 * SegmentedRing — Progress 1 ring primitive (rebuild).
 *
 * Replaces DonutRing on the new card design. Renders N gapped arc segments
 * around a central gold coin disc with a navy star. Filled count = how many
 * segments are gold; remaining are muted. When `completed`, the ring becomes
 * a solid green band with a green disc + white check (no coin centre).
 *
 * Geometry — fixed 100×100 viewBox, scales via `size` prop. Default 80px.
 *
 *   r = 38   (ring centreline radius)
 *   stroke = 6
 *   gap = 14°   (visible but tasteful spacing between segments)
 *   coin disc radius = 22  (clears the ring with ~10px breathing room)
 */

interface SegmentedRingProps {
  /** Total segments (= max redemptions per user, 1–10). */
  segments: number;
  /** Number of segments rendered in gold (= redemptions earned). */
  filled: number;
  /** Pixel size — width === height. Default 80. */
  size?: number;
  /** When true, swap to the completed treatment (full green ring + check). */
  completed?: boolean;
}

const GOLD = "#F1C72F"; // brand gold (matches the SuperSportBet "S" mark)
const GREEN = "#3DD17A";
// Empty/remaining segments — per design spec (#98A3C9). A light cool grey-blue
// that reads cleanly against the glass progress panel.
const MUTED = "#98A3C9";

const CX = 50;
const CY = 50;
const R = 38;
const STROKE = 6;
const COIN_R = 22;

/** Polar to Cartesian — 0° at top, clockwise (matches design convention). */
function polar(angleDeg: number, radius: number = R): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
}

/** Arc path between two angles (clockwise). */
function arc(startDeg: number, endDeg: number): string {
  const [x1, y1] = polar(startDeg);
  const [x2, y2] = polar(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export function SegmentedRing({
  segments,
  filled,
  size = 80,
  completed = false,
}: SegmentedRingProps) {
  const safeSegments = Math.max(1, Math.min(10, segments));
  const safeFilled = Math.max(0, Math.min(safeSegments, filled));

  // Segment geometry — used by both default and completed modes.
  // Each segment spans (360/N - gap) degrees, with `gap` between segments.
  // Gap scales mildly with segment count so the visual stays balanced.
  const gap = safeSegments <= 5 ? 14 : safeSegments <= 7 ? 11 : 8;
  const segArc = 360 / safeSegments - gap;

  // Build all N segment paths.
  const paths: { d: string; gold: boolean }[] = [];
  for (let i = 0; i < safeSegments; i++) {
    const centerDeg = (i + 0.5) * (360 / safeSegments);
    const startDeg = centerDeg - segArc / 2;
    const endDeg = centerDeg + segArc / 2;
    paths.push({ d: arc(startDeg, endDeg), gold: i < safeFilled });
  }

  // ── Completed treatment — same N gapped segments, but ALL green
  // (the user "completed" all of them) + a green check disc in the centre. ─
  if (completed) {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-hidden
        className="flex-none"
      >
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={GREEN}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        ))}
        <circle cx={CX} cy={CY} r={COIN_R} fill={GREEN} />
        <path
          d="M40 50 L47 57 L60 43"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden
      className="flex-none"
    >
      {/* Segments — muted first, gold overlaid so gold caps render cleanly. */}
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={p.gold ? GOLD : MUTED}
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
      ))}

      {/* SuperSportBet brand mark — gold "S" inside a dashed/segmented ring,
          replacing the previous gold-disc-with-navy-star centre. The mark is
          self-contained (its own circular frame), so no backing disc.
          Source: /Users/.../Desktop/Vector.svg (30×30). Scaled 1.467× and
          translated so its 15×15 centre lands on (50, 50). */}
      <g transform="translate(27.99 27.99) scale(1.467)" fill={GOLD}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 14.7617C0 6.60929 6.60929 0 14.7617 0C22.9141 0 29.5233 6.60929 29.5233 14.7617C29.5233 22.9141 22.9141 29.5233 14.7617 29.5233C6.60929 29.5233 0 22.9141 0 14.7617ZM2.12174 16.7299H4.11516C3.99786 16.0914 3.93723 15.434 3.93723 14.7617C3.93723 14.0893 3.99864 13.4319 4.11595 12.7935H2.12174C2.02255 13.4351 1.97059 14.0925 1.97059 14.7617C1.97059 15.4309 2.02255 16.0883 2.12174 16.7299ZM14.7617 1.97137C14.0925 1.97137 13.4351 2.02255 12.7935 2.12174V4.11595C13.4319 3.99864 14.0893 3.93723 14.7617 3.93723C15.434 3.93723 16.0914 3.99864 16.7299 4.11595V2.12174C16.0883 2.02333 15.4309 1.97137 14.7617 1.97137ZM14.7617 23.6187C19.6531 23.6187 23.6187 19.6531 23.6187 14.7617C23.6187 9.87025 19.6531 5.90467 14.7617 5.90467C9.87025 5.90467 5.90467 9.87025 5.90467 14.7617C5.90467 19.6531 9.87025 23.6187 14.7617 23.6187ZM8.62633 5.84247L7.21708 4.43323C6.15188 5.21264 5.21264 6.15267 4.43323 7.21708L5.84247 8.62633C6.59355 7.53751 7.53751 6.59276 8.62633 5.84247ZM4.43323 22.3063C5.21264 23.3715 6.15267 24.3107 7.21708 25.0901L8.62633 23.6809C7.53751 22.9298 6.59276 21.9858 5.84247 20.897L4.43323 22.3063ZM14.7617 27.552C15.4309 27.552 16.0883 27.5008 16.7299 27.4016V25.4074C16.0914 25.5247 15.434 25.5861 14.7617 25.5861C14.0893 25.5861 13.4319 25.5247 12.7935 25.4074V27.4016C13.4351 27.5 14.0925 27.552 14.7617 27.552ZM20.8978 23.6809L22.3071 25.0901C23.3715 24.3107 24.3115 23.3707 25.0909 22.3063L23.6817 20.897C22.9306 21.9858 21.9866 22.9306 20.8978 23.6809ZM23.6806 8.62586C22.9303 7.53724 21.9857 6.59344 20.897 5.84247L22.3063 4.43323C23.3707 5.21264 24.3107 6.15188 25.0893 7.21708L23.6806 8.62586ZM25.5869 14.7617C25.5869 15.434 25.5255 16.0914 25.4082 16.7299H27.4024C27.5008 16.0883 27.5528 15.4309 27.5528 14.7617C27.5528 14.0925 27.5016 13.4351 27.4024 12.7935H25.4082C25.5255 13.4319 25.5869 14.0893 25.5869 14.7617Z"
        />
        <path d="M20.5729 9.82322C20.5729 9.28961 20.0571 8.857 19.4206 8.857C18.7841 8.857 18.2683 9.28961 18.2683 9.82322C18.2683 10.3568 18.7841 10.7894 19.4206 10.7894C20.0571 10.7894 20.5729 10.3568 20.5729 9.82322Z" />
        <path d="M17.1232 14.2032C16.0949 13.2033 12.6552 13.877 11.3646 13.668C10.7387 13.5665 10.3269 13.3329 10.3269 12.8382C10.3269 10.7677 15.8667 9.49824 16.6829 9.51746C16.9388 9.52355 17.2266 9.65549 17.3541 9.76844C17.6765 10.0543 17.9055 10.4516 17.8663 10.7595C17.8663 11.0733 17.4687 11.2523 17.0712 11.2523C14.7017 11.2523 12.8942 11.8736 12.4356 12.2176C12.421 12.2317 12.4124 12.2502 12.4124 12.2701C12.4124 12.3142 12.455 12.35 12.5075 12.35C12.9907 12.35 16.0659 11.7656 17.8727 12.605C18.657 12.9696 19.0697 13.7324 19.0662 14.5524C19.0662 15.1275 18.6402 15.6604 18.1923 16.0354C17.4094 16.6915 15.76 17.3498 13.9427 18.2272C12.1593 19.0877 10.3731 19.9783 9.39889 20.4144C9.16595 20.5187 8.92317 20.5909 8.86997 20.477C8.8217 20.3748 8.91965 20.2337 8.9766 20.1639C9.40288 19.641 11.5146 18.462 13.4951 17.3536C15.1678 16.4178 16.8821 15.5643 17.2512 14.9508C17.2999 14.8688 17.3273 14.7746 17.3273 14.6766C17.3273 14.5203 17.2364 14.3134 17.1232 14.2032Z" />
      </g>
    </svg>
  );
}

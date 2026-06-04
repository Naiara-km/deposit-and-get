/**
 * EarnedRewardsCard — Details page "What you've earned" card for ACTIVE states.
 *
 * Per Figma 72:7965 (empty, 0 spins) and 75:9683 (won, 100 spins). Two states
 * driven by `earned`:
 *   - Empty (earned === 0): muted grey tile + grey star + "0 Bonus spins" +
 *     "No Bonus Spins yet — make a deposit to start earning."
 *   - Won (earned > 0):     navy tile + gold "S" brand mark + "{N} Bonus spins"
 *     + "Your Bonus Spins live inside the eligibles games."
 *
 * For completed / ended states the bigger BonusSpinsEarnedCard is used instead.
 */

interface EarnedRewardsCardProps {
  /** Total Bonus Spins earned so far (= redemptions × rewardCount). */
  earned: number;
}

export function EarnedRewardsCard({ earned }: EarnedRewardsCardProps) {
  const empty = earned <= 0;

  // Tile colours per state — matches the Claude Design handoff palette.
  const tileBg = empty ? "#EFEEF5" : "#161C7A";
  const glyphColor = empty ? "rgba(107,107,133,0.55)" : "#F1C72F";
  const amountColor = empty ? "rgba(107,107,133,0.70)" : "#1B1B2B";

  return (
    <section
      className="mx-3.5 mt-3 rounded-2xl bg-white px-[18px] py-4"
      style={{ boxShadow: "0 1px 4px rgba(20,20,60,0.06)" }}
      aria-label="What you've earned"
    >
      <h3
        className="mb-3 text-[13px] font-semibold tracking-[-0.01em]"
        style={{ color: "#6B6B85" }}
      >
        What you've earned
      </h3>
      <div className="flex items-start gap-3">
        {/* Icon tile — muted grey + star when empty, navy + gold S when won. */}
        <span
          className="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px]"
          style={{ background: tileBg }}
        >
          {empty ? <EmptyStarIcon color={glyphColor} /> : <BrandMarkIcon />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[17px] font-extrabold leading-[1.05] tracking-[-0.01em] tabular-nums"
              style={{ color: amountColor }}
            >
              {empty ? 0 : earned.toLocaleString()}
            </span>
            <span
              className="text-[14px] font-semibold leading-[1.05]"
              style={{ color: amountColor }}
            >
              Bonus spins
            </span>
          </div>
          <p
            className="mt-1 text-[11.5px] leading-[1.4]"
            style={{ color: "#6B6B85" }}
          >
            {empty
              ? "No Bonus Spins yet — make a deposit to start earning."
              : "Your Bonus Spins live inside the eligibles games."}
          </p>
        </div>
      </div>
    </section>
  );
}

function EmptyStarIcon({ color }: { color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden
      fill={color}
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M12 3.6l2.5 5.1 5.6.8-4.05 3.95.95 5.55L12 16.9l-5 2.65.95-5.55L3.9 9.5l5.6-.8z" />
    </svg>
  );
}

/** SuperSportBet "S" brand mark — gold S inside a segmented ring (Vector.svg). */
function BrandMarkIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 30 30"
      aria-hidden
      fill="#F1C72F"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 14.7617C0 6.60929 6.60929 0 14.7617 0C22.9141 0 29.5233 6.60929 29.5233 14.7617C29.5233 22.9141 22.9141 29.5233 14.7617 29.5233C6.60929 29.5233 0 22.9141 0 14.7617ZM2.12174 16.7299H4.11516C3.99786 16.0914 3.93723 15.434 3.93723 14.7617C3.93723 14.0893 3.99864 13.4319 4.11595 12.7935H2.12174C2.02255 13.4351 1.97059 14.0925 1.97059 14.7617C1.97059 15.4309 2.02255 16.0883 2.12174 16.7299ZM14.7617 1.97137C14.0925 1.97137 13.4351 2.02255 12.7935 2.12174V4.11595C13.4319 3.99864 14.0893 3.93723 14.7617 3.93723C15.434 3.93723 16.0914 3.99864 16.7299 4.11595V2.12174C16.0883 2.02333 15.4309 1.97137 14.7617 1.97137ZM14.7617 23.6187C19.6531 23.6187 23.6187 19.6531 23.6187 14.7617C23.6187 9.87025 19.6531 5.90467 14.7617 5.90467C9.87025 5.90467 5.90467 9.87025 5.90467 14.7617C5.90467 19.6531 9.87025 23.6187 14.7617 23.6187ZM8.62633 5.84247L7.21708 4.43323C6.15188 5.21264 5.21264 6.15267 4.43323 7.21708L5.84247 8.62633C6.59355 7.53751 7.53751 6.59276 8.62633 5.84247ZM4.43323 22.3063C5.21264 23.3715 6.15267 24.3107 7.21708 25.0901L8.62633 23.6809C7.53751 22.9298 6.59276 21.9858 5.84247 20.897L4.43323 22.3063ZM14.7617 27.552C15.4309 27.552 16.0883 27.5008 16.7299 27.4016V25.4074C16.0914 25.5247 15.434 25.5861 14.7617 25.5861C14.0893 25.5861 13.4319 25.5247 12.7935 25.4074V27.4016C13.4351 27.5 14.0925 27.552 14.7617 27.552ZM20.8978 23.6809L22.3071 25.0901C23.3715 24.3107 24.3115 23.3707 25.0909 22.3063L23.6817 20.897C22.9306 21.9858 21.9866 22.9306 20.8978 23.6809ZM23.6806 8.62586C22.9303 7.53724 21.9857 6.59344 20.897 5.84247L22.3063 4.43323C23.3707 5.21264 24.3107 6.15188 25.0893 7.21708L23.6806 8.62586ZM25.5869 14.7617C25.5869 15.434 25.5255 16.0914 25.4082 16.7299H27.4024C27.5008 16.0883 27.5528 15.4309 27.5528 14.7617C27.5528 14.0925 27.5016 13.4351 27.4024 12.7935H25.4082C25.5255 13.4319 25.5869 14.0893 25.5869 14.7617Z"
      />
      <path d="M20.5729 9.82322C20.5729 9.28961 20.0571 8.857 19.4206 8.857C18.7841 8.857 18.2683 9.28961 18.2683 9.82322C18.2683 10.3568 18.7841 10.7894 19.4206 10.7894C20.0571 10.7894 20.5729 10.3568 20.5729 9.82322Z" />
      <path d="M17.1232 14.2032C16.0949 13.2033 12.6552 13.877 11.3646 13.668C10.7387 13.5665 10.3269 13.3329 10.3269 12.8382C10.3269 10.7677 15.8667 9.49824 16.6829 9.51746C16.9388 9.52355 17.2266 9.65549 17.3541 9.76844C17.6765 10.0543 17.9055 10.4516 17.8663 10.7595C17.8663 11.0733 17.4687 11.2523 17.0712 11.2523C14.7017 11.2523 12.8942 11.8736 12.4356 12.2176C12.421 12.2317 12.4124 12.2502 12.4124 12.2701C12.4124 12.3142 12.455 12.35 12.5075 12.35C12.9907 12.35 16.0659 11.7656 17.8727 12.605C18.657 12.9696 19.0697 13.7324 19.0662 14.5524C19.0662 15.1275 18.6402 15.6604 18.1923 16.0354C17.4094 16.6915 15.76 17.3498 13.9427 18.2272C12.1593 19.0877 10.3731 19.9783 9.39889 20.4144C9.16595 20.5187 8.92317 20.5909 8.86997 20.477C8.8217 20.3748 8.91965 20.2337 8.9766 20.1639C9.40288 19.641 11.5146 18.462 13.4951 17.3536C15.1678 16.4178 16.8821 15.5643 17.2512 14.9508C17.2999 14.8688 17.3273 14.7746 17.3273 14.6766C17.3273 14.5203 17.2364 14.3134 17.1232 14.2032Z" />
    </svg>
  );
}

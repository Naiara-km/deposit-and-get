import { usePromo } from "@/context/PromoContext";

/**
 * Deposit Criteria table — Details page.
 *
 * Two variants driven by `promo.maxRedemptionsPerUser`:
 *   - max > 1  — full 7-row table per Figma 72:4573 (multi-redemption promo
 *                with a shared pool concept).
 *   - max === 1 — simplified 6-row table per Figma 78:8968 (single-redemption
 *                promo: no shared-pool row, ✅/❌ icons on the methods rows,
 *                shorter "how spins are earned" copy).
 *
 * Numeric values drive off the mock + live PromoContext so the table updates
 * when the Debug panel changes maxRedemptions, pool, or market.
 */
export function CriteriaTable() {
  const { promo, currencySymbol } = usePromo();
  const max = promo.maxRedemptionsPerUser;
  const totalSpins = promo.rewardCount * max;
  const min = `${currencySymbol}${promo.minDeposit.toLocaleString()}`;
  const maxD = `${currencySymbol}${promo.maxDeposit.toLocaleString()}`;

  // ── Single-redemption variant (max === 1) ─────────────────────────────
  const singleRedemptionRows: Array<[string, React.ReactNode]> = [
    ["Min. Deposit", `${min} per deposit`],
    ["Max. Deposit", maxD],
    [
      "How spins are earned",
      `${promo.rewardCount} Bonus Spins per qualifying deposit.`,
    ],
    [
      "Eligible methods",
      <span className="text-dg-ink-sub" key="eligible">
        <span className="mr-1 text-dg-success">✅</span> Card, Instant EFT,
        Capitec Pay, 1Voucher, OTT Voucher
      </span>,
    ],
    [
      "Excluded methods",
      <span className="text-dg-ink-sub" key="excluded">
        <span className="mr-1 text-dg-coral">❌</span> Manual bank transfer,
        in-store cash
      </span>,
    ],
    [
      "Exclusions",
      <span className="text-dg-ink-sub" key="exclusions">
        <span className="text-dg-coral">⚠</span> If deposit refunded, reward
        will be removed.
      </span>,
    ],
  ];

  // ── Multi-redemption variant (max > 1) ────────────────────────────────
  const multiRedemptionRows: Array<[string, React.ReactNode]> = [
    ["Min. Deposit", min],
    ["Max. Deposit", maxD],
    [
      "How spins are earned",
      `${promo.rewardCount} Bonus Spins (per qualifying deposit). One reward per deposit; a larger single deposit does not earn extra spins. Capped at ${totalSpins} Bonus Spins.`,
    ],
    [
      "Shared rewards pool",
      `First-come, first-served. ${promo.poolTotal.toLocaleString()} rewards total across all players. Promo ends when the pool is empty.`,
    ],
    [
      "Eligible methods",
      "Card, Instant EFT, Capitec Pay, Voucher, OTT Voucher",
    ],
    [
      "Excluded methods",
      <span className="text-dg-ink-sub" key="excluded">
        <span className="text-dg-coral">⚠</span> Reward bank transfer is direct
        (gambling: not eligible).
      </span>,
    ],
    [
      "Exclusions",
      <span className="text-dg-ink-sub" key="exclusions">
        <span className="text-dg-coral">⚠</span> If reward refunded, reward
        will be removed.
      </span>,
    ],
  ];

  const rows = max === 1 ? singleRedemptionRows : multiRedemptionRows;

  return (
    <section className="px-[18px] pb-2 pt-[18px]">
      <h2 className="m-0 text-[21px] font-extrabold text-dg-ink-dark">
        Deposit Criteria
      </h2>
      <p className="my-1 text-[13.5px] text-dg-ink-sub">
        Make sure your deposits qualify!
      </p>
      <div className="mt-3 rounded-[14px] bg-white px-4 py-1 shadow-[0_1px_4px_rgba(20,20,60,0.06)]">
        <div className="flex border-b border-[#ECEAF4] py-3 text-[13px] font-bold text-dg-ink-dark">
          <span className="flex-1">Criteria</span>
          <span className="flex-[1.4]">Details</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r[0]}
            className={`flex items-start py-3 text-[13px] leading-[1.4] ${
              i === rows.length - 1 ? "" : "border-b border-[#F1EFF8]"
            }`}
          >
            <span className="flex-1 pr-2 font-bold text-dg-ink-dark">
              {r[0]}
            </span>
            <span className="flex-[1.4] text-dg-ink-sub">{r[1]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

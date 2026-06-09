import { AppHeader } from "@/components/AppHeader";
import { usePromo } from "@/context/PromoContext";

export function Game() {
  const { promo, redemptions, isOptedIn } = usePromo();
  const totalSpins = redemptions * promo.rewardCount;
  const hasSpins = isOptedIn && redemptions > 0;

  return (
    <main className="pb-16">
      <AppHeader title={promo.eligibleGame.name} />

      <section className="p-4">
        <div className="aspect-[4/3] w-full rounded-card bg-brand-navy text-white">
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-yellow">
                Mocked game entry
              </p>
              <p className="mt-2 text-lg font-bold">{promo.eligibleGame.name}</p>
              <p className="mt-1 text-xs opacity-80">
                Actual game is third-party — not in scope.
              </p>
            </div>
          </div>
        </div>

        {hasSpins ? (
          <div className="mt-4 rounded-card border border-divider bg-surface p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-yellow">
              Bonus Spins ready
            </p>
            <p className="mt-1 text-base font-semibold text-emphasis">
              {totalSpins.toLocaleString()} Bonus Spins available
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-pill bg-brand-yellow py-3 text-sm font-bold text-brand-navy"
            >
              Use Bonus Spins
            </button>
          </div>
        ) : (
          <div className="mt-4 rounded-card border border-dashed border-divider bg-surface-muted p-4">
            <p className="text-xs text-text-secondary">
              You don't have any Bonus Spins for this game yet. Join Spins of
              Olympus and deposit to earn some.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

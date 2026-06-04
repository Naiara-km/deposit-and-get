import { SiteHeader } from "@/components/SiteHeader";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { PromoCard } from "@/components/PromoCard";
import { ActivePromosAccordion } from "@/components/ActivePromosAccordion";
import { SamplePlaceholders } from "@/components/PlaceholderPromoCard";
import { usePromo } from "@/context/PromoContext";

/**
 * Promotions page — Figma 85:9726.
 *
 * Layout:
 *   - SiteHeader + ProductSwitcher (PROMOS active) at the top.
 *   - When the user has opted in: Active Promos accordion (with the real
 *     PromoCard) FIRST, then a "SuperSportBet Promos" section below with
 *     the rest of the promotions (placeholder cards).
 *   - When the user hasn't opted in: a single "SuperSportBet Promos" list
 *     containing the real PromoCard alongside the placeholders.
 *
 * The previous in-page tab filter (All / Casino / Sports / Virtuals) is
 * dropped — the new design surfaces all promos as a single stacked list.
 */
export function Promotions() {
  const { state, isOptedIn } = usePromo();
  const activeCount = isOptedIn ? 1 : 0;

  return (
    <main className="bg-surface-app pb-16">
      <SiteHeader />
      <ProductSwitcher />
      <CategoryFilterTabs />

      {/* Active Promos — only when the user has opted in. */}
      {activeCount > 0 && (
        <section className="px-4 pt-4">
          <ActivePromosAccordion count={activeCount}>
            <PromoCard />
          </ActivePromosAccordion>
        </section>
      )}

      {/* SuperSportBet Promos list — always rendered. Contains the real
          PromoCard (when not opted in) + the placeholder cards. */}
      <section className="px-4 pt-4">
        <h2 className="mb-3 text-sm font-bold text-emphasis">
          SuperSportBet Promos
        </h2>
        <div className="flex flex-col gap-4">
          {!isOptedIn && <PromoCard />}
          <SamplePlaceholders />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-wide text-text-secondary/60">
          Debug · current state: <code>{state}</code>
        </p>
      </section>
    </main>
  );
}

/* =========================================================== CategoryFilterTabs */

/**
 * In-page filter tabs (All / Games / Sports / Virtuals) — visual only.
 * Prototype always sits on the "All" tab; the other tabs are static so
 * reviewers see the chrome but no filter logic is wired.
 */
function CategoryFilterTabs() {
  const tabs = ["All", "Games", "Sports", "Virtuals"];
  return (
    <nav
      aria-label="Promo category filter"
      className="flex items-center gap-6 border-b border-divider bg-surface px-5"
    >
      {tabs.map((t) => {
        const isActive = t === "All";
        return (
          <button
            key={t}
            type="button"
            // Visual-only — prototype always renders the "All" tab content.
            onClick={(e) => e.preventDefault()}
            className={`relative py-3 text-[15px] transition-colors ${
              isActive
                ? "font-bold text-brand-navy"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t}
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-brand-navy"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

import { Link, useLocation } from "react-router-dom";

/**
 * ProductSwitcher — sticky product-vertical tabs (Sports/Virtuals/Casino/
 * Promos/App), per Figma 85:9726.
 *
 * Sits right below the SiteHeader. The tab matching the current route is
 * highlighted with a darker pill background. Only PROMOS routes to a real
 * page in this prototype; the other tabs are visual-only (no-op links).
 */

type ProductTab = {
  label: string;
  href: string | null; // null = no-op (visual only for this prototype)
  matchPaths?: string[]; // routes that should highlight this tab
};

const TABS: ProductTab[] = [
  { label: "Sports", href: null, matchPaths: ["/"] },
  { label: "Virtuals", href: null },
  { label: "Casino", href: "/casino", matchPaths: ["/casino"] },
  {
    label: "Promos",
    href: "/promotions",
    matchPaths: ["/promotions", "/promotions/"],
  },
  { label: "App", href: null },
];

export function ProductSwitcher() {
  const { pathname } = useLocation();

  function isActive(t: ProductTab): boolean {
    if (!t.matchPaths) return false;
    return t.matchPaths.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  }

  return (
    <nav
      aria-label="Product switcher"
      className="sticky top-14 z-20 flex items-center gap-1 overflow-x-auto bg-ssb-bg px-3 py-2 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]"
    >
      {TABS.map((t) => {
        const active = isActive(t);
        const className = `whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] transition-colors ${
          active
            ? "bg-[#0B1259] text-white"
            : "text-white/65 hover:text-white"
        }`;
        if (t.href) {
          return (
            <Link key={t.label} to={t.href} className={className}>
              {t.label}
            </Link>
          );
        }
        return (
          <button
            key={t.label}
            type="button"
            // Visual-only — these verticals are out of scope for the prototype.
            onClick={(e) => e.preventDefault()}
            className={className}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

/**
 * PlaceholderPromoCard — static placeholder promo cards used to fill the
 * SuperSportBet Promos list around the one real promo (Spins of Olympus).
 *
 * Per Figma 85:9726 the Promotions page is a stack of cards from many
 * campaigns. The prototype only models one mechanic, so these are visual-
 * only placeholders to give reviewers the right page-level context.
 *
 * Cards have the same envelope as PromoCard (navy bg, rounded, hero band,
 * footer with date range + LEARN MORE outline) but no real behaviour.
 */

interface PlaceholderPromoCardProps {
  /** Card content — title, optional badge / subtitle, hero gradient, dates. */
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode; // e.g. "JUST FOR YOU!" tag, top-left
  /** Tailwind class for the hero band — usually a gradient or solid bg. */
  heroClassName?: string;
  /** Override the hero with arbitrary children (e.g. SVG decoration). */
  heroChildren?: React.ReactNode;
  /** Bottom-row date label e.g. "12 Feb - 28 Feb" or "Ends on 28 March". */
  dateLabel: React.ReactNode;
}

export function PlaceholderPromoCard({
  title,
  subtitle,
  badge,
  heroClassName,
  heroChildren,
  dateLabel,
}: PlaceholderPromoCardProps) {
  return (
    <article
      aria-label="Placeholder promo"
      className="relative flex min-h-[280px] w-full flex-col overflow-hidden rounded-[18px] bg-dg-card text-white shadow-[0_12px_30px_rgba(10,10,40,0.18)]"
    >
      {/* Hero band — fills until the footer. */}
      <div
        aria-hidden
        className={`absolute inset-0 ${heroClassName ?? "bg-gradient-to-br from-[#16358f] via-[#0A1A6B] to-[#16358f]"}`}
      >
        {heroChildren}
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,17,90,0.45) 0%, rgba(13,17,90,0.10) 38%, rgba(13,17,90,0.82) 100%)",
        }}
      />

      {/* Top — optional badge + title block. */}
      <div className="relative z-[2] flex flex-col gap-2 px-4 pt-4">
        {badge && (
          <span className="self-start whitespace-nowrap rounded-[6px] bg-[#FF3B5C] px-2.5 py-[5px] text-[10px] font-extrabold uppercase tracking-[0.04em] text-white shadow-[0_2px_8px_rgba(8,10,50,0.25)]">
            {badge}
          </span>
        )}
        <div className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.01em] text-white">
          {title}
        </div>
        {subtitle && (
          <div className="text-[12.5px] font-medium leading-snug text-white/80">
            {subtitle}
          </div>
        )}
      </div>

      <div aria-hidden className="flex-1" />

      {/* Solid navy footer band — dates + LEARN MORE. */}
      <div className="relative z-[3] flex items-center justify-between gap-3 bg-[#0B1259] px-4 py-3.5">
        <div className="text-[13px] font-semibold text-white/90">
          {dateLabel}
        </div>
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="whitespace-nowrap rounded-full border border-white/85 px-5 py-2 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-white transition hover:bg-white/10"
        >
          Learn More
        </button>
      </div>
    </article>
  );
}

/* ============================================================ Samples */

/** Sample placeholder cards used on the Promotions page. */
export function SamplePlaceholders() {
  return (
    <>
      <PlaceholderPromoCard
        title={
          <>
            Saturday Vibes
            <br />
            <span className="text-dg-gold">Casino Night</span>
          </>
        }
        subtitle="Bring the energy — daily bonus drops"
        heroClassName="bg-gradient-to-br from-[#3A1B7A] via-[#1A0C5B] to-[#4A0E5E]"
        dateLabel="12 Feb - 28 Feb"
      />
      <PlaceholderPromoCard
        badge="Just for you!"
        title={
          <>
            Drops &amp; Wins
            <br />
            PragmaticPlay Tournament
          </>
        }
        heroClassName="bg-gradient-to-br from-[#0F1E5C] via-[#0A1A6B] to-[#1B3680]"
        dateLabel="12 Feb - 28 Feb"
      />
      <PlaceholderPromoCard
        title={
          <span className="block text-center text-[26px] font-extrabold uppercase tracking-[-0.02em] text-dg-gold">
            Drops &amp; Wins
          </span>
        }
        subtitle={
          <span className="block text-center text-white/85">
            Over 10,000 daily prizes in tournaments &amp; prize drops
            <br />
            <span className="mt-2 inline-block text-[24px] font-extrabold leading-none text-white tabular-nums">
              ₦45,000,000,000
            </span>
            <br />
            <span className="text-[11px] uppercase tracking-[0.08em] text-white/70">
              In Cash Prizes
            </span>
          </span>
        }
        heroClassName="bg-gradient-to-br from-[#3A1B7A] via-[#5A1F8C] to-[#7A2B9C]"
        dateLabel={
          <>
            Ends on <span className="font-bold text-dg-gold">28 March</span>
          </>
        }
      />
    </>
  );
}

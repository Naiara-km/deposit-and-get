/**
 * Eligible Games — list of games where the promo's Free Spins can be used.
 * Figma: 50:10152.
 *
 * Title + 4-column grid of 71×71 thumbnails (rounded 8px). For the prototype,
 * all 8 tiles use the same Clover Gold placeholder per the Figma — the real
 * product would show distinct game art per qualifying title.
 */

const PLACEHOLDER_THUMB = "/figma/game-clover-gold.png";

const GAMES = Array.from({ length: 8 }).map((_, i) => ({
  id: `eligible-${i}`,
  name: "Clover Gold",
  thumb: PLACEHOLDER_THUMB,
}));

export function EligibleGames() {
  return (
    <section className="px-[18px] pb-6 pt-4">
      <h2 className="text-[20px] font-normal leading-[1.6] tracking-[0.15px] text-dg-ink-dark">
        Eligible Games
      </h2>
      <ul
        className="mt-4 grid grid-cols-4 gap-[14px]"
        aria-label="Games eligible for Free Spins"
      >
        {GAMES.map((g) => (
          <li
            key={g.id}
            className="relative overflow-hidden rounded-[8px] bg-white"
            style={{ aspectRatio: "1 / 1" }}
          >
            <img
              src={g.thumb}
              alt={g.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Eligible Games — list of games where the promo's Bonus Spins can be used.
 * Figma: 50:10152.
 *
 * Title + subtitle + 4-column grid of 1:1 thumbnails (rounded 8px). Each
 * tile points at /public/figma/games/<slug>.png — drop the actual artwork
 * in there to swap a title. Slots 7 & 8 are placeholders (reuse the
 * clover) until two more game thumbnails arrive.
 */
import { asset } from "@/lib/asset";

const CLOVER = asset("figma/game-clover-gold.png");

const GAMES: Array<{ id: string; name: string; thumb: string }> = [
  { id: "crash-king", name: "Crash King", thumb: asset("figma/games/crash-king.png") },
  { id: "multi-hot-5", name: "Multi Hot 5", thumb: asset("figma/games/multi-hot-5.png") },
  { id: "jetx", name: "JetX", thumb: asset("figma/games/jetx.png") },
  { id: "hot-hot-fruit", name: "Hot Hot Fruit", thumb: asset("figma/games/hot-hot-fruit.png") },
  { id: "bucs-gold-rush", name: "Bucs Gold Rush", thumb: asset("figma/games/bucs-gold-rush.png") },
  { id: "clover-gold", name: "Clover Gold", thumb: CLOVER },
  // Placeholders — replace with real thumbs once provided.
  { id: "placeholder-7", name: "Coming soon", thumb: CLOVER },
  { id: "placeholder-8", name: "Coming soon", thumb: CLOVER },
];

export function EligibleGames() {
  return (
    <section className="px-[18px] pb-6 pt-4">
      <h2 className="text-[20px] font-normal leading-[1.6] tracking-[0.15px] text-dg-ink-dark">
        Eligible Games
      </h2>
      <p className="mt-1 text-[13.5px] leading-[1.4] text-dg-ink-sub">
        Eligible games to use your Bonus Spins.
      </p>
      <ul
        className="mt-4 grid grid-cols-4 gap-[14px]"
        aria-label="Games eligible for Bonus Spins"
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

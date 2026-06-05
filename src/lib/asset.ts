/**
 * Resolve a public asset path against Vite's `BASE_URL`.
 *
 * In dev, BASE_URL === "/" so `asset("/figma/foo.svg")` returns "/figma/foo.svg".
 * On GitHub Pages the build sets BASE_URL to "/deposit-and-get/", so the same
 * call returns "/deposit-and-get/figma/foo.svg" — which is where the asset
 * actually lives on the static host.
 *
 * Use this for every `<img src>`, `backgroundImage: url(...)`, etc. that
 * references files under `public/`. Without this, absolute paths break on
 * Pages because the static server doesn't rewrite the subpath away.
 */
export function asset(path: string): string {
  // Strip a leading slash so we don't end up with a double "//".
  const clean = path.replace(/^\/+/, "");
  // BASE_URL always ends with "/" per Vite spec.
  return `${import.meta.env.BASE_URL}${clean}`;
}

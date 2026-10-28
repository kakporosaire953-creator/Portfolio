/**
 * Public-asset URL helper.
 *
 * The site is served from the domain root (Vercel), so BASE_PATH is empty and
 * `asset()` is a no-op. It is kept because plain `<img src="/...">` and
 * `fetch()` calls are not rewritten by Next.js, so a future sub-path host would
 * still have one place to fix. Next.js prefixes Link/href and its own bundles
 * automatically.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

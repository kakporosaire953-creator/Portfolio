/**
 * Public-asset URL helper.
 *
 * GitHub Pages serves this project under /Portfolio, so the app is built with
 * NEXT_PUBLIC_BASE_PATH=/Portfolio. Next.js prefixes Link/href and its own
 * bundles automatically, but plain `<img src="/...">` and `fetch()` calls are
 * not rewritten — they go through `asset()` instead. In local dev and on
 * root-hosted deployments BASE_PATH is empty and `asset()` is a no-op.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

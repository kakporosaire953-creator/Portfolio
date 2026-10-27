#!/usr/bin/env node
/**
 * Publishes the static build to GitHub Pages.
 *
 * The repository's Pages site is configured as "legacy" (deploy from the
 * `main` branch root), so the artefact has to live at the repository root,
 * under /Portfolio. This script:
 *
 *   1. temporarily hides `app/api` (a static host has no server; the contact
 *      form and assistant already ship their mailto / local-engine fallbacks),
 *   2. runs `next build` with `output: "export"` and basePath "/Portfolio",
 *   3. copies `out/` next to this project, at the repository root,
 *   4. restores `app/api`.
 *
 * Usage: npm run publish:pages   (from krafter/)
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname); // krafter/scripts
const app = path.resolve(root, ".."); // krafter
const repo = path.resolve(app, ".."); // repository root
const api = path.join(app, "app", "api");
const parked = path.join(app, ".api-parked");
const out = path.join(app, "out");

const BASE = process.env.PAGES_BASE_PATH ?? "/Portfolio";
const SITE = process.env.PAGES_SITE_URL ?? "https://kakporosaire953-creator.github.io/Portfolio";

let parkedNow = false;
try {
  if (existsSync(api)) {
    rmSync(parked, { recursive: true, force: true });
    renameSync(api, parked);
    parkedNow = true;
  }

  execSync("npx next build", {
    cwd: app,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_STATIC_EXPORT: "1",
      // Read by the contact form: no /api on a static host, so it goes straight
      // to the mailto instead of posting into a 404.
      NEXT_PUBLIC_STATIC_EXPORT: "1",
      NEXT_PUBLIC_BASE_PATH: BASE,
      NEXT_PUBLIC_SITE_URL: SITE,
    },
  });
} finally {
  if (parkedNow) {
    rmSync(api, { recursive: true, force: true });
    renameSync(parked, api);
  }
}

if (!existsSync(out)) {
  console.error("✗ Aucun dossier out/ — le build a échoué.");
  process.exit(1);
}

// The Pages site is legacy-built from the repository root, with Jekyll off.
// Files are OVERWRITTEN, never wiped: the legacy static pages keep their own
// assets (images/, assets/…) while the new build adds its own.
const files = [
  "index.html",
  // RSC payload the client prefetches for client-side navigation; without it
  // every prefetch 404s on a static host.
  "index.txt",
  "404.html",
  "sitemap.xml",
  "robots.txt",
  "manifest.webmanifest",
  "og.jpg",
  // Official K favicons (the old placeholder favicon.svg is gone).
  "favicon.ico",
  "favicon-32.png",
  "icon-192.png",
  "icon-512.png",
  "apple-icon.png",
];
for (const file of files) {
  const from = path.join(out, file);
  if (existsSync(from)) cpSync(from, path.join(repo, file));
}

// `_next` carries hashed bundles: replace it so stale chunks cannot pile up.
rmSync(path.join(repo, "_next"), { recursive: true, force: true });

// Everything else merges into the existing tree.
for (const dir of ["_next", "images", "projects", "brand", "a-propos", "services", "projets", "competences", "blog", "contact", "404"]) {
  const from = path.join(out, dir);
  if (!existsSync(from)) continue;
  const to = path.join(repo, dir);
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true, force: true });
}

writeFileSync(path.join(repo, ".nojekyll"), "");
console.log("✓ Site publié à la racine du dépôt (GitHub Pages /Portfolio).");

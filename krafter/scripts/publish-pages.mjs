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
const skip = new Set([".git", "krafter", "node_modules", ".github"]);
for (const entry of ["index.html", "404.html", "_next", "images", "projects", "brand"]) {
  const from = path.join(out, entry);
  if (!existsSync(from)) continue;
  const to = path.join(repo, entry);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}
for (const entry of ["sitemap.xml", "robots.txt", "favicon.svg", "og.jpg"]) {
  const from = path.join(out, entry);
  if (existsSync(from)) cpSync(from, path.join(repo, entry));
}
// Directory-style routes (trailingSlash) — a-propos/index.html, projets/... etc.
for (const dir of ["a-propos", "services", "projets", "competences", "blog", "contact"]) {
  const from = path.join(out, dir);
  if (!existsSync(from)) continue;
  const to = path.join(repo, dir);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

writeFileSync(path.join(repo, ".nojekyll"), "");
console.log("✓ Site publié à la racine du dépôt (GitHub Pages /Portfolio).");
console.log("  Entrées ignorées:", [...skip].join(", "));

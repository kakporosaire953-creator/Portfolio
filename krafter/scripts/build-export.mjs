#!/usr/bin/env node
/**
 * Builds the static export that Vercel serves, at `krafter/out`.
 *
 * Nothing is copied into the repository: Vercel deploys the build output
 * directly (`outputDirectory: "krafter/out"` in the root vercel.json), so the
 * committed tree stays source-only and GitHub has no site to publish.
 *
 * The site lives at the domain root, so the base path is always empty: an
 * environment variable left over from the GitHub Pages era cannot resurrect
 * the old `/Portfolio` prefix.
 *
 * After the build, legacy `/<legacyBase>/**` paths (the old GitHub Pages
 * project path) are mirrored as tiny redirect stubs, so every link and share
 * of the previous URLs keeps working even on a host that ignores routing
 * configuration.
 */
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname); // krafter/scripts
const app = path.resolve(here, ".."); // krafter
const out = path.join(app, "out");
const api = path.join(app, "app", "api");
const parked = path.join(app, ".api-parked");

// Normalised so a trailing slash, or a `/Portfolio` suffix left over from the
// GitHub Pages era, cannot leak into canonical URLs.
const SITE = (process.env.SITE_URL ?? "https://kakpo-rosaire.vercel.app")
  .replace(/\/+$/, "")
  .replace(/\/Portfolio$/, "");
const LEGACY_BASE = "/Portfolio";

let parkedNow = false;
try {
  // A static host has no server: /api is parked for the build, and the contact
  // form plus assistant already ship their mailto / local-engine fallbacks.
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
      NEXT_PUBLIC_STATIC_EXPORT: "1",
      SITE_BASE_PATH: "",
      NEXT_PUBLIC_SITE_BASE_PATH: "",
      NEXT_PUBLIC_SITE_URL: SITE,
    },
  });
} finally {
  if (parkedNow) {
    rmSync(api, { recursive: true, force: true });
    renameSync(parked, api);
  }
}

if (!existsSync(path.join(out, "index.html"))) {
  console.error("✗ Aucun export dans out/ — le build a échoué.");
  process.exit(1);
}

/** Every `…/index.html` in the export, as a site path. */
function routes(dir = out, prefix = "") {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === LEGACY_BASE.slice(1)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...routes(full, `${prefix}/${entry.name}`));
    } else if (entry.name === "index.html" && prefix !== "/404") {
      found.push(`${prefix || ""}/`);
    }
  }
  return found;
}

function stub(target) {
  const url = `${SITE}${target}`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Redirection</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body>
<p>Cette adresse a changé. <a href="${target}">Continuer vers ${url}</a></p>
</body>
</html>
`;
}

const legacyDir = path.join(out, LEGACY_BASE.slice(1));
rmSync(legacyDir, { recursive: true, force: true });

let stubs = 0;
for (const route of routes()) {
  const target = route === "/" ? "/" : route;
  const dir = path.join(legacyDir, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), stub(target));
  stubs += 1;
}

console.log(`✓ Export statique prêt pour Vercel (${SITE}), ${stubs} redirections héritées.`);

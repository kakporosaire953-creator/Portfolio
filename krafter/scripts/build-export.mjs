#!/usr/bin/env node
/**
 * Builds the static export that Vercel serves, at `krafter/out`.
 *
 * Nothing is copied into the repository: Vercel deploys the build output
 * directly (`outputDirectory: "krafter/out"` in the root vercel.json), so the
 * committed tree stays source-only.
 *
 * The site lives at the domain root, so the base path is empty. NEXT_PUBLIC_
 * SITE_BASE_PATH would only be set for a sub-path host.
 */
import { execSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname); // krafter/scripts
const app = path.resolve(here, ".."); // krafter
const api = path.join(app, "app", "api");
const parked = path.join(app, ".api-parked");

const BASE = process.env.SITE_BASE_PATH ?? "";
const SITE = process.env.SITE_URL ?? "https://kakpo-rosaire.vercel.app";

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
      SITE_BASE_PATH: BASE,
      NEXT_PUBLIC_SITE_BASE_PATH: BASE,
      NEXT_PUBLIC_SITE_URL: SITE,
    },
  });
} finally {
  if (parkedNow) {
    rmSync(api, { recursive: true, force: true });
    renameSync(parked, api);
  }
}

if (!existsSync(path.join(app, "out"))) {
  console.error("✗ Aucun dossier out/ — le build a échoué.");
  process.exit(1);
}

console.log(`✓ Export statique prêt pour Vercel (${SITE}).`);

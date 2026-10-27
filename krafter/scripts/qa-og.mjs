/**
 * Local visual QA helper (not part of the build).
 *
 * Needs a headless Chromium: `npm i -D puppeteer-core @sparticuz/chromium`.
 * They are deliberately kept out of package.json so the deploy job stays lean.
 *
 * Usage: with `npm run dev` on :3000,
 *   LD_LIBRARY_PATH=/tmp/nsslib node scripts/qa-og.mjs
 * Re-renders public/og.jpg at 1200x630 (2400x1260 then downscaled).
 */
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const browser = await puppeteer.launch({
  args: [...chromium.args, "--no-sandbox", "--disable-dev-shm-usage"],
  executablePath: await chromium.executablePath(),
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));

await page.evaluate(() => {
  document.body.innerHTML = `
  <div id="og" style="position:fixed;inset:0;width:1200px;height:630px;background:#faf8f3;color:#0a0a0a;overflow:hidden;font-family:'Instrument Sans Variable','Instrument Sans',sans-serif;">
    <div style="position:absolute;inset:0;background-image:linear-gradient(to right,rgba(8,26,43,.08) 1px,transparent 1px),linear-gradient(to bottom,rgba(8,26,43,.08) 1px,transparent 1px);background-size:84px 84px;"></div>
    <svg style="position:absolute;right:-120px;top:-190px" width="640" height="640" viewBox="0 0 640 640" fill="none">
      <circle cx="320" cy="320" r="250" stroke="#ff6a00" stroke-width="2" opacity=".55"/>
      <circle cx="320" cy="320" r="176" stroke="#1e6fd9" stroke-width="2" opacity=".4"/>
    </svg>
    <div style="position:absolute;left:76px;top:62px;width:1000px">
      <img src="/brand/the-krafter-wordmark.png" alt="" style="height:54px;width:auto;display:block"/>
      <div style="margin-top:74px;font-size:96px;line-height:.92;letter-spacing:-.045em;font-weight:600">ROSAIRE</div>
      <div style="font-family:'Bodoni Moda Variable','Bodoni Moda',serif;font-style:italic;font-size:96px;line-height:.92;letter-spacing:-.03em;color:#ff6a00">KAKPO<span style="color:#0a0a0a">.</span></div>
      <div style="margin-top:34px;display:flex;align-items:center;gap:16px;font-family:'JetBrains Mono Variable',monospace;font-size:19px;letter-spacing:.22em;text-transform:uppercase;color:#2b3a44">
        <span style="width:8px;height:8px;border-radius:99px;background:#ff6a00;display:inline-block"></span>
        Frontend Developer × UI/UX Designer
      </div>
      <div style="margin-top:14px;font-family:'JetBrains Mono Variable',monospace;font-size:17px;letter-spacing:.2em;text-transform:uppercase;color:#6d757a">
        Design <span style="color:#1e6fd9">×</span> Code <span style="color:#ff6a00">×</span> Impact · Cotonou, Bénin
      </div>
    </div>
    <div style="position:absolute;right:76px;bottom:58px;font-family:'JetBrains Mono Variable',monospace;font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:#6d757a">
      Créer · Inspirer · Impacter
    </div>
  </div>`;
});

await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 900));
const el = await page.$("#og");
await el.screenshot({ path: "public/og.jpg", type: "jpeg", quality: 90, omitBackground: false });
console.log("og written");
await browser.close();

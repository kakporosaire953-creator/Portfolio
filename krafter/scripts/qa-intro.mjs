/**
 * Local visual QA helper (not part of the build).
 * Needs `npm i -D puppeteer-core` and a Chromium binary.
 * Usage: LD_LIBRARY_PATH=... node scripts/qa-intro.mjs
 */
import puppeteer from "puppeteer-core";

const OUT = "/home/user/qa4";
const URL = process.env.QA_URL ?? "http://localhost:3000/";
const b = await puppeteer.launch({
  executablePath: "/tmp/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-gl=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-crash-reporter",
    "--disable-breakpad",
  ],
});
const p = await b.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
await p.setViewport({ width: 1440, height: 900 });
await p.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });

const marks = [400, 1100, 1900, 2500];
let prev = 0;
for (const [i, t] of marks.entries()) {
  await new Promise((r) => setTimeout(r, t - prev));
  prev = t;
  await p.screenshot({ path: `${OUT}/intro-${i}.png` });
  console.log(
    `t=${t}`,
    JSON.stringify(
      await p.evaluate(() => ({
        pct: document.querySelector(".intro__pct")?.textContent,
        canvas: !!document.querySelector(".intro__canvas canvas"),
        live: document.querySelector(".intro__canvas")?.classList.contains("is-live") ?? null,
        poster: !document.querySelector(".intro__poster")?.classList.contains("is-behind"),
      })),
    ),
  );
}
await new Promise((r) => setTimeout(r, 2600));
await p.screenshot({ path: `${OUT}/intro-done.png` });
console.log(
  "after",
  JSON.stringify(
    await p.evaluate(() => ({
      intro: !!document.querySelector(".intro"),
      theme: document.documentElement.dataset.theme,
      locked: document.documentElement.classList.contains("no-scroll"),
      overflow: document.documentElement.scrollWidth - innerWidth,
      plates: [...document.querySelectorAll(".drum__plate")].map((el) => ({
        t: el.style.transform.slice(0, 46),
        o: el.style.opacity,
        front: el.dataset.front,
      })),
    })),
  ),
);
console.log("errors:", errors.length ? errors.slice(0, 3) : "none");
await b.close();

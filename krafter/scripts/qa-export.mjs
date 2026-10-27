/**
 * Local visual QA helper (not part of the build).
 *
 * Needs a headless Chromium: `npm i -D puppeteer-core @sparticuz/chromium`.
 * They are deliberately kept out of package.json so the deploy job stays lean.
 *
 * Usage: serve the published root under the Pages path first, then run it:
 *   ln -s <repo> /tmp/serve/Portfolio && (cd /tmp/serve && python3 -m http.server 3100)
 *   LD_LIBRARY_PATH=/tmp/nsslib node scripts/qa-export.mjs
 * It checks the real export: motion, rail, broken assets, 4xx responses.
 */
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
const OUT = "/home/user/qa2";
const b = await puppeteer.launch({ args:[...chromium.args,"--no-sandbox","--disable-dev-shm-usage"], executablePath: await chromium.executablePath(), headless:true });
const p = await b.newPage();
await p.evaluateOnNewDocument(() => {
  const real = window.matchMedia.bind(window);
  window.matchMedia = (q) => real(String(q).includes("pointer: coarse") ? "(max-width: 0px)" : q);
  try { sessionStorage.setItem("krafter:intro-seen","1"); } catch {}
});
const failed = [];
p.on("requestfailed", (r) => failed.push(r.url()));
p.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
await p.setViewport({width:1440,height:900});
await p.goto("http://127.0.0.1:3100/Portfolio/", { waitUntil: "domcontentloaded", timeout: 90000 });
await new Promise((r) => setTimeout(r, 3500));
const top = await p.evaluate(()=>{ const el=document.querySelector(".reel"); return window.scrollY + el.getBoundingClientRect().top; });
await p.evaluate((t)=>window.scrollTo(0,t-90), top);
await new Promise((r)=>setTimeout(r,2600));
const t1 = await p.evaluate(()=>[...document.querySelectorAll("[data-reel-track]")].map(e=>getComputedStyle(e).transform));
await new Promise((r)=>setTimeout(r,1400));
const t2 = await p.evaluate(()=>[...document.querySelectorAll("[data-reel-track]")].map(e=>getComputedStyle(e).transform));
await p.screenshot({path:`${OUT}/export-home.png`});
const railVisible = await p.evaluate(()=>{ const r=document.querySelector(".rail"); return r ? getComputedStyle(r).display : "missing"; });
const imgs = await p.evaluate(()=>[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.currentSrc||i.src));
console.log(JSON.stringify({ moving: JSON.stringify(t1)!==JSON.stringify(t2), railVisible, brokenImages: imgs, failed: failed.slice(0,8), errs: errs.slice(0,5) }, null, 1));

// inner page + case study through the base path
for (const route of ["projets/", "projets/skillbridge/", "contact/"]) {
  await p.goto(`http://127.0.0.1:3100/Portfolio/${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 1600));
  console.log(route, await p.evaluate(() => document.title));
}
await p.goto("http://127.0.0.1:3100/Portfolio/projets/campusly/", { waitUntil: "domcontentloaded", timeout: 90000 });
await new Promise((r) => setTimeout(r, 1600));
await p.screenshot({path:`${OUT}/export-case.png`});
console.log("late failures:", failed.length);
await b.close();

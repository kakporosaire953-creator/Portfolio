/**
 * Local visual QA helper (not part of the build).
 *
 * Needs a headless Chromium: `npm i -D puppeteer-core @sparticuz/chromium`.
 * They are deliberately kept out of package.json so the deploy job stays lean.
 *
 * Usage: with `npm run dev` on :3000,
 *   LD_LIBRARY_PATH=/tmp/nsslib node scripts/qa-reel.mjs
 * Writes screenshots to /home/user/qa2 (light, dark, mobile, hover states).
 */
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
const OUT = "/home/user/qa2";
const b = await puppeteer.launch({ args:[...chromium.args,"--no-sandbox","--disable-dev-shm-usage","--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2"], executablePath: await chromium.executablePath(), headless:true });
const p = await b.newPage();
const errors=[]; p.on("pageerror",e=>errors.push(e.message)); p.on("console",m=>m.type()==="error"&&errors.push(m.text()));
// Headless Chromium reports a touch screen: pretend to be a desktop so the
// real motion path is exercised.
await p.evaluateOnNewDocument(() => {
  const real = window.matchMedia.bind(window);
  window.matchMedia = (query) => real(String(query).includes("pointer: coarse") ? "(max-width: 0px)" : query);
});
await p.setViewport({width:1440,height:900});
await p.goto("http://localhost:3000/", {waitUntil:"domcontentloaded", timeout:90000});
await p.evaluate(()=>{ try{sessionStorage.setItem("krafter:intro-seen","1");}catch{} });
await new Promise(r=>setTimeout(r,2500));
const top = await p.evaluate(()=>{ const el=document.querySelector(".reel"); return window.scrollY + el.getBoundingClientRect().top; });
await p.evaluate((t)=>window.scrollTo(0,t-80), top);
await new Promise(r=>setTimeout(r,3600));
await p.screenshot({path:`${OUT}/reel-light.png`});
// second sample after 1.5s to prove the tracks actually move
const x1 = await p.evaluate(()=>[...document.querySelectorAll("[data-reel-track]")].map(t=>getComputedStyle(t).transform));
await new Promise(r=>setTimeout(r,1600));
const x2 = await p.evaluate(()=>[...document.querySelectorAll("[data-reel-track]")].map(t=>getComputedStyle(t).transform));
console.log("moving:", JSON.stringify(x1)!==JSON.stringify(x2), x1[0], "->", x2[0]);
// dark
await p.evaluate(()=>{ localStorage.setItem("krafter:theme","dark"); document.documentElement.dataset.theme="dark"; });
await new Promise(r=>setTimeout(r,900));
await p.screenshot({path:`${OUT}/reel-dark.png`});
// rail close-up
await p.screenshot({path:`${OUT}/rail.png`, clip:{x:1300,y:250,width:140,height:420}});
// mobile
await p.setViewport({width:390,height:844});
await p.evaluate(()=>{ localStorage.setItem("krafter:theme","light"); document.documentElement.dataset.theme="light"; });
await new Promise(r=>setTimeout(r,900));
await p.evaluate((t)=>window.scrollTo(0,t-40), top);
await new Promise(r=>setTimeout(r,1200));
await p.screenshot({path:`${OUT}/reel-mobile.png`});
console.log("errors:", errors.length?errors:"none");
await b.close();

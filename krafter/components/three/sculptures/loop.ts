"use client";

/**
 * One render loop for every sculpture on the page.
 *
 * Each scene registers a tick and declares whether it is on screen. The loop
 * itself is stopped as soon as no canvas is visible, and while the tab is in the
 * background, so a page full of sculptures still costs nothing when nobody is
 * looking at it. Time only advances while the loop runs, which means a sculpture
 * resumes exactly where it left off instead of jumping.
 */

export type SculptureTick = (elapsed: number, delta: number) => void;

interface Entry {
  tick: SculptureTick;
  active: boolean;
}

const entries = new Set<Entry>();
let frameId = 0;
let running = false;
let lastTimestamp = 0;
let elapsed = 0;
let tabVisible = true;
let listening = false;

function anyActive(): boolean {
  for (const entry of entries) if (entry.active) return true;
  return false;
}

function onVisibilityChange() {
  tabVisible = document.visibilityState === "visible";
  lastTimestamp = 0;
  if (tabVisible) ensureLoop();
  else stopLoop();
}

function ensureLoop() {
  if (running || typeof window === "undefined") return;
  running = true;
  lastTimestamp = 0;
  if (!listening) {
    document.addEventListener("visibilitychange", onVisibilityChange);
    listening = true;
  }
  frameId = window.requestAnimationFrame(frame);
}

function stopLoop() {
  running = false;
  if (frameId) window.cancelAnimationFrame(frameId);
  frameId = 0;
}

function frame(timestamp: number) {
  if (!running) return;
  frameId = window.requestAnimationFrame(frame);

  if (lastTimestamp === 0) {
    lastTimestamp = timestamp;
    return;
  }
  const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
  lastTimestamp = timestamp;

  elapsed += delta;
  for (const entry of entries) {
    if (entry.active) entry.tick(elapsed, delta);
  }
}

/**
 * Registers a ticking scene. Returns a handle to toggle visibility and to
 * unregister. The loop starts and stops itself around the handles.
 */
export function registerSculpture(tick: SculptureTick, active: boolean) {
  const entry: Entry = { tick, active };
  entries.add(entry);
  if (active) ensureLoop();
  else if (!anyActive()) stopLoop();

  return {
    setActive(next: boolean) {
      if (entry.active === next) return;
      entry.active = next;
      if (next) ensureLoop();
      else if (!anyActive()) stopLoop();
    },
    dispose() {
      entries.delete(entry);
      if (!anyActive()) stopLoop();
      if (entries.size === 0 && listening) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        listening = false;
      }
    },
  };
}


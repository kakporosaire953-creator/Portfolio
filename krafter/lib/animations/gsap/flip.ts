"use client";

/** Cross-route image handover used by the GSAP Flip project transition. */
export type FlipPayload = {
  src: string;
  slug: string;
  rect: { x: number; y: number; width: number; height: number };
  time: number;
};

const KEY = "krafter:flip";
const MAX_AGE = 6000;

export function saveFlipPayload(payload: FlipPayload): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable — the transition simply doesn't run */
  }
}

export function takeFlipPayload(slug: string): FlipPayload | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FlipPayload;
    if (parsed.slug !== slug) return null;
    if (Date.now() - parsed.time > MAX_AGE) return null;
    if (!parsed.rect || parsed.rect.width <= 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

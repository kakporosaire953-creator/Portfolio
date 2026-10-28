"use client";

/**
 * Tiny shared state so the hero waits for KRAFTER / ASSEMBLY instead of
 * animating behind it. No global window pollution.
 */
type Listener = () => void;

let playing = false;
let finished = false;
const listeners = new Set<Listener>();

export function setIntroPlaying(value: boolean) {
  playing = value;
  if (!value) {
    finished = true;
    listeners.forEach((listener) => listener());
    listeners.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("krafter:intro-done"));
    }
  }
}

export function isIntroPlaying() {
  return playing;
}

export function hasIntroFinished() {
  return finished;
}

/** Runs immediately when the intro is not playing, otherwise on completion. */
export function whenIntroIdle(callback: () => void): () => void {
  if (!playing) {
    callback();
    return () => undefined;
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}

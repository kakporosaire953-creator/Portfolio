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

/**
 * Did the opening scene paint its first WebGL frame?
 *
 * Child effects run before the parent's, so the 3D scene can be ready before
 * the overlay has attached its listener. A module flag has no such race.
 */
let sceneReady = false;

export function markSceneReady() {
  sceneReady = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("krafter:intro-scene-ready"));
  }
}

export function hasSceneReady() {
  return sceneReady;
}

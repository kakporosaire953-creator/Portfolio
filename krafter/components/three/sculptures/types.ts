import type * as THREE from "three";

/** Which sculpture a stage should build. */
export type SculptureModel = "ghost" | "liquid-core";

/** Per-viewport quality, decided once when the scene is built. */
export interface SculptureQuality {
  mobile: boolean;
  /** Columns / rows of the ghost veil. */
  ghostSegments: [number, number];
  /** Length / cross-section segments of each ribbon. */
  ribbonSegments: [number, number];
  /** Device pixel ratio ceiling. */
  maxDpr: number;
}

/**
 * Plain state objects that GSAP owns. Each responsibility gets its own object,
 * so two timelines can never tween the same property: the scene composes them
 * into a single transform every frame.
 */
export interface RestState {
  y: number;
  rotationX: number;
  rotationY: number;
}

export interface PointerState {
  x: number;
  y: number;
}

export interface ScrollState {
  progress: number;
}

/**
 * Everything the stage needs from a sculpture, and nothing about the renderer
 * or the DOM. A model owns its geometry, its materials and how it reacts to
 * theme and time; the stage owns the canvas, the loop, GSAP and disposal of
 * the scene-level objects.
 */
export interface SculptureRig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Root that every motion is composed onto. */
  root: THREE.Group;
  rest: RestState;
  pointer: PointerState;
  scroll: ScrollState;
  /** Camera distance at scroll progress 0 and the extra push at progress 1. */
  cameraRig: { distance: number; push: number; height: number; lookAhead: number };
  /** 0 = light art direction, 1 = dark. Called by the theme tween. */
  applyThemeMix(mix: number): void;
  /** Per-frame work: uniforms, composed transforms, camera. */
  tick(elapsed: number, delta: number): void;
  /** One frame at rest, used for reduced motion. */
  still(elapsed: number): void;
  dispose(): void;
}

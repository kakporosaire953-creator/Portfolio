/**
 * THE KRAFTER — sculpture palette.
 *
 * The brand owns four colours. Everything the two sculptures show is built from
 * them: a warm key on the orange side, a deep cool fill on the blue side, a cyan
 * glint that belongs to the reflections of the logo, and paper for the highlights.
 * There is no violet world here: purple only appears where two reflections
 * overlap, which is exactly what makes iridescence read as light and not as paint.
 *
 * `mix` runs 0 → light theme, 1 → dark theme. Every value is interpolated from
 * these two states, so a theme change is a continuous, reversible tween rather
 * than a material swap.
 */

import * as THREE from "three";

export const BRAND = {
  orange: 0xff6a00,
  ember: 0xff8a2b,
  navy: 0x081a2b,
  blue: 0x1e6fd9,
  blueDeep: 0x123b5d,
  cyan: 0x54cfe0,
  paper: 0xfaf8f3,
  white: 0xffffff,
} as const;

export type ThemeMix = number; // 0 = light, 1 = dark

/** Linear interpolation between the two theme values. */
export function mix(a: number, b: number, t: ThemeMix) {
  return a + (b - a) * t;
}

/** A colour interpolated between the light and dark states. */
export function mixColor(light: THREE.ColorRepresentation, dark: THREE.ColorRepresentation, t: ThemeMix) {
  return new THREE.Color(light).lerp(new THREE.Color(dark), t);
}

/**
 * Studio that the two sculptures are lit and reflected in.
 *
 * Rather than a generic grey room, the environment is a small navy studio with
 * three emissive panels: a warm box on the right (orange #FF6A00), a cool box on
 * the left (blue #1E6FD9) and a narrow paper strip above. Their reflections are
 * what draws the brand into the metal; nothing is tinted afterwards.
 */
export function buildStudioEnvironment(renderer: THREE.WebGLRenderer, sigma = 0.03) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studio = new THREE.Scene();

  const room = new THREE.Mesh(
    new THREE.SphereGeometry(14, 32, 20),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0x24374a), side: THREE.BackSide }),
  );
  studio.add(room);

  const panel = (
    color: THREE.ColorRepresentation,
    intensity: number,
    position: [number, number, number],
    size: [number, number],
    lookAt: [number, number, number],
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size[0], size[1]),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(...position);
    mesh.lookAt(new THREE.Vector3(...lookAt));
    studio.add(mesh);
    return mesh;
  };

  // A large soft panel behind the viewer: the ambient light of the page itself.
  // Without it a glossy object mirrors only darkness and reads as painted.
  panel(BRAND.paper, 1.0, [0, 1.2, 8.5], [13, 9], [0, 0, 0]);
  // Warm key, high on the right: the orange edge light.
  panel(BRAND.orange, 2.2, [5.4, 2.6, 3.4], [5, 6], [0, 0, 0]);
  // Cool fill, low on the left: the deep blue volume.
  panel(BRAND.blue, 1.6, [-5.6, -0.4, 2.6], [6, 7], [0, 0, 0]);
  // A tight paper strip: the sharp highlight that tells glass from plastic.
  panel(BRAND.paper, 3.2, [0.4, 6.0, 1.4], [5, 1.1], [0, 0, 0]);
  // A narrow warm strip on the right, for a second, thinner edge light.
  panel(BRAND.ember, 2.4, [4.6, 0.2, 4.4], [1.1, 5.4], [0, 0, 0]);
  // Two thin strips: elongated highlights, the signature of glass.
  panel(BRAND.paper, 2.2, [2.6, 0.4, -1.4], [0.55, 7], [0, 0, 0]);
  panel(0x4d8fc8, 1.8, [-4.4, 1.2, -0.6], [0.9, 6], [0, 0, 0]);
  // A faint cyan bounce behind, so the silhouette never dies into the dark.
  panel(BRAND.cyan, 1.2, [0.6, -1.2, -6], [7, 5], [0, 0, 0]);

  const target = pmrem.fromScene(studio, sigma);
  const texture = target.texture;

  // The PMREM output owns the texture; the temporary studio can go.
  studio.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (object.material as THREE.Material).dispose();
    }
  });
  pmrem.dispose();

  return texture;
}

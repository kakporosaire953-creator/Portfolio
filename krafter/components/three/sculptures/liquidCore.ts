import * as THREE from "three";
import { BRAND, mixColor } from "./studio";
import type { SculptureQuality, SculptureRig } from "./types";

/**
 * THE LIQUID CORE
 *
 * Four closed ribbons, swept along periodic curves so each band is genuinely
 * continuous, then twisted along its own length. Their loops pass through each
 * other at different depths: the knot is interlaced geometry, not a texture and
 * not a torus with an offset.
 *
 * Metal does the rest. The studio environment supplies the orange and blue
 * reflections; nothing is painted on.
 */

const TAU = Math.PI * 2;

/** A curve described by a function, so the harmonics stay exactly periodic. */
class FunctionCurve extends THREE.Curve<THREE.Vector3> {
  private readonly fn: (t: number) => THREE.Vector3;

  constructor(fn: (t: number) => THREE.Vector3) {
    super();
    this.fn = fn;
  }

  override getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    return target.copy(this.fn(t));
  }
}

export interface RibbonOptions {
  /** Half width of the band. */
  width: number;
  /** Half thickness of the band. */
  thickness: number;
  /** Total twist around the band's own axis over one loop, in radians. */
  twist: number;
  /** [length segments, cross-section segments] */
  segments: [number, number];
}

/**
 * Sweeps an elliptic cross-section along a closed curve: a ribbon with real
 * thickness, whose edges catch a continuous specular line.
 */
export function createRibbonGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  { width, thickness, twist, segments }: RibbonOptions,
): THREE.BufferGeometry {
  const [lengthSegments, radialSegments] = segments;
  const frames = curve.computeFrenetFrames(lengthSegments, true);

  const vertexCount = (lengthSegments + 1) * (radialSegments + 1);
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices: number[] = [];

  const point = new THREE.Vector3();
  const normalAxis = new THREE.Vector3();
  const binormalAxis = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const normal = new THREE.Vector3();

  let cursor = 0;
  for (let i = 0; i <= lengthSegments; i += 1) {
    // The closing ring reuses the first frame, so the seam is exact: the band
    // has no step where the loop meets itself.
    const closing = i === lengthSegments;
    const t = i / lengthSegments;
    const frameIndex = closing ? 0 : i;
    curve.getPoint(t % 1, point);
    tangent.copy(frames.tangents[frameIndex]);
    normalAxis.copy(frames.normals[frameIndex]);
    binormalAxis.copy(frames.binormals[frameIndex]);

    // Twist around the tangent, so the band turns its face to the light.
    const angle = closing ? 0 : twist * t;
    normalAxis.applyAxisAngle(tangent, angle);
    binormalAxis.applyAxisAngle(tangent, angle);

    for (let j = 0; j <= radialSegments; j += 1) {
      const theta = (j / radialSegments) * TAU;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      offset
        .copy(binormalAxis)
        .multiplyScalar(cos * width)
        .addScaledVector(normalAxis, sin * thickness);

      normal
        .copy(binormalAxis)
        .multiplyScalar(cos / width)
        .addScaledVector(normalAxis, sin / thickness)
        .normalize();

      positions[cursor * 3] = point.x + offset.x;
      positions[cursor * 3 + 1] = point.y + offset.y;
      positions[cursor * 3 + 2] = point.z + offset.z;
      normals[cursor * 3] = normal.x;
      normals[cursor * 3 + 1] = normal.y;
      normals[cursor * 3 + 2] = normal.z;
      uvs[cursor * 2] = t;
      uvs[cursor * 2 + 1] = j / radialSegments;
      cursor += 1;
    }
  }

  const stride = radialSegments + 1;
  for (let i = 0; i < lengthSegments; i += 1) {
    for (let j = 0; j < radialSegments; j += 1) {
      const a = i * stride + j;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

type RibbonSpec = {
  curve: THREE.Curve<THREE.Vector3>;
  rotation: [number, number, number];
  width: number;
  thickness: number;
  twist: number;
  colors: { light: number; dark: number };
  roughness: [number, number];
  iridescence: [number, number];
  envIntensity: [number, number];
};

const w = (value: number) => value * TAU;

const TREFOIL = (t: number) =>
  new THREE.Vector3(
    0.55 * (Math.sin(w(t)) + 2 * Math.sin(2 * w(t) + 0.35)),
    0.62 * (Math.cos(w(t)) - 2 * Math.cos(2 * w(t) + 0.35)),
    0.58 * -Math.sin(3 * w(t) + 0.2),
  );

const SWEEP = (t: number) =>
  new THREE.Vector3(
    1.52 * Math.cos(w(t) + 0.8),
    0.56 * Math.sin(w(t) + 0.8) + 0.16 * Math.sin(3 * w(t)),
    0.96 * Math.sin(2 * w(t) + 0.4),
  );

const COIL = (t: number) => {
  const shrink = 0.72 + 0.28 * Math.cos(3 * w(t));
  return new THREE.Vector3(
    0.92 * Math.cos(2 * w(t) + 1.7) * shrink,
    0.86 * Math.sin(2 * w(t) + 1.7) * shrink,
    0.78 * Math.sin(3 * w(t) + 0.9),
  );
};

const HOOPS = (t: number) =>
  new THREE.Vector3(
    1.72 * Math.cos(w(t)),
    0.78 * Math.sin(2 * w(t) + 0.5),
    1.12 * Math.sin(w(t)),
  );

function ribbonSpecs(): RibbonSpec[] {
  return [
    {
      curve: new FunctionCurve(TREFOIL),
      rotation: [0.34, 0.15, 0.24],
      width: 0.55,
      thickness: 0.038,
      twist: TAU,
      colors: { light: 0x0d2a42, dark: 0x24506f },
      roughness: [0.18, 0.15],
      iridescence: [0.18, 0.32],
      envIntensity: [1.05, 1.2],
    },
    {
      curve: new FunctionCurve(SWEEP),
      rotation: [0.95, 0.55, 0.05],
      width: 0.66,
      thickness: 0.032,
      twist: TAU,
      colors: { light: 0x9c4a1c, dark: 0xff7a2e },
      roughness: [0.21, 0.17],
      iridescence: [0.22, 0.4],
      envIntensity: [1.0, 1.15],
    },
    {
      curve: new FunctionCurve(COIL),
      rotation: [-0.42, 1.05, 0.48],
      width: 0.36,
      thickness: 0.024,
      twist: TAU,
      colors: { light: 0x6c7a88, dark: 0xdbe6ef },
      roughness: [0.15, 0.12],
      iridescence: [0.3, 0.5],
      envIntensity: [1.15, 1.3],
    },
    {
      curve: new FunctionCurve(HOOPS),
      rotation: [1.22, 0.18, -0.3],
      width: 0.44,
      thickness: 0.03,
      twist: -TAU,
      colors: { light: 0x081a2b, dark: 0x1c4a6b },
      roughness: [0.19, 0.16],
      iridescence: [0.18, 0.3],
      envIntensity: [1.0, 1.15],
    },
  ];
}

export function createLiquidCoreRig(quality: SculptureQuality, env: THREE.Texture): SculptureRig {
  const scene = new THREE.Scene();
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  const root = new THREE.Group();
  scene.add(root);

  const inner = new THREE.Group();
  // The knot is authored at a generous scale; on the page it has to sit behind
  // the timeline without competing with it.
  inner.scale.setScalar(0.62);
  root.add(inner);

  const segments: [number, number] = quality.ribbonSegments;
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.MeshPhysicalMaterial[] = [];
  const specs = ribbonSpecs();

  specs.forEach((spec, index) => {
    const geometry = createRibbonGeometry(spec.curve, {
      width: spec.width,
      thickness: spec.thickness,
      twist: spec.twist,
      segments,
    });
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(spec.colors.light),
      metalness: 1,
      roughness: spec.roughness[0],
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      iridescence: spec.iridescence[0],
      iridescenceIOR: 1.32,
      iridescenceThicknessRange: [140, 520],
      envMapIntensity: spec.envIntensity[0],
    });
    material.userData.spec = spec;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(...spec.rotation);
    // Each band gets a slow drift of its own: the knot lives, it does not spin.
    mesh.userData.drift = 0.35 + index * 0.18;
    inner.add(mesh);
    geometries.push(geometry);
    materials.push(material);
  });

  const key = new THREE.DirectionalLight(new THREE.Color(0xffc9a0), 3.1);
  key.position.set(4.2, 3.4, 3.2);
  scene.add(key);

  const fill = new THREE.DirectionalLight(new THREE.Color(0x2f78c8), 1.5);
  fill.position.set(-3.8, 0.8, 2.2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(new THREE.Color(BRAND.cyan), 1.4);
  rim.position.set(-1.6, 2.2, -4.4);
  scene.add(rim);

  const ember = new THREE.DirectionalLight(new THREE.Color(BRAND.orange), 1.1);
  ember.position.set(-3.2, -2.4, 1.4);
  scene.add(ember);

  const ambient = new THREE.HemisphereLight(new THREE.Color(BRAND.paper), new THREE.Color(BRAND.navy), 0.3);
  scene.add(ambient);

  const applyThemeMix = (mix: number) => {
    materials.forEach((material) => {
      const spec = material.userData.spec as RibbonSpec;
      material.color.copy(mixColor(spec.colors.light, spec.colors.dark, mix));
      material.roughness = spec.roughness[0] + (spec.roughness[1] - spec.roughness[0]) * mix;
      material.iridescence = spec.iridescence[0] + (spec.iridescence[1] - spec.iridescence[0]) * mix;
      material.envMapIntensity =
        spec.envIntensity[0] + (spec.envIntensity[1] - spec.envIntensity[0]) * mix;
    });

    key.intensity = 3.1 + (4.0 - 3.1) * mix;
    key.color.copy(mixColor(0xffc9a0, 0xffb27a, mix));
    fill.intensity = 1.5 + (2.3 - 1.5) * mix;
    fill.color.copy(mixColor(0x2f78c8, 0x4a94e4, mix));
    rim.intensity = 1.4 + (2.2 - 1.4) * mix;
    ember.intensity = 1.1 + (2.0 - 1.1) * mix;
    ambient.intensity = 0.3 + (0.42 - 0.3) * mix;
  };

  const compose = (elapsed: number, pointerX: number, pointerY: number, progress: number) => {
    root.position.y = rig.rest.y;
    root.rotation.y = rig.rest.rotationY + progress * 1.15 + pointerX * 0.12;
    root.rotation.x = rig.rest.rotationX + progress * 0.18 - pointerY * 0.08;
    root.rotation.z = Math.sin(elapsed * 0.16) * 0.035;

    inner.children.forEach((child, index) => {
      const drift = child.userData.drift as number;
      child.rotation.y = Math.sin(elapsed * 0.11 * drift + index) * 0.06;
      child.rotation.z = Math.cos(elapsed * 0.09 * drift + index * 1.3) * 0.05;
    });

    const distance = rig.cameraRig.distance + progress * rig.cameraRig.push;
    camera.position.set(pointerX * 0.22, rig.cameraRig.height - pointerY * 0.16, distance);
    camera.lookAt(0, rig.cameraRig.lookAhead, 0);

    // The lights travel too: a fixed rig under a moving object reads as a
    // rotation, a moving rig reads as light in a room.
    key.position.set(4.2 + Math.sin(elapsed * 0.12) * 0.7, 3.4 + Math.cos(elapsed * 0.1) * 0.4, 3.2);
    rim.position.set(-1.6 + Math.cos(elapsed * 0.09) * 0.6, 2.2, -4.4);
  };

  const rig: SculptureRig = {
    scene,
    camera,
    root,
    rest: { y: 0, rotationX: 0.12, rotationY: 0.4 },
    pointer: { x: 0, y: 0 },
    scroll: { progress: 0 },
    cameraRig: { distance: quality.mobile ? 7.4 : 6.9, push: -0.6, height: 0.06, lookAhead: 0.02 },
    applyThemeMix,
    tick: (elapsed) => compose(elapsed, rig.pointer.x, rig.pointer.y, rig.scroll.progress),
    still: (elapsed) => compose(elapsed, 0, 0, 0.35),
    dispose: () => {
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      inner.clear();
      root.clear();
      scene.clear();
    },
  };

  return rig;
}

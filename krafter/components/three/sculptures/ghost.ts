import * as THREE from "three";
import { fbm2, smoothstep, SNOISE_GLSL } from "./noise";
import { BRAND, mixColor } from "./studio";
import type { SculptureQuality, SculptureRig } from "./types";

/**
 * THE LIVING GHOST
 *
 * A veil, not a sphere. The surface is a hand-written parametric sheet: a dome
 * that opens into five hanging lobes, with folds running down it and two carved
 * eye sockets. Nothing here is a primitive, and every silhouette curve is a
 * function of the angle around the body, so the hem can breathe and sway.
 *
 * The eyes are cut per pixel in the fragment shader, in the sheet's own UV
 * space. That keeps the ovals razor sharp at any device pixel ratio without a
 * boolean operation or a dense enough mesh to make the rim look polygonal.
 *
 * Hidden behind the eyes is a dark inner shell, so a hole reads as depth rather
 * than as a window on the page.
 */

/** Eye geometry, shared by the mesh (sockets) and the shader (holes). */
export const GHOST_EYES = {
  /** Longitude of both eyes, in UV space (0 and 1 meet at the front). */
  centers: [0.065, 0.935] as const,
  centerV: 0.395,
  radiusU: 0.0265,
  radiusV: 0.125,
  /** How far the socket scoop reaches, as a multiple of the eye radius. */
  socket: 1.38,
  /** Depth of the scoop, relative to the local radius. */
  depth: 0.08,
};

const LOBES = 5;
const SCALE = 0.74;

const tmpP = new THREE.Vector3();
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpC = new THREE.Vector3();
const tmpD = new THREE.Vector3();
const tmpN = new THREE.Vector3();
const tanU = new THREE.Vector3();
const tanV = new THREE.Vector3();

/** The sheet itself: (u around, v from crown to hem) → a point in space. */
function ghostPoint(u: number, v: number, out: THREE.Vector3): number {
  const phi = u * Math.PI * 2;
  // Sampled on the circle so the noise closes perfectly at the seam between
  // u = 0 and u = 1: no visible line down the front.
  const wobble = fbm2(Math.cos(phi) * 1.9 + 4.2, Math.sin(phi) * 1.9 + v * 3.4) * 0.018;

  // One smooth descent from crown to hem: flat at the top (a dome), flat at the
  // bottom (the hem does not stop dead), fast in the middle.
  const descent = smoothstep(0, 1, v);
  let y = 1.02 - 1.86 * descent;

  // The body opens to its full width just above the middle, then flares a
  // little into the skirt.
  let r = 0.9 * Math.sin((Math.PI / 2) * smoothstep(0, 0.58, v));
  r += 0.06 * smoothstep(0.7, 1, v);

  // Five scallops: the hem swells outward and hangs lower, in rounded lobes,
  // with a notch between each one.
  const wave = Math.cos(LOBES * phi + 0.55);
  const lobe = Math.pow(0.5 + 0.5 * wave, 1.5);
  const skirt = smoothstep(0.5, 0.97, v);
  r += lobe * skirt * 0.03 - (1 - lobe) * skirt * 0.015;
  y -= lobe * skirt * 0.52;

  // The last rows turn under, which is what makes a hem look rounded instead
  // of cut.
  const lip = smoothstep(0.86, 1, v);
  r -= lobe * lip * 0.075;
  y += lip * 0.03;

  // Sheets, not tubes: a couple of soft folds running down the veil.
  r += Math.sin(LOBES * phi + 0.55 + Math.sin(v * 3.4) * 0.5) * 0.016 * skirt;
  r *= 1 + wobble;

  // Eye sockets: scooped, so the rim catches the key light.
  let socket = 0;
  for (const center of GHOST_EYES.centers) {
    let du = Math.abs(u - center);
    du = Math.min(du, 1 - du) / GHOST_EYES.radiusU;
    const dv = (v - GHOST_EYES.centerV) / GHOST_EYES.radiusV;
    const d = Math.sqrt(du * du + dv * dv);
    if (d < GHOST_EYES.socket) {
      socket = Math.max(socket, 1 - smoothstep(0.7, GHOST_EYES.socket, d));
    }
  }
  r *= 1 - socket * GHOST_EYES.depth;

  out.set(r * Math.sin(phi) * SCALE, y * SCALE, r * Math.cos(phi) * SCALE);
  return socket;
}

/**
 * Builds the veil. Normals are analytic (finite differences of the same sheet),
 * so the seam between u = 0 and u = 1 is invisible without any merge pass.
 */
export function createGhostGeometry([columns, rows]: [number, number]): THREE.BufferGeometry {
  const positions = new Float32Array((columns + 1) * (rows + 1) * 3);
  const normals = new Float32Array((columns + 1) * (rows + 1) * 3);
  const uvs = new Float32Array((columns + 1) * (rows + 1) * 2);
  const indices: number[] = [];

  // One probe decides the orientation of the whole sheet.
  const eps = 0.0012;
  ghostPoint(0.2 + eps, 0.3, tmpA);
  ghostPoint(0.2 - eps, 0.3, tmpB);
  ghostPoint(0.2, 0.3 + eps, tmpC);
  ghostPoint(0.2, 0.3 - eps, tmpD);
  tanU.subVectors(tmpA, tmpB);
  tanV.subVectors(tmpC, tmpD);
  tmpN.crossVectors(tanU, tanV).normalize();
  ghostPoint(0.2, 0.3, tmpP);
  const outward = new THREE.Vector3(tmpP.x, 0, tmpP.z);
  const orientation = tmpN.dot(outward) < 0 ? -1 : 1;

  let cursor = 0;
  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns;

      ghostPoint(u, v, tmpP);
      ghostPoint(u + eps, v, tmpA);
      ghostPoint(u - eps, v, tmpB);
      ghostPoint(u, v + eps, tmpC);
      ghostPoint(u, Math.max(0, v - eps), tmpD);
      tanU.subVectors(tmpA, tmpB);
      tanV.subVectors(tmpC, tmpD);
      tmpN.crossVectors(tanU, tanV);
      // At the crown the two tangents collapse; the pole normal is simply up.
      if (tmpN.lengthSq() < 1e-12) tmpN.set(0, 1, 0);
      else tmpN.normalize().multiplyScalar(orientation);

      positions[cursor * 3] = tmpP.x;
      positions[cursor * 3 + 1] = tmpP.y;
      positions[cursor * 3 + 2] = tmpP.z;
      normals[cursor * 3] = tmpN.x;
      normals[cursor * 3 + 1] = tmpN.y;
      normals[cursor * 3 + 2] = tmpN.z;
      uvs[cursor * 2] = u;
      uvs[cursor * 2 + 1] = v;
      cursor += 1;
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 1;
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

const VERTEX_DECLARATIONS = /* glsl */ `
uniform float uTime;
uniform float uBreath;
varying vec2 vSculptUv;
varying vec3 vSculptPos;
${SNOISE_GLSL}
`;

const FRAGMENT_DECLARATIONS = /* glsl */ `
uniform vec2 uEyeCenterA;
uniform vec2 uEyeCenterB;
uniform vec3 uTintLow;
uniform vec3 uTintHigh;
uniform vec3 uRimTint;
uniform float uSheenGain;
uniform float uRimGain;
varying vec2 vSculptUv;
varying vec3 vSculptPos;
`;

/**
 * The ghost material. `MeshPhysicalMaterial` carries the real thin-film
 * iridescence and the clearcoat; the injected shader only adds what three does
 * not provide: the breathing displacement, the eye cut-out, and a faint brand
 * tinted sheen that keeps the object inside the KRAFTER palette.
 */
export function createGhostMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x5a839c),
    metalness: 0,
    roughness: 0.11,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 0.9,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [220, 600],
    sheen: 0.4,
    sheenColor: new THREE.Color(0xbfe9f2),
    sheenRoughness: 0.45,
    envMapIntensity: 1.5,
    side: THREE.DoubleSide,
  });

  const uniforms = {
    uTime: { value: 0 },
    uBreath: { value: 0.02 },
    uEyeCenterA: { value: new THREE.Vector2(GHOST_EYES.centers[0], GHOST_EYES.centerV) },
    uEyeCenterB: { value: new THREE.Vector2(GHOST_EYES.centers[1], GHOST_EYES.centerV) },
    uTintLow: { value: new THREE.Color(BRAND.ember) },
    uTintHigh: { value: new THREE.Color(BRAND.cyan) },
    uRimTint: { value: new THREE.Color(BRAND.paper) },
    uSheenGain: { value: 0.22 },
    uRimGain: { value: 0.15 },
  };
  material.userData.uniforms = uniforms;

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${VERTEX_DECLARATIONS}`)
      .replace(
        "#include <begin_vertex>",
        /* glsl */ `
        vec3 transformed = vec3(position);

        // Breathing: two slow noise fields along the normal. Amplitude is tiny,
        // the movement is in the phase, not the size.
        vec3 dir = normalize(position);
        float swell = noiseK(dir * 2.1 + vec3(0.0, uTime * 0.11, 0.0));
        float ripple = noiseK(dir * 5.4 + vec3(uTime * 0.19, 0.0, uTime * 0.07));
        transformed += normal * (swell * uBreath + ripple * uBreath * 0.38);
        transformed *= 1.0 + sin(uTime * 0.72) * 0.006;

        vSculptUv = uv;
        vSculptPos = transformed;
        `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${FRAGMENT_DECLARATIONS}`)
      .replace(
        "#include <clipping_planes_fragment>",
        /* glsl */ `
        #include <clipping_planes_fragment>
        float hole = 1e5;
        for (int i = 0; i < 2; i++) {
          vec2 center = i == 0 ? uEyeCenterA : uEyeCenterB;
          float du = abs(vSculptUv.x - center.x);
          du = min(du, 1.0 - du) / ${GHOST_EYES.radiusU.toFixed(6)};
          float dv = (vSculptUv.y - center.y) / ${GHOST_EYES.radiusV.toFixed(6)};
          hole = min(hole, du * du + dv * dv);
        }
        if (hole < 1.0) discard;
        `,
      )
      .replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `
        #include <emissivemap_fragment>

        // A thin brand tinted reflection, strongest at grazing angles.
        vec3 viewDirK = normalize(vViewPosition);
        float fresnel = pow(1.0 - clamp(dot(normalize(normal), viewDirK), 0.0, 1.0), 2.2);
        float height = smoothstep(-0.95, 0.9, vSculptPos.y / 1.15);
        totalEmissiveRadiance += mix(uTintLow, uTintHigh, height) * fresnel * uSheenGain;

        // The cut edge of each eye catches a line of light, like real thickness.
        float rim = smoothstep(1.0, 1.16, hole) * (1.0 - smoothstep(1.16, 1.5, hole));
        totalEmissiveRadiance += uRimTint * rim * uRimGain;
        `,
      );
  };
  material.customProgramCacheKey = () => "krafter-ghost-v1";

  return material;
}

/** Builds the ghost rig: scene, camera, veil, inner cavity, lights. */
export function createGhostRig(quality: SculptureQuality, env: THREE.Texture): SculptureRig {
  const scene = new THREE.Scene();
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  const root = new THREE.Group();
  scene.add(root);

  const geometry = createGhostGeometry(quality.ghostSegments);
  const material = createGhostMaterial();
  const veil = new THREE.Mesh(geometry, material);
  root.add(veil);

  // Inner shell: seen only through the eyes, it gives the holes a floor.
  const cavityMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x01040a),
    roughness: 0.62,
    metalness: 0,
    envMapIntensity: 0.1,
    side: THREE.BackSide,
  });
  const cavity = new THREE.Mesh(geometry, cavityMaterial);
  cavity.scale.setScalar(0.9);
  root.add(cavity);

  const key = new THREE.DirectionalLight(new THREE.Color(0xffc79b), 2.4);
  key.position.set(3.4, 3.2, 3.6);
  scene.add(key);

  const fill = new THREE.DirectionalLight(new THREE.Color(0x2a6fb8), 1.0);
  fill.position.set(-3.6, 1.2, 2.4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(new THREE.Color(BRAND.cyan), 0.9);
  rim.position.set(-1.2, 1.6, -4.2);
  scene.add(rim);

  const glow = new THREE.PointLight(new THREE.Color(BRAND.orange), 1.6, 10, 2);
  glow.position.set(-1.8, -1.5, 2.4);
  scene.add(glow);

  const coolBounce = new THREE.PointLight(new THREE.Color(0x2f7fc4), 1.2, 10, 2);
  coolBounce.position.set(2.4, 1.2, 1.6);
  scene.add(coolBounce);

  const ambient = new THREE.HemisphereLight(new THREE.Color(BRAND.paper), new THREE.Color(BRAND.navy), 0.35);
  scene.add(ambient);

  const uniforms = material.userData.uniforms as Record<string, { value: number | THREE.Color | THREE.Vector2 }>;

  const applyThemeMix = (mix: number) => {
    material.color.copy(mixColor(0x5a839c, 0x7ba6bd, mix));
    material.roughness = 0.11 + (0.09 - 0.11) * mix;
    material.iridescence = 0.9 + (0.75 - 0.9) * mix;
    material.envMapIntensity = 1.5 + (1.8 - 1.5) * mix;
    material.iridescenceThicknessRange = [220 + 60 * mix, 600 + 100 * mix];
    material.sheenColor.copy(mixColor(0xbfe9f2, 0xa9e8f5, mix));
    material.sheen = 0.4 + (0.62 - 0.4) * mix;

    cavityMaterial.color.copy(mixColor(0x02060c, 0x01040a, mix));
    cavityMaterial.envMapIntensity = 0.1 + (0.16 - 0.1) * mix;

    (uniforms.uTintLow.value as THREE.Color).copy(mixColor(BRAND.ember, 0xff8a3d, mix));
    (uniforms.uTintHigh.value as THREE.Color).copy(mixColor(BRAND.cyan, 0x7fe6f2, mix));
    (uniforms.uRimTint.value as THREE.Color).copy(mixColor(0xffffff, 0xffd2b0, mix));
    uniforms.uSheenGain.value = 0.22 + (0.32 - 0.22) * mix;
    uniforms.uRimGain.value = 0.15 + (0.26 - 0.15) * mix;

    key.intensity = 2.4 + (3.3 - 2.4) * mix;
    key.color.copy(mixColor(0xffc79b, 0xffb47a, mix));
    fill.intensity = 1.0 + (1.6 - 1.0) * mix;
    fill.color.copy(mixColor(0x2a6fb8, 0x3f8fe0, mix));
    rim.intensity = 0.9 + (1.6 - 0.9) * mix;
    glow.intensity = 1.6 + (2.6 - 1.6) * mix;
    coolBounce.intensity = 1.2 + (1.9 - 1.2) * mix;
    ambient.intensity = 0.35 + (0.45 - 0.35) * mix;
  };

  const compose = (elapsed: number, pointerX: number, pointerY: number, progress: number) => {
    root.position.y = rig.rest.y + Math.sin(elapsed * 0.41) * 0.028;
    root.position.x = -0.12 + pointerX * 0.07;
    root.rotation.y = rig.rest.rotationY + pointerX * 0.2;
    root.rotation.x = rig.rest.rotationX - pointerY * 0.11;
    root.rotation.z = pointerX * 0.03;

    const distance = rig.cameraRig.distance + progress * rig.cameraRig.push;
    camera.position.set(pointerX * 0.2, rig.cameraRig.height - pointerY * 0.14, distance);
    camera.lookAt(0, rig.cameraRig.lookAhead, 0);
  };

  const rig: SculptureRig = {
    scene,
    camera,
    root,
    rest: { y: 0, rotationX: -0.02, rotationY: 0 },
    pointer: { x: 0, y: 0 },
    scroll: { progress: 0 },
    cameraRig: { distance: quality.mobile ? 5.8 : 5.5, push: -0.5, height: 0.02, lookAhead: -0.06 },
    applyThemeMix,
    tick: (elapsed) => {
      uniforms.uTime.value = elapsed;
      compose(elapsed, rig.pointer.x, rig.pointer.y, rig.scroll.progress);
    },
    still: (elapsed) => {
      uniforms.uTime.value = elapsed;
      compose(elapsed, 0, 0, 0);
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      cavityMaterial.dispose();
      root.clear();
      scene.clear();
    },
  };

  return rig;
}

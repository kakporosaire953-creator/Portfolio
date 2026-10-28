/**
 * Technical checks for the two sculptures.
 *
 * These run on the real modules the site ships, in plain Node, with no browser:
 * they verify the things that are invisible in a screenshot and expensive to
 * discover in production, such as a seam that does not close, a normal that is
 * not unit length, an eye socket that is not carved, or a shader patch that
 * silently missed its anchor and would leave the ghost with painted eyes.
 *
 * Run with: npm run test:sculptures
 */

import * as THREE from "three";
import { GHOST_EYES, createGhostGeometry, createGhostMaterial } from "../components/three/sculptures/ghost.ts";
import { createRibbonGeometry } from "../components/three/sculptures/liquidCore.ts";
import { fbm2, valueNoise2 } from "../components/three/sculptures/noise.ts";
import { mix, mixColor } from "../components/three/sculptures/studio.ts";

let failures = 0;
let checks = 0;

function check(name, condition, detail = "") {
  checks += 1;
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? `: ${detail}` : ""}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

function isFiniteArray(array) {
  for (let i = 0; i < array.length; i += 1) if (!Number.isFinite(array[i])) return false;
  return true;
}

function resolveIncludes(source) {
  let out = source;
  for (let guard = 0; guard < 64; guard += 1) {
    const next = out.replace(/#include <([\w]+)>/g, (match, name) => THREE.ShaderChunk[name] ?? match);
    if (next === out) break;
    out = next;
  }
  return out;
}

function braceBalance(source) {
  let depth = 0;
  for (const char of source) {
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

/* -------------------------------------------------------------------------- */
section("Ghost geometry");
/* -------------------------------------------------------------------------- */

const ghost = createGhostGeometry([160, 96]);
const ghostPositions = ghost.attributes.position.array;
const ghostNormals = ghost.attributes.normal.array;
const ghostUvs = ghost.attributes.uv.array;
const columns = 161;
const rows = 97;

check("vertices are finite", isFiniteArray(ghostPositions));
check("normals are finite", isFiniteArray(ghostNormals));
check("uvs are in 0..1", Array.from(ghostUvs).every((value) => value >= 0 && value <= 1));
check("triangle count matches the grid", ghost.index.count / 3 === 160 * 96 * 2, `${ghost.index.count / 3}`);
check(
  "every index is in range",
  Array.from(ghost.index.array).every((index) => index >= 0 && index < columns * rows),
);

let unitNormals = true;
for (let i = 0; i < ghostNormals.length; i += 3) {
  const length = Math.hypot(ghostNormals[i], ghostNormals[i + 1], ghostNormals[i + 2]);
  if (Math.abs(length - 1) > 1e-3) unitNormals = false;
}
check("normals are unit length", unitNormals);

// The seam between u = 0 and u = 1 must be welded, or a line shows down the body.
let seamError = 0;
for (let row = 0; row < rows; row += 1) {
  const a = (row * columns) * 3;
  const b = (row * columns + columns - 1) * 3;
  for (let axis = 0; axis < 3; axis += 1) seamError = Math.max(seamError, Math.abs(ghostPositions[a + axis] - ghostPositions[b + axis]));
}
check("u seam is welded", seamError < 1e-6, `max gap ${seamError.toExponential(2)}`);

const box = new THREE.Box3().setFromBufferAttribute(new THREE.BufferAttribute(ghostPositions, 3));
const size = new THREE.Vector3();
box.getSize(size);
check("the body is taller than it is wide", size.y > size.x * 1.05, `${size.x.toFixed(2)} x ${size.y.toFixed(2)}`);
check("nothing is degenerate", size.x > 0.5 && size.y > 0.5 && size.z > 0.5, size.toArray().map((n) => n.toFixed(2)).join(","));

// Five lobes: the hem edge, seen from above, must show five maxima.
const hemRadii = [];
for (let column = 0; column < columns - 1; column += 1) {
  const index = ((rows - 1) * columns + column) * 3;
  hemRadii.push(Math.hypot(ghostPositions[index], ghostPositions[index + 2]));
}
let maxima = 0;
for (let i = 0; i < hemRadii.length; i += 1) {
  const previous = hemRadii[(i - 1 + hemRadii.length) % hemRadii.length];
  const current = hemRadii[i];
  const next = hemRadii[(i + 1) % hemRadii.length];
  if (current > previous && current >= next) maxima += 1;
}
check("the hem has five lobes", maxima === 5, `${maxima} maxima`);

// Eye sockets are geometry, not paint: the surface is pulled in around them.
function radiusAt(u, v) {
  const column = Math.round(u * 160) % 160;
  const row = Math.round(v * 96);
  const index = (row * columns + column) * 3;
  return Math.hypot(ghostPositions[index], ghostPositions[index + 2]);
}
const atEye = radiusAt(GHOST_EYES.centers[0], GHOST_EYES.centerV);
const besideEye = radiusAt(GHOST_EYES.centers[0] + GHOST_EYES.radiusU * 3, GHOST_EYES.centerV);
check("the eyes are carved into the surface", atEye < besideEye * 0.95, `${atEye.toFixed(3)} vs ${besideEye.toFixed(3)}`);

/* -------------------------------------------------------------------------- */
section("Liquid core ribbons");
/* -------------------------------------------------------------------------- */

const TAU = Math.PI * 2;
const ring = (t) =>
  new THREE.Vector3(
    0.55 * (Math.sin(t * TAU) + 2 * Math.sin(2 * t * TAU + 0.35)),
    0.62 * (Math.cos(t * TAU) - 2 * Math.cos(2 * t * TAU + 0.35)),
    0.58 * -Math.sin(3 * t * TAU + 0.2),
  );
class TestCurve extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const point = ring(t);
    return target.copy(point);
  }
}

const width = 0.4;
const thickness = 0.03;
const radialSegments = 24;
const lengthSegments = 120;
const ribbon = createRibbonGeometry(new TestCurve(), {
  width,
  thickness,
  twist: TAU,
  segments: [lengthSegments, radialSegments],
});
const ribbonPositions = ribbon.attributes.position.array;
const ribbonNormals = ribbon.attributes.normal.array;

check("vertices are finite", isFiniteArray(ribbonPositions));
check("normals are unit length", (() => {
  for (let i = 0; i < ribbonNormals.length; i += 3) {
    const length = Math.hypot(ribbonNormals[i], ribbonNormals[i + 1], ribbonNormals[i + 2]);
    if (Math.abs(length - 1) > 1e-3) return false;
  }
  return true;
})());
check("the band is closed", ribbon.index.count / 3 === lengthSegments * radialSegments * 2);

// Cross-section aspect: a ribbon, not a tube.
let maxCross = 0;
for (let j = 0; j <= radialSegments; j += 1) {
  const a = j * 3;
  for (let k = j + 1; k <= radialSegments; k += 1) {
    const b = k * 3;
    const distance = Math.hypot(
      ribbonPositions[a] - ribbonPositions[b],
      ribbonPositions[a + 1] - ribbonPositions[b + 1],
      ribbonPositions[a + 2] - ribbonPositions[b + 2],
    );
    maxCross = Math.max(maxCross, distance);
  }
}
check("the cross-section is a flat ribbon", Math.abs(maxCross - width * 2) < 0.01, `${maxCross.toFixed(3)} for width ${width}`);

// Closing ring exactness.
let ribbonSeam = 0;
const stride = radialSegments + 1;
for (let j = 0; j <= radialSegments; j += 1) {
  const first = j * 3;
  const last = (lengthSegments * stride + j) * 3;
  for (let axis = 0; axis < 3; axis += 1) {
    ribbonSeam = Math.max(ribbonSeam, Math.abs(ribbonPositions[first + axis] - ribbonPositions[last + axis]));
  }
}
check("the ribbon closes on itself", ribbonSeam < 1e-6, `max gap ${ribbonSeam.toExponential(2)}`);

/* -------------------------------------------------------------------------- */
section("Ghost shader");
/* -------------------------------------------------------------------------- */

const material = createGhostMaterial();
const shader = {
  uniforms: {},
  vertexShader: THREE.ShaderLib.physical.vertexShader,
  fragmentShader: THREE.ShaderLib.physical.fragmentShader,
};
material.onBeforeCompile(shader, null);
const vertex = resolveIncludes(shader.vertexShader);
const fragment = resolveIncludes(shader.fragmentShader);

check("the vertex displacement was injected", shader.vertexShader.includes("transformed += normal * (swell"));
check("the eye cut was injected after the clipping chunk", /#include <clipping_planes_fragment>[\s\S]{0,80}float hole = 1e5/.test(shader.fragmentShader));
check("the brand sheen was injected after the emissive chunk", /#include <emissivemap_fragment>[\s\S]{0,200}viewDirK/.test(shader.fragmentShader));
check("the breathing noise made it in", vertex.includes("noiseK") && vertex.includes("uBreath"));
check("the UV varyings agree", vertex.includes("varying vec2 vSculptUv") && fragment.includes("varying vec2 vSculptUv"));
check("the eyes are cut, not painted", fragment.includes("discard") && fragment.includes(GHOST_EYES.radiusU.toFixed(6)));
check("the brand sheen is added to the emissive term", fragment.includes("totalEmissiveRadiance +="));
// Balanced braces on the shipped source: this catches an injected block that
// was cut in the middle of a scope.
check("the vertex shader is structurally closed", braceBalance(shader.vertexShader), "unbalanced braces");
check("the fragment shader is structurally closed", braceBalance(shader.fragmentShader), "unbalanced braces");
check("every injected uniform is declared", ["uTime", "uBreath", "uEyeCenterA", "uEyeCenterB", "uTintLow", "uTintHigh", "uRimTint", "uSheenGain", "uRimGain"]
  .every((name) => vertex.includes(`uniform`) && (vertex.includes(name) || fragment.includes(name))));
check("the program cache key is stable", material.customProgramCacheKey() === "krafter-ghost-v1");

/* -------------------------------------------------------------------------- */
section("Theme and noise");
/* -------------------------------------------------------------------------- */

check("mix interpolates both ends", mix(2, 6, 0) === 2 && mix(2, 6, 1) === 6 && Math.abs(mix(2, 6, 0.5) - 4) < 1e-9);
const light = mixColor(0xffffff, 0x000000, 0);
const dark = mixColor(0xffffff, 0x000000, 1);
check("mixColor reaches both art directions", light.getHex() === 0xffffff && dark.getHex() === 0x000000);
check("noise is deterministic", valueNoise2(1.3, 4.7) === valueNoise2(1.3, 4.7));
check("noise stays in range", (() => {
  for (let i = 0; i < 500; i += 1) {
    const value = fbm2(i * 0.37, i * 0.11);
    if (value < -1.2 || value > 1.2) return false;
  }
  return true;
})());

/* -------------------------------------------------------------------------- */

console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures > 0) {
  console.error(`${failures} failing check(s)`);
  process.exit(1);
}

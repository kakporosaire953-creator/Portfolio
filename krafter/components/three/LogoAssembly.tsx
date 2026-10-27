"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MARK_LOOPS } from "@/lib/brand/markGeometry";

/**
 * KRAFTER / ASSEMBLY, the WebGL half.
 *
 * The official monogram, extruded from the traced geometry, assembled in front
 * of the camera: two halves dock, the brand colour plates slide out from
 * behind, a light sweeps across the metal. Roughly two seconds, then the
 * loader lifts.
 *
 * Constraints, in order:
 *  - the CSS posters (MarkGlyph) is already painted, this canvas fades in on top;
 *  - one renderer, capped pixel ratio, paused when the tab is hidden;
 *  - every geometry, material, texture and listener is disposed on unmount;
 *  - no WebGL, no motion: the caller keeps the static poster instead.
 */

const ORANGE = new THREE.Color("#ff6a00");
const BLUE = new THREE.Color("#1e6fd9");
const INK = new THREE.Color("#0c1a2a");

const DURATION = 2000; // ms, assembly choreography
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

function shapeFromLoop(loop: [number, number][]) {
  const shape = new THREE.Shape();
  loop.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

export function LogoAssembly({
  onReady,
  className,
}: {
  /** Called once the first frame is on screen, so the caller can fade the canvas in. */
  onReady?: () => void;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // caller keeps the static poster
    }

    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    const isSmall = width < 640;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.6 : 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 60);
    const camZ = isSmall ? 4.9 : 4.2;
    camera.position.set(0, 0, camZ);

    // Studio reflections, so the metal has something to answer to.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
    scene.environment = envTexture;

    const group = new THREE.Group();
    scene.add(group);

    // --- geometry -------------------------------------------------------------
    const baseGeometry: THREE.ExtrudeGeometry[] = [];
    const extrude = (loop: [number, number][]) => {
      const geometry = new THREE.ExtrudeGeometry(shapeFromLoop(loop), {
        depth: 0.26,
        bevelEnabled: true,
        bevelThickness: 0.022,
        bevelSize: 0.018,
        bevelSegments: 2,
        curveSegments: 1,
      });
      geometry.center();
      baseGeometry.push(geometry);
      return geometry;
    };

    const metalMaterial = new THREE.MeshPhysicalMaterial({
      color: INK,
      metalness: 0.62,
      roughness: 0.26,
      clearcoat: 0.9,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.25,
    });

    const parts = MARK_LOOPS.map((loop, index) => {
      const geometry = extrude(loop);
      // Upper half keeps the warm plate, lower half the cool one, exactly the
      // way the official file reads.
      const tone = index === 0 ? ORANGE : BLUE;

      const plateMaterial = new THREE.MeshPhysicalMaterial({
        color: tone,
        metalness: 0.25,
        roughness: 0.42,
        clearcoat: 0.4,
        emissive: tone.clone().multiplyScalar(0.22),
        envMapIntensity: 0.85,
      });

      const metal = new THREE.Mesh(geometry, metalMaterial);
      const plate = new THREE.Mesh(geometry, plateMaterial);
      plate.scale.setScalar(1.035);
      plate.position.z = -0.24;
      plate.visible = true;

      const holder = new THREE.Group();
      holder.add(plate, metal);

      // Assembly start: each half sits aside, back and turned.
      const side = index === 0 ? -1 : 1;
      holder.userData.from = {
        x: side * 0.62,
        y: side * 0.1,
        z: -1.1,
        ry: side * 0.62,
        rz: side * 0.08,
      };
      group.add(holder);
      return { holder, plate, metal };
    });

    const scale = isSmall ? 1.55 : 1.85;
    group.scale.setScalar(scale);

    // Unit edges, for the inline that draws the silhouette once assembled.
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#f6f2ea"),
      transparent: true,
      opacity: 0,
    });
    const edges = MARK_LOOPS.map((loop) => {
      const points = loop.map(([x, y]) => new THREE.Vector3(x, y, 0.16));
      points.push(points[0].clone());
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      baseGeometry.push(geometry as unknown as THREE.ExtrudeGeometry);
      return new THREE.Line(geometry, edgeMaterial);
    });
    edges.forEach((line) => group.add(line));

    // --- lights ---------------------------------------------------------------
    const key = new THREE.DirectionalLight("#fff2e2", 2.4);
    key.position.set(-3.2, 3.4, 4.5);
    const warm = new THREE.PointLight(ORANGE, 26, 12, 2);
    warm.position.set(-2.4, -1.6, 2.2);
    const cool = new THREE.PointLight(BLUE, 30, 12, 2);
    cool.position.set(2.6, 1.2, 2.4);
    const rim = new THREE.DirectionalLight("#cfe0ff", 1.1);
    rim.position.set(2.4, -2.2, -3);
    scene.add(key, warm, cool, rim, new THREE.AmbientLight("#ffffff", 0.35));

    // --- pointer parallax -----------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // --- loop -----------------------------------------------------------------
    const start = performance.now();
    let raf = 0;
    let visible = true;
    let notified = false;

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let last = start;

    const frame = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      const ease = easeOutExpo(t);

      parts.forEach(({ holder }, index) => {
        const from = holder.userData.from as {
          x: number;
          y: number;
          z: number;
          ry: number;
          rz: number;
        };
        const k = Math.min(Math.max((ease - index * 0.06) / (1 - index * 0.06), 0), 1);
        holder.position.set(from.x * (1 - k), from.y * (1 - k), from.z * (1 - k));
        holder.rotation.y = from.ry * (1 - k);
        holder.rotation.z = from.rz * (1 - k);
      });

      // The colour plates slide out from behind right after the halves dock.
      const plateT = Math.min(Math.max((elapsed - 900) / 900, 0), 1);
      const plateEase = easeInOutQuint(plateT);
      parts.forEach(({ plate }) => {
        plate.position.z = -0.24 - (1 - plateEase) * 0.35;
        plate.scale.setScalar(1.035 + (1 - plateEase) * 0.12);
      });

      // A single specular pass across the metal.
      const sweep = Math.min(Math.max((elapsed - 1500) / 700, 0), 1);
      key.position.x = -3.2 + sweep * 6.4;

      // Idle breathing once assembled.
      const idle = Math.max(0, elapsed - DURATION) / 1000;
      group.rotation.y = Math.sin(idle * 0.5) * 0.12 + pointer.x * 0.18;
      group.rotation.x = Math.sin(idle * 0.42) * 0.05 - pointer.y * 0.12;
      group.position.y = Math.sin(idle * 0.8) * 0.03;

      pointer.x += (target.x - pointer.x) * 0.06;
      pointer.y += (target.y - pointer.y) * 0.06;

      camera.position.z = camZ - ease * (isSmall ? 0.25 : 0.45);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      if (!notified && elapsed > 60) {
        notified = true;
        readyRef.current?.();
      }

      if (visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      parts.forEach(({ holder }) => group.remove(holder));
      edges.forEach((line) => group.remove(line));
      baseGeometry.forEach((geometry) => geometry.dispose());
      metalMaterial.dispose();
      parts.forEach(({ plate }) => (plate.material as THREE.Material).dispose());
      edgeMaterial.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} />;
}

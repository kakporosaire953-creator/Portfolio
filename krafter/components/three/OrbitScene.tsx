"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { OrbitPoster } from "@/components/svg/OrbitPoster";

/**
 * KRAFTER / ORBIT
 * A restrained architectural 3D scene: one translucent glass volume, orbital
 * rings, a few geometric points, a camera that barely follows the pointer.
 *
 * - isolated canvas, lazy loaded from the hero
 * - capped pixel ratio, pausing off-screen / on hidden tabs
 * - full disposal of geometries, materials and the renderer
 * - static composition when WebGL is unavailable or motion is reduced
 */
export function OrbitScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

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
      setFailed(true);
      return;
    }

    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    const isSmall = window.matchMedia("(max-width: 767px)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.35 : 1.75));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, isSmall ? 5.4 : 4.6);

    // Environment: a soft studio room so the glass has something to refract.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envTexture = pmrem.fromScene(envScene, 0.06).texture;
    scene.environment = envTexture;

    const group = new THREE.Group();
    scene.add(group);

    // 1 — translucent volume
    const coreGeometry = new THREE.IcosahedronGeometry(isSmall ? 0.92 : 1.06, 0);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dfe8f2"),
      metalness: 0.05,
      roughness: 0.14,
      transmission: 0.94,
      thickness: 1.1,
      ior: 1.42,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.1,
      transparent: true,
      opacity: 0.92,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Thin navy wireframe for architectural structure
    const wireGeometry = new THREE.EdgesGeometry(coreGeometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#081a2b"),
      transparent: true,
      opacity: 0.28,
    });
    const wire = new THREE.LineSegments(wireGeometry, wireMaterial);
    wire.scale.setScalar(1.004);
    group.add(wire);

    // 2 — orbital rings
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ff6a00"),
      transparent: true,
      opacity: 0.85,
    });
    const ringMaterialSoft = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#123b5d"),
      transparent: true,
      opacity: 0.35,
    });

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.0042, 8, 220), ringMaterial);
    ringA.rotation.set(1.18, 0.22, 0.1);
    group.add(ringA);

    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.003, 8, 220), ringMaterialSoft);
    ringB.rotation.set(0.52, 1.02, -0.35);
    group.add(ringB);

    const orbitCurve = new THREE.EllipseCurve(0, 0, 2.35, 1.15, 0, Math.PI * 1.72, false, 0);
    const orbitPoints = orbitCurve.getPoints(140).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#0a0a0a"),
      transparent: true,
      opacity: 0.18,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.rotation.set(-0.6, 0.5, 0.2);
    group.add(orbitLine);

    // 3 — geometric points
    const pointCount = isSmall ? 260 : 620;
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i += 1) {
      const radius = 1.9 + Math.random() * 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#ff6a00"),
      size: 0.016,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    // 4 — lighting
    const keyLight = new THREE.DirectionalLight("#fff2e2", 2.1);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#ff6a00", 1.5);
    rimLight.position.set(-4, -1.5, -2);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight("#f5f2ea", 0.5));

    // Pointer parallax
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Visibility & viewport gating
    let visible = true;
    let inView = true;
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 },
    );
    io.observe(host);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Resize
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Theme reaction: keep the scene readable in dark mode
    const applyTheme = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      wireMaterial.color.set(dark ? "#e9eef3" : "#081a2b");
      wireMaterial.opacity = dark ? 0.34 : 0.28;
      orbitMaterial.color.set(dark ? "#ffffff" : "#0a0a0a");
      orbitMaterial.opacity = dark ? 0.24 : 0.18;
      ringMaterialSoft.color.set(dark ? "#8fb6d6" : "#123b5d");
      pointsMaterial.color.set(dark ? "#ff8f3d" : "#ff6a00");
      coreMaterial.color.set(dark ? "#9fb6c9" : "#dfe8f2");
      coreMaterial.opacity = dark ? 0.85 : 0.92;
    };
    applyTheme();
    window.addEventListener("krafter:theme-change", applyTheme);

    const clock = new THREE.Clock();
    let frameId = 0;

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      camera.position.x = pointer.x * 0.32;
      camera.position.y = -pointer.y * 0.22;
      camera.lookAt(0, 0, 0);

      group.rotation.y = elapsed * 0.12 + pointer.x * 0.18;
      group.rotation.x = Math.sin(elapsed * 0.22) * 0.06 - pointer.y * 0.1;
      group.position.y = Math.sin(elapsed * 0.5) * 0.045;

      ringA.rotation.z = elapsed * 0.16;
      ringB.rotation.z = -elapsed * 0.1;
      orbitLine.rotation.z = elapsed * 0.05;
      points.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    const loop = () => {
      frameId = window.requestAnimationFrame(loop);
      if (!visible || !inView) return;
      renderFrame();
    };

    if (reduced) {
      renderer.render(scene, camera);
    } else {
      loop();
    }

    // A lost context should not leave an empty box.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("krafter:theme-change", applyTheme);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      io.disconnect();
      ro.disconnect();

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ringA.geometry.dispose();
      ringB.geometry.dispose();
      ringMaterial.dispose();
      ringMaterialSoft.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [reduced]);

  if (failed) {
    return (
      <div className={className}>
        <OrbitPoster />
      </div>
    );
  }

  return <div ref={hostRef} className={className} data-orbit-canvas />;
}

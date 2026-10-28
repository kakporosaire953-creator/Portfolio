"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * PROCESS / ATMOSPHERE
 *
 * Decoration behind the method timeline, and nothing more: one thin orbital
 * ring standing on the axis, a slow field of fine dust for depth, and a light
 * that drifts with the pointer. It sits behind the cards, never catches a
 * click, and stops completely the moment the section leaves the screen.
 *
 * Rules kept from the other scenes in this project:
 *  - transparent canvas, capped pixel ratio;
 *  - paused off-screen and on hidden tabs, resumed without a time jump;
 *  - reduced motion never reaches this file (the caller does not mount it);
 *  - every geometry, material, texture and listener is disposed on unmount;
 *  - no WebGL means no canvas at all, and the CSS background carries the look.
 */
export function ProcessAtmosphere({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return; // the section keeps its CSS depth
    }

    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    const isSmall = window.matchMedia("(max-width: 1023px)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.2 : 1.5));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    camera.position.set(0, 0, 9);

    const ink = new THREE.Color("#0b1a2a");
    const orange = new THREE.Color("#ff6a00");
    const blue = new THREE.Color("#1e6fd9");
    const dark = document.documentElement.dataset.theme === "dark";

    // 1. A single thin ring, standing on the axis. Two of them, offset, read
    //    as an orbit rather than a hoop.
    const group = new THREE.Group();
    group.position.set(0, 0.4, 0);
    scene.add(group);

    const ringGeometry = new THREE.TorusGeometry(1.85, 0.005, 6, 160);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: dark ? "#8fb6d6" : blue,
      transparent: true,
      opacity: dark ? 0.26 : 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.set(Math.PI * 0.42, 0.2, 0);
    group.add(ring);

    const ringGeometryB = new THREE.TorusGeometry(2.5, 0.004, 6, 160);
    const ringMaterialB = new THREE.MeshBasicMaterial({
      color: dark ? "#ff8f3d" : orange,
      transparent: true,
      opacity: dark ? 0.18 : 0.14,
    });
    const ringB = new THREE.Mesh(ringGeometryB, ringMaterialB);
    ringB.rotation.set(Math.PI * 0.36, -0.28, 0.2);
    group.add(ringB);

    // 2. Fine dust: depth without noise. Fewer points on small screens.
    const count = isSmall ? 260 : 520;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 1.4 + Math.random() * 6.2;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.42 - 2.5;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: dark ? "#dbe7f2" : ink,
      size: isSmall ? 0.018 : 0.022,
      transparent: true,
      opacity: dark ? 0.24 : 0.18,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // The rings are unlit lines, so "light" is done in colour and opacity
    // instead of a lamp: both drift with the reading progress below.
    const ringBase = ringMaterial.color.clone();
    const ringWarm = new THREE.Color(dark ? "#ffb27a" : "#ffab5a");

    // Pointer parallax, capped so the decoration stays behind the text.
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isSmall) window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Scroll drives the light, not the layout: the section reads its progress.
    let progress = 0;
    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      progress = Math.min(Math.max((window.innerHeight - rect.top) / span, 0), 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Render only while the section is on screen and the tab is visible.
    let inView = false;
    let visible = !document.hidden;
    let sync = () => {};

    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.01, rootMargin: "150px 0px" },
    );
    io.observe(host);

    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let running = false;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;

      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;

      group.rotation.y = elapsed * 0.035 + pointer.x * 0.12;
      group.rotation.x = -0.12 + pointer.y * 0.06;
      group.position.y = 0.4 + Math.sin(elapsed * 0.22) * 0.05;
      // The light leans with the scroll: the inner ring warms and both get a
      // touch more present as the method advances, never more than a texture.
      ringMaterial.color.copy(ringBase).lerp(ringWarm, progress * 0.6);
      ringMaterial.opacity = (dark ? 0.2 : 0.13) + progress * 0.1;
      ringMaterialB.opacity = (dark ? 0.16 : 0.1) + progress * 0.07;

      dust.rotation.y = -elapsed * 0.014 - pointer.x * 0.03;
      dust.position.y = -progress * 0.7;

      camera.position.x = pointer.x * 0.32;
      camera.position.y = -pointer.y * 0.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    // Nothing renders off-screen or on a hidden tab: no drift, no cost.
    const run = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const halt = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    sync = () => {
      if (inView && visible) run();
      else halt();
    };

    const onResize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      ringGeometry.dispose();
      ringGeometryB.dispose();
      ringMaterial.dispose();
      ringMaterialB.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}

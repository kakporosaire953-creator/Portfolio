"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";
import { createGhostRig } from "./sculptures/ghost";
import { createLiquidCoreRig } from "./sculptures/liquidCore";
import { buildStudioEnvironment } from "./sculptures/studio";
import { createSculptureMotion } from "./sculptures/motion";
import { registerSculpture } from "./sculptures/loop";
import type { SculptureModel, SculptureQuality, SculptureRig } from "./sculptures/types";

/**
 * The single stage that both sculptures run in.
 *
 * The stage owns everything that is not the sculpture: one WebGL context, one
 * capped pixel ratio, one environment, the shared render loop, the GSAP score,
 * resize and visibility handling, and complete disposal. The model only builds
 * geometry, materials, lights and how it composes its motion.
 *
 * If WebGL is missing, fails to initialise, or loses its context, `onFail` tells
 * the stage to show the static poster instead of an empty box.
 */

function readQuality(): SculptureQuality {
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  return {
    mobile,
    ghostSegments: mobile ? [208, 128] : [320, 196],
    ribbonSegments: mobile ? [180, 10] : [320, 18],
    maxDpr: Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.75),
  };
}

export function SculptureScene({
  model,
  onReady,
  onFail,
}: {
  model: SculptureModel;
  onReady?: () => void;
  onFail?: () => void;
}) {
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
      onFail?.();
      return;
    }

    const quality = readQuality();
    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;

    renderer.setPixelRatio(quality.maxDpr);
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.className = "sculpture-canvas";
    host.appendChild(renderer.domElement);

    let rig: SculptureRig;
    let envTexture: THREE.Texture;
    try {
      envTexture = buildStudioEnvironment(renderer, model === "ghost" ? 0.03 : 0.035);
      rig = model === "ghost" ? createGhostRig(quality, envTexture) : createLiquidCoreRig(quality, envTexture);
    } catch {
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      setFailed(true);
      onFail?.();
      return;
    }

    rig.camera.aspect = width / height;
    rig.camera.updateProjectionMatrix();

    const mix = document.documentElement.dataset.theme === "dark" ? 1 : 0;
    const motion = createSculptureMotion({
      rig,
      host,
      model,
      reduced,
      initialMix: mix,
      applyExposure: (value) => {
        renderer.toneMappingExposure = 1.05 + (1.16 - 1.05) * value;
      },
      onInvalidate: () => {
        if (reduced) {
          rig.still(0);
          renderer.render(rig.scene, rig.camera);
        }
      },
    });

    const draw = () => renderer.render(rig.scene, rig.camera);
    let loop: ReturnType<typeof registerSculpture> | null = null;

    if (reduced) {
      rig.still(0);
      draw();
      onReady?.();
    } else {
      loop = registerSculpture(
        (elapsed) => {
          rig.tick(elapsed, 0);
          draw();
        },
        true,
      );
      // First frame is already on screen: the poster can step aside now.
      rig.tick(0, 0);
      draw();
      onReady?.();
    }

    // Off screen or in a background tab, the scene costs nothing.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (loop) loop.setActive(visible);
      },
      { rootMargin: "160px 0px", threshold: 0 },
    );
    io.observe(host);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      rig.camera.aspect = w / h;
      rig.camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (reduced) {
        rig.still(0);
        draw();
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
      onFail?.();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    return () => {
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      io.disconnect();
      ro.disconnect();
      loop?.dispose();
      motion.revert();
      rig.dispose();
      envTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [model, reduced, onReady, onFail]);

  if (failed) return null;
  return <div ref={hostRef} className="sculpture-scene" data-sculpture={model} />;
}

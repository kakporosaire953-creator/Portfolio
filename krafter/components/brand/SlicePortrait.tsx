"use client";

import { useEffect, useRef } from "react";

/**
 * The opening portrait, cut into vertical bands that slide out of register.
 *
 * The displacement is not decoration: its amplitude is driven by the real
 * loading progress, so the photograph resolves into a single image exactly when
 * the site is ready. At rest (or with JavaScript disabled) the picture is
 * plain, which is why a normal <img> sits underneath the canvas.
 *
 * Drawn on a canvas rather than with N <img> elements: one decode, no
 * duplicated bitmap per band, and the bands can bleed past the edges without
 * leaving seams.
 */
export function SlicePortrait({
  src,
  progress,
  className,
  alt = "",
  onReady,
}: {
  src: string;
  /** 0 → fully displaced, 100 → perfectly registered. Read every frame. */
  progress: { current: number };
  className?: string;
  alt?: string;
  /** Fires once the photograph is decoded and the first frame is drawn. */
  onReady?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bands = window.matchMedia("(max-width: 700px)").matches ? 13 : 21;

    // Deterministic, irregular displacement: the same rhythm on every visit,
    // never a random mess. Ranged in -1…1.
    const rhythm = Array.from(
      { length: bands },
      (_, i) => Math.sin(i * 1.71 + 0.4) * 0.68 + Math.sin(i * 0.63 + 2.1) * 0.32,
    );

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let idle = 0;
    let image: HTMLImageElement | null = null;
    let stillVisible = true;
    let settled = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const draw = (time: number) => {
      frame = 0;
      if (!image || !width || !height) return;
      const value = Math.max(0, Math.min(100, progress.current));
      // Full displacement at 0 %, a small residual at 100 %: the portrait keeps
      // its cut rhythm instead of snapping back into a plain photograph.
      const amp = 0.06 + 0.94 * Math.pow(1 - value / 100, 1.12);

      // The travel is deliberately small: a band may only move by as much as
      // the photograph's margins allow, so the head is never sliced by the
      // frame edge. The stripes do the rest of the work.
      const travelY = Math.min(12, height * 0.016);
      const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const scale = Math.max(cover, (height + travelY * 2 + 14) / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      const slackX = Math.max(0, (drawWidth - width) / 2);
      const travelX = Math.min(16, slackX * 0.8);
      const originX = (width - drawWidth) / 2;
      // Bias the crop towards the top: when the photograph is much taller than
      // its frame, centring it would cut the face out of the picture.
      const originY = drawHeight > height ? -(drawHeight - height) * 0.1 - 6 : (height - drawHeight) / 2;

      const columnWidth = width / bands;
      const gap = Math.min(3, Math.max(1.1, columnWidth * 0.032));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < bands; i += 1) {
        const x = i * columnWidth;
        const sourceX = ((x - originX) / drawWidth) * image.naturalWidth;
        const sourceWidth = (columnWidth / drawWidth) * image.naturalWidth + 0.5;
        const breathe = reduce ? 0 : Math.sin(time / 2900 + i * 0.42) * 2.4 * (0.3 + amp);
        const shiftY = rhythm[i] * travelY * amp + breathe;
        // A second, slower rhythm on the horizontal axis: it gives the cut its
        // woven feel and, unlike the vertical one, it has room to spare.
        const shiftX = Math.sin(i * 0.9 + 0.6) * travelX * amp;
        ctx.drawImage(
          image,
          Math.max(0, Math.min(sourceX, image.naturalWidth - 1)),
          0,
          Math.max(1, Math.min(sourceWidth, image.naturalWidth - sourceX)),
          image.naturalHeight,
          x + shiftX,
          originY + shiftY,
          Math.max(1, columnWidth - gap),
          drawHeight,
        );
      }

      if (stillVisible && stillRef.current) {
        stillVisible = false;
        stillRef.current.style.opacity = "0";
      }

      // Animate while the cut is still resolving, then stop for good: the last
      // frame keeps its rhythm and no loop is left running.
      if (value < 99.9) {
        frame = window.requestAnimationFrame(draw);
      } else if (!settled) {
        settled = true;
        window.clearInterval(idle);
      }
    };

    const schedule = () => {
      if (!frame && !settled) frame = window.requestAnimationFrame(draw);
    };

    const element = new Image();
    element.decoding = "async";
    element.src = src;
    element.onload = () => {
      image = element;
      canvas.classList.add("is-live");
      schedule();
      readyRef.current?.();
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      schedule();
    });
    observer.observe(wrap);

    // Progress is written ten times a second by the loader; redraw on each
    // change, plus a slow idle loop so the photograph keeps breathing.
    idle = window.setInterval(schedule, 240);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(idle);
      observer.disconnect();
      element.onload = null;
    };
  }, [progress, src]);

  return (
    <div className={`slice-portrait ${className ?? ""}`} ref={wrapRef}>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative still, canvas draws over it */}
      <img className="slice-portrait__still" ref={stillRef} src={src} alt={alt} aria-hidden="true" />
      <canvas className="slice-portrait__canvas" ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

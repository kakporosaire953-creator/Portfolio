"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SculpturePoster } from "@/components/svg/SculpturePoster";
import { cn } from "@/lib/utils/cn";
import type { SculptureModel } from "./sculptures/types";

const SculptureScene = dynamic(
  () => import("./SculptureScene").then((mod) => mod.SculptureScene),
  { ssr: false },
);

/**
 * Mounts a sculpture behind existing content.
 *
 * - `mode="intro"`: waits for the opening scene to leave, so shader compilation
 *   never competes with the first impression.
 * - `mode="visible"`: waits until the section approaches, so a scene deep in the
 *   page is never built (or downloaded) by a visitor who does not scroll.
 *
 * The poster is painted immediately and only steps aside once the first WebGL
 * frame exists, which is what keeps the swap invisible. Every failure path
 * (no WebGL, driver error, lost context) leaves the poster in place.
 */
export function SculptureStage({
  model,
  mode = "visible",
  className,
  ...rest
}: {
  model: SculptureModel;
  mode?: "intro" | "visible";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (mode !== "intro") return;
    // The boot script marks html.intro-off before paint when no opening scene
    // is shown: then there is nothing to wait for.
    if (document.documentElement.classList.contains("intro-off")) {
      setArmed(true);
      return;
    }
    const arm = () => setArmed(true);
    window.addEventListener("krafter:intro-done", arm, { once: true });
    // Belt and braces: a loader that never reports done must not cost the
    // visitor the sculpture.
    const failsafe = window.setTimeout(arm, 9000);
    return () => {
      window.removeEventListener("krafter:intro-done", arm);
      window.clearTimeout(failsafe);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "visible" || armed) return;
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [armed, mode]);

  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => setFailed(true), []);

  return (
    <div
      ref={hostRef}
      className={cn("sculpture-stage", className)}
      data-sculpture={model}
      data-state={failed ? "fallback" : ready ? "live" : "poster"}
      {...rest}
      aria-hidden="true"
    >
      <div className="sculpture-stage__poster">
        <SculpturePoster model={model} />
      </div>
      {armed && !failed ? (
        <div className="sculpture-stage__canvas">
          <SculptureScene model={model} onReady={onReady} onFail={onFail} />
        </div>
      ) : null}
    </div>
  );
}

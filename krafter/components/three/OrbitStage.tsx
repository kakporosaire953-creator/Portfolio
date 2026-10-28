"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { OrbitPoster } from "@/components/svg/OrbitPoster";
import { cn } from "@/lib/utils/cn";

const OrbitScene = dynamic(() => import("./OrbitScene").then((mod) => mod.OrbitScene), {
  ssr: false,
  loading: () => <OrbitPoster />,
});

/**
 * Hero 3D stage. The static poster is painted first (SSR), then replaced by
 * the WebGL scene once the client chunk is ready.
 *
 * The scene is armed only after the opening scene has left. Compiling its
 * shaders costs a long task on modest hardware, and spending that while the
 * visitor is looking at the loading scene is exactly when it hurts: the
 * poster holds the frame instead, and the 3D fades in on a quiet main thread.
 */
export function OrbitStage({
  className,
  ...rest
}: {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // The boot script marks html.intro-off before paint when no opening scene
    // is shown: then there is nothing to wait for.
    if (document.documentElement.classList.contains("intro-off")) {
      setArmed(true);
      return;
    }
    const arm = () => setArmed(true);
    window.addEventListener("krafter:intro-done", arm, { once: true });
    // Belt and braces: a loader that never reports done must not cost the
    // visitor the hero scene.
    const failsafe = window.setTimeout(arm, 9000);
    return () => {
      window.removeEventListener("krafter:intro-done", arm);
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div className={cn("orbit-stage", className)} aria-hidden="true" {...rest}>
      <div className="orbit-stage__poster">
        <OrbitPoster />
      </div>
      {armed ? (
        <div className="orbit-stage__canvas">
          <OrbitScene className="orbit-canvas" />
        </div>
      ) : null}
    </div>
  );
}

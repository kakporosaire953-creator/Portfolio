"use client";

import dynamic from "next/dynamic";
import { OrbitPoster } from "@/components/svg/OrbitPoster";
import { cn } from "@/lib/utils/cn";

const OrbitScene = dynamic(() => import("./OrbitScene").then((mod) => mod.OrbitScene), {
  ssr: false,
  loading: () => <OrbitPoster />,
});

/**
 * Hero 3D stage. The static poster is painted first (SSR), then replaced by
 * the WebGL scene once the client chunk is ready.
 */
export function OrbitStage({ className }: { className?: string }) {
  return (
    <div className={cn("orbit-stage", className)} aria-hidden="true">
      <div className="orbit-stage__poster">
        <OrbitPoster />
      </div>
      <div className="orbit-stage__canvas">
        <OrbitScene className="orbit-canvas" />
      </div>
    </div>
  );
}

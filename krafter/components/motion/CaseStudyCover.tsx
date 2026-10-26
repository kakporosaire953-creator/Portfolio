"use client";

import { useEffect, useRef } from "react";
import { Flip, gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap/register";
import { takeFlipPayload } from "@/lib/animations/gsap/flip";
import { useReducedMotion } from "@/lib/utils/useReducedMotion";

type Props = {
  slug: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Landing side of the project Flip transition: a fixed clone travels from the
 * grid thumbnail rect to this cover, then hands over to the real element.
 */
export function CaseStudyCover({ slug, src, alt, width, height }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const payload = takeFlipPayload(slug);
    if (!payload) return;
    const frame = frameRef.current;
    if (!frame) return;

    registerGsap();

    const clone = document.createElement("img");
    clone.src = payload.src || src;
    clone.alt = "";
    clone.setAttribute("aria-hidden", "true");
    clone.decoding = "async";
    Object.assign(clone.style, {
      position: "fixed",
      left: `${payload.rect.x}px`,
      top: `${payload.rect.y}px`,
      width: `${payload.rect.width}px`,
      height: `${payload.rect.height}px`,
      objectFit: "cover",
      zIndex: "70",
      margin: "0",
      pointerEvents: "none",
      willChange: "transform",
    });
    document.body.appendChild(clone);
    frame.style.opacity = "0";

    const tween = Flip.fit(clone, frame, {
      duration: 0.9,
      ease: "power3.inOut",
      scale: true,
      onComplete: () => {
        frame.style.opacity = "";
        gsap.to(clone, {
          opacity: 0,
          duration: 0.25,
          onComplete: () => clone.remove(),
        });
        ScrollTrigger.refresh();
      },
    });

    return () => {
      clone.remove();
      frame.style.opacity = "";
      if (tween && "kill" in tween) tween.kill();
    };
  }, [reduced, slug, src]);

  return (
    <div className="case-cover" ref={frameRef} data-flip-target={slug}>
      {/* eslint-disable-next-line @next/next/no-img-element -- local optimised asset */}
      <img src={src} alt={alt} width={width} height={height} className="case-cover__img" />
    </div>
  );
}

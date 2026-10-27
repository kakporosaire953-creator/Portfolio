"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

/** Registers GSAP plugins exactly once, in the browser only. */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger, Flip };

"use client";

import { useEffect, useRef } from "react";
import type { DependencyList, RefObject } from "react";
import { gsap, registerGsap } from "./register";

type ScopeRef = RefObject<HTMLElement | null>;

/**
 * Scopes a GSAP context to a container element and reverts every tween,
 * ScrollTrigger and SplitText instance on unmount / dependency change.
 * Prevents duplicated animations in React StrictMode.
 */
export function useGsap(
  setup: (scope: HTMLElement) => void | (() => void),
  deps: DependencyList = [],
  containerRef?: ScopeRef,
): ScopeRef {
  const internalRef = useRef<HTMLElement | null>(null);
  const ref = containerRef ?? internalRef;

  useEffect(() => {
    if (typeof window === "undefined") return;
    registerGsap();
    const scope = ref.current;
    if (!scope) return;

    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup(scope);
    }, scope);

    return () => {
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

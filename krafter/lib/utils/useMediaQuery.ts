"use client";

import { useEffect, useState } from "react";

/** Generic media-query hook, SSR safe (returns false until mounted). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const DESKTOP_QUERY = "(min-width: 1024px)";
export const POINTER_FINE_QUERY = "(hover: hover) and (pointer: fine)";

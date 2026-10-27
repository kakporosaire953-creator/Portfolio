"use client";

import { ProjectDrum } from "./ProjectDrum";

/**
 * Selected work.
 *
 * The turntable lives in its own component: it pins, rotates and cleans up
 * after itself, while this section only keeps the page rhythm.
 */
export function SelectedWork() {
  return (
    <section className="section" aria-labelledby="selected-work-title">
      <ProjectDrum />
    </section>
  );
}

/**
 * Static fallback for KRAFTER / ORBIT.
 * Used before hydration, when WebGL is unavailable, or when motion is reduced.
 * Decorative only — never the carrier of essential information.
 */
export function OrbitPoster({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 420"
      fill="none"
      role="img"
      aria-label="Composition orbitale statique"
      data-orbit-poster
    >
      <circle cx="210" cy="210" r="150" stroke="var(--line)" strokeWidth="1" />
      <circle cx="210" cy="210" r="112" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 6" />
      <ellipse
        cx="210"
        cy="210"
        rx="176"
        ry="86"
        stroke="var(--orange)"
        strokeWidth="1.1"
        transform="rotate(-24 210 210)"
      />
      <ellipse
        cx="210"
        cy="210"
        rx="150"
        ry="150"
        stroke="var(--line-strong)"
        strokeWidth="1"
        strokeDasharray="140 260"
        transform="rotate(38 210 210)"
      />
      <path
        d="M210 118l79 46v92l-79 46-79-46v-92z"
        stroke="var(--navy)"
        strokeWidth="1.2"
        opacity="0.55"
        strokeLinejoin="round"
      />
      <path d="M210 118l0 92 79 46M210 210l-79 -46" stroke="var(--orange)" strokeWidth="1.2" opacity="0.8" />
      <circle cx="210" cy="210" r="6" fill="var(--orange)" />
      <circle cx="296" cy="150" r="3.4" fill="var(--orange)" />
      <circle cx="120" cy="264" r="2.6" fill="var(--navy)" opacity="0.6" />
      <circle cx="322" cy="278" r="2.2" fill="var(--navy)" opacity="0.45" />
    </svg>
  );
}

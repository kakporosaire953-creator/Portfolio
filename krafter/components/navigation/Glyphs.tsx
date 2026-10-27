import type { NavIcon } from "@/data/profile";

type IconProps = {
  name: NavIcon;
  size?: number;
  className?: string;
};

/**
 * Architectural line icons — built on a 24px grid, 1.5px strokes.
 * Purely functional: they identify rail destinations.
 */
export function NavGlyph({ name, size = 20, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
    focusable: "false" as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M9.75 20v-5.5h4.5V20" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.75" r="3.75" />
          <path d="M4.75 20c.9-3.6 3.7-5.6 7.25-5.6s6.35 2 7.25 5.6" />
          <path d="M2.5 12h1.75M19.75 12H21.5" />
        </svg>
      );
    case "services":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="0.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="0.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="0.5" />
          <path d="M13.5 17h7M17 13.5v7" />
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="M3 9.5h18" />
          <path d="M8.5 9.5V19M15.5 9.5V19" />
          <path d="M6.25 7.25h.01M8.75 7.25h.01" />
        </svg>
      );
    case "skills":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.25" />
          <circle cx="5" cy="5.5" r="1.6" />
          <circle cx="19" cy="5.5" r="1.6" />
          <circle cx="5" cy="18.5" r="1.6" />
          <circle cx="19" cy="18.5" r="1.6" />
          <path d="M6.2 6.7 10.2 10.3M17.8 6.7 13.8 10.3M6.2 17.3 10.2 13.7M17.8 17.3 13.8 13.7" />
        </svg>
      );
    case "blog":
      return (
        <svg {...common}>
          <path d="M5 4.5h14v15H5z" />
          <path d="M8 8.5h5M8 12h8M8 15.5h8" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <path d="M3.5 6.5h17v11h-17z" />
          <path d="m4 7.5 8 5.5 8-5.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function ArrowUpRight({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12 12 4M5.4 4H12v6.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeft({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13.5 8h-11M6.5 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 2.5v11M4 9.5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

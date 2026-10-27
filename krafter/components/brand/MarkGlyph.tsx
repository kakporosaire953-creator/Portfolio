import { MARK_LOOPS } from "@/lib/brand/markGeometry";

/**
 * The official monogram as vector geometry.
 *
 * Same traced loops the 3D loader extrudes, so the instant the page paints, the
 * real mark is already on screen. It doubles as the WebGL fallback and as the
 * poster behind the canvas while three.js loads.
 *
 * Coordinates are +y up; SVG is +y down, so the path flips the axis.
 */
export function MarkGlyph({
  className,
  fill = "currentColor",
  stroke,
  strokeWidth,
}: {
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="-1 -1 2 2"
      aria-hidden="true"
      focusable="false"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    >
      {MARK_LOOPS.map((loop, index) => (
        <path
          key={index}
          d={`M ${loop.map(([x, y]) => `${x} ${-y}`).join(" L ")} Z`}
        />
      ))}
    </svg>
  );
}

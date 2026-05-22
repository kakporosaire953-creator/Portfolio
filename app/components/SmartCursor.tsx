// app/components/SmartCursor.tsx – custom cursor that follows mouse with subtle glow
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function SmartCursor() {
  const [isVisible, setIsVisible] = useState(true);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { stiffness: 500, damping: 30 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - 8);
      mouseY.set(e.clientY - 8);
    };
    const hide = () => setIsVisible(false);
    const show = () => setIsVisible(true);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseenter", show);
    window.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseenter", show);
      window.removeEventListener("mouseleave", hide);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 size-4 rounded-full bg-electric-blue opacity-80 shadow-[0_0_8px_2px_#00f0ff]"
      style={{
        x: cursorX,
        y: cursorY,
        display: isVisible ? "block" : "none",
      }}
    />
  );
}

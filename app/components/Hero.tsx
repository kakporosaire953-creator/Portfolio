// app/components/Hero.tsx – Premium hero section with animated headline and CTA

// Note: added id="hero" to the outer section for navigation
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050816] text-white">
      {/* Animated gradient blob behind the text */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        <svg
          viewBox="0 0 800 800"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="gradient" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#001429" />
            </radialGradient>
          </defs>
          <circle cx="400" cy="400" r="350" fill="url(#gradient)" />
        </svg>
      </motion.div>

      {/* Content */}
      <motion.h1
        className="z-10 bg-clip-text text-5xl font-extrabold leading-none text-transparent md:text-7xl lg:text-8xl"
        style={{ backgroundImage: "linear-gradient(90deg, #00f0ff, #ff7a00)" }}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        Rosaire
      </motion.h1>
      <motion.p
        className="z-10 mt-4 max-w-2xl text-lg text-gray-300 md:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.0 }}
      >
        Creative frontend developer crafting immersive, modern digital experiences powered by AI and motion.
      </motion.p>
      <motion.a
        href="#projects"
        className="z-10 mt-8 inline-block rounded-full bg-[#00f0ff] px-8 py-3 text-sm font-medium text-[#050816] transition-colors hover:bg-[#ff7a00]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        View My Work
      </motion.a>
    </section>
  );

}

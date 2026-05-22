// app/components/WhatICreate.tsx – premium feature cards
import { motion } from "framer-motion";

const features = [
  {
    title: "AI‑Powered UI",
    description: "Smart, context‑aware interfaces that adapt in real‑time",
    emoji: "🤖",
  },
  {
    title: "Motion Design",
    description: "Fluid, physics‑based animations that delight users",
    emoji: "✨",
  },
  {
    title: "Next‑Gen Stack",
    description: "React, TypeScript, Tailwind, Three.js – all optimized for performance",
    emoji: "⚡",
  },
];

export default function WhatICreate() {
  return (
    <section className="py-16 bg-[#001429] text-white" id="whaticreate">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-4xl font-bold">What I Create</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="rounded-xl bg-[#050816]/70 p-6 text-center backdrop-blur-sm shadow-xl"
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-5xl">{f.emoji}</div>
              <h3 className="mt-4 text-2xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-gray-300">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

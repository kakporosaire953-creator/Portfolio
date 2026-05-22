// app/components/Skills.tsx – premium skill showcase
import { motion } from "framer-motion";

const skills = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "⏭️" },
  { name: "TypeScript", icon: "🦺" },
  { name: "Tailwind CSS", icon: "🌿" },
  { name: "Framer Motion", icon: "💃" },
  { name: "Three.js", icon: "🪐" },
  { name: "GSAP", icon: "🧩" },
  { name: "AI APIs", icon: "🤖" },
];

export default function Skills() {
  return (
    <section className="py-20 bg-[#001429] text-white" id="skills">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">Skills & Tools</h2>
        <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-8">
          {skills.map((s, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center rounded-xl bg-[#050816]/70 p-4 backdrop-blur-sm shadow-xl"
              whileHover={{ y: -4, scale: 1.05 }}
            >
              <div className="text-4xl">{s.icon}</div>
              <span className="mt-2 text-lg font-medium">{s.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

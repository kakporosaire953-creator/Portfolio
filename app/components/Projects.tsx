// app/components/Projects.tsx – premium project showcase
import { motion } from "framer-motion";

const projects = [
  {
    title: "AI‑Powered Dashboard",
    description: "Real‑time analytics UI with GPT‑3 content generation",
    image: "/images/project1.jpg",
    link: "#",
  },
  {
    title: "3D Product Viewer",
    description: "Interactive WebGL showcase built with Three.js",
    image: "/images/project2.jpg",
    link: "#",
  },
  {
    title: "Motion‑Rich Landing Page",
    description: "Cinematic entry experience using Framer Motion",
    image: "/images/project3.jpg",
    link: "#",
  },
];

export default function Projects() {
  return (
    <section className="py-20 bg-[#001429] text-white" id="projects">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">Featured Projects</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((p, i) => (
            <motion.a
              key={i}
              href={p.link}
              className="relative block rounded-xl bg-[#050816]/70 backdrop-blur-sm overflow-hidden shadow-xl"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="relative h-48">
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001429] via-[#001429] to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-gray-300">{p.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

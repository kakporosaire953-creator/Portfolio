// app/components/Timeline.tsx – premium vertical timeline
import { motion } from "framer-motion";

const milestones = [
  { year: "2022", title: "Started Frontend Journey", desc: "First React project, learning fundamentals." },
  { year: "2023", title: "Mastered TypeScript", desc: "Built several production‑grade apps with strict typing." },
  { year: "2024", title: "AI‑Enhanced UI", desc: "Integrated GPT‑3 for dynamic content generation." },
  { year: "2025", title: "Full‑Stack Expertise", desc: "Added Node.js, serverless functions, and CI/CD pipelines." },
];

export default function Timeline() {
  return (
    <section className="py-20 bg-[#001429] text-white" id="timeline">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">My Journey</h2>
        <div className="relative space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              className="relative flex items-start"
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute left-0 top-1.5 h-full w-0.5 bg-[#00f0ff]" />
              <div className="ml-8 flex flex-col rounded-xl bg-[#050816]/70 p-4 backdrop-blur-sm shadow-xl">
                <span className="text-sm font-medium text-[#00f0ff]">{m.year}</span>
                <h3 className="mt-1 text-xl font-semibold">{m.title}</h3>
                <p className="mt-2 text-gray-300">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// app/components/Lab.tsx – interactive UI/AI showcase (placeholder)
import { motion } from "framer-motion";

export default function Lab() {
  return (
    <section className="py-20 bg-[#050816] text-white" id="lab">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-8 text-4xl font-bold">Lab – Experiments & AI Demos</h2>
        <motion.div
          className="mx-auto max-w-2xl rounded-xl bg-[#001429]/70 p-8 backdrop-blur-sm shadow-xl"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-lg text-gray-300">
            Explore AI‑driven UI prototypes, 3‑D visualizations, and motion experiments. (Content to be added soon.)
          </p>
        </motion.div>
      </div>
    </section>
  );
}

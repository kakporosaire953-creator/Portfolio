// app/components/Testimonials.tsx – premium testimonial carousel
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Rosaire transformed our product UI into a living experience – seamless, beautiful, and AI‑enhanced.",
    author: "Claire D., Product Lead",
  },
  {
    quote: "The motion design on our landing page increased conversions by 27% – truly cinematic.",
    author: "Marco S., Founder",
  },
  {
    quote: "Their 3D showcase blew our investors away – a perfect blend of tech and art.",
    author: "Lena K., Investor",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#001429] text-white" id="testimonials">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">Testimonials</h2>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-8"
            drag="x"
            dragConstraints={{ left: -((testimonials.length - 1) * 100), right: 0 }}
            dragElastic={0.1}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="min-w-[80%] flex-shrink-0 rounded-xl bg-[#050816]/70 p-8 backdrop-blur-sm shadow-xl"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-lg italic text-gray-300">"{t.quote}"</p>
                <p className="mt-4 text-right text-sm font-medium text-[#00f0ff]">
                  – {t.author}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

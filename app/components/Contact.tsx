// app/components/Contact.tsx – premium contact section
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="py-20 bg-[#001429] text-white" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">Get In Touch</h2>
        <motion.div
          className="mx-auto max-w-xl rounded-xl bg-[#050816]/70 p-8 backdrop-blur-sm shadow-xl"
          whileHover={{ scale: 1.02 }}
        >
            <form action="/api/contact" method="POST" className="flex flex-col gap-4">
  <input
    type="text"
    name="name"
    placeholder="Your Name"
    required
    className="rounded border border-gray-600 bg-[#001429] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
  />
  <input
    type="email"
    name="email"
    placeholder="Your Email"
    required
    className="rounded border border-gray-600 bg-[#001429] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
  />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              required
              className="rounded border border-gray-600 bg-[#001429] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
            />
            <button
              type="submit"
              className="mt-2 rounded-full bg-[#00f0ff] px-6 py-3 font-medium text-[#050816] transition-colors hover:bg-[#ff7a00]"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

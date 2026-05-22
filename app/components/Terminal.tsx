// app/components/Terminal.tsx – interactive frontend console
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type CommandHandler = (args: string[]) => string;

const commands: Record<string, CommandHandler> = {
  help: () =>
    "Available commands: help, about, projects, skills, contact. Type a command and press Enter.",
  about:
    () =>
      "Rosaire – creative frontend developer specialized in immersive UI/UX, AI‑enhanced interfaces and modern web tech.",
  projects: () => "Check out the \"Featured Projects\" section below!",
  skills: () =>
    "React • Next.js • TypeScript • Tailwind • Framer Motion • GSAP • Three.js • AI API Integration",
  contact: () => "Email: rosaire@example.com | WhatsApp: +33 6 12 34 56 78",
};

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [typing, setTyping] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto‑focus the hidden input when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Typewriter effect for the latest output
  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => {
      setTyping((prev) => prev.slice(0, -1));
    }, 30);
    return () => clearTimeout(timer);
  }, [typing]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);
    const handler = commands[name];
    const result = handler ? handler(args) : `Unknown command: ${name}`;
    setHistory((h) => [...h, `> ${cmd}`, result]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <section className="bg-[#001429] text-[#00f0ff] font-mono p-6 rounded-xl max-w-2xl mx-auto mb-12" id="terminal">
      <h2 className="text-xl font-semibold mb-4"><span className="text-white">Rosaire</span> ~/dev/portfolio $</h2>
      <div className="h-60 overflow-y-auto mb-4">
        {history.map((line, i) => (
          <pre key={i} className="whitespace-pre-wrap mb-1">
            {line}
          </pre>
        ))}
        {/* Current command line with typing cursor */}
        <form onSubmit={onSubmit} className="flex items-center">
          <span className="mr-2 text-white">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent flex-1 outline-none caret-electric-blue text-white"
            autoComplete="off"
          />
          {/* hidden submit button to capture Enter */}
          <button type="submit" className="hidden" />
        </form>
        {/* simulate blinking cursor for typing effect */}
        {typing && (
          <motion.span
            className="text-white"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            _
          </motion.span>
        )}
      </div>
    </section>
  );
}

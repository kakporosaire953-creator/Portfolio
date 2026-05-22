// app/components/NavBar.tsx – navigation bar
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center bg-[#001429]/80 backdrop-blur-sm py-3 shadow-lg">
      <ul className="flex space-x-6 text-sm font-medium text-[#00f0ff]">
        <li><Link href="#hero">Home</Link></li>
        <li><Link href="#whaticreate">What I Create</Link></li>
        <li><Link href="#projects">Projects</Link></li>
        <li><Link href="#lab">Lab</Link></li>
        <li><Link href="#terminal">Console</Link></li>
        <li><Link href="#skills">Skills</Link></li>
        <li><Link href="#timeline">Timeline</Link></li>
        <li><Link href="#testimonials">Testimonials</Link></li>
        <li><Link href="#contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

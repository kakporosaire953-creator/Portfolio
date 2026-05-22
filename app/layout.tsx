import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmartCursor from "./components/SmartCursor";
import NavBar from "./components/NavBar";


// Load Google fonts – premium typography
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Rosaire – Ultra‑Premium Frontend Portfolio",
  description: "Rosaire – Creative frontend developer crafting immersive, modern digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full bg-[#050816] text-white`}>
      <body className="min-h-screen flex flex-col antialiased overflow-x-hidden relative">
        <SmartCursor />
        <NavBar />
        {children}
      </body>
    </html>
  );
}

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IDENTITY } from "../data/content";
import { Command } from "lucide-react";

export default function Nav({ onOpenPalette, onOpenTerminal, jumpTo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const items = [
    { id: "work", label: "Work", n: "02" },
    { id: "about", label: "About", n: "03" },
    { id: "skills", label: "Skills", n: "05" },
    { id: "contact", label: "Contact", n: "06" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[#0d0f1e]/85 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <button
          data-testid="nav-brand"
          onClick={() => jumpTo("hero")}
          className="font-serif-display text-xl md:text-2xl text-white tracking-tight"
        >
          Yachi<span className="text-[#5B73FF]">.</span>
        </button>

        <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
          {items.map((it) => (
            <button
              key={it.id}
              data-testid={`nav-${it.id}`}
              onClick={() => jumpTo(it.id)}
              className="hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-[#5B73FF]/60">{it.n}</span>
              {it.label}
            </button>
          ))}
          <button
            data-testid="nav-terminal"
            onClick={onOpenTerminal}
            className="group hover:text-white transition-colors duration-300 flex items-center gap-2 text-[#4ADE80]"
          >
            Terminal
            <span className="relative flex items-center">
              <span className="text-[8px] px-1.5 py-0.5 border border-[#4ADE80]/40 text-[#4ADE80] rounded-full leading-none">
                new
              </span>
            </span>
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            data-testid="nav-palette"
            onClick={onOpenPalette}
            className="hidden md:flex items-center gap-2 border border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/60 hover:text-white hover:border-white/25 transition-colors duration-300"
          >
            <Command size={12} /> K
          </button>
          <a
            data-testid="nav-resume"
            href={IDENTITY.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2 border border-white text-white hover:bg-white hover:text-[#0d0f1e] transition-colors duration-300"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </motion.header>
  );
}

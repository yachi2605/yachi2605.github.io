import React from "react";
import { IDENTITY } from "../data/content";

export default function Footer({ onOpenTerminal, onOpenPalette }) {
  return (
    <footer className="border-t border-white/5 py-14" data-testid="footer">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="font-serif-display text-[18vw] md:text-[14vw] leading-[0.85] tracking-tighter text-white/10 select-none pointer-events-none">
          yachi.darji
        </div>
        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-[11px] text-white/50">
          <div>
            © {new Date().getFullYear()} — Built solo in Chicago. React · FastAPI · Recharts · Framer Motion · Lenis.
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button onClick={onOpenTerminal} className="hover:text-white transition-colors duration-300" data-testid="footer-terminal">
              ` terminal
            </button>
            <button onClick={onOpenPalette} className="hover:text-white transition-colors duration-300" data-testid="footer-palette">
              ⌘K palette
            </button>
            <a href={IDENTITY.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
              linkedin ↗
            </a>
            <a href={IDENTITY.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
              github ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

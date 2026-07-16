import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IDENTITY } from "../data/content";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Magnetic from "../components/Magnetic";

const EASE = [0.16, 1, 0.3, 1];

const HERO_PHOTOS = ["/photos/p3.jpg", "/photos/p4.jpg", "/photos/p2.jpg", "/photos/p1.jpg"];

function LineReveal({ children, delay = 0, className = "" }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.05, ease: EASE, delay }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function ScrambleName({ text }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#/*_";
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let raf;
    let start = performance.now();
    const dur = 1200;
    const loop = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const revealed = Math.floor(text.length * p);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") out += " ";
        else if (i < revealed) out += text[i];
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(loop);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return <>{display}</>;
}

export default function Hero({ jumpTo }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen w-full pt-28 pb-16 overflow-hidden">
      {/* full-bleed photo columns behind the headline */}
      <div className="absolute inset-0 z-0 grid grid-cols-4 pointer-events-none">
        {HERO_PHOTOS.map((src, i) => (
          <div key={src} className="relative h-full overflow-hidden">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover grayscale-[0.35] brightness-[0.55]"
            />
          </div>
        ))}
      </div>
      {/* legibility scrim over the photo columns: darkest on the left
          text column, fading to clear on the right */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(13,15,30,0.94) 0%, rgba(13,15,30,0.82) 32%, rgba(13,15,30,0.4) 62%, rgba(13,15,30,0.08) 88%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 38% 45%, rgba(13,15,30,0.6) 0%, transparent 70%)",
        }}
      />
      {/* grid + noise background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none z-0" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div style={{ opacity }} className="grid grid-cols-12 gap-6 md:gap-8 items-end pt-8 md:pt-12">
          {/* left: kinetic headline */}
          <div className="col-span-12 lg:col-span-8">
            <h1 className="font-serif-display text-[13vw] md:text-[9vw] lg:text-[8.6rem] xl:text-[10rem] leading-[0.88] tracking-tighter text-white font-light">
              <LineReveal delay={0.35}>
                <span data-testid="hero-name">
                  <ScrambleName text="Yachi Darji." />
                </span>
              </LineReveal>
              <LineReveal delay={0.55} className="text-white/40">
                Builds
              </LineReveal>
              <LineReveal delay={0.7}>
                <span className="italic">systems</span>{" "}
                <span className="text-[#5B73FF]">that</span>{" "}
                <span className="italic">ship.</span>
              </LineReveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.9, ease: EASE }}
              className="mt-10 max-w-xl text-white/60 text-base md:text-lg leading-relaxed"
            >
              Data Scientist / ML Engineer.{" "}
              <span className="text-white">
                I care more about whether a model survives production
              </span>{" "}
              than whether it is clever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.4}>
                <button
                  data-testid="hero-cta-work"
                  onClick={() => jumpTo("work")}
                  className="group inline-flex items-center gap-3 bg-[#5B73FF] text-white font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 hover:bg-white hover:text-[#0d0f1e] transition-colors duration-300"
                >
                  See the Work
                  <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                </button>
              </Magnetic>
              <Magnetic strength={0.4}>
                <a
                  data-testid="hero-cta-resume"
                  href={IDENTITY.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-white/25 text-white font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 hover:border-white transition-colors duration-300"
                >
                  Resume ↗
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* right: System Status Panel */}
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 1, ease: EASE }}
            className="col-span-12 lg:col-span-4 lg:pl-8"
            data-testid="system-status-panel"
          >
            <div className="border border-white/10 bg-[#14172a]/60 backdrop-blur-sm p-5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mb-4">
                <span>system_status.log</span>
                <span className="text-[#4ADE80]">live</span>
              </div>
              <StatusRow k="role" v="Data Scientist / ML Eng" />
              <StatusRow k="location" v="Chicago · IL" />
              <StatusRow k="visa" v="OPT · STEM" />
              <StatusRow k="shipped" v="5 products · 2 live" />
              <StatusRow k="edu" v="MS Data Science · IIT" />
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                <span className="pulse-dot" />
                <span className="font-mono text-[11px] text-[#4ADE80] uppercase tracking-[0.22em]">
                  actively interviewing
                </span>
              </div>
              <div className="mt-3 font-mono text-[10px] text-white/30">
                target_roles = [&quot;DS&quot;, &quot;MLE&quot;, &quot;GenAI&quot;]
              </div>
            </div>

            <div className="mt-4 font-mono text-[10px] text-white/30 flex items-center gap-2">
              <kbd className="border border-white/10 px-1.5 py-0.5">`</kbd>
              <span>terminal</span>
              <span className="mx-2">·</span>
              <kbd className="border border-white/10 px-1.5 py-0.5">⌘K</kbd>
              <span>palette</span>
            </div>
          </motion.aside>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
        >
          <ArrowDown size={12} className="animate-bounce" />
          scroll · index below
        </motion.div>
      </div>
    </section>
  );
}

function StatusRow({ k, v }) {
  return (
    <div className="flex items-baseline justify-between font-mono text-[12px] py-1.5 border-b border-white/[0.04] last:border-b-0">
      <span className="text-white/40 uppercase tracking-widest text-[10px]">{k}</span>
      <span className="text-white">{v}</span>
    </div>
  );
}

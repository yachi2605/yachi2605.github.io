import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE } from "../data/content";
import { useAchievements } from "../context/Achievements";

const EASE = [0.16, 1, 0.3, 1];

export default function Timeline() {
  const [active, setActive] = useState(TIMELINE.length - 1);
  const { unlock } = useAchievements();
  return (
    <section className="relative py-32 md:py-40 border-t border-white/5" data-testid="timeline">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span className="text-[#5B73FF]">04 /</span> timeline · 2022 → 2026
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-serif-display text-4xl md:text-6xl text-white tracking-tight font-light leading-[1]">
              A four-year drift toward <span className="italic text-white/50">production ML.</span>
            </h2>
          </div>
        </div>

        {/* Year rail */}
        <div className="relative">
          <div className="absolute top-6 left-0 right-0 h-[1px] bg-white/10" />
          <div className="grid grid-cols-5 gap-2 relative">
            {TIMELINE.map((t, i) => (
              <button
                key={t.year}
                data-testid={`timeline-${t.year}`}
                onClick={() => {
                  setActive(i);
                  unlock("timeline");
                }}
                className="group flex flex-col items-start pt-0"
              >
                <span
                  className={`w-3 h-3 rounded-full border-2 mb-3 transition-colors duration-300 ${
                    active === i ? "bg-[#5B73FF] border-[#5B73FF]" : "bg-[#0d0f1e] border-white/30 group-hover:border-white"
                  }`}
                />
                <span
                  className={`font-mono text-sm md:text-base tabular-nums tracking-widest transition-colors duration-300 ${
                    active === i ? "text-white" : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {t.year}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div className="mt-14 grid grid-cols-12 gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="col-span-12 md:col-span-10 md:col-start-2"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5B73FF] mb-4">
                {TIMELINE[active].org}
              </div>
              <h3 className="font-serif-display text-3xl md:text-5xl text-white leading-tight tracking-tight">
                {TIMELINE[active].role}
              </h3>
              <p className="mt-6 text-white/70 text-base md:text-lg leading-relaxed max-w-3xl">
                {TIMELINE[active].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

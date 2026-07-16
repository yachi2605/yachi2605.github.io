import React from "react";
import { motion } from "framer-motion";
import { SKILLS, CREDENTIALS } from "../data/content";

const EASE = [0.16, 1, 0.3, 1];

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 md:py-40 border-t border-white/5" data-testid="skills">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span className="text-[#5B73FF]">05 /</span> skills · in three tiers
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-serif-display text-4xl md:text-6xl text-white tracking-tight font-light leading-[1]">
              What I reach for.
            </h2>
          </div>
        </div>

        {/* Core */}
        <div className="mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6">
            tier_01 · core expertise
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SKILLS.core.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
                className="border border-white/10 hover:border-[#5B73FF]/60 bg-[#14172a]/40 p-6 transition-colors duration-300 group"
                data-testid={`skill-core-${s.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="font-serif-display text-2xl md:text-3xl text-white group-hover:text-[#5B73FF] transition-colors duration-300">
                  {s.name}
                </div>
                <div className="mt-3 font-mono text-[11px] text-white/50">{s.note}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Daily */}
        <div className="mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6">
            tier_02 · daily stack
          </div>
          <motion.div
            className="flex flex-wrap gap-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {SKILLS.daily.map((s) => (
              <motion.span
                key={s}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.96 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5, ease: EASE }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="font-mono text-xs tracking-wide text-white bg-white/5 border border-white/10 hover:border-[#5B73FF] hover:bg-[#5B73FF]/10 px-5 py-2.5 rounded-full cursor-default transition-colors duration-300"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Supporting */}
        <div className="mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6">
            tier_03 · supporting technologies
          </div>
          <motion.div
            className="flex flex-wrap gap-x-3 gap-y-3 font-mono text-[11px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.025 } } }}
          >
            {SKILLS.supporting.map((s) => (
              <motion.span
                key={s}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.4, ease: EASE }}
                whileHover={{ scale: 1.08, color: "#ffffff" }}
                className="text-white/50 border border-white/[0.06] px-3 py-1.5 cursor-default hover:border-white/25 transition-colors duration-300"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Credentials */}
        <div className="border-t border-white/10 pt-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6">
            credentials
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 font-mono text-[12px] text-white/70"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {CREDENTIALS.map((c) => (
              <motion.div
                key={c}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, ease: EASE }}
                className="group flex items-baseline gap-3 py-2 border-b border-white/[0.04] hover:border-[#5B73FF]/40 transition-colors duration-300"
              >
                <span className="text-[#5B73FF] group-hover:translate-x-1 transition-transform duration-300">▸</span>
                <span className="group-hover:text-white transition-colors duration-300">{c}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

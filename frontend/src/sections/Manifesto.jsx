import React from "react";
import { motion } from "framer-motion";
import { MANIFESTO } from "../data/content";

const EASE = [0.16, 1, 0.3, 1];

export default function Manifesto() {
  return (
    <section id="about" className="relative py-32 md:py-48" data-testid="manifesto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span className="text-[#5B73FF]">03 /</span> about — how i work
            </div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="col-span-12 md:col-span-9 font-serif-display text-4xl md:text-6xl lg:text-7xl leading-[0.98] tracking-tight font-light"
          >
            Most models look great in a notebook. I care about the ones that
            <span className="italic text-white/50"> hold up </span>
            <span className="text-[#5B73FF]">once they're live.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {MANIFESTO.map((m, i) => (
            <motion.article
              key={m.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
              className="col-span-12 md:col-span-6 border-t border-white/10 pt-6"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5B73FF]">
                  ch.{m.n}
                </span>
                <h3 className="font-serif-display text-2xl md:text-3xl leading-tight tracking-tight text-white">
                  {m.title}
                </h3>
              </div>
              <p className="mt-4 pl-16 md:pl-20 text-white/90 text-base md:text-[15px] leading-relaxed max-w-[46ch]">
                {m.plain}
              </p>
              <p className="mt-2 pl-16 md:pl-20 text-white/50 text-[13px] leading-relaxed max-w-[46ch]">
                {m.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

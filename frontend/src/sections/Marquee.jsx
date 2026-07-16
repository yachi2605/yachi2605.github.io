import React from "react";
import Marquee from "react-fast-marquee";

const SKILLS = [
  "Forecasting",
  "Agentic AI",
  "Causal Inference",
  "MLOps",
  "RAG Systems",
  "Distributed Systems",
];

export default function EditorialMarquee() {
  return (
    <div className="border-y border-white/5 py-9 bg-[#0d0f1e] overflow-hidden" data-testid="marquee">
      <Marquee speed={30} gradient={false} pauseOnHover>
        {SKILLS.concat(SKILLS).map((w, i) => (
          <span key={i} className="inline-flex items-baseline mx-8 md:mx-12">
            <span className="font-mono text-xs md:text-sm text-[#5B73FF] mr-4 md:mr-5 self-start mt-2">
              {String((i % SKILLS.length) + 1).padStart(2, "0")}
            </span>
            <span className="font-serif-display italic text-[7vw] md:text-[5vw] leading-none tracking-tight text-white/85 hover:text-white transition-colors duration-300">
              {w}
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

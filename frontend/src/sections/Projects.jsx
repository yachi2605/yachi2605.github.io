import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { PROJECTS, FILTERS } from "../data/content";
import { ArrowUpRight, Code2, Layers } from "lucide-react";
import { useAchievements } from "../context/Achievements";
import ProjectArchitecture from "./ProjectArchitecture";

const EASE = [0.16, 1, 0.3, 1];

function TiltCard({ p, i, onExplore }) {
  const { unlock } = useAchievements();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => unlock("project")}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative border border-white/8 bg-[#14172a]/40 overflow-hidden"
      data-testid={`project-${p.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0f1e]">
        <img
          src={p.image}
          onError={(e) => {
            if (p.fallbackImage) e.currentTarget.src = p.fallbackImage;
          }}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1e] via-[#0d0f1e]/50 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {p.isNew && (
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em] px-2 py-1 bg-[#4ADE80] text-[#0d0f1e]"
              data-testid={`project-${p.id}-new`}
            >
              new
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] px-2 py-1 border border-white/20 text-white/70 bg-black/30 backdrop-blur-sm">
            {p.year}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8" style={{ transform: "translateZ(40px)" }}>
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-serif-display text-3xl md:text-4xl text-white tracking-tight">
            {p.title}
          </h3>
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }}
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 mb-4">
          {p.tag}
        </p>
        <p className="text-white/70 text-[15px] leading-relaxed mb-6">{p.oneLiner}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {p.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] text-white/50 border border-white/10 px-2 py-1"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {p.architecture && (
            <button
              data-testid={`project-${p.id}-architecture`}
              onClick={(e) => {
                e.stopPropagation();
                onExplore(p);
              }}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5B73FF] hover:text-white transition-colors duration-300 link-underline"
            >
              <Layers size={12} /> Architecture
            </button>
          )}
          {p.live && (
            <a
              data-testid={`project-${p.id}-launch`}
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#4ADE80] hover:text-white transition-colors duration-300 link-underline"
            >
              Launch <ArrowUpRight size={12} />
            </a>
          )}
          {p.code && (
            <a
              data-testid={`project-${p.id}-code`}
              href={p.code}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 link-underline"
            >
              <Code2 size={12} /> View Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [openProject, setOpenProject] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const list = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  // Deep link: /?project=rentpilot opens that project's architecture modal on load.
  useEffect(() => {
    const id = searchParams.get("project");
    if (!id) return;
    const p = PROJECTS.find((pr) => pr.id === id && pr.architecture);
    if (p) {
      setOpenProject(p);
      setTimeout(() => document.getElementById("work")?.scrollIntoView({ block: "start" }), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openWithLink = (p) => {
    setOpenProject(p);
    setSearchParams(p ? { project: p.id } : {}, { replace: false });
  };

  const closeWithLink = () => {
    setOpenProject(null);
    setSearchParams({}, { replace: false });
  };

  return (
    <section id="work" className="relative py-32 md:py-40" data-testid="projects">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span className="text-[#5B73FF]">02 /</span> work
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-serif-display text-4xl md:text-6xl lg:text-7xl text-white tracking-tight font-light leading-[1]">
              Selected work. <span className="italic text-white/50">Five things I actually shipped.</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              data-testid={`filter-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors duration-300 ${
                filter === f.id
                  ? "bg-white text-[#0d0f1e] border-white"
                  : "border-white/10 text-white/60 hover:text-white hover:border-white/25"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <TiltCard key={p.id} p={p} i={i} onExplore={openWithLink} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectArchitecture project={openProject} onClose={closeWithLink} />
    </section>
  );
}

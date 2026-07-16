import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IDENTITY, PROJECTS, SKILLS } from "../data/content";
import { useAchievements } from "../context/Achievements";

const sections = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About / Manifesto" },
  { id: "work", label: "Work / Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function CommandPalette({ open, setOpen, jumpTo }) {
  const [query, setQuery] = useState("");
  const [i, setI] = useState(0);
  const { unlock } = useAchievements();

  useEffect(() => {
    if (open) {
      unlock("palette");
      setQuery("");
      setI(0);
    }
  }, [open, unlock]);

  const items = useMemo(() => {
    const rows = [];
    sections.forEach((s) =>
      rows.push({
        group: "Sections",
        label: s.label,
        hint: `#${s.id}`,
        action: () => {
          setOpen(false);
          setTimeout(() => jumpTo(s.id), 100);
        },
      })
    );
    PROJECTS.forEach((p) =>
      rows.push({
        group: "Projects",
        label: p.title,
        hint: p.tag,
        action: () => {
          setOpen(false);
          setTimeout(() => jumpTo("work"), 100);
        },
      })
    );
    SKILLS.core.forEach((s) =>
      rows.push({
        group: "Skills",
        label: s.name,
        hint: s.note,
        action: () => {
          setOpen(false);
          setTimeout(() => jumpTo("skills"), 100);
        },
      })
    );
    rows.push({
      group: "Links",
      label: "Resume ↗",
      hint: "PDF",
      action: () => window.open(IDENTITY.resume, "_blank"),
    });
    rows.push({
      group: "Links",
      label: "GitHub ↗",
      hint: "yachi2605",
      action: () => window.open(IDENTITY.github, "_blank"),
    });
    rows.push({
      group: "Links",
      label: "LinkedIn ↗",
      hint: "in/yachi-darji",
      action: () => window.open(IDENTITY.linkedin, "_blank"),
    });
    rows.push({
      group: "Links",
      label: `Email · ${IDENTITY.email}`,
      hint: "mailto",
      action: () => window.open(`mailto:${IDENTITY.email}`, "_blank"),
    });
    return rows;
  }, [jumpTo, setOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (r) => r.label.toLowerCase().includes(q) || r.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => setI(0), [query]);

  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setI((v) => Math.min(filtered.length - 1, v + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setI((v) => Math.max(0, v - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[i]?.action?.();
    }
  };

  // group filtered
  const grouped = filtered.reduce((acc, r) => {
    (acc[r.group] = acc[r.group] || []).push(r);
    return acc;
  }, {});

  let cursor = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          data-testid="palette-overlay"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-[#14172a] border border-white/10 shadow-2xl"
          >
            <input
              autoFocus
              data-testid="palette-input"
              placeholder="type to search sections, projects, skills…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              className="w-full bg-transparent border-b border-white/10 px-5 py-4 outline-none text-white font-serif-display text-xl placeholder:text-white/25"
            />
            <div className="max-h-[52vh] overflow-y-auto">
              {Object.keys(grouped).length === 0 && (
                <div className="p-6 font-mono text-[11px] text-white/40">no results.</div>
              )}
              {Object.entries(grouped).map(([g, rows]) => (
                <div key={g} className="py-2">
                  <div className="px-5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                    {g}
                  </div>
                  {rows.map((r) => {
                    cursor++;
                    const active = cursor === i;
                    return (
                      <button
                        key={g + r.label}
                        data-testid={`palette-item-${r.label.replace(/\s/g, '_')}`}
                        onMouseEnter={() => setI(cursor)}
                        onClick={r.action}
                        className={`w-full flex items-center justify-between px-5 py-2.5 text-left transition-colors duration-150 ${
                          active ? "bg-[#5B73FF]/15 text-white" : "text-white/80 hover:text-white"
                        }`}
                      >
                        <span className="text-[15px]">{r.label}</span>
                        <span className="font-mono text-[10px] text-white/40">{r.hint}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 px-5 py-2 flex items-center justify-between font-mono text-[10px] text-white/40 uppercase tracking-widest">
              <div className="flex items-center gap-3">
                <span>↑↓ nav</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
              <span>⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

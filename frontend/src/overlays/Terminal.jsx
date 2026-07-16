import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { IDENTITY, PROJECTS, SKILLS, CREDENTIALS, TIMELINE } from "../data/content";
import { useAchievements } from "../context/Achievements";

const HELP = [
  ["help", "list all commands"],
  ["about", "brief biography"],
  ["experience", "work history"],
  ["projects", "shipped work"],
  ["skills", "tech stack"],
  ["credentials", "certs & awards"],
  ["resume", "open resume PDF"],
  ["contact", "reach out"],
  ["whoami", "identity"],
  ["achievements", "exploration progress"],
  ["theme dark|light", "toggle theme"],
  ["coffee", "☕"],
  ["sudo hire yachi", "…"],
  ["clear", "clear buffer"],
];

export default function Terminal({ open, setOpen, jumpTo }) {
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const [buffer, setBuffer] = useState([
    { t: "sys", v: "yachi_os v1.2.6 (dec 2025) · type `help` to begin" },
  ]);
  const [input, setInput] = useState("");
  const { unlocked, unlock, labels } = useAchievements();

  useEffect(() => {
    if (open) {
      unlock("terminal");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, unlock]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [buffer]);

  const push = (v, t = "out") => setBuffer((b) => [...b, { t, v }]);

  const run = (cmd) => {
    const raw = cmd.trim();
    if (!raw) return;
    push(`$ ${raw}`, "in");
    const c = raw.toLowerCase();

    if (c === "help") {
      HELP.forEach(([k, d]) => push(`${k.padEnd(20, " ")} — ${d}`));
    } else if (c === "about") {
      push("Data Scientist / ML Engineer, based in Chicago.");
      push("MS Data Science @ Illinois Tech (May 2026).");
      push("Currently at Labelmaster (co-op) building 8-dept forecasting.");
      push("Ship > clever. Numbers > plan.");
    } else if (c === "experience") {
      TIMELINE.slice().reverse().forEach((t) => {
        push(`${t.year} · ${t.role} — ${t.org}`);
      });
    } else if (c === "projects") {
      PROJECTS.forEach((p) => push(`- ${p.title.padEnd(16, " ")} ${p.tag}${p.isNew ? "  [NEW]" : ""}`));
    } else if (c === "skills") {
      push(`core: ${SKILLS.core.map((s) => s.name).join(", ")}`);
      push(`daily: ${SKILLS.daily.join(", ")}`);
      push(`supporting: ${SKILLS.supporting.slice(0, 8).join(", ")}...`);
    } else if (c === "credentials") {
      CREDENTIALS.forEach((cr) => push(`▸ ${cr}`));
    } else if (c === "resume") {
      push("→ opening resume.pdf");
      window.open(IDENTITY.resume, "_blank");
    } else if (c === "contact") {
      push(`email    ${IDENTITY.email}`);
      push(`linkedin ${IDENTITY.linkedin}`);
      push(`github   ${IDENTITY.github}`);
    } else if (c === "whoami") {
      push("yachi@systems-lab:~$  Data Scientist · ML Engineer · Chicago");
    } else if (c === "achievements") {
      const keys = Object.keys(labels);
      push(`unlocked ${unlocked.size}/${keys.length}`);
      keys.forEach((k) => {
        push(`${unlocked.has(k) ? "[✓]" : "[ ]"}  ${labels[k]}`);
      });
    } else if (c === "coffee") {
      push("current compute accelerator: ☕", "special");
    } else if (c === "sudo hire yachi") {
      push("Permission granted.", "special");
      push("→ opening /#contact");
      setOpen(false);
      setTimeout(() => jumpTo("contact"), 250);
    } else if (c === "clear" || c === "cls") {
      setBuffer([]);
      return;
    } else if (c === "theme dark") {
      document.documentElement.classList.remove("light");
      push("theme = dark");
    } else if (c === "theme light") {
      document.documentElement.classList.add("light");
      push("theme = light (portfolio prefers dark — switching back in 2s)");
      setTimeout(() => document.documentElement.classList.remove("light"), 2000);
    } else if (c === "ls" || c === "dir") {
      push("about  experience  projects  skills  credentials  contact");
    } else {
      push(`command not found: ${raw}`, "err");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          data-testid="terminal-overlay"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl bg-[#0d0f1e] border border-[#5B73FF]/60 shadow-[0_0_60px_rgba(91,115,255,0.25)]"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <div className="font-mono text-[11px] text-[#4ADE80] uppercase tracking-widest flex items-center gap-2">
                <span className="pulse-dot" /> yachi_os · terminal
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
                data-testid="terminal-close"
              >
                <X size={16} />
              </button>
            </div>
            <div
              ref={bodyRef}
              className="h-[46vh] md:h-[52vh] overflow-y-auto p-5 font-mono text-[12.5px] leading-relaxed space-y-1"
            >
              {buffer.map((l, i) => (
                <div
                  key={i}
                  className={
                    l.t === "in"
                      ? "text-white"
                      : l.t === "err"
                      ? "text-red-400"
                      : l.t === "special"
                      ? "text-[#5B73FF]"
                      : l.t === "sys"
                      ? "text-white/40"
                      : "text-[#4ADE80]"
                  }
                >
                  {l.v}
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  run(input);
                  setInput("");
                }}
                className="flex items-center gap-2 pt-1"
              >
                <span className="text-[#5B73FF]">$</span>
                <input
                  ref={inputRef}
                  data-testid="terminal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-white caret-[#4ADE80]"
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="w-2 h-4 bg-[#4ADE80] blink" />
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

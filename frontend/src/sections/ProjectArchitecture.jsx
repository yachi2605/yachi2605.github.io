import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Link2 } from "lucide-react";
import { toast } from "sonner";
import { useAchievements } from "../context/Achievements";

const EASE = [0.16, 1, 0.3, 1];

export default function ProjectArchitecture({ project, onClose }) {
  const nodes = project?.architecture || [];
  const [active, setActive] = useState(nodes[0]?.id);
  const { unlock } = useAchievements();

  useEffect(() => {
    if (project) {
      unlock("architecture");
      setActive(project.architecture?.[0]?.id);
    }
  }, [project, unlock]);

  const node = nodes.find((n) => n.id === active) || nodes[0];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          data-testid="architecture-modal"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0d0f1e] border border-white/10"
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10 bg-[#0d0f1e]/95 backdrop-blur">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5B73FF] mb-1">
                  architecture · {project.title}
                </div>
                <h3 className="font-serif-display text-2xl md:text-4xl text-white leading-none">
                  Click a node. See the tradeoff.
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success("link copied");
                  }}
                  className="text-white/50 hover:text-white transition-colors"
                  data-testid="architecture-modal-copy-link"
                  title="Copy shareable link"
                >
                  <Link2 size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors"
                  data-testid="architecture-modal-close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {/* pipeline */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
                {nodes.map((n, i) => (
                  <button
                    key={n.id}
                    data-testid={`arch-node-${n.id}`}
                    onClick={() => setActive(n.id)}
                    className={`relative text-left border p-4 transition-colors duration-300 ${
                      active === n.id
                        ? "border-[#5B73FF] bg-[#5B73FF]/10"
                        : "border-white/10 bg-[#14172a]/40 hover:border-white/25"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-serif-display text-lg md:text-2xl text-white leading-tight">
                      {n.label}
                    </div>
                    {i < nodes.length - 1 && (
                      <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20 text-lg z-10">
                        →
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* detail */}
              <motion.div
                key={node?.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="border border-white/10 bg-[#14172a]/50 p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
              >
                <Detail k="tech_stack" v={node?.tech} />
                <Detail k="design_decision" v={node?.decision} />
                <Detail k="tradeoff" v={node?.tradeoff} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Detail({ k, v }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5B73FF] mb-3">{k}</div>
      <p className="font-serif-display text-lg md:text-2xl leading-snug text-white/90">{v}</p>
    </div>
  );
}

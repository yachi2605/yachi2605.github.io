import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";

const AchievementContext = createContext(null);

const ACH_LABELS = {
  terminal: "Terminal opened",
  palette: "Command palette used",
  architecture: "Architecture Explorer inspected",
  timeline: "Timeline traversed",
  project: "Project details opened",
};

export function AchievementProvider({ children }) {
  const [unlocked, setUnlocked] = useState(new Set());
  const [milestoneShown, setMilestoneShown] = useState(false);

  const unlock = useCallback(
    (key) => {
      setUnlocked((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        toast.success(`unlocked · ${ACH_LABELS[key] || key}`, {
          description: `${next.size}/${Object.keys(ACH_LABELS).length} discovered`,
        });
        if (next.size >= 3 && !milestoneShown) {
          setMilestoneShown(true);
          setTimeout(() => {
            toast(`> explorer.status = "curious"`, {
              description: "Type `achievements` in terminal to see progress.",
              duration: 5000,
            });
          }, 900);
        }
        return next;
      });
    },
    [milestoneShown]
  );

  const value = useMemo(() => ({ unlocked, unlock, labels: ACH_LABELS }), [unlocked, unlock]);
  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>;
}

export const useAchievements = () => useContext(AchievementContext);

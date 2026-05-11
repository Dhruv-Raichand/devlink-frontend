import { useState, useCallback } from "react";

const useHints = () => {
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const hasSeenHint = useCallback(
    (id) => localStorage.getItem(`hint_seen_${id}`) === "true",
    [],
  );

  const hasDismissedHint = useCallback(
    (id) => localStorage.getItem(`hint_dismissed_${id}`) === "true",
    [],
  );

  const markHintSeen = useCallback((id) => {
    localStorage.setItem(`hint_seen_${id}`, "true");
    rerender();
  }, []);

  const dismissHint = useCallback((id) => {
    localStorage.setItem(`hint_dismissed_${id}`, "true");
    rerender();
  }, []);

  const shouldShow = useCallback(
    (id) => !hasSeenHint(id) && !hasDismissedHint(id),
    [hasSeenHint, hasDismissedHint],
  );

  return {
    shouldShow,
    hasSeenHint,
    hasDismissedHint,
    markHintSeen,
    dismissHint,
  };
};

export default useHints;

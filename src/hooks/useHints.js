/**
 * useHints — central hint state manager
 *
 * Stores dismissed/seen state in localStorage.
 * All hint types (modal, slide-in, inline, banner) use this.
 *
 * Keys:
 *   onboarding_complete       — full-page onboarding done
 *   hint_seen_{id}            — one-time modal/slide-in seen
 *   hint_dismissed_{id}       — user explicitly dismissed
 */

import { useState, useCallback } from "react";

const useHints = () => {
  // Force re-render when hints change
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const isOnboardingComplete = () =>
    localStorage.getItem("onboarding_complete") === "true";

  const completeOnboarding = () => {
    localStorage.setItem("onboarding_complete", "true");
    rerender();
  };

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

  // Should show = not seen AND not dismissed
  const shouldShow = useCallback(
    (id) => !hasSeenHint(id) && !hasDismissedHint(id),
    [hasSeenHint, hasDismissedHint],
  );

  return {
    isOnboardingComplete,
    completeOnboarding,
    shouldShow,
    hasSeenHint,
    hasDismissedHint,
    markHintSeen,
    dismissHint,
  };
};

export default useHints;

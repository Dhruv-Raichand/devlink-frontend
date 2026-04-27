import { useState, useEffect } from "react";
import useHints from "../../hooks/useHints";

/**
 * InlineBanner — context-aware dismissible top banner.
 * Shows below the page header, dismisses forever.
 *
 * Usage:
 *   <InlineBanner
 *     id="requests_explain"
 *     message="Received: people who liked you. Sent: requests you've sent."
 *     type="info"
 *   />
 *
 * Or context-aware:
 *   <InlineBanner
 *     id="feed_no_skills"
 *     condition={user.skills?.length === 0}
 *     message="You haven't added skills yet — add them to appear in skill searches."
 *     type="tip"
 *     action={{ label: "Add skills", onClick: () => navigate('/app/profile') }}
 *   />
 */

const TYPES = {
  info: {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="8.01" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    ),
    color: "text-violet-400",
    bg: "bg-violet-950/20 border-violet-900/40",
  },
  tip: {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: "text-amber-400",
    bg: "bg-amber-950/20 border-amber-900/40",
  },
  success: {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    color: "text-emerald-400",
    bg: "bg-emerald-950/20 border-emerald-900/40",
  },
};

const InlineBanner = ({
  id,
  message,
  type = "info",
  condition = true,
  action = null,
}) => {
  const { hasDismissedHint, dismissHint } = useHints();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (condition && !hasDismissedHint(id)) setVisible(true);
    else setVisible(false);
  }, [condition, id]);

  const dismiss = () => {
    dismissHint(id);
    setVisible(false);
  };

  if (!visible) return null;

  const { icon, color, bg } = TYPES[type] || TYPES.info;

  return (
    <div
      className={`flex items-center gap-3 border rounded-xl px-4 py-3 mb-5 ${bg}`}>
      <span className={`flex-shrink-0 ${color}`}>{icon}</span>
      <p className={`text-[13px] flex-1 leading-relaxed ${color}`}>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`text-[12px] font-medium transition-colors cursor-pointer bg-transparent border-none flex-shrink-0 whitespace-nowrap ${color} opacity-80 hover:opacity-100`}>
          {action.label} →
        </button>
      )}
      <button
        onClick={dismiss}
        className="text-current opacity-40 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0 flex-shrink-0"
        aria-label="Dismiss">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default InlineBanner;

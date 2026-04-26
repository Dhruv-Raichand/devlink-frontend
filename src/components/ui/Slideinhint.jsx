import { useEffect, useState } from "react";
import useHints from "../../hooks/useHints";

/**
 * SlideInHint — contextual suggestion panel, slides in from bottom-right.
 * Shown when a condition is true AND the hint hasn't been dismissed.
 *
 * Usage:
 *   <SlideInHint
 *     id="profile_no_photo"
 *     condition={!user.photoUrl}
 *     icon="📸"
 *     title="Add a profile photo"
 *     body="Profiles with photos get more connection requests."
 *     action={{ label: "Add photo", onClick: () => navigate('/app/profile') }}
 *   />
 */
const SlideInHint = ({
  id,
  condition,
  icon,
  title,
  body,
  action,
  delay = 1500,
}) => {
  const { hasDismissedHint, dismissHint } = useHints();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!condition || hasDismissedHint(id)) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [condition, id]);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => {
      dismissHint(id);
      setVisible(false);
      setExiting(false);
    }, 250);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 w-72 bg-[#13121c] border border-[#2d2b40] rounded-2xl shadow-2xl p-4 transition-all duration-250 ${
        exiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
      style={{ animation: !exiting ? "slideInRight 0.3s ease" : undefined }}>
      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-[#4a4760] hover:text-[#9b8ec4] transition-colors cursor-pointer bg-transparent border-none p-0">
        <svg
          width="14"
          height="14"
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

      <div className="flex items-start gap-3 pr-4">
        <span className="text-[24px] leading-none flex-shrink-0 mt-0.5">
          {icon}
        </span>
        <div>
          <p className="font-['Outfit'] font-bold text-[14px] text-white mb-1">
            {title}
          </p>
          <p className="text-[12px] text-[#6b6880] leading-relaxed mb-3">
            {body}
          </p>
          {action && (
            <button
              onClick={() => {
                action.onClick();
                dismiss();
              }}
              className="text-[12px] font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer bg-transparent border-none p-0">
              {action.label} →
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SlideInHint;

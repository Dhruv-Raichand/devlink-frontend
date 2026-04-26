import { useEffect, useState } from "react";
import useHints from "../../hooks/useHints";

/**
 * HintModal — one-time modal for feature discovery moments.
 * Shows once, never again after dismissed.
 *
 * Usage:
 *   <HintModal
 *     id="feed_swipe"
 *     emoji="👆"
 *     title="How swiping works"
 *     body="Swipe right or tap Like to send a connection request. Swipe left to pass."
 *     cta="Got it"
 *   />
 */
const HintModal = ({ id, emoji, title, body, cta = "Got it", delay = 800 }) => {
  const { shouldShow, markHintSeen } = useHints();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShow(id)) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [id]);

  const dismiss = () => {
    markHintSeen(id);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0a0a0f]/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal — slides up on mobile, center on desktop */}
      <div className="relative w-full max-w-sm bg-[#13121c] border border-[#2d2b40] rounded-2xl p-6 shadow-2xl animate-[slideUp_0.3s_ease]">
        <div className="text-[40px] mb-4 text-center leading-none">{emoji}</div>
        <h3 className="font-['Outfit'] font-extrabold text-[20px] text-white text-center tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-[14px] text-[#9b8ec4] text-center leading-relaxed mb-6">
          {body}
        </p>
        <button
          onClick={dismiss}
          className="w-full py-3 bg-violet-700 hover:bg-violet-600 text-white font-medium text-[14px] rounded-xl transition-all cursor-pointer border-none">
          {cta}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HintModal;

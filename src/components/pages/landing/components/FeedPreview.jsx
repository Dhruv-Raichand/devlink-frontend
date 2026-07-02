import { useState, useEffect } from "react";
import { PROFILES } from "../data";
import SwipeCardPreview from "./SwipeCard";

const FeedPreview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev - 1 + PROFILES.length) % PROFILES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const currentProfile = PROFILES[activeIndex];
  const nextProfile = PROFILES[(activeIndex + 1) % PROFILES.length];
  const nextNextProfile = PROFILES[(activeIndex + 2) % PROFILES.length];

  return (
    <div
      className="relative mx-auto w-full max-w-[440px] [animation:fadeUp_0.6s_ease_0.42s_both]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div className="absolute -inset-8 bg-violet-950/20 blur-3xl" />

      <div className="relative rounded-[28px] border border-[#2d2b40] bg-[#0d0c16]/95 p-4 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-[#1e1d28] pb-3 mb-4">
          <div>
            <p className="font-['Outfit'] font-bold text-white text-[18px]">
              Find your coding partner
            </p>
            <p className="text-[11px] text-[#4a4760] mt-0.5">
              Filtered by React and Node.js
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#13121c] border border-[#2d2b40] rounded-full px-3 py-1.5">
            <span className="w-5 h-5 rounded-lg bg-violet-700 flex items-center justify-center text-xs font-bold text-white">
              8
            </span>
            <span className="text-[12px] text-[#6b6880]">left</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {["React", "Node.js", "TypeScript", "Python"].map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-3 py-1.5 rounded-full border border-[#2d2b40] bg-[#0d0c16] text-[#6b6880]">
              {skill}
            </span>
          ))}
        </div>

        <div className="relative min-h-[520px] flex items-center justify-center">
          {/* back card */}
          <div
            key={`back-${nextNextProfile.id}`}
            className="hidden sm:block absolute top-10 left-1/2 -translate-x-[calc(50%-28px)] scale-[0.85] rotate-[10deg] opacity-35 z-0 transition-all duration-500">
            <SwipeCardPreview profile={nextNextProfile} />
          </div>

          {/* middle card */}
          <div
            key={`mid-${nextProfile.id}`}
            className="hidden sm:block absolute top-6 left-1/2 -translate-x-[calc(50%+18px)] scale-[0.92] rotate-[-6deg] opacity-55 z-10 transition-all duration-500">
            <SwipeCardPreview profile={nextProfile} />
          </div>

          {/* main card */}
          <div
            key={currentProfile.id}
            className="relative z-20 [animation:cardIn_0.5s_ease]">
            <SwipeCardPreview profile={currentProfile} tilt interactive />
          </div>
        </div>

        {/* jump-to-profile dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {PROFILES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show ${p.firstName}'s profile`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-violet-500" : (
                  "w-1.5 bg-[#2d2b40] hover:bg-[#3d3a54]"
                )
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedPreview;

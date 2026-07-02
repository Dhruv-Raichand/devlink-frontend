import { useState, useEffect } from "react";
import { PROFILES } from "../data";
import SwipeCardPreview from "./SwipeCard";

const FeedPreview = () => {
  const [activeIndex, setActiveIndex] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev - 1;

        if (next < 0) {
          return PROFILES.length - 1;
        }

        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentProfile = PROFILES[activeIndex];

  return (
    <div className="relative mx-auto w-full max-w-[440px] [animation:fadeUp_0.6s_ease_0.42s_both]">
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
            className="
            hidden sm:block 
            absolute 
            top-8 
            left-1/2 
            -translate-x-1/2
            scale-[0.88]
            rotate-[8deg]
            opacity-40
            z-0
          ">
            <SwipeCardPreview profile={PROFILES[0]} />
          </div>

          {/* middle card */}
          <div
            className="
            hidden sm:block
            absolute
            top-5
            left-1/2
            -translate-x-1/2
            scale-[0.94]
            rotate-[-5deg]
            opacity-60
            z-10
          ">
            <SwipeCardPreview profile={PROFILES[1]} />
          </div>

          {/* main card */}
          <div className="relative z-20 animate-[fadeUp_1s_ease]">
            <SwipeCardPreview
              key={currentProfile.id}
              profile={currentProfile}
              tilt
              interactive
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPreview;

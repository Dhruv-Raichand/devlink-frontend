import { useEffect, useState } from "react";
import { STATS } from "../data";
import { useInView } from "../hooks/useInView";

const StatBlock = ({ stat, showBorder }) => {
  const [ref, inView] = useInView();
  const targetNum = parseFloat(stat.n);
  const suffix = stat.n.replace(/[0-9.]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(targetNum * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, targetNum]);

  const display = targetNum % 1 === 0 ? Math.round(count) : count.toFixed(1);

  return (
    <div
      ref={ref}
      className={`flex-1 sm:max-w-[220px] py-7 px-5 text-center ${
        showBorder ? "border-b sm:border-b-0 sm:border-r border-[#1e1d28]" : ""
      }`}>
      <div
        className={`font-['Outfit'] font-extrabold tracking-tight ${stat.featured ? "text-[38px] text-amber-400" : "text-[32px] text-violet-300"}`}>
        {display}
        {suffix}
      </div>
      <div className="text-[13px] text-[#4a4760] mt-1">{stat.label}</div>
    </div>
  );
};

const Stats = () => (
  <div className="flex flex-col sm:flex-row justify-center border-t border-b border-[#1e1d28] bg-[#0d0c16]">
    {STATS.map((s, i) => (
      <StatBlock key={s.label} stat={s} showBorder={i < STATS.length - 1} />
    ))}
  </div>
);

export default Stats;

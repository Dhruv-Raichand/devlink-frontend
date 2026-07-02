import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../../layout/NavBar";
import Footer from "../../layout/Footer";
import { SKILLS } from "./data";
import Stats from "./components/Stats";
import Hero from "./sections/Hero";
import Pricing from "./sections/Pricing";
import Features from "./sections/Features";
import Reveal from "./components/Reveal";

export default function Landing() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) navigate("/app");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e6f0] overflow-x-hidden relative">
      {/* Aurora background: two slow-drifting blurred blobs, fixed behind everything */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-[100px] [animation:drift1_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] [animation:drift2_30s_ease-in-out_infinite]" />
      </div>

      <NavBar />
      <Hero />
      <Stats />

      <div className="py-8 overflow-hidden border-b border-[#1e1d28] bg-[#0a0a0f] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-2.5 w-max [animation:scrollLeft_25s_linear_infinite] hover:[animation-play-state:paused]">
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span
              key={i}
              className="text-[12px] px-3 py-1.5 rounded-full border border-[#2d2b40] bg-[#13121c] text-[#9b8ec4] whitespace-nowrap hover:border-violet-700 hover:text-violet-300 transition-colors cursor-default">
              {s}
            </span>
          ))}
        </div>
      </div>

      <Features />

      <Pricing />

      <section className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10 mb-20">
        <Reveal className="relative bg-[#0d0c16] border border-[#2d2b40] rounded-2xl px-8 sm:px-10 py-16 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(109,40,217,0.12),transparent_70%)]" />
          <h2 className="relative font-['Outfit'] font-extrabold [font-size:clamp(22px,4vw,36px)] text-white tracking-tight mb-3.5">
            Ready to find your partner?
          </h2>
          <p className="relative text-[15px] text-[#7a7590] mb-8">
            Join thousands of developers already connecting on DevLink.
          </p>
          <button
            onClick={() => navigate("/login", { state: { mode: "signup" } })}
            className="relative px-9 py-3.5 text-[15px] font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-600 hover:-translate-y-px transition-all cursor-pointer">
            Create free account
          </button>
        </Reveal>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import FeedPreview from "../components/FeedPreview";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-5 sm:px-8 lg:px-10 pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_65%_55%_at_68%_8%,rgba(109,40,217,0.18),transparent_72%)]" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.95fr_470px] gap-12 lg:gap-16 items-center">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 bg-[#13121c] border border-indigo-900 rounded-full px-3.5 py-1.5 text-[11px] text-violet-400 uppercase tracking-widest font-medium mb-7 [animation:fadeUp_0.6s_ease_0.1s_both]">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 inline-block" />
            Developer networking reimagined
          </div>

          <h1 className="font-['Outfit'] font-extrabold leading-[1.03] mb-5 [font-size:clamp(40px,7vw,74px)] bg-gradient-to-b from-white to-[#9b8ec4] bg-clip-text text-transparent [animation:fadeUp_0.6s_ease_0.2s_both]">
            Swipe, match, and build with devs who fit your stack
          </h1>

          <p className="text-base sm:text-[17px] text-[#7a7590] max-w-xl mb-9 leading-relaxed [animation:fadeUp_0.6s_ease_0.32s_both]">
            DevLink turns discovery into a focused product flow: filter by tech
            stack, review a real profile card, match, then jump straight into
            chat.
          </p>

          <div className="flex gap-3 flex-wrap [animation:fadeUp_0.6s_ease_0.46s_both]">
            <button
              onClick={() => navigate("/login", { state: { mode: "signup" } })}
              className="px-8 py-3.5 text-[15px] font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-600 hover:-translate-y-px transition-all cursor-pointer">
              Start matching free
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3.5 text-[15px] text-[#9b8ec4] border border-[#2d2b40] rounded-lg hover:border-violet-800 hover:text-violet-300 hover:-translate-y-px transition-all cursor-pointer bg-transparent">
              See how it works
            </button>
          </div>
        </div>

        <FeedPreview />
      </div>
    </section>
  );
};

export default Hero;

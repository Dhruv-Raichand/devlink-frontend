import { FEATURES } from "../data";
import Reveal from "../components/Reveal";
import FeatureDemo from "../components/FeatureDemo";

const Features = () => {
  return (
    <section
      id="features"
      className="px-5 sm:px-8 lg:px-10 py-20 max-w-6xl mx-auto">
      <Reveal className="text-center mb-14">
        <div className="text-[11px] text-violet-700 uppercase tracking-[0.12em] font-medium mb-3.5">
          Product preview
        </div>
        <h2 className="font-['Outfit'] font-extrabold [font-size:clamp(24px,4vw,36px)] text-white tracking-tight">
          Four product moments, not feature blurbs
        </h2>
      </Reveal>

      <Reveal className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-[#0d0c16] border border-[#1e1d28] rounded-xl p-5 hover:border-indigo-800 hover:-translate-y-1 transition-all duration-200 min-h-[360px] flex flex-col">
            <div className="flex-1 flex items-center justify-center mb-5">
              <FeatureDemo type={f.demo} />
            </div>
            <h3 className="font-['Outfit'] text-[15px] font-bold text-[#e8e6f0]">
              {f.title}
            </h3>
          </div>
        ))}
      </Reveal>
    </section>
  );
};

export default Features;

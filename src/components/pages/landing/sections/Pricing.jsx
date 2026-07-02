import { useNavigate } from "react-router-dom";
import { PRICING } from "../data";
import Reveal from "../components/Reveal";

const CheckIcon = () => (
  <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section className="px-5 sm:px-8 lg:px-10 pb-20 max-w-6xl mx-auto">
      <Reveal className="text-center mb-10">
        <div className="text-[11px] text-violet-700 uppercase tracking-[0.12em] font-medium mb-3.5">
          Plans
        </div>
        <h2 className="font-['Outfit'] font-extrabold [font-size:clamp(24px,4vw,36px)] text-white tracking-tight mb-3">
          Match more when you need more reach
        </h2>
        <p className="text-[14px] text-[#6b6880]">
          Upgrade for deeper filtering, unlimited swipes, and profile boost.
        </p>
      </Reveal>

      <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRICING.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl flex flex-col transition-all duration-200 ${
              plan.popular ?
                "bg-[#13121c] border-2 border-violet-600 shadow-lg shadow-violet-950/40"
              : "bg-[#13121c] border border-[#1e1d28] hover:border-[#2d2b40]"
            }`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="bg-violet-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  Most popular
                </span>
                <span className="bg-emerald-950/80 border border-emerald-900/70 text-emerald-400 text-[10px] px-2 py-1 rounded-full font-semibold">
                  Save 20%
                </span>
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <div className="mb-6">
                <h3 className="font-['Outfit'] font-bold text-[18px] text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-[12px] text-[#6b6880] mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-['Outfit'] font-extrabold text-[36px] text-white tracking-tight">
                    {plan.price}
                  </span>
                  {plan.suffix && (
                    <span className="text-[13px] text-[#4a4760]">
                      {plan.suffix}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate("/app/premium")}
                className={`w-full py-2.5 rounded-xl text-[13px] font-medium transition-all mb-6 cursor-pointer ${
                  plan.popular ?
                    "bg-violet-700 hover:bg-violet-600 text-white border-none"
                  : "bg-transparent border border-[#2d2b40] text-[#9b8ec4] hover:border-violet-700 hover:text-violet-300"
                }`}>
                View pricing
              </button>

              <div className="border-t border-[#1e1d28] mb-5" />

              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckIcon />
                    <span className="text-[13px] text-[#9b8ec4]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Reveal>

      <p className="text-center text-[12px] text-[#4a4760] mt-6">
        Cancel anytime - No card required for Free
      </p>
    </section>
  );
};

export default Pricing;

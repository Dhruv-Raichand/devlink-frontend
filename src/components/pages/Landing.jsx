import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";

const SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Docker",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Kubernetes",
  "Next.js",
  "Vue",
  "Flutter",
  "Swift",
  "Kotlin",
];

const FEATURES = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Match by stack",
    desc: "Filter by React, Node, Python and 30+ technologies. Find devs who speak your language.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Real-time chat",
    desc: "Message your connections instantly. No friction between you and your next collaborator.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "GitHub linking",
    desc: "Show your work before you say a word. Let your commits speak for themselves.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Swipe to connect",
    desc: "Like or pass on developer profiles. When both swipe right, you're connected.",
  },
];

const STATS = [
  { n: "2.4k", label: "Developers" },
  { n: "840+", label: "Connections made" },
  { n: "30+", label: "Tech stacks" },
];

export default function Landing() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) navigate("/app");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e6f0] overflow-x-hidden">
      {/* ── NAV ── */}
      <NavBar />

      {/* ── HERO ── */}
      <section className="relative px-10 pt-24 pb-20 text-center overflow-hidden">
        {/* Static radial glow — replaces canvas */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(109,40,217,0.18),transparent_70%)]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#13121c] border border-indigo-900 rounded-full px-3.5 py-1.5 text-[11px] text-violet-400 uppercase tracking-widest font-medium mb-7 [animation:fadeUp_0.6s_ease_0.1s_both]">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 inline-block" />
            Developer networking — reimagined
          </div>

          <h1 className="font-['Outfit'] font-extrabold leading-[1.08] tracking-[-0.03em] mb-5 [font-size:clamp(36px,6vw,64px)] bg-gradient-to-b from-white to-[#9b8ec4] bg-clip-text text-transparent [animation:fadeUp_0.6s_ease_0.2s_both]">
            Find your next
            <br />
            coding partner
          </h1>

          <p className="text-base text-[#7a7590] max-w-md mx-auto mb-10 leading-relaxed [animation:fadeUp_0.6s_ease_0.35s_both]">
            Swipe through developers, match by tech stack, build something great
            together. The Tinder for engineers.
          </p>

          <div className="flex gap-3 justify-center flex-wrap [animation:fadeUp_0.6s_ease_0.5s_both]">
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
      </section>

      {/* ── STATS BAR ── */}
      <div className="flex justify-center border-t border-b border-[#1e1d28] bg-[#0d0c16]">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 max-w-[200px] py-7 px-5 text-center ${
              i < STATS.length - 1 ? "border-r border-[#1e1d28]" : ""
            }`}>
            <div className="font-['Outfit'] text-[32px] font-extrabold text-violet-300 tracking-tight">
              {s.n}
            </div>
            <div className="text-[13px] text-[#4a4760] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── SKILL SCROLL ── */}
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

      {/* ── FEATURES ── */}
      <section id="features" className="px-10 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-[11px] text-violet-700 uppercase tracking-[0.12em] font-medium mb-3.5">
            Why DevLink
          </div>
          <h2 className="font-['Outfit'] font-extrabold [font-size:clamp(24px,4vw,36px)] text-white tracking-tight">
            Built for how devs actually work
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[#0d0c16] border border-[#1e1d28] rounded-xl p-6 hover:border-indigo-800 hover:-translate-y-1 transition-all duration-200">
              <div className="w-10 h-10 bg-[#1a1928] border border-[#2d2b40] rounded-[10px] flex items-center justify-center text-violet-600 mb-4">
                {f.icon}
              </div>
              <h3 className="font-['Outfit'] text-[15px] font-bold text-[#e8e6f0] mb-2">
                {f.title}
              </h3>
              <p className="text-[13px] text-[#6b6880] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-3xl px-10 mb-20">
        <div className="relative bg-[#0d0c16] border border-[#2d2b40] rounded-2xl px-10 py-16 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(109,40,217,0.12),transparent_70%)]" />
          <h2 className="relative font-['Outfit'] font-extrabold [font-size:clamp(22px,4vw,36px)] text-white tracking-tight mb-3.5">
            Ready to find your partner?
          </h2>
          <p className="relative text-[15px] text-[#7a7590] mb-8">
            Join thousands of developers already connecting on DevLink.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="relative px-9 py-3.5 text-[15px] font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-600 hover:-translate-y-px transition-all cursor-pointer">
            Create free account
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />

      {/* Only 2 keyframes that Tailwind can't do natively */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

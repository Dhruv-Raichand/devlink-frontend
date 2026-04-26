import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { addUser } from "../../store/userSlice";
import { notifyError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import useHints from "../../hooks/useHints";

const PREDEFINED_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "Swift",
  "Kotlin",
  "Docker",
  "Kubernetes",
  "AWS",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Next.js",
  "Vue",
  "Flutter",
  "DevOps",
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "others", label: "Other" },
];

const inputCls =
  "w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-violet-500 transition-colors";
const labelCls =
  "block text-[12px] text-white/40 uppercase tracking-wider mb-2";

const STEPS = [
  {
    id: "basics",
    title: "Let's set up your profile",
    subtitle: "Your photo and basics help others decide to connect with you",
    emoji: "👋",
  },
  {
    id: "skills",
    title: "What do you work with?",
    subtitle: "Pick your tech stack — this is how developers find each other",
    emoji: "⚡",
  },
  {
    id: "bio",
    title: "Tell your story",
    subtitle: "A short bio and GitHub link make your profile stand out",
    emoji: "✍️",
  },
  {
    id: "done",
    title: "You're all set!",
    subtitle: "Your profile is ready. Start finding your coding partner.",
    emoji: "🚀",
  },
];

const Onboarding = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { completeOnboarding } = useHints();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState("forward"); // for animation hint

  // Step 1 state
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [previewImage, setPreviewImage] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");

  // Step 2 state
  const [skills, setSkills] = useState(user?.skills || []);
  const [customSkill, setCustomSkill] = useState("");

  // Step 3 state
  const [about, setAbout] = useState(user?.about || "");
  const [githubUsername, setGithubUsername] = useState(
    user?.githubUsername || "",
  );

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill)
      : prev.length < 10 ? [...prev, skill]
      : prev,
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !skills.includes(s) && skills.length < 10) {
      setSkills([...skills, s]);
      setCustomSkill("");
    }
  };

  const save = async (payload) => {
    try {
      setIsLoading(true);
      const res = await api.patch("/profile/edit", payload);
      dispatch(addUser(res.data.data));
      return true;
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to save");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate("/app");
  };

  const next = async () => {
    setDirection("forward");
    let ok = true;

    if (step === 0) {
      ok = await save({
        photoUrl: photoUrl || undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
      });
    } else if (step === 1) {
      ok = await save({ skills });
    } else if (step === 2) {
      ok = await save({
        about: about || undefined,
        githubUsername: githubUsername.trim() || undefined,
      });
    }

    if (ok) setStep((s) => Math.min(s + 1, 3));
  };

  const skip = () => {
    setDirection("forward");
    setStep((s) => Math.min(s + 1, 3));
  };

  const canSkip = step < 3;
  const isLastContent = step === 2;
  const isDone = step === 3;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Top progress */}
      {!isDone && (
        <div className="fixed top-0 left-0 right-0 z-10">
          <div className="h-0.5 bg-[#1e1d28]">
            <div
              className="h-full bg-violet-600 transition-all duration-700 ease-out"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Navbar stub */}
      <div className="flex items-center justify-between px-8 h-14 border-b border-[#1e1d28] mt-0.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] overflow-hidden">
            <img src="/devlink.png" className="w-full h-full object-contain" />
          </div>
          <span className="font-['Outfit'] font-extrabold text-[18px] text-white tracking-tight">
            DevLink
          </span>
        </div>
        {!isDone && (
          <span className="text-[12px] text-[#4a4760]">
            Step {step + 1} of 3
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step header */}
          <div className="text-center mb-8">
            <div className="text-[48px] mb-4 leading-none">
              {STEPS[step].emoji}
            </div>
            <h1 className="font-['Outfit'] font-extrabold text-[30px] text-white tracking-tight mb-2">
              {STEPS[step].title}
            </h1>
            <p className="text-[14px] text-[#6b6880] leading-relaxed max-w-sm mx-auto">
              {STEPS[step].subtitle}
            </p>
          </div>

          {/* ── Step 1: Basics ── */}
          {step === 0 && (
            <div className="bg-[#13121c] border border-[#1e1d28] rounded-2xl p-6 flex flex-col gap-5">
              {/* Photo */}
              <div>
                <label className={labelCls}>Profile photo URL</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2d2b40] flex-shrink-0 bg-[#1a1928]">
                    {previewImage ?
                      <img
                        src={previewImage}
                        className="w-full h-full object-cover"
                        onError={() => setPreviewImage("")}
                      />
                    : <div className="w-full h-full flex items-center justify-center text-[#4a4760]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    }
                  </div>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => {
                      setPhotoUrl(e.target.value);
                      setPreviewImage(e.target.value);
                    }}
                    className={inputCls}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Age</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={inputCls}
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={inputCls + " cursor-pointer"}>
                    <option value="">Select</option>
                    {GENDER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Context-aware hint */}
              {!photoUrl && (
                <div className="flex items-start gap-2.5 bg-violet-950/20 border border-violet-900/40 rounded-xl px-4 py-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-violet-400 mt-0.5 flex-shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="8.01" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                  </svg>
                  <p className="text-[12px] text-violet-300">
                    Profiles with a photo get significantly more connection
                    requests.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Skills ── */}
          {step === 1 && (
            <div className="bg-[#13121c] border border-[#1e1d28] rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`text-[12px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      skills.includes(skill) ?
                        "border-violet-600 bg-violet-950/50 text-violet-300"
                      : "border-[#2d2b40] bg-[#0d0c16] text-[#6b6880] hover:border-[#4a4760] hover:text-[#9b8ec4]"
                    }`}>
                    {skill}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  placeholder="Add a custom skill..."
                  className={inputCls + " flex-1"}
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-3 py-2 bg-[#1a1928] border border-[#2d2b40] text-[#9b8ec4] hover:border-violet-700 text-[12px] rounded-xl transition-all cursor-pointer">
                  Add
                </button>
              </div>

              {skills.length === 0 ?
                <div className="flex items-start gap-2.5 bg-amber-950/20 border border-amber-900/40 rounded-xl px-4 py-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-400 mt-0.5 flex-shrink-0">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <p className="text-[12px] text-amber-300">
                    Pick at least one skill so developers can find you in
                    searches.
                  </p>
                </div>
              : <p className="text-[12px] text-[#6b6880]">
                  {skills.length}/10 selected
                  {skills.length >= 3 && " — looking good!"}
                </p>
              }
            </div>
          )}

          {/* ── Step 3: Bio + GitHub ── */}
          {step === 2 && (
            <div className="bg-[#13121c] border border-[#1e1d28] rounded-2xl p-6 flex flex-col gap-5">
              <div>
                <label className={labelCls}>About me</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="What are you building? What kind of collaborator are you looking for?"
                  className={inputCls + " resize-none"}
                />
                <p className="text-[11px] text-[#4a4760] text-right mt-1">
                  {about.length}/500
                </p>
              </div>

              <div>
                <label className={labelCls}>
                  GitHub username
                  <span className="normal-case text-[#4a4760] ml-1">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a4760] text-[14px] pointer-events-none">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="your-username"
                    className={inputCls + " pl-[108px]"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Done ── */}
          {step === 3 && (
            <div className="bg-[#13121c] border border-[#1e1d28] rounded-2xl p-6">
              <div className="flex flex-col gap-3">
                {[
                  { label: "Profile set up", done: true },
                  { label: "Skills added", done: skills.length > 0 },
                  { label: "Bio written", done: !!about },
                  { label: "GitHub linked", done: !!githubUsername },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.done ? "bg-emerald-600" : "bg-[#2d2b40]"
                      }`}>
                      {item.done ?
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      : <div className="w-2 h-2 rounded-full bg-[#4a4760]" />}
                    </div>
                    <span
                      className={`text-[14px] ${item.done ? "text-white" : "text-[#4a4760]"}`}>
                      {item.label}
                    </span>
                    {!item.done && (
                      <span className="text-[11px] text-[#4a4760] ml-auto">
                        can add later
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            {canSkip && !isDone && (
              <button
                onClick={skip}
                className="px-5 py-3 border border-[#2d2b40] text-[#6b6880] hover:text-[#9b8ec4] hover:border-[#4a4760] text-[13px] rounded-xl transition-all cursor-pointer bg-transparent">
                Skip
              </button>
            )}
            <button
              onClick={isDone ? handleComplete : next}
              disabled={isLoading}
              className="flex-1 py-3 bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white font-medium text-[14px] rounded-xl transition-all cursor-pointer border-none">
              {isLoading ?
                "Saving..."
              : isDone ?
                "Start matching →"
              : isLastContent ?
                "Finish setup"
              : "Continue →"}
            </button>
          </div>

          {/* Step dots */}
          {!isDone && (
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === step ? "w-5 h-1.5 bg-violet-600"
                    : i < step ? "w-1.5 h-1.5 bg-violet-800"
                    : "w-1.5 h-1.5 bg-[#2d2b40]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

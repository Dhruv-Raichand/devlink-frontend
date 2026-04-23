import { useState, useRef } from "react";
import UserCard from "../ui/UserCard";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/toast";

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
  "w-full bg-[#13121c] border border-[#2d2b40] text-[#e8e6f0] placeholder-[#3a3850] rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-violet-600 transition-colors";
const labelCls =
  "block text-[11px] text-[#6b6880] uppercase tracking-wider mb-1.5";

const ProfileEdit = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [customSkill, setCustomSkill] = useState("");
  const [previewImage, setPreviewImage] = useState(user?.photoUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const original = useRef({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    about: user?.about || "",
    photoUrl: user?.photoUrl || "",
    age: user?.age || "",
    gender: user?.gender || "",
    skills: user?.skills || [],
  });

  const hasChanges =
    JSON.stringify(original.current) !==
    JSON.stringify({
      firstName,
      lastName,
      about,
      photoUrl,
      age,
      gender,
      skills,
    });

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

  const handleSave = async () => {
    if (!hasChanges) {
      notifyError("No changes detected");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.patch("/profile/edit", {
        firstName,
        lastName,
        about,
        photoUrl,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        skills,
      });
      notifySuccess(res?.data?.message);
      dispatch(addUser(res.data.data));
      original.current = {
        firstName,
        lastName,
        about,
        photoUrl,
        age,
        gender,
        skills,
      };
    } catch (err) {
      notifyError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Outfit'] font-extrabold text-[28px] text-white tracking-tight mb-1">
          Edit profile
        </h1>
        <p className="text-[13px] text-[#6b6880]">
          Update your info and skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* ── Form ── */}
        <div className="bg-[#13121c] border border-[#1e1d28] rounded-xl p-6 flex flex-col gap-5">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputCls}
                placeholder="John"
              />
            </div>
            <div>
              <label className={labelCls}>Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputCls}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className={labelCls}>Profile photo URL</label>
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
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-10 h-10 rounded-full object-cover border border-[#2d2b40] mt-2"
                onError={() => setPreviewImage("")}
              />
            )}
          </div>

          {/* Age + Gender */}
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

          {/* About */}
          <div>
            <label className={labelCls}>About me</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tell others about yourself..."
              className={inputCls + " resize-none"}
            />
            <p className="text-[11px] text-[#4a4760] text-right mt-1">
              {about?.length || 0}/500
            </p>
          </div>

          {/* Skills */}
          <div>
            <label className={labelCls}>
              Skills{" "}
              <span className="normal-case text-[#4a4760]">
                ({skills.length}/10)
              </span>
            </label>
            {/* Predefined chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PREDEFINED_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`text-[12px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    skills.includes(skill) ?
                      "border-violet-600 bg-violet-950/40 text-violet-300"
                    : "border-[#2d2b40] bg-[#0d0c16] text-[#6b6880] hover:border-[#4a4760] hover:text-[#9b8ec4]"
                  }`}>
                  {skill}
                </button>
              ))}
            </div>
            {/* Custom skill input */}
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
                placeholder="Add custom skill..."
                className={inputCls + " flex-1"}
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 bg-[#1a1928] border border-[#2d2b40] text-[#9b8ec4] hover:border-violet-700 hover:text-violet-300 text-[12px] rounded-lg transition-all cursor-pointer">
                Add
              </button>
            </div>
            {/* Selected custom skills not in predefined */}
            {skills.filter((s) => !PREDEFINED_SKILLS.includes(s)).length >
              0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills
                  .filter((s) => !PREDEFINED_SKILLS.includes(s))
                  .map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border border-violet-600 bg-violet-950/40 text-violet-300">
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          setSkills(skills.filter((s) => s !== skill))
                        }
                        className="text-violet-400 hover:text-white cursor-pointer bg-transparent border-none p-0 leading-none">
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate("/app")}
              className="flex-1 py-2.5 border border-[#2d2b40] text-[#6b6880] hover:text-[#9b8ec4] hover:border-[#4a4760] text-[13px] rounded-lg transition-all cursor-pointer bg-transparent">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
              className="flex-1 py-2.5 bg-violet-700 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-[13px] rounded-lg transition-all cursor-pointer border-none">
              {isLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div className="lg:sticky lg:top-20 self-start">
          <p className="text-[11px] text-[#4a4760] uppercase tracking-wider mb-3">
            Live preview
          </p>
          <UserCard
            user={{
              firstName,
              lastName,
              about,
              photoUrl: previewImage,
              age,
              gender,
              skills,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

import { PROFILES } from "../data";
import SwipeCardPreview from "./SwipeCard";

const Avatar = ({ name, photo, className = "w-7 h-7" }) => (
  <div
    aria-label={name}
    className={`${className} rounded-full overflow-hidden border border-[#2d2b40] bg-[#1a1928]`}>
    {photo ?
      <img src={photo} alt={name} className="w-full h-full object-cover" />
    : <div className="w-full h-full bg-[radial-gradient(circle_at_50%_36%,#f5f3ff_0_17%,#a78bfa_18%_27%,transparent_28%),radial-gradient(circle_at_50%_98%,#6d28d9_0_35%,transparent_36%),linear-gradient(135deg,#312e81,#13121c)]" />
    }
  </div>
);

const SkillDemo = () => (
  <div className="w-full rounded-2xl border border-[#1e1d28] bg-[#13121c] p-4">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[10px] text-[#4a4760] uppercase tracking-wider">
        Filter by skill
      </p>
      <span className="text-[11px] text-[#6b6880]">6 selected</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {["React", "Node.js", "TypeScript", "Docker", "AWS", "GraphQL"].map(
        (skill) => (
          <span
            key={skill}
            className={`text-[12px] px-3 py-1.5 rounded-full border transition-all ${
              skill === "React" || skill === "Docker" ?
                "border-violet-600 bg-violet-950/50 text-violet-300"
              : "border-[#2d2b40] bg-[#0d0c16] text-[#6b6880]"
            }`}>
            {skill}
          </span>
        ),
      )}
    </div>
  </div>
);

const ChatDemo = () => {
  const chatProfile = PROFILES[3] ?? PROFILES[0];
  return (
    <div className="w-full rounded-2xl border border-[#1e1d28] bg-[#0d0c16] p-4">
      <div className="flex items-center gap-3 border-b border-[#1e1d28] pb-3 mb-4">
        <Avatar
          name={chatProfile.name}
          photo={chatProfile.photo}
          className="w-8 h-8"
        />
        <div>
          <p className="font-['Outfit'] text-[13px] font-bold text-white">
            Aarav Mehta
          </p>
          <p className="text-[10px] text-[#4a4760]">View profile</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-2">
          <Avatar name={chatProfile.name} photo={chatProfile.photo} />
          <div className="max-w-[78%] flex flex-col gap-1">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-[#1a1928] border border-[#2d2b40] text-[#e8e6f0] text-[13px] leading-relaxed">
              Want to pair on the API tonight?
            </div>
            <span className="text-[10px] text-[#4a4760] px-1">
              Aarav - 9:42 PM
            </span>
          </div>
        </div>
        <div className="flex items-end gap-2 flex-row-reverse">
          <Avatar name="You" />
          <div className="max-w-[78%] flex flex-col gap-1 items-end">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-br-sm bg-violet-700 text-white text-[13px] leading-relaxed">
              Yep. I can wire sockets.
            </div>
            <span className="text-[10px] text-[#4a4760] px-1">
              You - 9:43 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GitHubDemo = () => (
  <div className="w-full rounded-2xl border border-[#1e1d28] bg-[#13121c] p-4 space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-['Outfit'] text-[14px] font-bold text-white">
          devlink-api
        </p>
        <p className="text-[11px] text-[#4a4760]">TypeScript - public</p>
      </div>
      <span className="text-[11px] px-2 py-1 rounded-full border border-[#2d2b40] text-[#9b8ec4]">
        linked
      </span>
    </div>
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div
            className={`w-3 h-3 rounded-full border ${i === 4 ? "bg-violet-500 border-violet-300" : "bg-[#1a1928] border-[#2d2b40]"}`}
          />
          {i < 4 && <div className="h-px flex-1 bg-[#2d2b40]" />}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[
        ["Commits", "42"],
        ["Repos", "12"],
        ["Stars", "128"],
      ].map(([label, value]) => (
        <div
          key={label}
          className="bg-[#0d0c16] border border-[#1e1d28] rounded-lg px-3 py-2">
          <div className="text-[16px] font-bold text-white">{value}</div>
          <div className="text-[10px] text-[#4a4760]">{label}</div>
        </div>
      ))}
    </div>
    <div className="rounded-xl bg-[#0d0c16] border border-[#1e1d28] px-3 py-2">
      <p className="text-[11px] text-[#6b6880]">latest push</p>
      <p className="text-[12px] text-[#9b8ec4] mt-1">add socket room cleanup</p>
    </div>
  </div>
);

const SwipeDemo = () => {
  const passProfile = PROFILES[2] ?? PROFILES[0];
  const matchProfile = PROFILES[1] ?? PROFILES[0];

  return (
    <div className="relative w-full min-h-[280px] rounded-2xl border border-[#1e1d28] bg-[#0d0c16] p-4 overflow-hidden">
      <div className="absolute right-4 top-4 rounded-full border border-violet-600 bg-violet-950/40 px-3 py-1 text-[11px] text-violet-300 z-10">
        right swipe
      </div>

      <div className="absolute left-3 top-6 w-[175px] rotate-[-7deg]">
        <div className="w-[250px] origin-top-left scale-[0.7]">
          <SwipeCardPreview profile={passProfile} compact />
        </div>
      </div>

      <div className="absolute right-4 bottom-4 w-[190px] rotate-[3deg]">
        <div className="rounded-2xl border border-violet-600 bg-[#13121c] p-4 shadow-xl shadow-violet-950/30">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#13121c] overflow-hidden bg-[#1a1928] z-10">
              <img
                src={matchProfile.photo}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#13121c] overflow-hidden bg-[#1a1928] -ml-4">
              <div className="w-full h-full flex items-center justify-center bg-violet-800 text-white text-[13px] font-bold">
                You
              </div>
            </div>
            <div className="ml-3">
              <p className="font-['Outfit'] text-[14px] font-bold text-white">
                It's a match
              </p>
              <p className="text-[11px] text-[#6b6880]">Chat unlocked</p>
            </div>
          </div>
          <button className="w-full bg-violet-700 text-white font-medium py-2.5 rounded-xl text-[13px] border-none">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureDemo = ({ type }) => {
  if (type === "skills") return <SkillDemo />;
  if (type === "chat") return <ChatDemo />;
  if (type === "github") return <GitHubDemo />;
  return <SwipeDemo />;
};

export default FeatureDemo;

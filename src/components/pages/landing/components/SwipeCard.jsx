import { useRef, useState, useEffect } from "react";

const initials = (first, last) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const ProfilePhoto = ({ compact = false, src, role, firstName, lastName }) => {
  const imgRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className="absolute inset-0 bg-[#1a1928]">
      {!failed ?
        <img
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#4c1d95_0%,#1a1928_70%)]">
          <span className="font-['Outfit'] font-bold text-white/80 text-[42px] tracking-wide">
            {initials(firstName, lastName)}
          </span>
        </div>
      }
      {!loaded && !failed && (
        <div className="absolute inset-0 bg-[#1a1928] animate-pulse" />
      )}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#13121c]/95 via-[#13121c]/35 to-transparent" />
      {!compact && (
        <div className="absolute left-4 top-4 rounded-full border border-[#2d2b40] bg-[#13121c]/85 px-3 py-1 text-[11px] text-[#9b8ec4]">
          {role}
        </div>
      )}
    </div>
  );
};

const SwipeCardPreview = ({
  profile,
  compact = false,
  tilt = false,
  interactive = false,
}) => {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltStyle({
      transform: `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`,
    });
  };

  const handleMouseLeave = () => {
    if (interactive)
      setTiltStyle({ transform: "perspective(800px) rotateY(0) rotateX(0)" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        interactive ? { ...tiltStyle, transition: "transform 0.15s ease-out" }
        : tilt ?
          { transform: "rotate(-3deg)" }
        : undefined
      }
      className={`bg-[#13121c] border border-[#2d2b40] rounded-2xl overflow-hidden shadow-xl shadow-black/30 ${
        compact ? "w-[250px]" : "w-[360px]"
      }`}>
      <div
        className={`relative bg-[#1a1928] overflow-hidden ${compact ? "h-36" : "h-[280px]"}`}>
        <ProfilePhoto
          compact={compact}
          src={profile?.photo}
          role={profile?.role}
          firstName={profile?.firstName}
          lastName={profile?.lastName}
        />
        <div className="absolute top-3 right-3 bg-[#13121c]/90 border border-[#2d2b40] text-[#e8e6f0] px-2.5 py-1 rounded-full text-[12px] font-medium">
          {profile?.age}
        </div>
      </div>

      <div className={compact ? "p-4" : "p-5"}>
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3
            className={`font-['Outfit'] font-bold text-white tracking-tight leading-tight ${compact ? "text-[16px]" : "text-[20px]"}`}>
            {profile.firstName} {profile.lastName}
          </h3>
          {!compact && (
            <span className="flex items-center gap-1.5 text-[10px] text-violet-300 bg-violet-950/40 border border-violet-800/60 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          )}
        </div>
        {!compact && (
          <p className="text-[12px] text-[#6b6880] mb-3">{profile.role}</p>
        )}
        <p
          className={`text-[#9b8ec4] leading-relaxed ${compact ? "hidden" : "text-[13px] mb-4 line-clamp-2"}`}>
          {profile.about}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {profile?.skills?.slice(0, compact ? 3 : 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2.5 py-1 rounded-full border border-[#2d2b40] bg-[#0d0c16] text-[#9b8ec4]">
              {skill}
            </span>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button className="flex-1 bg-[#1a1928] border border-[#2d2b40] text-[#9b8ec4] font-medium py-2.5 rounded-xl text-[13px]">
            Pass
          </button>
          <button className="flex-1 bg-violet-700 text-white font-medium py-2.5 rounded-xl text-[13px] border-none">
            Like
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCardPreview;

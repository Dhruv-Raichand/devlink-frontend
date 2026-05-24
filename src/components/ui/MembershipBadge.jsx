import { BADGE } from "../../utils/constants";

function MembershipBadge({ membershipType }) {
  const badge = BADGE[membershipType];
  if (!badge) return null;

  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}>
      {badge.label}
    </span>
  );
}

export default MembershipBadge;

export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL;

export const BADGE = {
  FREE: null,
  PRO: { label: "Pro", className: "bg-violet-700 text-white" },
  ELITE: { label: "Elite", className: "bg-amber-500 text-black" },
};

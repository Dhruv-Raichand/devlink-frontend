import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="font-['Outfit'] font-extrabold text-[96px] text-[#1e1d28] leading-none mb-6 select-none">
          404
        </div>
        <h2 className="font-['Outfit'] font-bold text-[22px] text-white mb-3">
          Page not found
        </h2>
        <p className="text-[14px] text-[#6b6880] mb-8 leading-relaxed">
          The page you're looking for doesn't exist or the link may be broken.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
          Go back home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

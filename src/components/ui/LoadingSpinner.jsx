const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-8 h-8 rounded-full border-2 border-[#2d2b40] border-t-violet-600 animate-spin" />
    <p className="text-[13px] text-[#6b6880]">{message}</p>
  </div>
);

export default LoadingSpinner;

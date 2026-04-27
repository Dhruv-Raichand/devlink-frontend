const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-center max-w-sm">
      <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center mx-auto mb-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="font-['Outfit'] font-bold text-[16px] text-white mb-1.5">
        Something went wrong
      </h2>
      <p className="text-[13px] text-[#6b6880] mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
          Try again
        </button>
      )}
    </div>
  </div>
);

export default ErrorMessage;

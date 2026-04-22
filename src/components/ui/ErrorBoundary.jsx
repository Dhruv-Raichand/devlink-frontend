// ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="font-['Outfit'] font-extrabold text-[72px] text-[#1e1d28] leading-none mb-6 select-none">
              500
            </div>
            <h2 className="font-['Outfit'] font-bold text-[22px] text-white mb-3">
              Something crashed
            </h2>
            <p className="text-[14px] text-[#6b6880] mb-8 leading-relaxed">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

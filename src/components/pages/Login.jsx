import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../store/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/toast";
import NavBar from "../layout/NavBar";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const [isLoginMode, setIsLoginMode] = useState(
    location.state?.mode !== "signup", // false = signup tab open
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        firstName,
        lastName,
        emailId,
        password,
      });
      notifySuccess("Registration Successful!");
      dispatch(addUser(res?.data?.data));
    } catch (err) {
      notifyError(err?.response?.data?.message || "Registration failed");
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { emailId, password });
      notifySuccess("Login Successful!");
      dispatch(addUser(res?.data?.data));
      return navigate("/app");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Login failed");
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    isLoginMode ?
      emailId.trim() && password.trim()
    : firstName.trim() && lastName.trim() && emailId.trim() && password.trim();

  useEffect(() => {
    if (user) {
      const onboardingDone =
        localStorage.getItem("onboarding_complete") === "true";
      console.log("User logged in, onboarding done:", onboardingDone);

      navigate(onboardingDone ? "/app" : "/app/onboarding");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <NavBar />

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-[400px]">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-['Outfit'] font-extrabold text-[32px] text-white tracking-tight leading-tight mb-2">
              {isLoginMode ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-[14px] text-[#6b6880]">
              {isLoginMode ?
                "Sign in to your DevLink account"
              : "Start finding your next coding partner"}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-[#13121c] border border-[#1e1d28] rounded-lg p-1 mb-8">
            <button
              onClick={() => {
                setIsLoginMode(true);
                setError("");
              }}
              className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all cursor-pointer border-none ${
                isLoginMode ?
                  "bg-violet-700 text-white"
                : "bg-transparent text-[#6b6880] hover:text-[#9b8ec4]"
              }`}>
              Sign in
            </button>
            <button
              onClick={() => {
                setIsLoginMode(false);
                setError("");
              }}
              className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all cursor-pointer border-none ${
                !isLoginMode ?
                  "bg-violet-700 text-white"
                : "bg-transparent text-[#6b6880] hover:text-[#9b8ec4]"
              }`}>
              Sign up
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4">
            {/* Name row — sign up only */}
            {!isLoginMode && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#6b6880] uppercase tracking-wider mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="w-full bg-[#13121c] border border-[#2d2b40] text-[#e8e6f0] placeholder-[#3a3850] rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-violet-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6b6880] uppercase tracking-wider mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="w-full bg-[#13121c] border border-[#2d2b40] text-[#e8e6f0] placeholder-[#3a3850] rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-violet-600 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] text-[#6b6880] uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full bg-[#13121c] border border-[#2d2b40] text-[#e8e6f0] placeholder-[#3a3850] rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] text-[#6b6880] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#13121c] border border-[#2d2b40] text-[#e8e6f0] placeholder-[#3a3850] rounded-lg px-3 py-2.5 pr-10 text-[13px] focus:outline-none focus:border-violet-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4760] hover:text-[#9b8ec4] transition-colors cursor-pointer bg-transparent border-none p-0"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ?
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  : <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/60 text-red-400 px-3.5 py-2.5 rounded-lg text-[13px]">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              onClick={isLoginMode ? handleLogin : handleSignUp}
              disabled={isLoading || !isFormValid}
              className="w-full bg-violet-700 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-[14px] transition-all hover:-translate-y-px cursor-pointer mt-1 border-none">
              {isLoading ?
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Processing...
                </span>
              : isLoginMode ?
                "Sign in"
              : "Create account"}
            </button>
          </form>

          {/* Bottom note */}
          <p className="text-center text-[12px] text-[#3a3850] mt-8">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

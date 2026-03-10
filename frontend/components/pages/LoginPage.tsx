import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import AuthService from "../../services/authService";

interface LoginPageProps {
  onAuthChange: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AuthService.login(email, password);
      onAuthChange();
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md opacity-0 animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] mb-5 shadow-lg shadow-indigo-200">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E293B] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Sign in to continue optimizing your career
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4F46E5] transition-colors" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-4 rounded-xl bg-[#f8f9fa] text-slate-800 border-2 border-slate-100 focus:border-[#4F46E5] focus:bg-white transition-all outline-none font-semibold text-sm placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4F46E5] transition-colors" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-4 rounded-xl bg-[#f8f9fa] text-slate-800 border-2 border-slate-100 focus:border-[#4F46E5] focus:bg-white transition-all outline-none font-semibold text-sm placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-rose-50 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl border border-rose-100 animate-fade-up">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading || !email || !password}
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-500 active:scale-[0.98] ${
                loading
                  ? "bg-slate-800 text-white cursor-wait"
                  : "bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 shimmer"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-slate-400 font-medium">
            Don't have an account?{" "}
            <button
              id="go-to-signup"
              onClick={() => navigate("/signup")}
              className="text-[#4F46E5] font-bold hover:underline transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

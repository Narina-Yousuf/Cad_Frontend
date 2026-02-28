import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Lock, Mail, ArrowRight, HeartPulse } from "lucide-react";
import type { LoginCredentials } from "../../types/auth.types";

export default function DoctorLogin() {
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
    login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1a1a2e] font-sans">
      {/* LEFT SIDE: Visual Brand Section (Midnight Theme) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
            alt="Medical Professional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
        </div>

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-2 text-white font-bold text-2xl">
          <HeartPulse className="text-[#7c5dfa]" /> CAD.AI
        </div>

        {/* Slogan and Pagination Dots */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black leading-tight mb-4 text-white">
            Capturing Moments, <br /> Protecting Hearts.
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-md">
            The physician portal provides secure access to patient ECG analysis
            and AI-driven clinical reports.
          </p>
          <div className="mt-8 flex gap-2">
            <div className="w-8 h-1 bg-[#7c5dfa] rounded-full transition-all" />
            <div className="w-4 h-1 bg-white/20 rounded-full" />
            <div className="w-4 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form (Amethyst Theme) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-[#1a1a2e]">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
              Physician Login
            </h2>
            <p className="text-[#94a3b8] font-medium">
              Already have an account?{" "}
              <Link
                to="/signup"
                className="text-[#7c5dfa] hover:underline ml-1"
              >
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-1">
                Professional Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#94a3b8] group-focus-within:text-[#7c5dfa] transition-colors" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className={`w-full pl-11 pr-4 py-4 bg-[#252541] border rounded-2xl text-white outline-none transition-all duration-200 placeholder:text-[#94a3b8]/30 ${
                    errors.email
                      ? "border-red-400"
                      : "border-white/5 focus:border-[#7c5dfa] focus:ring-4 focus:ring-[#7c5dfa]/10"
                  }`}
                  placeholder="dr.smith@hospital.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-[10px] font-bold uppercase mt-1.5 ml-1 animate-in fade-in">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black text-[#7c5dfa] uppercase tracking-widest hover:text-[#9277ff] transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#94a3b8] group-focus-within:text-[#7c5dfa] transition-colors" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  className={`w-full pl-11 pr-4 py-4 bg-[#252541] border rounded-2xl text-white outline-none transition-all duration-200 placeholder:text-[#94a3b8]/30 ${
                    errors.password
                      ? "border-red-400"
                      : "border-white/5 focus:border-[#7c5dfa] focus:ring-4 focus:ring-[#7c5dfa]/10"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-[10px] font-bold uppercase mt-1.5 ml-1 animate-in fade-in">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c5dfa] hover:bg-[#9277ff] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#7c5dfa]/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {loading ? "Verifying..." : "Create account"}
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-4">
            <Link
              to="/patient/login"
              className="text-[10px] font-black text-[#94a3b8] hover:text-white uppercase tracking-[0.2em] transition-colors"
            >
              Switch to Patient Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

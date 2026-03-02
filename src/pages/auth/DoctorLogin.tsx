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
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* LEFT SIDE: Visual Brand Section (Clean Professional Slate) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-16 overflow-hidden">
        {/* Background Image Overlay with Blue Tint */}
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
            alt="Medical Professional"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-blue-500/20" />
        </div>

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3 text-white font-black text-3xl tracking-tighter italic">
          <div className="bg-[#0ea5e9] p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <HeartPulse className="text-white w-7 h-7" />
          </div> 
          CAD.AI
        </div>

        {/* Slogan and Pagination Dots */}
        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-[1.1] mb-6 text-white tracking-tighter">
            Capturing Moments, <br /> 
            <span className="text-[#0ea5e9]">Protecting Hearts.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
            The physician portal provides secure access to patient ECG analysis
            and AI-driven clinical reports.
          </p>
          <div className="mt-10 flex gap-3">
            <div className="w-12 h-1.5 bg-[#0ea5e9] rounded-full transition-all" />
            <div className="w-4 h-1.5 bg-white/10 rounded-full" />
            <div className="w-4 h-1.5 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form (Clean White Theme) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        {/* Background subtle decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter uppercase">
              Physician <span className="text-[#0ea5e9]">Login</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Welcome back, Doctor. Please sign in to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Professional Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-[#0ea5e9] transition-colors" />
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
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl text-slate-900 font-bold outline-none transition-all duration-300 placeholder:text-slate-300 placeholder:font-medium ${
                    errors.email
                      ? "border-red-200 bg-red-50"
                      : "border-slate-100 focus:bg-white focus:border-[#0ea5e9] focus:ring-4 focus:ring-blue-500/5 shadow-sm focus:shadow-md"
                  }`}
                  placeholder="dr.smith@hospital.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-2 animate-in fade-in">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-[#0ea5e9] transition-colors" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl text-slate-900 font-bold outline-none transition-all duration-300 placeholder:text-slate-300 placeholder:font-medium ${
                    errors.password
                      ? "border-red-200 bg-red-50"
                      : "border-slate-100 focus:bg-white focus:border-[#0ea5e9] focus:ring-4 focus:ring-blue-500/5 shadow-sm focus:shadow-md"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-2 animate-in fade-in">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button - Using Neutral Dark for main action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0ea5e9] hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? "Verifying Credentials..." : "Access Portal"}
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-6 space-y-4">
            <p className="text-sm text-slate-400 font-medium">
              New to the platform?{" "}
              <Link to="/signup" className="text-[#0ea5e9] font-black hover:underline uppercase text-xs ml-1">
                Register Clinic
              </Link>
            </p>
            <div className="h-px bg-slate-100 w-1/2 mx-auto" />
            <Link
              to="/patient/login"
              className="inline-block text-[10px] font-black text-slate-300 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors"
            >
              Switch to Patient Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
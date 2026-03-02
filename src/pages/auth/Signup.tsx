import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../context/useAuth";
import { HeartPulse, User, Stethoscope, ArrowRight } from "lucide-react";
import type { SignupData } from "../../types/auth.types";

export default function Signup() {
  const { signup, loading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupData>({
    defaultValues: {
      role: "PATIENT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit: SubmitHandler<SignupData> = (data) => {
    signup(data);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* LEFT SIDE: Visual Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-16 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80"
            alt="Medical Research"
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

        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-[1.1] mb-6 text-white tracking-tighter">
            Capturing Moments, <br /> 
            <span className="text-[#0ea5e9]">Creating Memories.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
            Join our advanced neural network platform for real-time coronary
            artery disease screening and heart health management.
          </p>
          <div className="mt-10 flex gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === 3 ? "w-12 bg-[#0ea5e9]" : "w-4 bg-white/10"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="w-full max-w-md space-y-10 py-12 animate-in fade-in slide-in-from-right-8 duration-700 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter uppercase">
              Join <span className="text-[#0ea5e9]">CAD.AI</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Already have an account?{" "}
              <Link to="/doctor/login" className="text-[#0ea5e9] hover:underline ml-1 font-black">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection Tabs */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Account Type
              </label>
              <div className="flex gap-3 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100">
                {(["PATIENT", "DOCTOR"] as const).map((r) => (
                  <label
                    key={r}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl cursor-pointer transition-all font-black text-[10px] tracking-widest uppercase border-2 ${
                      selectedRole === r
                        ? "bg-white border-blue-100 text-[#0ea5e9] shadow-sm shadow-blue-500/5"
                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value={r}
                      {...register("role")}
                      className="hidden"
                    />
                    {r === "DOCTOR" ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <Input
                label="Full Name"
                placeholder="Dr. Jordan Fletcher"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
              />

              <Input
                label="Professional Email"
                type="email"
                placeholder="jordan.f@medical.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                })}
                error={errors.password?.message}
              />
            </div>

            {/* Conditional Doctor Fields */}
            {selectedRole === "DOCTOR" && (
              <div className="space-y-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mt-4 animate-in zoom-in-95 duration-300">
                <Input
                  label="License Number"
                  placeholder="MED-123456"
                  {...register("licenseNumber", {
                    required: selectedRole === "DOCTOR" ? "License is required" : false,
                  })}
                  error={errors.licenseNumber?.message}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Specialization"
                    placeholder="Cardiology"
                    {...register("specialization", {
                      required: selectedRole === "DOCTOR" ? "Required" : false,
                    })}
                    error={errors.specialization?.message}
                  />
                  <Input
                    label="Hospital"
                    placeholder="General Clinic"
                    {...register("hospitalName")}
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 px-2 py-2 group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 appearance-none border-2 border-slate-200 rounded-lg checked:bg-[#0ea5e9] checked:border-[#0ea5e9] transition-all cursor-pointer"
                />
                <div className="absolute pointer-events-none hidden group-has-[:checked]:block text-white left-1">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                I agree to the{" "}
                <span className="text-[#0ea5e9] cursor-pointer hover:underline">Terms</span>{" "}
                & <span className="text-[#0ea5e9] cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? "Initializing..." : "Register Now"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
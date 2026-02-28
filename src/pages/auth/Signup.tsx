import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../context/useAuth";
import { HeartPulse } from "lucide-react";
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1a1a2e] font-sans">
      {/* LEFT SIDE: Visual Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80"
            alt="Medical Research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white font-bold text-2xl">
          <HeartPulse className="text-[#7c5dfa]" /> CAD.AI
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-black leading-tight mb-4 text-white">
            Capturing Moments, <br /> Creating Memories.
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-md">
            Join our advanced neural network platform for real-time coronary
            artery disease screening and heart health management.
          </p>
          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${i === 3 ? "w-8 bg-[#7c5dfa]" : "w-4 bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-[#1a1a2e] overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
              Create an account
            </h2>
            <p className="text-[#94a3b8] font-medium">
              Already have an account?{" "}
              <Link
                to="/doctor/login"
                className="text-[#7c5dfa] hover:underline ml-1"
              >
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-1">
                Select Your Role
              </label>
              <div className="flex gap-3">
                {(["PATIENT", "DOCTOR"] as const).map((r) => (
                  <label
                    key={r}
                    className={`flex-1 text-center py-3.5 rounded-2xl cursor-pointer transition-all font-black text-xs tracking-widest uppercase border-2 ${
                      selectedRole === r
                        ? "bg-[#7c5dfa]/10 border-[#7c5dfa] text-white"
                        : "bg-[#252541] border-white/5 text-[#94a3b8] hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      value={r}
                      {...register("role")}
                      className="hidden"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Full Name"
                placeholder="Fletcher"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Email"
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
                label="Enter your password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                })}
                error={errors.password?.message}
              />
            </div>

            {/* Conditional Doctor Fields */}
            {selectedRole === "DOCTOR" && (
              <div className="space-y-4 pt-4 border-t border-white/5 mt-4 animate-in fade-in slide-in-from-top-2">
                <Input
                  label="License Number"
                  placeholder="MED-123456"
                  {...register("licenseNumber", {
                    required:
                      selectedRole === "DOCTOR" ? "License is required" : false,
                  })}
                  error={errors.licenseNumber?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Specialization"
                    placeholder="Cardiology"
                    {...register("specialization", {
                      required:
                        selectedRole === "DOCTOR"
                          ? "Specialization is required"
                          : false,
                    })}
                    error={errors.specialization?.message}
                  />
                  <Input
                    label="Hospital"
                    placeholder="General Clinic"
                    {...register("hospitalName")}
                    error={errors.hospitalName?.message}
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 px-1 py-2">
              <input
                type="checkbox"
                required
                className="mt-1 accent-[#7c5dfa]"
              />
              <p className="text-[11px] text-[#94a3b8] leading-snug">
                I agree to the{" "}
                <span className="text-[#7c5dfa] cursor-pointer hover:underline">
                  Terms & Conditions
                </span>{" "}
                and the Privacy Policy.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c5dfa] hover:bg-[#9277ff] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#7c5dfa]/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-sm mt-4"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

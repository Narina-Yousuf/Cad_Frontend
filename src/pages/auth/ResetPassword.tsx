import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 6) return toast.error("Password minimum 6 characters!");
    if (password !== confirm) return toast.error("Passwords match nahi karte!");
    if (!token) return toast.error("Invalid reset link!");

    setLoading(true);
    try {
      const api = (await import("../../services/api")).default;
      await api.post("/api/auth/reset-password", { token, password });
      setDone(true);
      toast.success("Password reset ho gaya!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Reset failed — link expired ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-8 hover:text-slate-700 transition-all"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <Lock className="text-[#0ea5e9]" size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              New Password
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
              Enter your new password below
            </p>
          </div>

          {done ? (
            <div className="text-center space-y-4">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-emerald-600 font-black uppercase text-sm">
                  Password reset ho gaya! Login karo.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 outline-none focus:border-sky-300 focus:bg-white transition-all pr-12"
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 outline-none focus:border-sky-300 focus:bg-white transition-all"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#0ea5e9] hover:bg-[#7cc9ed] text-white font-black py-5 rounded-2xl shadow-xl disabled:opacity-50 transition-all uppercase tracking-widest text-[11px] flex items-center justify-center gap-3"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) return toast.error("Email daalo!");
    setLoading(true);
    try {
      const api = (await import("../../services/api")).default;
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent!");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Security: always show success
        setSent(true);
        toast.success("If the email is registered, a reset link will be sent!");
      } else {
        toast.error("Server error — Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-8 hover:text-slate-700 transition-all"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <Mail className="text-[#0ea5e9]" size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Reset Password
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
              Enter your email to receive reset link
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-emerald-600 font-black uppercase text-sm">
                  Reset link sent! Check your email.
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-[#0ea5e9] text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[11px]"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 outline-none focus:border-sky-300 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#0ea5e9] hover:bg-[#7cc9ed] text-white font-black py-5 rounded-2xl shadow-xl disabled:opacity-50 transition-all uppercase tracking-widest text-[11px] flex items-center justify-center gap-3"
              >
                <Send size={16} />
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

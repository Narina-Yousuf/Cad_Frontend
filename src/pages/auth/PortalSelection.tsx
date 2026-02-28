import React from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, User, HeartPulse } from "lucide-react";

export default function PortalSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Branding/Image Section */}
      <div className="md:w-1/2 bg-slate-900 relative flex flex-col justify-between p-12 overflow-hidden">
        {/* Background Image/Overlay logic */}
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80"
            alt="Heart health"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white font-bold text-2xl">
            <HeartPulse className="text-[#7c5dfa]" /> CAD.AI
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-black leading-tight mb-4">
            Capturing Moments, <br /> Protecting Hearts.
          </h1>
          <p className="text-slate-300 text-lg max-w-md">
            Advanced AI-driven coronary artery disease detection for physicians
            and patients.
          </p>
        </div>
      </div>

      {/* Right Side: Selection Section */}
      <div className="md:w-1/2 flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
            <p className="text-[#94a3b8] font-medium">
              Please select your portal to continue
            </p>
          </div>

          <div className="space-y-4">
            {/* Doctor Portal Button */}
            <button
              onClick={() => navigate("/doctor/login")}
              className="w-full flex items-center gap-4 p-6 rounded-2xl bg-[#252541] border border-white/5 hover:border-[#7c5dfa]/50 transition-all group"
            >
              <div className="p-3 bg-[#1a1a2e] rounded-xl group-hover:bg-[#7c5dfa]/10 transition-colors">
                <Stethoscope className="text-[#7c5dfa] w-8 h-8" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Physician Portal</p>
                <p className="text-xs text-[#94a3b8]">
                  Clinical diagnostic tools & reports
                </p>
              </div>
            </button>

            {/* Patient Portal Button */}
            <button
              onClick={() => navigate("/patient/login")}
              className="w-full flex items-center gap-4 p-6 rounded-2xl bg-[#252541] border border-white/5 hover:border-[#7c5dfa]/50 transition-all group"
            >
              <div className="p-3 bg-[#1a1a2e] rounded-xl group-hover:bg-[#7c5dfa]/10 transition-colors">
                <User className="text-[#7c5dfa] w-8 h-8" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Patient Portal</p>
                <p className="text-xs text-[#94a3b8]">
                  View results & personal history
                </p>
              </div>
            </button>
          </div>

          <div className="pt-8 text-center">
            <p className="text-[#94a3b8]">
              New user?
              <button
                onClick={() => navigate("/signup")}
                className="ml-2 text-[#7c5dfa] font-bold hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

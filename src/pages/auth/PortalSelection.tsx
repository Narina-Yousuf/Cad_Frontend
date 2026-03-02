import React from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, User, HeartPulse, ChevronRight } from "lucide-react";

export default function PortalSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Left Side: Branding/Image Section */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex flex-col justify-between p-16 overflow-hidden">
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80"
            alt="Heart health"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-blue-500/20" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white font-black text-3xl tracking-tighter italic">
            <div className="bg-[#0ea5e9] p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <HeartPulse className="text-white w-7 h-7" />
            </div> 
            CAD.AI
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-[1.1] mb-6 text-white tracking-tighter">
            Capturing Moments, <br /> 
            <span className="text-[#0ea5e9]">Protecting Hearts.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
            Advanced AI-driven coronary artery disease detection for physicians
            and patients.
          </p>
        </div>
      </div>

      {/* Right Side: Selection Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
         {/* Background subtle decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter uppercase">
              Welcome <span className="text-[#0ea5e9]">Back</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Please select your portal to continue
            </p>
          </div>

          <div className="space-y-4">
            {/* Doctor Portal Button */}
            <button
              onClick={() => navigate("/doctor/login")}
              className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-[#0ea5e9]/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all duration-300">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-lg leading-none mb-1">Physician Portal</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Clinical Tools & Diagnostics
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0ea5e9] group-hover:translate-x-1 transition-all" />
            </button>

            {/* Patient Portal Button */}
            <button
              onClick={() => navigate("/patient/login")}
              className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-[#0ea5e9]/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all duration-300">
                  <User className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-lg leading-none mb-1">Patient Portal</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Personal Records & Trends
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0ea5e9] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="pt-8 text-center">
            <p className="text-sm text-slate-400 font-medium">
              New to the platform?
              <button
                onClick={() => navigate("/signup")}
                className="ml-2 text-[#0ea5e9] font-black hover:underline uppercase text-xs"
              >
                Register Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
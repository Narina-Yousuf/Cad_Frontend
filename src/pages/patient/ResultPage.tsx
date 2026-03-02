import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  AlertCircle,
  FileText,
  ArrowLeft,
  Info,
  Heart,
  ChevronRight,
  Loader2,
  Activity,
  Zap
} from "lucide-react";
import { getAnalysisResult } from "../../services/analysis.service";
import type { ECGResultData } from "../../types/analysis.types";

export default function PatientResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ECGResultData | null>(null);

  useEffect(() => {
    if (id) getAnalysisResult(id).then(setData);
  }, [id]);

  if (!data)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="relative mb-6">
          <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
          <Activity className="absolute inset-0 m-auto w-5 h-5 text-slate-300" />
        </div>
        <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
          Decrypting Neural Result...
        </span>
      </div>
    );

  const isCAD = data.result.isCADDetected;
  const statusColor = isCAD ? "text-rose-500" : "text-emerald-500";
  const bgGradient = isCAD
    ? "from-rose-500 to-rose-700"
    : "from-[#0ea5e9] to-[#2563eb]";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700 font-sans">
      {/* Navigation */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="group flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-900 transition-all"
      >
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-sky-50 transition-colors">
          <ArrowLeft size={18} />
        </div>
        Return to Portal
      </button>

      {/* Hero Result Card */}
      <div
        className={`relative overflow-hidden p-12 rounded-[3.5rem] text-white shadow-2xl shadow-blue-900/20 bg-gradient-to-br ${bgGradient} group transition-all duration-500`}
      >
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/5 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
            <div className="p-6 bg-white/20 rounded-[2.5rem] backdrop-blur-2xl border border-white/30 shadow-2xl shadow-black/10">
              {isCAD ? (
                <AlertCircle size={56} className="animate-pulse" />
              ) : (
                <ShieldCheck size={56} />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/70">
                Diagnostic Outcome
              </p>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-tight">
                {isCAD ? "Alert: Action Needed" : "Cardiac Health: Stable"}
              </h1>
            </div>
          </div>

          <div className="bg-black/15 px-10 py-5 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-sky-300" />
              <p className="text-[10px] uppercase font-black tracking-widest text-white/60">
                Inference v{data.result.modelVersion}
              </p>
            </div>
            <p className="font-black text-2xl italic tracking-tighter">
              VALIDATED
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Confidence Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center group transition-all hover:translate-y-[-4px]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Analysis Confidence
          </p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
            {(data.result.confidenceScore * 100).toFixed(1)}%
          </p>
          <div className="w-16 h-1.5 bg-slate-100 mx-auto mt-6 rounded-full overflow-hidden">
            <div
              className="bg-[#0ea5e9] h-full rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"
              style={{ width: `${data.result.confidenceScore * 100}%` }}
            />
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center group transition-all hover:translate-y-[-4px]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Waveform Heart Rate
          </p>
          <div className="flex items-center justify-center gap-3">
            <Heart size={24} className="text-rose-500 animate-pulse" fill="currentColor" fillOpacity={0.2} />
            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
              {data.result.heartRate}
              <span className="text-xs text-slate-300 ml-2 uppercase not-italic">bpm</span>
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center group transition-all hover:translate-y-[-4px]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Neural Status
          </p>
          <p className={`text-xl font-black uppercase tracking-[0.15em] italic ${statusColor}`}>
            {isCAD ? "Clinical Referral" : "Rhythm Normal"}
          </p>
          <div className="mt-4 flex justify-center">
            <div className={`w-2 h-2 rounded-full ${isCAD ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row gap-6 items-center shadow-sm">
        <div className="p-4 bg-sky-50 rounded-[1.5rem] text-[#0ea5e9] border border-sky-100">
          <Info size={28} />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
            Clinical Disclaimer
          </h4>
          <p className="text-slate-400 text-[13px] leading-relaxed font-bold uppercase tracking-tight">
            This AI screening identifies CAD morphological markers in ECG waveforms. 
            It is a decision-support tool, not a diagnosis. 
            <span className="text-slate-900 ml-1 italic font-black">Please share the Technical Report with a physician.</span>
          </p>
        </div>
      </div>

      {/* Action Suite */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
        <button
          onClick={() => navigate(`/patient/report/${id}`)}
          className="group bg-white border border-slate-100 text-slate-900 font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 hover:border-sky-200 hover:bg-sky-50 transition-all shadow-xl shadow-blue-900/5 uppercase tracking-[0.2em] text-[10px]"
        >
          <FileText size={20} className="text-[#0ea5e9] group-hover:scale-110 transition-transform" /> 
          Access Medical Report
        </button>

        <button
          onClick={() => navigate("/patient/upload")}
          className="bg-slate-900 text-white font-black py-6 rounded-[2rem] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 active:scale-95"
        >
          Initiate New Screening <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
} 
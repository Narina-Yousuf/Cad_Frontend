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
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#7c5dfa] animate-spin" />
      </div>
    );

  const isCAD = data.result.isCADDetected;
  const statusColor = isCAD ? "text-orange-400" : "text-emerald-400";
  const bgGradient = isCAD
    ? "from-orange-500 to-red-600"
    : "from-[#7c5dfa] to-indigo-600";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 bg-[#1a1a2e] min-h-screen animate-in fade-in duration-500">
      {/* Navigation */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="group flex items-center gap-2 text-[#94a3b8] font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
      >
        <div className="p-2 bg-[#252541] rounded-lg group-hover:bg-[#7c5dfa]/10 transition-colors">
          <ArrowLeft size={16} />
        </div>
        Back to Dashboard
      </button>

      {/* Hero Result Card */}
      <div
        className={`relative overflow-hidden p-10 rounded-[2.5rem] text-white shadow-2xl bg-gradient-to-br ${bgGradient} group`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="p-5 bg-white/20 rounded-[2rem] backdrop-blur-xl border border-white/30">
              {isCAD ? <AlertCircle size={48} /> : <ShieldCheck size={48} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-1">
                Diagnosis Status
              </p>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
                {isCAD ? "Attention Required" : "Heart Health: Normal"}
              </h1>
            </div>
          </div>

          <div className="bg-black/20 px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] uppercase font-black tracking-widest text-white/60 mb-1 text-center">
              AI Engine
            </p>
            <p className="font-mono font-bold text-lg text-center">
              v{data.result.modelVersion}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#252541] p-6 rounded-[2rem] border border-white/5 shadow-xl text-center group hover:border-[#7c5dfa]/30 transition-all">
          <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-3">
            AI Confidence
          </p>
          <p className="text-3xl font-black text-[#7c5dfa] tracking-tight">
            {(data.result.confidenceScore * 100).toFixed(1)}%
          </p>
          <div className="w-12 h-1 bg-[#1a1a2e] mx-auto mt-4 rounded-full overflow-hidden">
            <div
              className="bg-[#7c5dfa] h-full"
              style={{ width: `${data.result.confidenceScore * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#252541] p-6 rounded-[2rem] border border-white/5 shadow-xl text-center group hover:border-[#7c5dfa]/30 transition-all">
          <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-3">
            Avg Heart Rate
          </p>
          <p className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <Heart size={20} className="text-red-400" /> {data.result.heartRate}{" "}
            <span className="text-xs text-[#94a3b8]">BPM</span>
          </p>
        </div>

        <div className="bg-[#252541] p-6 rounded-[2rem] border border-white/5 shadow-xl text-center group hover:border-[#7c5dfa]/30 transition-all">
          <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-3">
            Clinical Status
          </p>
          <p
            className={`text-xl font-black uppercase tracking-widest ${statusColor}`}
          >
            {isCAD ? "Consult Provider" : "Condition Stable"}
          </p>
        </div>
      </div>

      {/* AI Note Banner */}
      <div className="bg-[#7c5dfa]/5 p-6 rounded-[2rem] border border-[#7c5dfa]/20 flex gap-5 items-start">
        <div className="p-3 bg-[#7c5dfa]/10 rounded-2xl text-[#7c5dfa]">
          <Info size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-white font-black uppercase tracking-tight text-sm">
            Medical Advisory
          </p>
          <p className="text-[#94a3b8] text-sm leading-relaxed font-medium">
            This screening was performed using a high-precision neural network.
            While highly accurate, it is not a replacement for a clinical
            diagnosis. Always validate results with your cardiologist.
          </p>
        </div>
      </div>

      {/* Action Suite */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => navigate(`/patient/report/${id}`)}
          className="flex-1 bg-[#252541] border border-white/10 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all uppercase tracking-widest text-xs"
        >
          <FileText size={18} className="text-[#7c5dfa]" /> View Technical
          Report
        </button>

        <button
          onClick={() => navigate("/patient/upload")}
          className="flex-1 bg-[#7c5dfa] text-white font-black py-5 rounded-2xl hover:bg-[#9277ff] transition-all shadow-xl shadow-[#7c5dfa]/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
        >
          Perform New Test <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

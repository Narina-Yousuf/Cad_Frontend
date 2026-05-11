import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  CheckCircle2,
  FileText,
  History,
  RefreshCw,
  Activity,
  AlertTriangle,
  Loader2,
  Cpu,
  Clock,
} from "lucide-react";
import { getAnalysisResult } from "../../services/analysis.service";
import { generateReport } from "../../services/report.service";
import { useAuth } from "../../context/useAuth";
import type { ECGResultData } from "../../types/analysis.types";
import toast from "react-hot-toast";

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<ECGResultData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id)
      getAnalysisResult(id)
        .then(setData)
        .catch(() => toast.error("Failed to load results"));
  }, [id]);

  const handleGenerateReport = async () => {
    if (!id) return;
    setIsGenerating(true);
    try {
      const analysisId = data?.result?.id;
      if (!analysisId) throw new Error("No analysis ID");
      
      let report;
      try {
        report = await generateReport(analysisId);
      } catch {
        // Report already exists - fetch it
        const api = (await import("../../services/api")).default;
        const reportRes = await api.get(`/api/reports/analysis/${analysisId}`);
        report = reportRes.data.data.report;
      }
      const rolePath = user?.role === "DOCTOR" ? "doctor" : "patient";
      navigate(`/${rolePath}/report/${report.id}`);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
      </div>
    );

  const isCAD = data.result.isCADDetected;
  const accentColor = isCAD ? "text-red-600" : "text-emerald-600";
  const bgHeader = isCAD ? "bg-red-600" : "bg-[#0ea5e9]";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50/30 animate-in fade-in zoom-in-95 duration-500 font-sans">
      {/* High-Impact Result Header */}
      <div
        className={`${bgHeader} rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-10">
            <div className="p-6 bg-white/20 rounded-[2.5rem] backdrop-blur-xl border border-white/30 shadow-2xl">
              {isCAD ? <ShieldAlert size={64} /> : <CheckCircle2 size={64} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-2">
                Neural Classification
              </p>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                {isCAD ? "CAD Detected" : "Normal Sinus"}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="h-2 w-40 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                    style={{ width: `${data.result.confidenceScore * 100}%` }}
                  />
                </div>
                <span className="text-xs font-black tracking-widest uppercase">
                  {(data.result.confidenceScore * 100).toFixed(1)}% Confidence
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/20 px-8 py-5 rounded-[2rem] border border-white/10 backdrop-blur-md text-center">
            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-white/60 mb-1">
              Engine Bio-Hash
            </p>
            <p className="font-mono font-bold text-lg tracking-tighter">
              v{data.result.modelVersion}
            </p>
          </div>
        </div>
      </div>

      {/* Warning/Status Banner */}
      <div
        className={`p-10 rounded-[2.5rem] flex items-start gap-8 border-2 bg-white ${
          isCAD ? "border-red-100" : "border-emerald-100"
        } shadow-xl shadow-slate-200/50`}
      >
        <div className={`p-4 rounded-2xl ${isCAD ? "bg-red-50" : "bg-emerald-50"}`}>
          <AlertTriangle className={accentColor} size={32} />
        </div>
        <div>
          <p className={`font-black uppercase tracking-tight text-2xl ${accentColor}`}>
            {isCAD ? "Immediate Clinical Review Required" : "Physiological Homeostasis Confirmed"}
          </p>
          <p className="text-slate-500 font-bold mt-2 leading-relaxed text-sm">
            {isCAD
              ? "The AI has flagged significant ST-segment deviations and T-wave abnormalities. Please proceed to the full report for specific lead morphology and clinician recommendations."
              : "Cardiac rhythms are within expected variance. No biomarkers of ischemia or coronary narrowing were detected by the neural network during this diagnostic sweep."}
          </p>
        </div>
      </div>

      {/* Clinical Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "ST Depression", value: data.result.stDepression?.startsWith("{") ? (isCAD ? "Detected" : "Normal") : (data.result.stDepression || "Normal"), abnormal: isCAD },
          { label: "T-Wave Inversion", value: data.result.tWaveInversion, abnormal: isCAD },
          { label: "QRS Duration", value: data.result.qrsDuration, abnormal: false },
          { label: "Heart Rate", value: `${data.result.heartRate} BPM`, abnormal: false },
        ].map((indicator, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-blue-900/5 transition-all hover:translate-y-[-5px] hover:border-[#0ea5e9]/20"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">
              {indicator.label}
            </p>
            <p className={`text-3xl font-black text-center tracking-tighter tabular-nums ${
              indicator.abnormal ? "text-red-500" : "text-slate-900"
            }`}>
              {indicator.value}
            </p>
          </div>
        ))}
      </div>

      {/* Technical Analysis Footer */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-blue-400">
            <Cpu size={20} /> Advanced Diagnostics Metadata
          </h3>
          <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            LOG_ID: {id?.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {[
            { label: "Compute Time", val: `${data.result.analysisTime}ms`, icon: Clock },
            { label: "Sampling Rate", val: "500 Hz", icon: Activity },
            { label: "Neural Layers", val: "128-Deep", icon: Cpu },
            { label: "Subject Name", val: data.patient.name, icon: FileText },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {item.label}
              </p>
              <div className="flex items-center gap-3">
                 <item.icon size={14} className="text-blue-500" />
                 <p className="text-white font-black text-lg tracking-tight uppercase">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Suite */}
      <div className="flex flex-wrap gap-4 pt-10">
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="flex-1 min-w-[280px] flex items-center justify-center gap-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black py-6 rounded-3xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 uppercase tracking-[0.2em] text-[11px]"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
          {isGenerating ? "Compiling Dossier..." : "Generate Official Report"}
        </button>

        <button
          onClick={() => navigate(-2)}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-900 font-black py-6 rounded-3xl transition-all uppercase tracking-[0.2em] text-[11px] shadow-sm"
        >
          <History size={18} /> Patient History
        </button>

        <button
          onClick={() => navigate(user?.role === "DOCTOR" ? "/doctor/upload" : "/patient/upload")}
          className="px-10 flex items-center justify-center gap-3 bg-slate-900 text-white font-black py-6 rounded-3xl transition-all uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 shadow-xl"
        >
          <RefreshCw size={18} /> New Scan
        </button>
      </div>
    </div>
  );
}
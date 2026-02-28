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
      const report = await generateReport(id);
      const rolePath = user?.role === "DOCTOR" ? "doctor" : "patient";
      navigate(`/${rolePath}/report/${report.id}`);
    } catch (error) {
      toast.error("Failed to generate report");
      console.log(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data)
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7c5dfa] animate-spin" />
      </div>
    );

  const isCAD = data.result.isCADDetected;
  const accentColor = isCAD ? "text-red-400" : "text-emerald-400";
  const bgAccent = isCAD ? "bg-red-500" : "bg-emerald-500";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 bg-[#1a1a2e] animate-in fade-in duration-500">
      {/* High-Impact Result Header */}
      <div
        className={`${bgAccent} rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="p-5 bg-white/20 rounded-[2rem] backdrop-blur-xl border border-white/30 shadow-2xl">
              {isCAD ? <ShieldAlert size={56} /> : <CheckCircle2 size={56} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-1">
                AI Diagnostic Result
              </p>
              <h1 className="text-5xl font-black tracking-tighter uppercase">
                {isCAD ? "CAD Detected" : "Normal ECG"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-32 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${data.result.confidenceScore * 100}%` }}
                  />
                </div>
                <span className="text-xs font-black italic">
                  {(data.result.confidenceScore * 100).toFixed(1)}% Confidence
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e]/30 px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-md text-center">
            <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1">
              Neural Engine
            </p>
            <p className="font-mono font-bold text-lg tracking-tighter">
              v{data.result.modelVersion}
            </p>
          </div>
        </div>
      </div>

      {/* Warning Banner - Dark Surface Style */}
      <div
        className={`p-8 rounded-3xl flex items-start gap-5 border ${isCAD ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}
      >
        <div
          className={`p-2 rounded-lg ${isCAD ? "bg-red-500/10" : "bg-emerald-500/10"}`}
        >
          <AlertTriangle className={accentColor} size={24} />
        </div>
        <div>
          <p
            className={`font-black uppercase tracking-tight text-xl ${accentColor}`}
          >
            {isCAD ? "Clinical Action Required" : "No Critical Anomalies"}
          </p>
          <p className="text-[#94a3b8] font-medium mt-1 leading-relaxed">
            {isCAD
              ? "The neural network has identified high-risk morphological features consistent with myocardial ischemia. Immediate clinical review and stress testing are advised."
              : "Cardiac electrical activity is within normal physiological limits. No acute patterns of coronary insufficiency were identified during this 10-second sweep."}
          </p>
        </div>
      </div>

      {/* Clinical Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "ST Depression",
            value: data.result.stDepression,
            abnormal: isCAD,
          },
          {
            label: "T-Wave Inversion",
            value: data.result.tWaveInversion,
            abnormal: isCAD,
          },
          {
            label: "QRS Duration",
            value: data.result.qrsDuration,
            abnormal: false,
          },
          {
            label: "Heart Rate",
            value: `${data.result.heartRate} BPM`,
            abnormal: false,
          },
        ].map((indicator, idx) => (
          <div
            key={idx}
            className="bg-[#252541] p-6 rounded-[2rem] border border-white/5 shadow-xl transition-all hover:border-[#7c5dfa]/30"
          >
            <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-4 text-center">
              {indicator.label}
            </p>
            <p
              className={`text-2xl font-black text-center tracking-tight ${indicator.abnormal ? "text-red-400" : "text-emerald-400"}`}
            >
              {indicator.value}
            </p>
          </div>
        ))}
      </div>

      {/* Analysis Details - Technical Surface */}
      <div className="bg-[#252541] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <Activity className="text-[#7c5dfa]" size={18} /> Technical Analysis
            Details
          </h3>
          <span className="text-[10px] font-black text-[#94a3b8] uppercase bg-[#1a1a2e] px-4 py-1.5 rounded-full">
            Secure Hash: {id?.slice(0, 8)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { label: "Analysis Time", val: `${data.result.analysisTime}s` },
            { label: "Signal Length", val: "10 Seconds" },
            { label: "Features Extracted", val: "48 Parameters" },
            { label: "Subject", val: data.patient.name },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <p className="text-white font-black text-lg">{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons - Premium Design */}
      <div className="flex flex-wrap gap-4 pt-6">
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="flex-1 min-w-[240px] flex items-center justify-center gap-3 bg-[#7c5dfa] hover:bg-[#9277ff] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-[#7c5dfa]/20 disabled:opacity-50 uppercase tracking-[0.15em] text-xs"
        >
          {isGenerating ? (
            <Loader2 className="animate-spin" />
          ) : (
            <FileText size={18} />
          )}
          {isGenerating ? "Processing Report..." : "Generate Medical Report"}
        </button>

        <button
          onClick={() => navigate(-2)}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-[#252541] border border-white/10 hover:bg-white/5 text-[#94a3b8] hover:text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.15em] text-xs"
        >
          <History size={18} /> View History
        </button>

        <button
          onClick={() =>
            navigate(
              user?.role === "DOCTOR" ? "/doctor/upload" : "/patient/upload",
            )
          }
          className="px-8 flex items-center justify-center gap-3 bg-[#1a1a2e] border border-white/10 hover:border-[#7c5dfa]/50 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.15em] text-xs"
        >
          <RefreshCw size={18} /> New Analysis
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Activity, BrainCircuit, Loader2, ShieldCheck, Zap } from "lucide-react";
import {
  runAnalysis,
  getAnalysisResult,
} from "../../services/analysis.service";

export default function PatientAnalyzeECG() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Securing cardiac data stream...");

  useEffect(() => {
    if (!id) return;

    const start = async () => {
      try {
        await runAnalysis(id);

        const progressInterval = setInterval(() => {
          setProgress((p) => {
            if (p >= 94) {
              clearInterval(progressInterval);
              return 94;
            }
            if (p > 15) setStatus("Neural network identifying morphological patterns...");
            if (p > 45) setStatus("Detecting ST-segment & T-wave anomalies...");
            if (p > 75) setStatus("Finalizing diagnostic risk probability...");
            return p + 1;
          });
        }, 200);

        const check = async () => {
          try {
            const data = await getAnalysisResult(id);
            if (data?.ecg?.status === "COMPLETED" || data?.result) {
              setProgress(100);
              setStatus("Diagnostic computation complete!");
              setTimeout(() => navigate(`/patient/result/${id}`), 1000);
            } else {
              setTimeout(check, 2000);
            }
          } catch (err) {
            setTimeout(check, 3000);
          }
        };
        check();
      } catch (err) {
        setStatus("Retrying connection to neural core...");
      }
    };
    start();
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 animate-in fade-in duration-1000 font-sans relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-sky-200/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Visual Hub */}
      <div className="relative mb-16 group">
        <div className="absolute inset-0 bg-sky-400/20 blur-[80px] rounded-full scale-150 animate-pulse transition-all duration-1000" />

        <div className="relative bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl shadow-sky-900/10">
          <Heart 
            className="w-24 h-24 text-[#0ea5e9] animate-[pulse_1.5s_ease-in-out_infinite]" 
            fill="currentColor" 
            fillOpacity={0.1}
          />
          <Activity className="absolute inset-0 m-auto w-10 h-10 text-slate-300 opacity-50" />
        </div>

        <div className="absolute -bottom-2 -right-2 bg-slate-900 p-4 rounded-3xl shadow-2xl shadow-slate-900/20 transform hover:scale-110 transition-transform">
          <BrainCircuit size={24} className="text-white" />
        </div>
        
        <div className="absolute -top-4 -left-4 bg-[#0ea5e9] p-3 rounded-2xl shadow-lg shadow-sky-500/20">
          <Zap size={18} className="text-white" />
        </div>
      </div>

      {/* Header & Status */}
      <div className="text-center space-y-4 mb-12 relative z-10">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
          Analyzing <span className="text-[#0ea5e9]">Heart</span> Data
        </h2>
        <div className="flex items-center justify-center gap-3">
           <div className="h-[1px] w-8 bg-slate-200" />
           <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] h-5 min-w-[300px]">
             {status}
           </p>
           <div className="h-[1px] w-8 bg-slate-200" />
        </div>
      </div>

      {/* Progress Architecture */}
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex justify-between items-end px-2">
          <div className="flex items-center gap-3">
            <Loader2 size={16} className="text-[#0ea5e9] animate-spin" />
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">
              Inference Engine Active
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 italic tabular-nums">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-white h-5 rounded-full overflow-hidden p-1.5 border border-slate-100 shadow-xl">
          <div
            className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="pt-10 flex justify-center">
          <div className="px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <ShieldCheck size={14} className="text-emerald-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Biometric Data Fully Encrypted
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <footer className="absolute bottom-12 opacity-30">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          Powered by Cardio-Neural v4.0
        </p>
      </footer>
    </div>
  );
}
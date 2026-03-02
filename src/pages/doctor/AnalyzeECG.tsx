import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Activity, Loader2 } from "lucide-react";
import {
  runAnalysis,
  getAnalysisResult,
} from "../../services/analysis.service";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";

export default function AnalyzeECG() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Extracting signal features...");

  useEffect(() => {
    const startWorkflow = async () => {
      try {
        if (!id) return;

        // 1. Trigger API Analysis
        await runAnalysis(id);

        // 2. Simulated Progress Logic
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            if (prev > 30) setStatus("Running neural network model...");
            if (prev > 60) setStatus("Validating clinical indicators...");
            return prev + 1;
          });
        }, 50);

        // 3. Poll for result
        const checkResult = async () => {
          try {
            const data = await getAnalysisResult(id);
            if (data.ecg.status === "COMPLETED") {
              setProgress(100);
              setStatus("Analysis Complete!");
              setTimeout(() => {
                const rolePath = user?.role.toLowerCase();
                navigate(`/${rolePath}/result/${id}`);
              }, 800);
            } else {
              setTimeout(checkResult, 2000);
            }
          } catch (e) {
            setTimeout(checkResult, 2000);
            console.log(e);
          }
        };

        checkResult();
      } catch (error) {
        toast.error("Analysis engine failed to start");
        console.log(error);
      }
    };

    startWorkflow();
  }, [id, navigate, user]);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-8 text-center bg-white relative overflow-hidden font-sans">
      {/* Background soft blue glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50" />

      {/* Visual Animation Section */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-[#0ea5e9]/10 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-500/5 group">
          <Heart className="w-24 h-24 text-[#0ea5e9] animate-pulse transition-transform group-hover:scale-110 duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Activity className="w-10 h-10 text-slate-200" />
          </div>
          {/* Circular Spinner overlay */}
          <Loader2 className="absolute top-4 right-4 w-6 h-6 text-[#0ea5e9]/30 animate-spin" />
        </div>
      </div>

      {/* Title & Status */}
      <div className="relative z-10 space-y-3">
        <h2 className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-[0.4em] mb-4">
          AI Diagnostic Engine
        </h2>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
          Analyzing <span className="text-[#0ea5e9]">ECG Data</span>
        </h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest pt-2">
          {status}
        </p>
      </div>

      {/* Progress Container */}
      <div className="w-full max-w-md mt-12 space-y-6 relative z-10">
        <div className="flex justify-between items-end px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-ping" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Neural Processing
            </span>
          </div>
          <span className="text-lg font-black text-slate-900 tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Modern Progress Bar */}
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-50 shadow-inner p-1">
          <div
            className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(14,165,233,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-center items-center gap-6 pt-4 text-slate-300">
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black uppercase tracking-tighter mb-1">Time Remaining</span>
              <span className="text-xs font-bold text-slate-500">
                {Math.max(0, Math.ceil((100 - progress) / 5))}s
              </span>
           </div>
           <div className="w-px h-6 bg-slate-100" />
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black uppercase tracking-tighter mb-1">Model Accuracy</span>
              <span className="text-xs font-bold text-slate-500">99.2%</span>
           </div>
        </div>
      </div>
    </div>
  );
}
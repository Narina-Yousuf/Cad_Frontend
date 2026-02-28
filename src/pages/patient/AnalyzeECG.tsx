import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Activity, BrainCircuit, Loader2 } from "lucide-react";
import {
  runAnalysis,
  getAnalysisResult,
} from "../../services/analysis.service";

export default function PatientAnalyzeECG() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Securing heart data connection...");

  useEffect(() => {
    if (!id) return;

    const start = async () => {
      await runAnalysis(id);

      // Simulated smooth progress for UX
      const progressInterval = setInterval(() => {
        setProgress((p) => {
          if (p >= 92) {
            clearInterval(progressInterval);
            return 92;
          }
          if (p > 20)
            setStatus("Neural network identifying signal patterns...");
          if (p > 50)
            setStatus("Cross-referencing CAD morphological markers...");
          if (p > 80) setStatus("Finalizing clinical risk assessment...");
          return p + 2;
        });
      }, 300);

      const check = async () => {
        try {
          const data = await getAnalysisResult(id);
          if (data.ecg.status === "COMPLETED") {
            setProgress(100);
            setStatus("Analysis Success!");
            setTimeout(() => navigate(`/patient/result/${id}`), 800);
          } else {
            setTimeout(check, 2000);
          }
        } catch (err) {
          setTimeout(check, 3000);
          console.log(err);
        }
      };
      check();
    };
    start();
  }, [id, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#1a1a2e] animate-in fade-in duration-700">
      {/* Visual Hub */}
      <div className="relative mb-12">
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-[#7c5dfa]/20 blur-[100px] rounded-full scale-150 animate-pulse" />

        <div className="relative bg-[#252541] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <Heart className="w-20 h-20 text-[#7c5dfa] animate-pulse" />
          <Activity className="absolute inset-0 m-auto w-8 h-8 text-white/40" />
        </div>

        <div className="absolute -bottom-4 -right-4 bg-[#7c5dfa] p-3 rounded-2xl shadow-xl shadow-[#7c5dfa]/20 animate-bounce">
          <BrainCircuit size={20} className="text-white" />
        </div>
      </div>

      {/* Text Info */}
      <h2 className="text-4xl font-black text-white mb-3 tracking-tight uppercase">
        Analyzing Heart Data
      </h2>
      <p className="text-[#94a3b8] mb-12 text-center max-w-sm font-bold text-[10px] uppercase tracking-[0.2em] leading-loose h-8">
        {status}
      </p>

      {/* Progress Architecture */}
      <div className="w-full max-w-sm space-y-4">
        <div className="flex justify-between items-end px-1">
          <div className="flex items-center gap-2">
            <Loader2 size={12} className="text-[#7c5dfa] animate-spin" />
            <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">
              Processing
            </span>
          </div>
          <span className="text-sm font-black text-white italic">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-[#252541] h-3 rounded-full overflow-hidden p-[2px] border border-white/5 shadow-inner">
          <div
            className="bg-[#7c5dfa] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(124,93,250,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="pt-6 flex justify-center">
          <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <p className="text-[9px] font-black text-[#94a3b8]/60 uppercase tracking-tighter">
              Encrypted End-to-End Neural Link Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

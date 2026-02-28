import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Activity } from "lucide-react";
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-[#1a1a2e]">
      {/* Visual Animation Section */}
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-[#7c5dfa]/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-[#252541] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <Heart className="w-24 h-24 text-[#7c5dfa] animate-pulse" />
          <Activity className="absolute inset-0 m-auto w-10 h-10 text-white opacity-50" />
        </div>
      </div>

      {/* Title & Status */}
      <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
        Analyzing ECG Data
      </h1>
      <p className="text-[#94a3b8] font-medium text-lg mb-12 max-w-md uppercase tracking-widest text-[11px]">
        {status}
      </p>

      {/* Progress Container */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-between items-end px-1">
          <span className="text-[10px] font-black text-[#7c5dfa] uppercase tracking-[0.2em]">
            Neural Engine Processing
          </span>
          <span className="text-sm font-black text-white">{progress}%</span>
        </div>

        <div className="w-full bg-[#252541] h-3 rounded-full overflow-hidden border border-white/5 p-[2px]">
          <div
            className="bg-[#7c5dfa] h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(124,93,250,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[10px] text-[#94a3b8]/50 font-bold uppercase tracking-tighter pt-4">
          Estimated time remaining:{" "}
          {Math.max(0, Math.ceil((100 - progress) / 5))}s
        </p>
      </div>
    </div>
  );
}

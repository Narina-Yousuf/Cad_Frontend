import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Activity, BrainCircuit, ChevronLeft, Loader2 } from "lucide-react";
import { ECGWaveform } from "../../components/signal/ECGWaveform";
import { getECGSignal } from "../../services/ecg.service";
import type { ECGSignal } from "../../types/ecg.types";
import toast from "react-hot-toast";

export default function PatientSignalDisplay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [signal, setSignal] = useState<ECGSignal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getECGSignal(id)
        .then(setSignal)
        .catch(() => toast.error("Error loading signal"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#7c5dfa] animate-spin" />
        <span className="text-[#94a3b8] font-black uppercase tracking-[0.2em] text-xs">
          Syncing Waveform Data...
        </span>
      </div>
    );

  if (!signal)
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center p-8 bg-[#252541] rounded-[2rem] border border-white/5">
          <p className="text-red-400 font-black uppercase tracking-widest text-sm">
            Signal Data Missing
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#94a3b8] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            Return Home
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 bg-[#1a1a2e] min-h-screen animate-in fade-in duration-500">
      {/* Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-[#94a3b8] font-black uppercase text-[10px] tracking-widest hover:text-white transition-all mb-4"
      >
        <div className="p-2 bg-[#252541] rounded-lg group-hover:bg-[#7c5dfa]/10 transition-colors">
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </div>
        Back
      </button>

      {/* Main Signal Surface */}
      <div className="bg-[#252541] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#7c5dfa]/5 rounded-full blur-3xl -mr-24 -mt-24" />

        <header className="mb-8 relative z-10">
          <p className="text-[10px] font-black text-[#7c5dfa] uppercase tracking-[0.3em] mb-2">
            Source: {signal.fileName}
          </p>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight uppercase leading-none">
            <Activity className="text-[#7c5dfa]" /> Recorded ECG Signal
          </h1>
        </header>

        {/* The Animated Waveform Component */}
        <div className="rounded-3xl overflow-hidden border border-white/5 shadow-inner bg-[#1a1a2e]">
          <ECGWaveform />
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-6 items-center justify-between border-t border-white/5 pt-8 relative z-10">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em]">
              Recording Parameters
            </p>
            <p className="text-sm font-bold text-white">
              Sampling:{" "}
              <span className="text-[#7c5dfa]">{signal.samplingRate}Hz</span> •
              Length: <span className="text-[#7c5dfa]">{signal.duration}s</span>{" "}
              • Lead: <span className="text-[#7c5dfa]">II</span>
            </p>
          </div>

          <button
            onClick={() => navigate(`/patient/analyze/${id}`)}
            className="w-full md:w-auto bg-[#7c5dfa] hover:bg-[#9277ff] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl shadow-[#7c5dfa]/20 transition-all active:scale-95 group"
          >
            <BrainCircuit
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            Run AI Analysis
          </button>
        </div>
      </div>

      {/* Info Tip */}
      <div className="bg-[#7c5dfa]/5 p-6 rounded-[2rem] border border-[#7c5dfa]/10 flex gap-4 items-start">
        <Activity size={18} className="text-[#7c5dfa] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#94a3b8] font-medium leading-relaxed uppercase tracking-wider">
          The visualization above displays the digitized electrical activity of
          your heart. Click{" "}
          <span className="text-white font-black">Run AI Analysis</span> to
          process this data through our CAD detection neural network.
        </p>
      </div>
    </div>
  );
}

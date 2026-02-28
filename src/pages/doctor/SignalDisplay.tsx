import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Activity,
  Download,
  BrainCircuit,
  Info,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { ECGWaveform } from "../../components/signal/ECGWaveform";
import { getECGSignal } from "../../services/ecg.service";
import type { ECGSignal } from "../../types/ecg.types";
import toast from "react-hot-toast";

export default function SignalDisplay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [signal, setSignal] = useState<ECGSignal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getECGSignal(id)
        .then(setSignal)
        .catch(() => toast.error("Failed to load signal data"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#7c5dfa] animate-spin" />
        <span className="text-[#94a3b8] font-black uppercase tracking-[0.2em] text-xs">
          Initializing Signal Buffer...
        </span>
      </div>
    );

  if (!signal)
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center p-8 bg-[#252541] rounded-[2rem] border border-white/5">
          <p className="text-red-400 font-black uppercase tracking-widest text-sm">
            Signal not found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#94a3b8] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#1a1a2e] min-h-screen animate-in fade-in duration-500">
      {/* Back Button & Header */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-[#94a3b8] font-black uppercase text-[10px] tracking-widest hover:text-white transition-all mb-4"
      >
        <ChevronLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back
      </button>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight uppercase">
            <Activity className="text-[#7c5dfa]" /> {signal.fileName}
          </h1>
          <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-[0.15em] mt-1">
            Patient: <span className="text-white">{signal.patient.name}</span> •
            ID: {id?.slice(0, 8)} •{" "}
            {new Date(signal.uploadDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#252541] border border-white/5 hover:bg-white/5 text-[#94a3b8] hover:text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
            <Download className="w-4 h-4" /> Download Raw
          </button>
          <button
            onClick={() => navigate(`/doctor/analyze/${id}`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#7c5dfa] hover:bg-[#9277ff] text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#7c5dfa]/20 transition-all active:scale-95"
          >
            <BrainCircuit className="w-4 h-4" /> Run AI Analysis
          </button>
        </div>
      </header>

      {/* The Animated Waveform Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#7c5dfa]/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <ECGWaveform />
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Sampling Rate", value: `${signal.samplingRate} Hz` },
          { label: "Duration", value: `${signal.duration}s` },
          { label: "Channel", value: "Lead II" },
          { label: "Resolution", value: "12-bit" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#252541] p-6 rounded-[2rem] border border-white/5 shadow-xl transition-all hover:border-[#7c5dfa]/30"
          >
            <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-2">
              {item.label}
            </p>
            <p className="text-xl font-black text-white tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Information Banner */}
      <div className="bg-[#7c5dfa]/5 p-6 rounded-[2rem] flex items-start gap-4 border border-[#7c5dfa]/20">
        <div className="p-2 bg-[#7c5dfa]/10 rounded-xl">
          <Info className="text-[#7c5dfa] w-5 h-5" />
        </div>
        <p className="text-sm text-[#94a3b8] font-medium leading-relaxed">
          The waveform visualized above represents the raw data extracted from
          the source file.
          <span className="text-white font-bold mx-1">
            Run AI Analysis
          </span>{" "}
          will perform morphological feature extraction and classify this signal
          for indicators of Coronary Artery Disease.
        </p>
      </div>
    </div>
  );
}

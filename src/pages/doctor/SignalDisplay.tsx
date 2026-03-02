import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Activity,
  Download,
  BrainCircuit,
  Info,
  ChevronLeft,
  Loader2,
  Calendar,
  Waves,
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
        <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
          Synchronizing Waveform Buffer...
        </span>
      </div>
    );

  if (!signal)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
          <p className="text-red-500 font-black uppercase tracking-widest text-sm">
            Signal Data Nullified
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-[#0ea5e9] hover:text-blue-700 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto"
          >
            <ChevronLeft size={14} /> Return to Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50/30 min-h-screen animate-in fade-in zoom-in-95 duration-500 font-sans">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-[#0ea5e9] transition-all"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Return
          </button>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-blue-50 text-[#0ea5e9] p-1.5 rounded-lg border border-blue-100">
                  <Activity size={18} />
               </div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                 {signal.fileName}
               </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm text-slate-600">
                Patient: {signal.patient.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-[#0ea5e9]" />
                {new Date(signal.uploadDate).toLocaleDateString()}
              </span>
              <span className="text-slate-200">|</span>
              <span className="font-mono">REF_{id?.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-[#0ea5e9]/30 text-slate-500 hover:text-[#0ea5e9] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm">
            <Download size={16} /> Export Raw
          </button>
          <button
            onClick={() => navigate(`/doctor/analyze/${id}`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            <BrainCircuit size={16} /> Run AI Analysis
          </button>
        </div>
      </div>

      {/* The Waveform Canvas */}
      <div className="relative group bg-white rounded-[3rem] p-8 border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
        <div className="absolute top-6 right-8 flex items-center gap-2">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Rendering Lead II</span>
        </div>
        
        {/* Signal component container */}
        <div className="min-h-[400px] flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 relative overflow-hidden">
           {/* This replicates the grid paper look often found in ECGs */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px]" />
           <ECGWaveform />
        </div>
      </div>

      {/* Metadata Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Sampling Frequency", value: `${signal.samplingRate} Hz`, icon: Waves },
          { label: "Acquisition Time", value: `${signal.duration}s`, icon: Calendar },
          { label: "Standardized Lead", value: "Lead II", icon: Activity },
          { label: "Voltage Depth", value: "12-bit", icon: Info },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-blue-900/5 transition-all hover:translate-y-[-4px] hover:border-[#0ea5e9]/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <item.icon size={14} className="text-[#0ea5e9]" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {item.label}
              </p>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tighter italic">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Instructional Context */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-start gap-6 relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
          <Info className="text-blue-400 w-6 h-6" />
        </div>
        <div className="space-y-1 relative z-10">
           <h4 className="text-white font-black uppercase text-xs tracking-widest">Diagnostic Protocol</h4>
           <p className="text-sm text-slate-400 font-medium leading-relaxed">
             Visual verification is required before initiating classification. 
             The <span className="text-blue-400 font-black">Run AI Analysis</span> engine will deploy a deep convolutional neural network to 
             scan for ST-segment depression and QRS morphological anomalies indicative of CAD.
           </p>
        </div>
      </div>
    </div>
  );
}
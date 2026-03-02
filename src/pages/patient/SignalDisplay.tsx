import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Activity, BrainCircuit, ChevronLeft, Loader2, Waves, Info } from "lucide-react";
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
        .catch(() => toast.error("Error synchronizing signal stream"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
          <Activity className="absolute inset-0 m-auto w-5 h-5 text-sky-400 animate-pulse" />
        </div>
        <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
          Calibrating Waveform Interface...
        </span>
      </div>
    );

  if (!signal)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl max-w-sm w-full">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Activity className="text-rose-500 w-8 h-8" />
          </div>
          <p className="text-slate-900 font-black uppercase tracking-widest text-sm mb-2">
            Signal Data Offline
          </p>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tight mb-8">
            The requested cardiac stream could not be found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700 font-sans">
      {/* Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-900 transition-all mb-4"
      >
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:border-sky-200 group-hover:bg-sky-50 transition-all">
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </div>
        Back
      </button>

      {/* Main Signal Surface */}
      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
        {/* Ambient Branding Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

        <header className="mb-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-[0.4em]">
                Live Stream: {signal.fileName}
              </p>
            </div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase italic leading-none">
              <Activity className="text-[#0ea5e9] w-10 h-10" /> Cardiac Waveform
            </h1>
          </div>
          
          <div className="flex items-center gap-4 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
             <Waves size={16} className="text-slate-300" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead II Configuration</span>
          </div>
        </header>

        {/* The Animated Waveform Component Container */}
        <div className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-900 relative group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="p-1">
             <ECGWaveform />
          </div>
          {/* Grid Overlay for that Oscilloscope look */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 opacity-20" 
               style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)' }} 
          />
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-8 items-center justify-between border-t border-slate-50 pt-10 relative z-10">
          <div className="grid grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Frequency</p>
              <p className="text-sm font-black text-slate-900 italic uppercase">{signal.samplingRate} <span className="text-[10px] text-slate-400 not-italic">Hz</span></p>
            </div>
            <div className="border-x border-slate-100 px-8">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Duration</p>
              <p className="text-sm font-black text-slate-900 italic uppercase">{signal.duration} <span className="text-[10px] text-slate-400 not-italic">Sec</span></p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Resolution</p>
              <p className="text-sm font-black text-slate-900 italic uppercase">12-Bit</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/patient/analyze/${id}`)}
            className="w-full md:w-auto bg-[#0ea5e9] hover:bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-sky-500/20 transition-all active:scale-95 group"
          >
            <BrainCircuit
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            Process AI Analysis
          </button>
        </div>
      </div>

      {/* Instructional Advisory */}
      
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row gap-6 items-center shadow-sm">
        <div className="p-4 bg-sky-50 rounded-2xl text-[#0ea5e9]">
          <Info size={24} />
        </div>
        <p className="text-[11px] text-slate-400 font-bold leading-loose uppercase tracking-widest text-center md:text-left">
          Visualizing <span className="text-slate-900">digitized electrical potentials</span>. 
          The neural engine will evaluate the morphological structure of the 
          <span className="text-[#0ea5e9] mx-1">ST-segment</span> and 
          <span className="text-[#0ea5e9] mx-1">T-wave</span> for early CAD markers.
        </p>
      </div>
    </div>
  );
}
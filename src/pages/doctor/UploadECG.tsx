import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { FileDropzone } from "../../components/upload/FileDropzone";
import { uploadECG, getPatients } from "../../services/ecg.service";
import type { PatientListItem } from "../../types/ecg.types";
import {
  Loader2,
  User,
  Trash2,
  ArrowRight,
  Activity,
  FileUp,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";
import toast from "react-hot-toast";

export default function UploadECG() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.role === "DOCTOR") {
      getPatients()
        .then(setPatients)
        .catch(() => toast.error("Failed to load patient records"));
    }
  }, [user]);

  const handleUpload = async () => {
    if (files.length < 2) return toast.error("Please select both .hea and .dat files");
    if (user?.role === "DOCTOR" && !selectedPatient) {
      return toast.error("Please assign this signal to a patient");
    }

    const formData = new FormData();
    files.forEach(f => formData.append("ecgFiles", f));
    if (selectedPatient) formData.append("patientId", selectedPatient);

    try {
      setUploading(true);
      const result = await uploadECG(formData, (p) => setProgress(p));
      setSuccess(true);
      toast.success("Signal ingestion successful");
      setTimeout(
        () => navigate(`/${user?.role.toLowerCase()}/signal/${result.id}`),
        1800,
      );
    } catch (err) {
      toast.error("Network upload error");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700 font-sans relative overflow-hidden">
      {/* Structural background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-sky-400 to-blue-100 opacity-50" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Portal Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-sky-900/5 mb-6 border border-slate-100">
            <Activity className="text-[#0ea5e9] w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase ">
            Analyze <span className="text-[#0ea5e9]">ECG Signal</span>
          </h1>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-4 flex items-center justify-center gap-2">
            <Fingerprint size={12} /> Encrypted Diagnostic Entry Point
          </p>
        </div>

        {!success ? (
          <div className="space-y-6">
            {/* STEP 1: DROPZONE */}
            <div
              className={`bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl shadow-blue-900/5 transition-all duration-500 ${
                files.length > 0 ? "opacity-40 scale-95 blur-[2px] pointer-events-none" : "scale-100 opacity-100"
              }`}
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-[11px] font-black text-white shadow-lg">
                    01
                  </div>
                  <h3 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[11px]">
                    Initialize Data Stream
                  </h3>
                </div>
                <FileDropzone
                  onFileSelect={(f) => {
                    const selected = Array.isArray(f) ? f : [f];
                    setFiles(selected);
                  }}
                  error={files.length === 0 ? "Select .HEA + .DAT files" : undefined}
                />
              </div>
            </div>

            {/* STEP 2: CONFIGURATION */}
            {files.length > 0 && !uploading && (
              <div className="bg-white rounded-[3rem] border-2 border-[#0ea5e9]/30 shadow-2xl shadow-sky-500/10 animate-in slide-in-from-bottom-12 duration-500 overflow-hidden">
                <div className="p-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#0ea5e9] flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-sky-500/20">
                        02
                      </div>
                      <h3 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[11px]">
                        Parameter Validation
                      </h3>
                    </div>
                    <button
                      onClick={() => setFiles([])}
                      className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <FileUp className="text-[#0ea5e9]" size={24} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {files.map((f, i) => (
                        <div key={i}>
                          <p className="text-slate-900 font-black text-sm truncate uppercase tracking-tight">{f.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{(f.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {user?.role === "DOCTOR" && (
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                        <User size={14} className="text-[#0ea5e9]" /> Target Clinical Record
                      </label>
                      <select
                        className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-[#0ea5e9]/20 focus:bg-white text-slate-900 rounded-3xl outline-none transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer shadow-inner"
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                      >
                        <option value="">Choose Patient Identity...</option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleUpload}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-3xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px] group"
                  >
                    Execute AI Processing
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* PROGRESS STATE */}
            {uploading && (
              <div className="bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-2xl shadow-blue-900/5 animate-in zoom-in-95">
                <div className="relative inline-flex mb-10">
                  <Loader2 size={64} className="text-[#0ea5e9] animate-spin" />
                  <div className="absolute inset-0 blur-2xl bg-sky-400/20 animate-pulse rounded-full" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">
                  Stream Ingesting
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
                  Transmitting high-fidelity morphological data
                </p>

                <div className="space-y-6">
                  <div className="w-full bg-slate-100 h-4 rounded-full p-1 shadow-inner overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-5xl font-black text-slate-900 italic tabular-nums">
                    {progress}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="bg-white rounded-[4rem] border border-slate-100 p-20 text-center shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="bg-emerald-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border-2 border-emerald-100">
              <ShieldCheck className="text-emerald-500 w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">
              Buffer Synchronized
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px]">
              Security Handshake Complete. Initializing Dashboard...
            </p>
          </div>
        )}

        <footer className="mt-16 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-slate-200" /> 
            AES-256 Medical Grade Encryption 
            <span className="w-12 h-[1px] bg-slate-200" />
          </p>
        </footer>
      </div>
    </div>
  );
}

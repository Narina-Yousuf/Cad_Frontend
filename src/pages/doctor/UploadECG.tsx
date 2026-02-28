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
} from "lucide-react";
import toast from "react-hot-toast";

export default function UploadECG() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.role === "DOCTOR") {
      getPatients()
        .then(setPatients)
        .catch(() => toast.error("Failed to load patients"));
    }
  }, [user]);

  const handleUpload = async () => {
    if (!file) return;
    if (user?.role === "DOCTOR" && !selectedPatient) {
      return toast.error("Please select a patient");
    }

    const formData = new FormData();
    formData.append("ecgFile", file);
    if (selectedPatient) formData.append("patientId", selectedPatient);

    try {
      setUploading(true);
      const result = await uploadECG(formData, (p) => setProgress(p));
      setSuccess(true);
      toast.success("Upload successful!");
      setTimeout(
        () => navigate(`/${user?.role.toLowerCase()}/signal/${result.id}`),
        2000,
      );
    } catch (err) {
      toast.error("Upload failed");
      console.log(err);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#7c5dfa]/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header - Centered & Clean */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-[#7c5dfa]/10 rounded-2xl mb-4 border border-[#7c5dfa]/20">
            <Activity className="text-[#7c5dfa] w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Analyze <span className="text-[#7c5dfa]">Signal</span>
          </h1>
          <p className="text-[#94a3b8] font-bold text-[10px] uppercase tracking-[0.3em] mt-3 opacity-60">
            Neural Network Ingestion Portal
          </p>
        </div>

        {!success ? (
          <div className="space-y-6">
            {/* STEP 1: DROPZONE */}
            <div
              className={`bg-[#252541] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden transition-all duration-500 ${file ? "opacity-50 scale-95 blur-[1px]" : "scale-100 opacity-100"}`}
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[10px] font-black text-[#7c5dfa] border border-[#7c5dfa]/30">
                    01
                  </div>
                  <h3 className="text-white font-black uppercase tracking-widest text-xs">
                    Select Data Source
                  </h3>
                </div>
                <FileDropzone
                  onFileSelect={(f) => {
                    if (f.size > 50 * 1024 * 1024)
                      toast.error("File exceeds 50MB limit");
                    else setFile(f);
                  }}
                  error={file ? undefined : "CSV, MAT, or TXT"}
                />
              </div>
            </div>

            {/* STEP 2: CONFIGURATION (Appears after file select) */}
            {file && !uploading && (
              <div className="bg-[#252541] rounded-[2.5rem] border border-[#7c5dfa]/30 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7c5dfa] flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-[#7c5dfa]/20">
                        02
                      </div>
                      <h3 className="text-white font-black uppercase tracking-widest text-xs">
                        Finalize Metadata
                      </h3>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="bg-[#1a1a2e] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <FileUp className="text-[#7c5dfa]" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-white font-black text-sm truncate uppercase tracking-tighter">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-[#94a3b8] font-bold">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • READY
                      </p>
                    </div>
                  </div>

                  {user?.role === "DOCTOR" && (
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">
                        <User size={12} className="text-[#7c5dfa]" /> Target
                        Patient
                      </label>
                      <select
                        className="w-full p-5 bg-[#1a1a2e] border border-white/5 text-white rounded-2xl focus:border-[#7c5dfa] outline-none transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer"
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                      >
                        <option value="">Select Identity...</option>
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
                    className="w-full bg-[#7c5dfa] hover:bg-[#9277ff] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#7c5dfa]/20 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] hover:-translate-y-1 active:scale-95"
                  >
                    Start Neural Analysis
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* PROGRESS STATE */}
            {uploading && (
              <div className="bg-[#252541] rounded-[2.5rem] border border-white/5 p-12 text-center shadow-2xl animate-in zoom-in-95">
                <div className="relative inline-flex mb-8">
                  <Loader2 size={48} className="text-[#7c5dfa] animate-spin" />
                  <div className="absolute inset-0 blur-xl bg-[#7c5dfa]/30 animate-pulse rounded-full" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
                  Ingesting Signal
                </h3>
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-10">
                  Data transmission in progress
                </p>

                <div className="space-y-4">
                  <div className="w-full bg-[#1a1a2e] h-3 rounded-full p-[2px] border border-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7c5dfa] to-[#9277ff] rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(124,93,250,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-3xl font-black text-white italic">
                    {progress}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="bg-[#252541] rounded-[3rem] border border-white/5 p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="bg-emerald-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
              <ShieldCheck className="text-emerald-400 w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-3">
              Transmission Secure
            </h2>
            <p className="text-[#94a3b8] font-bold uppercase tracking-widest text-[10px]">
              Initialization Complete. Loading visualization...
            </p>
          </div>
        )}

        <footer className="mt-12 text-center opacity-20">
          <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.4em]">
            Secure End-to-End Encryption Enabled
          </p>
        </footer>
      </div>
    </div>
  );
}

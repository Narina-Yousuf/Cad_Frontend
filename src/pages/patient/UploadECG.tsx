import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDropzone } from "../../components/upload/FileDropzone";
import { uploadECG } from "../../services/ecg.service";
import { HeartPulse, UploadCloud, FileType, CheckCircle2, Info } from "lucide-react";
import toast from "react-hot-toast";

export default function PatientUploadECG() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (files.length < 2) return;

    const formData = new FormData();
    files.forEach((f) => formData.append("ecgFiles", f));

    try {
      setUploading(true);
      const result = await uploadECG(formData, (p) => setProgress(p));
      toast.success("Signal Sync Complete");
      navigate(`/patient/analyze/${result.id}`);
    } catch (err) {
      toast.error("Format mismatch. Please use approved clinical file types.");
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-12 space-y-10 bg-slate-50/30 min-h-screen animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="bg-white w-20 h-20 rounded-[2rem] shadow-xl shadow-blue-900/5 flex items-center justify-center mx-auto mb-6 border border-slate-100 group transition-transform hover:scale-110">
          <HeartPulse className="text-[#0ea5e9] w-10 h-10 animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
          Upload <span className="text-[#0ea5e9]">Cardiac Data</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-relaxed">
          Provide your digitized ECG recording for neural network CAD screening.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 relative overflow-hidden">
        <UploadCloud className="absolute -right-8 -top-8 w-40 h-40 text-slate-50 opacity-50" />

        <div className="relative z-10">
          <FileDropzone
            onFileSelect={(f) => setFiles(f)}
            error={files.length === 0 ? "Awaiting: .HEA + .DAT files" : undefined}
          />

          {files.length > 0 && !uploading && (
            <div className="mt-8 space-y-3">
              {files.map((f, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 truncate">
                    <div className="p-3 bg-sky-500 rounded-xl text-white">
                      <FileType size={18} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-black text-slate-900 truncate tracking-tight uppercase italic">
                        {f.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {(f.size / 1024).toFixed(1)} KB • Ready
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setFiles([])}
                className="text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          )}

          {uploading ? (
            <div className="mt-10 space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600">
                    Transmitting to Neural Core
                  </span>
                </div>
                <span className="text-lg font-black italic text-slate-900">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-sky-400 to-blue-600 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(14,165,233,0.4)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              disabled={files.length < 2}
              className="w-full mt-10 bg-[#0ea5e9] hover:bg-[#7cc9ed] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <CheckCircle2 size={18} /> Submit for Analysis
            </button>
          )}
        </div>
      </div>

      <div className="bg-sky-50/50 p-8 rounded-[2.5rem] border border-sky-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-sky-100">
          <Info className="text-sky-500" size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs">
            Data Requirements
          </h4>
          <p className="text-slate-400 text-[11px] leading-relaxed font-bold uppercase tracking-tight">
            Please select both <span className="text-sky-600 mx-1">.HEA</span> and
            <span className="text-sky-600 mx-1">.DAT</span> files together for analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

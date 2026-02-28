import React, { useState, useCallback } from "react";
import { Upload, AlertCircle } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  error?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 text-center cursor-pointer group
        ${
          isDragging
            ? "border-[#7c5dfa] bg-[#7c5dfa]/10 shadow-[0_0_20px_rgba(124,93,250,0.1)]"
            : "border-white/10 bg-[#1a1a2e] hover:border-[#7c5dfa]/50 hover:bg-[#252541]"
        }`}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        accept=".csv,.mat,.txt"
      />

      <div className="flex flex-col items-center">
        <div
          className={`p-5 rounded-2xl mb-6 transition-all duration-300 
          ${isDragging ? "bg-[#7c5dfa] text-white scale-110" : "bg-[#252541] text-[#7c5dfa] group-hover:scale-105"}`}
        >
          <Upload className="w-10 h-10" />
        </div>

        <p className="text-xl font-black text-white tracking-tight">
          Drag & drop ECG file here
        </p>
        <p className="text-sm text-[#94a3b8] mt-2 font-medium">
          or click to browse from computer
        </p>

        <div className="mt-8 flex gap-3 justify-center">
          {[".CSV", ".MAT", ".TXT"].map((ext) => (
            <span
              key={ext}
              className="text-[10px] font-black tracking-widest bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-[#94a3b8]"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center justify-center gap-2 text-red-400 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
};

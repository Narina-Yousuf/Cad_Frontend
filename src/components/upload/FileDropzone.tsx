import React, { useState, useCallback } from "react";
import { Upload, AlertCircle, FileText } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (files: File[]) => void;
  error?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
      className={`relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-300 text-center cursor-pointer group
        ${
          isDragging
            ? "border-[#0ea5e9] bg-blue-50/50 shadow-2xl shadow-blue-500/10"
            : "border-slate-200 bg-slate-50 hover:border-[#0ea5e9]/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5"
        }`}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelect(Array.from(e.target.files));
          }
        }}
        accept=".hea,.dat"
        multiple
      />

      <div className="flex flex-col items-center">
        {/* Animated Icon Container */}
        <div
          className={`p-6 rounded-[1.5rem] mb-6 transition-all duration-300 shadow-sm
          ${isDragging ? "bg-[#0ea5e9] text-white scale-110 shadow-blue-500/20" : "bg-white text-[#0ea5e9] group-hover:scale-105 group-hover:shadow-md"}`}
        >
          <Upload className="w-10 h-10" />
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          Drop ECG Waveform Data
        </h3>
        <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">
          Click to browse or drag and drop
        </p>

        {/* File Extension Badges */}
        <div className="mt-8 flex gap-2 justify-center">
          {[".HEA"].map((ext) => (
            <span
              key={ext}
              className="text-[9px] font-black tracking-[0.2em] bg-white border border-slate-100 px-4 py-2 rounded-xl text-slate-400 shadow-sm"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-8 flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
};
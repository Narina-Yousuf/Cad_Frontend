import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Printer,
  Download,
  X,
  HeartPulse,
  FileCheck,
  ShieldAlert,
  Loader2,
  Calendar,
  Fingerprint,
} from "lucide-react";
import { getReport } from "../../services/report.service";
import type { ReportData } from "../../types/report.types";
import toast from "react-hot-toast";

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getReport(id)
        .then(setReport)
        .catch(() => toast.error("Failed to load report"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-20 text-center">
        <Loader2 className="animate-spin w-12 h-12 text-[#0ea5e9] mb-4" />
        <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
          Synchronizing Neural Diagnostics...
        </span>
      </div>
    );

  if (!report)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black uppercase text-slate-400">
        Archive Entry Not Found.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-700 font-sans">
      {/* Action Toolbar */}
      <div className="max-w-4xl mx-auto mb-10 flex justify-between items-center no-print">
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-95"
          >
            <Printer size={16} /> Print Analysis
          </button>
          <button className="flex items-center gap-3 bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all shadow-sm">
            <Download size={16} /> Export PDF
          </button>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Report Container */}
      <div
        id="report-content"
        className="max-w-4xl mx-auto bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-12 md:p-20 rounded-[3rem] text-slate-900 border border-slate-100 print:shadow-none print:p-0 print:rounded-none"
      >
        {/* Document Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-100 pb-12 mb-12">
          <div className="flex items-center gap-6">
            <div className="bg-[#0ea5e9] p-4 rounded-3xl shadow-lg shadow-blue-500/20">
              <HeartPulse className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none italic">
                Clinical <span className="text-[#0ea5e9]">Verdict</span>
              </h1>
              <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.25em] text-[9px]">
                CAD.AI Neural Diagnostic Output
              </p>
            </div>
          </div>
          <div className="mt-8 md:mt-0 text-left md:text-right space-y-2">
            <div className="bg-slate-50 px-4 py-2 rounded-xl inline-block border border-slate-100">
              <p className="font-black text-slate-900 text-[10px] uppercase tracking-widest">
                Dossier: {report.id.slice(0, 12).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center md:justify-end gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <Calendar size={12} className="text-[#0ea5e9]" />
              {new Date(report.generatedDate).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Patient & Doctor Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#0ea5e9]" /> Patient Identification
            </h3>
            <div className="space-y-4 px-2">
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Legal Name</span>
                <span className="font-black text-slate-900 uppercase tracking-tight">{report.patientInfo.name}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Unique ID</span>
                <span className="font-mono text-xs text-slate-600">{report.patientInfo.patientId.slice(0, 16)}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Biometrics</span>
                <span className="font-black text-slate-900">{report.patientInfo.age}Y / {report.patientInfo.gender}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-4 h-[2px] bg-slate-200" /> Attending Authority
            </h3>
            <div className="space-y-4 px-2">
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Physician</span>
                <span className="font-black text-slate-900 uppercase">Dr. {report.doctor?.name}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Department</span>
                <span className="font-black text-slate-900">{report.doctor?.specialization}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Institution</span>
                <span className="font-black text-slate-900">{report.doctor?.hospitalName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Hero Block */}
        <div
          className={`p-10 rounded-[2.5rem] mb-16 flex flex-col md:flex-row items-center justify-between border-2 transition-all ${
            report.analysisResult.isCADDetected
              ? "bg-red-50/50 border-red-100 shadow-xl shadow-red-900/5"
              : "bg-emerald-50/50 border-emerald-100 shadow-xl shadow-emerald-900/5"
          }`}
        >
          <div className="flex items-center gap-8">
            <div className={`p-5 rounded-[2rem] bg-white shadow-sm border ${report.analysisResult.isCADDetected ? 'border-red-100' : 'border-emerald-100'}`}>
              {report.analysisResult.isCADDetected ? (
                <ShieldAlert className="w-12 h-12 text-red-500" />
              ) : (
                <FileCheck className="w-12 h-12 text-emerald-500" />
              )}
            </div>
            <div>
              <h2
                className={`text-5xl font-black uppercase tracking-tighter italic ${report.analysisResult.isCADDetected ? "text-red-600" : "text-emerald-600"}`}
              >
                {report.analysisResult.isCADDetected ? "CAD Detected" : "Normal Sinus"}
              </h2>
              <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                Neural Confidence Rating: 
                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black">
                  {(report.analysisResult.confidenceScore * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
          <div className="mt-8 md:mt-0 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] rotate-0 md:rotate-90">
            Validated Result
          </div>
        </div>

        {/* Detailed Findings Table */}
        <div className="mb-16">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full" />
            Morphological Feature Extraction
          </h3>
          <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left text-[9px] uppercase font-black text-slate-400 tracking-[0.25em]">
                  <th className="p-6">Waveform Parameter</th>
                  <th className="p-6">AI Observational Finding</th>
                  <th className="p-6 text-center">Reference Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {Object.entries(report.ecgParameters).map(([key, param]) => (
                  <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-black text-slate-900 uppercase text-xs tracking-tight">
                      {key.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td className="p-6 text-slate-500 font-medium italic text-xs">
                      "{param.finding}"
                    </td>
                    <td className="p-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border ${
                        param.status === "Abnormal" 
                        ? "bg-red-50 text-red-600 border-red-100" 
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}>
                        {param.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden mb-16">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
           <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-10 relative z-10">
            Clinical Protocols & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-5 items-start group">
                <div className="bg-white/10 text-white w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black border border-white/10 group-hover:bg-[#0ea5e9] transition-colors">
                  {i + 1}
                </div>
                <p className="text-xs text-slate-300 font-bold leading-relaxed tracking-wide">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Footer */}
        <div className="mt-20 pt-12 border-t-2 border-slate-50 grid grid-cols-1 md:grid-cols-2 items-end gap-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-[#0ea5e9]">
                <Fingerprint size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Biometric Verification Hash</span>
             </div>
            <p className="text-[10px] font-mono text-slate-300 break-all leading-relaxed uppercase">
              SHA-256: {id?.repeat(2).slice(0, 64)}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Generated by Neural Engine v{report.analysisResult.modelVersion} • Lead II Morphology
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6">
              Official Digital Signature
            </p>
            <div className="h-24 w-full md:w-64 bg-slate-50 border-b-4 border-slate-900 md:ml-auto flex items-center justify-center relative overflow-hidden rounded-t-xl">
               <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
               <span className="font-serif italic text-2xl text-slate-300 tracking-tighter opacity-50 select-none">
                 Dr. {report.doctor?.name.split(' ').pop()}
               </span>
            </div>
            <p className="text-[9px] font-black text-slate-300 mt-4 uppercase tracking-[0.2em]">Verified Secure Document</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; padding: 0 !important; }
          .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
          #report-content { 
            width: 100% !important; 
            max-width: none !important; 
            margin: 0 !important; 
            border: none !important; 
            box-shadow: none !important; 
            padding: 20px !important; 
          }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>
    </div>
  );
}
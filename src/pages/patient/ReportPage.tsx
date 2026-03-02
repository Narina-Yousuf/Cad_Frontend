import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Printer,
  ArrowLeft,
  Heart,
  Info,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Download,
} from "lucide-react";
import { getReport } from "../../services/report.service";
import type { ReportData } from "../../types/report.types";
import toast from "react-hot-toast";

export default function PatientReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getReport(id)
        .then(setReport)
        .catch(() => toast.error("Failed to sync clinical report"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-20 text-center">
        <div className="relative mb-6">
          <div className="animate-spin w-12 h-12 border-4 border-sky-100 border-t-sky-500 rounded-full" />
          <Heart className="absolute inset-0 m-auto w-5 h-5 text-sky-500 animate-pulse" />
        </div>
        <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
          Rendering Health Record...
        </span>
      </div>
    );

  if (!report)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-black uppercase tracking-widest">
        Record not found.
      </div>
    );

  const isCAD = report.analysisResult.isCADDetected;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 animate-in fade-in duration-700 font-sans">
      {/* Patient Utility Toolbar */}
      <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-6 no-print">
        <button
          onClick={() => navigate("/patient/dashboard")}
          className="group flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-900 transition-all"
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:border-sky-200 group-hover:bg-sky-50">
            <ArrowLeft size={18} />
          </div>
          Back to Dashboard
        </button>
        
        <div className="flex gap-4">
            <button
            onClick={handlePrint}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-95"
            >
            <Printer size={18} /> Export PDF / Print
            </button>
        </div>
      </div>

      {/* The Medical Report Document */}
      <div
        id="report-content"
        className="max-w-4xl mx-auto bg-white border border-slate-100 p-10 md:p-20 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 text-slate-900 print:shadow-none print:border-none print:p-0 print:rounded-none relative overflow-hidden"
      >
        {/* Document Watermark for Screen */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none no-print">
            <Fingerprint size={240} />
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-16 pb-10 border-b-2 border-slate-50 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-sky-500 rounded-full" />
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                    Diagnostic <span className="text-sky-500">Summary</span>
                </h1>
            </div>
            <div className="flex items-center gap-8 text-[11px] text-slate-400 font-black uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-sky-400" />
                {new Date(report.generatedDate).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Info size={15} className="text-sky-400" />
                ID: {report.id.slice(0, 12).toUpperCase()}
              </span>
            </div>
          </div>
          <div
            className={`p-6 rounded-[2rem] shadow-inner ${isCAD ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}
          >
            <Heart className="w-12 h-12 fill-current" />
          </div>
        </div>

        {/* Primary Conclusion Card */}
        <div
          className={`rounded-[2.5rem] p-10 mb-12 border-2 relative z-10 ${
            isCAD
              ? "bg-rose-50/30 border-rose-100 shadow-xl shadow-rose-900/5"
              : "bg-emerald-50/30 border-emerald-100 shadow-xl shadow-emerald-900/5"
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            {isCAD ? (
              <div className="p-3 bg-rose-500 rounded-2xl shadow-lg shadow-rose-500/20">
                <ShieldAlert className="text-white" />
              </div>
            ) : (
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="text-white" />
              </div>
            )}
            <h2
              className={`text-3xl font-black uppercase tracking-tighter italic ${isCAD ? "text-rose-900" : "text-emerald-900"}`}
            >
              Outcome: {isCAD ? "Positive Detection" : "No CAD Detected"}
            </h2>
          </div>
          <p className="text-slate-700 font-bold leading-relaxed text-lg italic pr-12">
            {isCAD
              ? "The Neural Analysis Core has identified morphological markers indicative of Coronary Artery Disease. Clinical correlation by a certified specialist is mandatory."
              : "Analysis complete. Waveform patterns are within standard physiological ranges. No significant indicators of Coronary Artery Disease detected."}
          </p>
        </div>

        {/* Meta Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 relative z-10">
          <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
              Patient Identification
            </p>
            <p className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">
              {report.patientInfo.name}
            </p>
            <p className="text-[11px] font-black text-sky-600 mt-2 uppercase tracking-[0.2em]">
              {report.patientInfo.age} Years • {report.patientInfo.gender}
            </p>
          </div>
          <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
              Clinical Context
            </p>
            <p className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">
              {report.doctor?.hospitalName || "Remote Scan"}
            </p>
            <p className="text-[11px] font-black text-sky-600 mt-2 uppercase tracking-[0.2em]">
              {report.doctor?.name ? `Lead: Dr. ${report.doctor.name}` : "Automated Neural Screening"}
            </p>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="mb-16 relative z-10">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
            <div className="w-2 h-2 bg-sky-500 rounded-full" />
            Biological Indicators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
            {Object.entries(report.ecgParameters).map(([key, param]) => (
              <div
                key={key}
                className="flex items-center justify-between py-5 border-b border-slate-100 group hover:bg-slate-50/50 px-2 transition-colors rounded-xl"
              >
                <span className="text-xs font-black text-slate-600 uppercase tracking-tight">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span
                  className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 ${
                    param.status === "Abnormal"
                      ? "bg-rose-50 text-rose-600 border-rose-100"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                >
                  {param.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Block */}
        <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-3 bg-sky-500/20 rounded-2xl border border-sky-500/30">
              <Info className="text-sky-400" size={20} />
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-[11px]">
              Specialist Recommendations
            </h3>
          </div>
          <ul className="space-y-6 relative z-10">
            {report.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex gap-5 text-sm font-bold leading-relaxed text-slate-300 group"
              >
                <span className="font-black text-sky-400 text-lg italic transition-transform group-hover:scale-110">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="pt-1">{rec}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-50 text-center relative z-10">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] leading-loose">
            Digitally Verified Health Record • Version {report.analysisResult.modelVersion} <br />
            Powered by Cardio-Neural AI Engine • Proprietary Diagnostic Framework
          </p>
        </div>
      </div>

      {/* Advanced Print Overrides */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
          #report-content { 
            border: none !important; 
            max-width: 100% !important; 
            box-shadow: none !important; 
            padding: 0 !important;
            margin: 0 !important;
          }
          .rounded-[3.5rem] { border-radius: 0 !important; }
          .bg-slate-900 { background: #0f172a !important; -webkit-print-color-adjust: exact; }
          .text-white { color: white !important; -webkit-print-color-adjust: exact; }
          .bg-rose-50 { background: #fff1f2 !important; -webkit-print-color-adjust: exact; }
          .bg-emerald-50 { background: #ecfdf5 !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
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
        .catch(() => toast.error("Failed to load your health report"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#7c5dfa] border-t-transparent rounded-full mb-4" />
        <span className="text-[#94a3b8] font-black uppercase tracking-widest text-xs">
          Preparing your report...
        </span>
      </div>
    );

  if (!report)
    return (
      <div className="p-20 text-center bg-[#1a1a2e] text-white">
        Report not found.
      </div>
    );

  const isCAD = report.analysisResult.isCADDetected;

  return (
    <div className="min-h-screen bg-[#1a1a2e] py-8 px-4 sm:px-6 animate-in fade-in duration-500">
      {/* Patient Toolbar - Amethyst Theme */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center no-print">
        <button
          onClick={() => navigate("/patient/dashboard")}
          className="group flex items-center gap-2 text-[#94a3b8] font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
        >
          <div className="p-2 bg-[#252541] rounded-lg group-hover:bg-[#7c5dfa]/10">
            <ArrowLeft size={16} />
          </div>
          Dashboard
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#7c5dfa] text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#9277ff] shadow-xl shadow-[#7c5dfa]/20 transition-all active:scale-95"
        >
          <Printer size={18} /> Print for Doctor
        </button>
      </div>

      {/* The Medical Report Document - High Contrast for Print */}
      <div
        id="report-content"
        className="max-w-3xl mx-auto bg-white border border-white/5 p-8 md:p-14 rounded-[2.5rem] shadow-2xl text-slate-900 print:shadow-none print:border-none print:p-0 print:rounded-none"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">
              Heart Health Summary
            </h1>
            <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-300" />
                {new Date(report.generatedDate).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>Ref ID: {report.id.slice(0, 10).toUpperCase()}</span>
            </div>
          </div>
          <div
            className={`p-4 rounded-2xl ${isCAD ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-emerald-500"}`}
          >
            <Heart className="w-10 h-10 fill-current" />
          </div>
        </div>

        {/* Diagnostic Highlight */}
        <div
          className={`rounded-3xl p-8 mb-10 border-2 shadow-sm ${
            isCAD
              ? "bg-orange-50/50 border-orange-200 shadow-orange-500/5"
              : "bg-emerald-50/50 border-emerald-200 shadow-emerald-500/5"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            {isCAD ? (
              <ShieldAlert className="text-orange-600" />
            ) : (
              <ShieldCheck className="text-emerald-600" />
            )}
            <h2
              className={`text-2xl font-black uppercase tracking-tight ${isCAD ? "text-orange-700" : "text-emerald-700"}`}
            >
              Result: {isCAD ? "Action Recommended" : "Healthy Rhythm"}
            </h2>
          </div>
          <p className="text-slate-700 font-medium leading-relaxed text-lg">
            {isCAD
              ? "Our neural engine has identified indicators consistent with Coronary Artery Disease. This finding requires professional clinical validation. Please present this report to a cardiologist."
              : "Good news: The AI analysis did not detect significant indicators of Coronary Artery Disease in this specific ECG reading."}
          </p>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              Patient
            </p>
            <p className="text-xl font-black text-slate-900">
              {report.patientInfo.name}
            </p>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              {report.patientInfo.age} Yrs • {report.patientInfo.gender}
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              Source Facility
            </p>
            <p className="text-xl font-black text-slate-900">
              {report.doctor?.hospitalName || "Personal Upload"}
            </p>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              {report.doctor?.name
                ? `Under Dr. ${report.doctor.name}`
                : "Automated Screening"}
            </p>
          </div>
        </div>

        {/* Simplified Indicator List */}
        <div className="mb-12">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Detailed Indicators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {Object.entries(report.ecgParameters).map(([key, param]) => (
              <div
                key={key}
                className="flex items-center justify-between py-4 border-b border-slate-50"
              >
                <span className="text-xs font-black text-slate-600 uppercase tracking-tight">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                    param.status === "Abnormal"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {param.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations - High Contrast Dark Block */}
        <div className="bg-slate-900 text-white p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Info className="text-blue-400" size={20} />
            </div>
            <h3 className="font-black uppercase tracking-[0.15em] text-sm">
              Recommended Next Steps
            </h3>
          </div>
          <ul className="space-y-4 relative z-10">
            {report.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex gap-4 text-sm font-medium leading-relaxed text-slate-300"
              >
                <span className="font-black text-blue-400 text-base">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-loose">
            Generated by CAD.AI Neural Engine v
            {report.analysisResult.modelVersion} <br />
            Digital Health Record • Physician Validation Required
          </p>
        </div>
      </div>

      {/* Global Print Overrides */}
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
        }
      `}</style>
    </div>
  );
}

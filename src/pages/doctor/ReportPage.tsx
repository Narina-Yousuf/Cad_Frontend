import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Printer,
  Download,
  X,
  HeartPulse,
  FileCheck,
  ShieldAlert,
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
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#7c5dfa] border-t-transparent rounded-full mb-4" />
        <span className="text-[#94a3b8] font-black uppercase tracking-widest text-xs">
          Generating Document...
        </span>
      </div>
    );
  if (!report)
    return (
      <div className="p-20 text-center bg-[#1a1a2e] text-white">
        Report not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1a1a2e] py-8 px-4 sm:px-6 animate-in fade-in duration-500">
      {/* Action Toolbar - Amethyst Theme */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center no-print">
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#7c5dfa] text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#9277ff] shadow-lg shadow-[#7c5dfa]/20 transition-all active:scale-95"
          >
            <Printer size={18} /> Print Report
          </button>
          <button className="flex items-center gap-2 bg-[#252541] text-white border border-white/5 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">
            <Download size={18} /> Download PDF
          </button>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-[#252541] border border-white/5 text-[#94a3b8] rounded-2xl hover:text-white transition-all shadow-xl"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Report Container */}
      <div
        id="report-content"
        className="max-w-4xl mx-auto bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] p-10 md:p-16 rounded-xl text-slate-900 print:shadow-none print:p-0 print:rounded-none"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b-8 border-slate-900 pb-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-3 rounded-xl">
              <HeartPulse className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                Clinical Report
              </h1>
              <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                AI Diagnostic Engine Analysis
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-slate-100 px-4 py-2 rounded-lg inline-block mb-2">
              <p className="font-black text-slate-900 text-sm">
                Case File #{report.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Generated: {new Date(report.generatedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">
              Patient Information
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Name</span>{" "}
                <span className="font-black">{report.patientInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">ID</span>{" "}
                <span className="font-mono">
                  {report.patientInfo.patientId.slice(0, 12)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Age/Sex</span>{" "}
                <span className="font-black">
                  {report.patientInfo.age}Y / {report.patientInfo.gender}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">
              Clinician Details
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Attending</span>{" "}
                <span className="font-black">Dr. {report.doctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Specialty</span>{" "}
                <span className="font-black">
                  {report.doctor?.specialization}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Facility</span>{" "}
                <span className="font-black">
                  {report.doctor?.hospitalName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Result Highlight */}
        <div
          className={`p-8 rounded-3xl mb-12 flex items-center justify-between border-4 ${
            report.analysisResult.isCADDetected
              ? "bg-red-50 border-red-600 shadow-[0_10px_30px_rgba(220,38,38,0.1)]"
              : "bg-emerald-50 border-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
          }`}
        >
          <div className="flex items-center gap-6">
            {report.analysisResult.isCADDetected ? (
              <ShieldAlert className="w-16 h-16 text-red-600" />
            ) : (
              <FileCheck className="w-16 h-16 text-emerald-600" />
            )}
            <div>
              <h2
                className={`text-4xl font-black uppercase tracking-tighter ${report.analysisResult.isCADDetected ? "text-red-600" : "text-emerald-600"}`}
              >
                {report.analysisResult.isCADDetected
                  ? "CAD Detected"
                  : "Normal Sinus"}
              </h2>
              <p className="text-slate-700 font-bold mt-1">
                AI Classification Confidence:{" "}
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-sm">
                  {(report.analysisResult.confidenceScore * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ECG Parameters Table */}
        <div className="mb-12">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Detailed Morphological Findings
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-left text-[10px] uppercase font-black text-white tracking-widest">
                <th className="p-4 rounded-tl-xl">ECG Parameter</th>
                <th className="p-4">Clinical Finding</th>
                <th className="p-4 rounded-tr-xl text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {Object.entries(report.ecgParameters).map(([key, param]) => (
                <tr key={key} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-black text-slate-900 uppercase text-xs tracking-tight">
                    {key.replace(/([A-Z])/g, " $1")}
                  </td>
                  <td className="p-4 italic text-slate-600 font-medium">
                    {param.finding}
                  </td>
                  <td
                    className={`p-4 text-center font-black text-xs ${param.status === "Abnormal" ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {param.status === "Abnormal" ? "● ABNORMAL" : "● NORMAL"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations */}
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Clinical Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="bg-slate-900 text-white w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-16 pt-10 border-t-2 border-slate-100 grid grid-cols-2 items-end">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest space-y-1">
            <p>
              Generated by CAD.AI Neural Engine v
              {report.analysisResult.modelVersion}
            </p>
            <p>Standard Lead II Morphology Extraction</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">
              Authorized Signature
            </p>
            <div className="h-16 w-48 bg-slate-50 border-b-2 border-slate-900 ml-auto opacity-50 italic flex items-center justify-center text-slate-300">
              Digital ID Signed
            </div>
          </div>
        </div>
      </div>

      {/* Global Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; margin: 0; padding: 0; }
          .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
          #report-content { width: 100% !important; max-width: none !important; margin: 0 !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

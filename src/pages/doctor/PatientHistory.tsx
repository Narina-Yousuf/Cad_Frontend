import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Heart,
  ShieldCheck,
  FileText,
  User,
  ChevronRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { getPatientHistory } from "../../services/history.service";
import type { PatientHistoryData } from "../../types/history.types";

export default function PatientHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PatientHistoryData | null>(null);

  useEffect(() => {
    if (patientId) getPatientHistory(patientId).then(setData);
  }, [patientId]);

  if (!data)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Patient Dossier...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50/30 min-h-screen animate-in fade-in duration-500 font-sans">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-[#0ea5e9] transition-all"
      >
        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:border-[#0ea5e9]/30 group-hover:text-[#0ea5e9]">
          <ArrowLeft size={16} />
        </div>
        Return to Global Logs
      </button>

      {/* Patient Profile Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-2xl">
            <User className="text-white w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">Active Profile</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              {data.patient.name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} className="text-[#0ea5e9]" />
                Record ID: <span className="text-slate-600">{patientId?.slice(0, 8)}</span>
              </p>
              <div className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full" />
              <p className="text-[#0ea5e9] font-black text-[10px] uppercase tracking-widest underline underline-offset-4 decoration-blue-200">
                {data.patient.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Tests",
            value: data.summary.totalTests,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "CAD Detected",
            value: data.summary.cadDetected,
            icon: Activity,
            color: "text-red-500",
            bg: "bg-red-50",
          },
          {
            label: "Normal Tests",
            value: data.summary.normal,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Avg Confidence",
            value: data.summary.avgConfidence,
            icon: Heart,
            color: "text-[#0ea5e9]",
            bg: "bg-blue-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-blue-900/5 transition-all hover:translate-y-[-4px]"
          >
            <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className={`${stat.color} w-6 h-6`} />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-transparent to-blue-50/20">
          <div className="flex items-center gap-3">
             <div className="w-2 h-6 bg-[#0ea5e9] rounded-full" />
             <h2 className="font-black uppercase tracking-widest text-slate-900 text-sm italic">
               Clinical Diagnostic Timeline
             </h2>
          </div>
          <div className="bg-slate-50 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-200">
            End-to-End Encryption Active
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6">Reference Filename</th>
                <th className="px-10 py-6">AI Verdict</th>
                <th className="px-10 py-6">Reliability Score</th>
                <th className="px-10 py-6">Clinician</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.history.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                  onClick={() => navigate(`/doctor/result/${record.ecgId}`)}
                >
                  <td className="px-10 py-8 text-xs font-bold text-slate-500 tabular-nums">
                    {new Date(record.uploadDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-xs font-black text-slate-700 uppercase tracking-tight truncate max-w-[180px] bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
                      {record.fileName}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                        record.result === "CAD Detected"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                    >
                      {record.result}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-slate-900 text-sm tabular-nums">
                        {record.confidence}
                      </span>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full hidden lg:block overflow-hidden">
                        <div
                          className="bg-[#0ea5e9] h-full rounded-full shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                          style={{ width: record.confidence }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[8px] border border-slate-200">
                        {record.uploadedBy.charAt(0)}
                      </div>
                      {record.uploadedBy}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl text-slate-400 group-hover:text-[#0ea5e9] group-hover:border-[#0ea5e9]/30 text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm transition-all hover:scale-105">
                      Full Analysis <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
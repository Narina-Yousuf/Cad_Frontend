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
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#7c5dfa] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#1a1a2e] animate-in fade-in duration-500">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-[#94a3b8] font-black uppercase text-[10px] tracking-widest hover:text-[#7c5dfa] transition-all"
      >
        <div className="p-2 bg-[#252541] rounded-lg group-hover:bg-[#7c5dfa]/10">
          <ArrowLeft size={14} />
        </div>
        Back to History
      </button>

      {/* Patient Profile Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#252541] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c5dfa]/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-[#1a1a2e] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
            <User className="text-[#7c5dfa] w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              {data.patient.name}
            </h1>
            <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{" "}
              Patient Record #{patientId?.slice(0, 5)}
            </p>
            <p className="text-[#7c5dfa] font-mono text-sm mt-1">
              {data.patient.email}
            </p>
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
            color: "text-blue-400",
          },
          {
            label: "CAD Detected",
            value: data.summary.cadDetected,
            icon: Activity,
            color: "text-red-400",
          },
          {
            label: "Normal Tests",
            value: data.summary.normal,
            icon: ShieldCheck,
            color: "text-emerald-400",
          },
          {
            label: "Avg Confidence",
            value: data.summary.avgConfidence,
            icon: Heart,
            color: "text-[#7c5dfa]",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#252541] p-6 rounded-[2rem] border border-white/5 shadow-xl transition-transform hover:scale-[1.02]"
          >
            <div className="bg-[#1a1a2e] w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              <stat.icon className={`${stat.color} w-5 h-5`} />
            </div>
            <p className="text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.2em] mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <section className="bg-[#252541] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-black uppercase tracking-[0.15em] text-white text-sm">
            Complete Diagnostic Logs
          </h2>
          <div className="bg-[#1a1a2e] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#7c5dfa] border border-[#7c5dfa]/20">
            Secure History
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a1a2e]/50 text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">File Reference</th>
                <th className="px-8 py-5">Diagnosis</th>
                <th className="px-8 py-5">AI Confidence</th>
                <th className="px-8 py-5">Uploaded By</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.history.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => navigate(`/doctor/result/${record.ecgId}`)}
                >
                  <td className="px-8 py-6 text-sm font-bold text-[#94a3b8]">
                    {new Date(record.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[150px]">
                      {record.fileName}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        record.result === "CAD Detected"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {record.result}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-white text-sm">
                        {record.confidence}
                      </span>
                      <div className="w-12 bg-[#1a1a2e] h-1 rounded-full hidden sm:block">
                        <div
                          className="bg-[#7c5dfa] h-full rounded-full shadow-[0_0_8px_rgba(124,93,250,0.5)]"
                          style={{ width: record.confidence }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">
                    {record.uploadedBy}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="flex items-center gap-2 bg-[#1a1a2e] px-4 py-2 rounded-xl text-[#7c5dfa] text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-[#7c5dfa] hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-[#7c5dfa]/10">
                      View Report <ChevronRight size={12} />
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

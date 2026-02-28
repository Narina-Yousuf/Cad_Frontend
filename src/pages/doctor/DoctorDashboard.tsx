import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  Percent,
  ShieldCheck,
  Upload,
  FileText,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { getDoctorDashboard } from "../../services/dashboard.service";
import { StatCard } from "../../components/dashboard/StatCard";
import type { DoctorDashboardData } from "../../types/dashboard.types";
import toast from "react-hot-toast";

export default function DoctorDashboard() {
  const [data, setData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const dashboardData = await getDoctorDashboard();
      setData(dashboardData);
    } catch (error) {
      toast.error("Failed to refresh dashboard data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data)
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="animate-spin inline-block w-10 h-10 border-4 border-[#7c5dfa] border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#1a1a2e] animate-in fade-in duration-700">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#252541] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c5dfa]/5 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-[#7c5dfa] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7c5dfa]/20 border border-white/10">
            <span className="text-2xl font-black text-white uppercase">
              {data.doctor.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Dr. {data.doctor.name}
            </h1>
            <p className="text-[#94a3b8] font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
              {data.doctor.specialization} • {data.doctor.hospitalName}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          {/* FIXED LINK: Changed from /doctor/reports to /doctor/history to match App.tsx */}
          <button
            onClick={() => navigate("/doctor/history")}
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            <FileText className="w-4 h-4 text-[#7c5dfa]" /> Clinical Records
          </button>

          <button
            onClick={() => navigate("/doctor/upload")}
            className="flex items-center gap-2 bg-[#7c5dfa] hover:bg-[#9277ff] text-white px-6 py-3 rounded-xl font-black transition-all shadow-lg shadow-[#7c5dfa]/20 text-[10px] uppercase tracking-widest border border-white/10"
          >
            <Upload className="w-4 h-4" /> New Analysis
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Patients"
          value={data.stats.totalPatients}
          icon={Users}
        />
        <StatCard
          label="Analyses Today"
          value={data.stats.analysesToday}
          icon={Activity}
        />
        <StatCard
          label="CAD Detection"
          value={data.stats.cadDetectionRate}
          icon={Percent}
        />
        <StatCard
          label="AI Confidence"
          value={data.stats.avgConfidence}
          icon={ShieldCheck}
        />
      </div>

      {/* Recent Patients Table */}
      <section className="bg-[#252541] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-transparent to-white/[0.02]">
          <div className="flex items-center gap-3">
            <Clock className="text-[#7c5dfa] w-5 h-5" />
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              Recent Analyses
            </h2>
          </div>
          <span className="text-[9px] font-black text-[#7c5dfa] uppercase tracking-[0.2em] bg-[#7c5dfa]/10 border border-[#7c5dfa]/20 px-4 py-1.5 rounded-full">
            Live Feed Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1a1a2e]/50 text-[#94a3b8] uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Patient Details</th>
                <th className="px-8 py-5">Analysis Date</th>
                <th className="px-8 py-5">Diagnosis</th>
                <th className="px-8 py-5">Risk Profile</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.recentPatients.map((patient) => (
                <tr
                  key={patient.ecgId}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  onClick={() => navigate(`/doctor/result/${patient.ecgId}`)}
                >
                  <td className="px-8 py-6">
                    <div className="font-black text-white group-hover:text-[#7c5dfa] transition-colors uppercase tracking-tight text-sm">
                      {patient.patientName}
                    </div>
                    <div className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mt-1">
                      {patient.patientEmail}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-[#94a3b8] font-bold uppercase tracking-tighter">
                    {new Date(patient.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        patient.status === "CAD Detected"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
                          patient.risk === "High"
                            ? "bg-red-500 shadow-red-500/50"
                            : patient.risk === "Medium"
                              ? "bg-yellow-500 shadow-yellow-500/50"
                              : "bg-emerald-500 shadow-emerald-500/50"
                        }`}
                      />
                      <span className="text-xs font-black text-white uppercase tracking-widest">
                        {patient.risk}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-[#1a1a2e] rounded-xl text-[#7c5dfa] opacity-0 group-hover:opacity-100 transition-all border border-white/5 shadow-xl hover:scale-110">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.recentPatients.length === 0 && (
            <div className="p-20 text-center">
              <div className="bg-[#1a1a2e] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Users className="text-[#94a3b8]/20 w-8 h-8" />
              </div>
              <p className="text-[#94a3b8] font-black uppercase tracking-[0.2em] text-[10px]">
                No active diagnostic sessions found
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

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
  Loader2,
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Diagnostics...</p>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-80 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
        {/* Subtle Brand Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full px-6 flex items-center justify-center shadow-2xl shadow-slate-900/20 border-4 border-white">
            <span className="text-3xl font-black text-white italic">
              {data.doctor.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-[#0ea5e9] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Verified Provider</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              Dr. {data.doctor.name}
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
              {data.doctor.specialization} • <span className="text-slate-600">{data.doctor.hospitalName}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/doctor/history")}
            className="flex items-center gap-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm active:scale-95"
          >
            <FileText className="w-4 h-4 text-[#0ea5e9]" /> Clinical Records
          </button>

          <button
            onClick={() => navigate("/doctor/upload")}
            className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 text-[10px] uppercase tracking-widest border border-blue-400/20 active:scale-95"
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
          label="Analysis Today"
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
      <section className="bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-transparent to-blue-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Clock className="text-[#0ea5e9] w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                Recent <span className="text-[#0ea5e9]">Analyses</span>
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time AI synchronization</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Live Feed Active
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-10 py-6">Patient Identification</th>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6">AI Verdict</th>
                <th className="px-10 py-6">Risk Profile</th>
                <th className="px-10 py-6 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.recentPatients.map((patient) => (
                <tr
                  key={patient.ecgId}
                  className="hover:bg-blue-50/40 cursor-pointer transition-all group"
                  onClick={() => navigate(`/doctor/result/${patient.ecgId}`)}
                >
                  <td className="px-10 py-7">
                    <div className="font-black text-slate-900 group-hover:text-[#0ea5e9] transition-colors uppercase tracking-tight text-sm">
                      {patient.patientName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {patient.patientEmail}
                    </div>
                  </td>
                  <td className="px-10 py-7 text-xs text-slate-500 font-bold uppercase tracking-tighter">
                    {new Date(patient.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-10 py-7">
                    <span
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                        patient.status === "CAD Detected"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full shadow-inner border-2 border-white ${
                          patient.risk === "High"
                            ? "bg-red-500 shadow-red-500/20"
                            : patient.risk === "Medium"
                              ? "bg-amber-500 shadow-amber-500/20"
                              : "bg-emerald-500 shadow-emerald-500/20"
                        }`}
                      />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                        {patient.risk}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 group-hover:text-[#0ea5e9] group-hover:border-[#0ea5e9]/30 transition-all shadow-sm hover:scale-110">
                      <ArrowUpRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.recentPatients.length === 0 && (
            <div className="p-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                <Users className="text-slate-200 w-10 h-10" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">
                Waiting for incoming diagnostic data...
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
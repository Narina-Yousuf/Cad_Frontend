import React, { useEffect, useState } from "react";
import {
  Calendar,
  Heart,
  Activity,
  FileCheck,
  History,
  Upload,
  User,
  ArrowUpRight,
} from "lucide-react";
import { getPatientDashboard } from "../../services/dashboard.service";
import { StatCard } from "../../components/dashboard/StatCard";
import { AlertBanner } from "../../components/dashboard/AlertBanner";
import type { PatientDashboardData } from "../../types/dashboard.types";
import toast from "react-hot-toast";

export default function PatientDashboard() {
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const dashboardData = await getPatientDashboard();
      setData(dashboardData);
    } catch (error) {
      toast.error("Failed to load health profile");
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
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-[#7c5dfa] border-t-transparent rounded-full" />
          <span className="text-[#94a3b8] font-black uppercase tracking-widest text-xs">
            Syncing Health Data...
          </span>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 bg-[#1a1a2e] animate-in fade-in duration-700">
      {/* Premium Profile Card */}
      <div className="bg-[#252541] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c5dfa]/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#1a1a2e] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
              <User className="text-[#7c5dfa] w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Welcome back, {data.patient.name.split(" ")[0]}
              </h1>
              <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-3">
                <span className="bg-[#7c5dfa]/20 text-[#7c5dfa] px-2 py-0.5 rounded text-[10px]">
                  {data.patient.bloodGroup}
                </span>
                {data.patient.gender} •{" "}
                {new Date().getFullYear() -
                  new Date(data.patient.dateOfBirth || "").getFullYear()}{" "}
                Years Old
              </p>
            </div>
          </div>
          <button className="bg-[#7c5dfa] hover:bg-[#9277ff] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-[#7c5dfa]/20 active:scale-95">
            Update Medical Info
          </button>
        </div>
      </div>

      {/* Alert Banner Container */}
      {data.alert && (
        <div className="animate-in slide-in-from-top-4">
          <AlertBanner
            alert={data.alert}
            onDismiss={() => setData({ ...data, alert: null })}
          />
        </div>
      )}

      {/* Patient Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Last Test"
          value={
            data.stats.lastTestDate
              ? new Date(data.stats.lastTestDate).toLocaleDateString()
              : "N/A"
          }
          icon={Calendar}
        />
        <StatCard
          label="Recent Result"
          value={data.stats.lastResult}
          icon={Activity}
        />
        <StatCard
          label="Heart Rate"
          value={data.stats.heartRate ? `${data.stats.heartRate} BPM` : "--"}
          icon={Heart}
        />
        <StatCard
          label="Total History"
          value={data.stats.totalTests}
          icon={FileCheck}
        />
      </div>

      {/* Activity Timeline Section */}
      <section className="bg-[#252541] p-8 rounded-[2.5rem] shadow-2xl border border-white/5 relative">
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Health Activity
            </h2>
            <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mt-1">
              Timeline of your clinical diagnostics
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-[#1a1a2e] border border-white/5 rounded-xl text-[#94a3b8] hover:text-white transition-all">
              <History className="w-5 h-5" />
            </button>
            <button className="p-3 bg-[#7c5dfa]/10 border border-[#7c5dfa]/20 text-[#7c5dfa] rounded-xl hover:bg-[#7c5dfa] hover:text-white transition-all">
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[1.25rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {data.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="relative flex items-center justify-between group animate-in slide-in-from-left-4"
            >
              <div className="flex items-center gap-8 relative z-10">
                <div
                  className={`w-10 h-10 rounded-2xl border-2 border-[#252541] shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    activity.result === "CAD Detected"
                      ? "bg-red-500 shadow-red-500/20"
                      : "bg-emerald-500 shadow-emerald-500/20"
                  }`}
                >
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-white text-lg tracking-tight group-hover:text-[#7c5dfa] transition-colors">
                    {activity.fileName}
                  </h4>
                  <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mt-1">
                    {new Date(activity.date).toLocaleString()} • Via{" "}
                    {activity.uploadedBy}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-6">
                <div>
                  <p
                    className={`font-black text-sm uppercase tracking-widest ${activity.result === "CAD Detected" ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {activity.result}
                  </p>
                  <p className="text-[10px] font-black text-[#94a3b8]/50 uppercase mt-1">
                    Conf:{" "}
                    <span className="text-white">{activity.confidence}</span>
                  </p>
                </div>
                <button className="p-2 bg-[#1a1a2e] rounded-xl text-[#7c5dfa] opacity-0 group-hover:opacity-100 transition-all border border-white/5 shadow-xl">
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}

          {data.recentActivity.length === 0 && (
            <div className="py-12 flex flex-col items-center gap-4 border-2 border-dashed border-white/5 rounded-[2rem]">
              <div className="bg-white/5 p-4 rounded-2xl text-[#94a3b8]/20">
                <Activity size={32} />
              </div>
              <p className="text-[#94a3b8] font-bold uppercase tracking-widest text-xs text-center px-8">
                No active diagnostics found. <br />{" "}
                <span className="text-[#7c5dfa]">Upload an ECG</span> to begin
                tracking.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

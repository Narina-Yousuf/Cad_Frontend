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
  Droplets,
  ShieldCheck,
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
      toast.error("Failed to sync health profile");
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-4 border-[#0ea5e9]/20 border-t-[#0ea5e9] rounded-full" />
            <Activity className="absolute inset-0 m-auto w-5 h-5 text-[#0ea5e9] animate-pulse" />
          </div>
          <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
            Retrieving Biometric Data...
          </span>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 bg-slate-50/50 min-h-screen animate-in fade-in duration-700 font-sans">
      {/* Premium Profile Header */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-sky-900/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-50 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-inner group-hover:border-sky-200 transition-colors">
                <User className="text-[#0ea5e9] w-12 h-12" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <ShieldCheck className="text-white w-3 h-3" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                Welcome back, {data.patient.name.split(" ")[0]}
              </h1>

            </div>
          </div>
          <button className="bg-[#0ea5e9] hover:bg-[#6ec1e7] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95">
            Update Medical Profile
          </button>
        </div>
      </div>

      {/* Alert System */}
      {data.alert && (
        <div className="animate-in slide-in-from-top-6 duration-500">
          <AlertBanner
            alert={data.alert}
            onDismiss={() => setData({ ...data, alert: null })}
          />
        </div>
      )}

      {/* Clinical Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Last Analysis", value: data.stats.lastTestDate ? new Date(data.stats.lastTestDate).toLocaleDateString() : "Pending", icon: Calendar },
          { label: "Cardiac Status", value: data.stats.lastResult, icon: Activity },
          { label: "Pulse Rate", value: data.stats.heartRate ? `${data.stats.heartRate} BPM` : "--", icon: Heart },
          { label: "Diagnostic Count", value: data.stats.totalTests, icon: FileCheck },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:translate-y-[-4px] transition-all">
            <div className="flex items-center gap-2 mb-4">
              <stat.icon size={14} className="text-[#0ea5e9]" />
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity Timeline Section */}
      <section className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-center mb-12 border-b border-slate-50 pb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Health Timeline
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
              Recent Clinical Inferences
            </p>
          </div>
          <div className="flex gap-4">
            <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-[#0ea5e9] hover:bg-white transition-all shadow-sm">
              <History className="w-5 h-5" />
            </button>
            <button className="p-4 bg-[#0ea5e9]/5 border border-[#0ea5e9]/10 text-[#0ea5e9] rounded-2xl hover:bg-[#0ea5e9] hover:text-white transition-all shadow-sm">
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-12 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-[2px] before:bg-slate-50">
          {data.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="relative flex items-center justify-between group animate-in slide-in-from-left-6"
            >
              <div className="flex items-center gap-8 relative z-10">
                <div
                  className={`w-11 h-11 rounded-[1rem] border-4 border-white shadow-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                    activity.result === "CAD Detected"
                      ? "bg-rose-500 shadow-rose-500/20"
                      : "bg-emerald-500 shadow-emerald-500/20"
                  }`}
                >
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-[#0ea5e9] transition-colors uppercase italic">
                    {activity.fileName}
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {new Date(activity.date).toLocaleString()} • ID: {activity.id.slice(0,6).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-10">
                <div className="hidden sm:block">
                  <p
                    className={`font-black text-[10px] uppercase tracking-[0.2em] mb-1 ${
                      activity.result === "CAD Detected" ? "text-rose-500" : "text-emerald-500"
                    }`}
                  >
                    {activity.result}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full ${activity.result === "CAD Detected" ? "bg-rose-500" : "bg-emerald-500"}`} style={{width: activity.confidence}} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400">{activity.confidence}</span>
                  </div>
                </div>
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all border border-slate-100 group-hover:shadow-lg">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          ))}

          {data.recentActivity.length === 0 && (
            <div className="py-20 flex flex-col items-center gap-6 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-slate-200">
                <Activity size={40} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] text-center px-12 leading-relaxed">
                Primary Diagnostics Empty. <br />{" "}
                <span className="text-[#0ea5e9]">Submit New Waveform</span> to synchronize timeline.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
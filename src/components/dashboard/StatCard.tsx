import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
}) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-50 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 shadow-md shadow-blue-900/5 group">
    {/* Icon Container - Sky Blue tinted background */}
    <div className="p-2 rounded-2xl bg-slate-50 text-[#0ea5e9] group-hover:bg-blue-50 transition-colors duration-300">
      <Icon size={15} className="transition-transform duration-300 group-hover:scale-110" />
    </div>
    
    <div className="flex flex-col min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">
        {label}
      </p>
      <p className="text-[12px] font-black text-slate-900 tracking-tight leading-tight">
        {value}
      </p>
    </div>
  </div>
);
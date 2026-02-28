import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string; // Kept for logic, but UI now follows a unified theme
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
}) => (
  <div className="bg-[#252541] p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#7c5dfa]/30 shadow-xl shadow-black/20">
    <div className="p-4 rounded-2xl bg-[#1a1a2e] border border-white/5 group">
      <Icon className="w-6 h-6 text-[#7c5dfa] transition-transform duration-300 group-hover:scale-110" />
    </div>
    <div className="flex flex-col">
      <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

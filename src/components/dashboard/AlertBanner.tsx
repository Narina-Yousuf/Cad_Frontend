import React from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import type { Alert } from "../../types/dashboard.types";

export const AlertBanner: React.FC<{ alert: Alert; onDismiss: () => void }> = ({
  alert,
  onDismiss,
}) => {
  const isWarning = alert.type === "warning";

  return (
    <div
      className={`flex items-center justify-between p-5 rounded-2xl mb-8 border animate-in slide-in-from-top-4 shadow-lg ${
        isWarning
          ? "bg-[#252541] text-red-400 border-red-500/20 shadow-red-500/5"
          : "bg-[#252541] text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-xl ${isWarning ? "bg-red-500/10" : "bg-emerald-500/10"}`}
        >
          {isWarning ? (
            <AlertCircle className="w-6 h-6" />
          ) : (
            <CheckCircle className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="font-black uppercase tracking-tight text-sm">
            {isWarning ? "Attention Required" : "Analysis Success"}
          </p>
          <p className="text-white font-medium text-sm mt-0.5">
            {alert.message}
          </p>
          {alert.confidence && (
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mt-1">
              AI Confidence:{" "}
              <span className="text-white">{alert.confidence}</span>
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="p-2 hover:bg-white/5 rounded-xl transition-all text-[#94a3b8] hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

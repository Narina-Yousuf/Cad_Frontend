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
      className={`flex items-center justify-between p-5 rounded-[2rem] mb-8 border animate-in slide-in-from-top-4 shadow-xl shadow-blue-900/5 ${
        isWarning
          ? "bg-red-50 text-red-600 border-red-100"
          : "bg-emerald-50 text-emerald-600 border-emerald-100"
      }`}
    >
      <div className="flex items-center gap-5">
        {/* Icon Container with stronger contrast */}
        <div
          className={`p-3 rounded-2xl shadow-sm ${
            isWarning ? "bg-white text-red-500" : "bg-white text-emerald-500"
          }`}
        >
          {isWarning ? (
            <AlertCircle className="w-6 h-6 stroke-[2.5px]" />
          ) : (
            <CheckCircle className="w-6 h-6 stroke-[2.5px]" />
          )}
        </div>

        <div>
          <p className="font-black uppercase tracking-[0.15em] text-[10px] leading-none mb-1.5">
            {isWarning ? "Clinical Attention Required" : "Diagnostic Analysis Success"}
          </p>
          <p className="text-slate-900 font-bold text-sm tracking-tight leading-none">
            {alert.message}
          </p>
          {alert.confidence && (
            <p className={`text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2 ${
              isWarning ? "text-red-400" : "text-emerald-400"
            }`}>
              <span className="opacity-60">AI Confidence Index:</span>
              <span className={`px-2 py-0.5 rounded-md bg-white border ${
                isWarning ? "border-red-100" : "border-emerald-100"
              }`}>
                {alert.confidence}
              </span>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-2.5 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md border border-transparent hover:border-slate-100"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
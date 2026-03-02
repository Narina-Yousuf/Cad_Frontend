import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="w-full mb-6">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          {...props}
          className={`
            w-full px-5 py-4 rounded-2xl border outline-none transition-all duration-300
            text-sm font-bold tracking-tight text-slate-900
            placeholder:text-slate-300 placeholder:font-medium
            ${
              error
                ? "bg-red-50 border-red-200 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "bg-slate-50 border-slate-100 text-slate-900 focus:bg-white focus:border-[#0ea5e9] focus:ring-4 focus:ring-blue-500/5 shadow-sm focus:shadow-md"
            }
          `}
        />
      </div>
      {error && (
        <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 ml-2 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  ),
);

Input.displayName = "Input";
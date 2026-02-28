import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="w-full mb-5">
      <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          {...props}
          className={`
            w-full px-4 py-3.5 bg-[#252541] text-white rounded-xl border outline-none transition-all duration-200
            placeholder:text-[#94a3b8]/30 text-sm
            ${
              error
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/5 focus:border-[#7c5dfa] focus:ring-4 focus:ring-[#7c5dfa]/10"
            }
          `}
        />
      </div>
      {error && (
        <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  ),
);

Input.displayName = "Input";

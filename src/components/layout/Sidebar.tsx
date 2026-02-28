import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  History,
  LogOut,
  HeartPulse,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  // Links matched exactly to App.tsx Routes
  const doctorLinks = [
    { name: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "New Analysis", path: "/doctor/upload", icon: Upload },
    { name: "Clinical Records", path: "/doctor/history", icon: History },
  ];

  const patientLinks = [
    { name: "My Health", path: "/patient/dashboard", icon: LayoutDashboard },
    { name: "Upload ECG", path: "/patient/upload", icon: Upload },
    { name: "Test History", path: "/patient/history", icon: History },
  ];

  const links = user?.role === "DOCTOR" ? doctorLinks : patientLinks;

  return (
    <aside className="w-68 h-screen bg-[#1a1a2e] border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 no-print shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
      {/* Brand Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-[#7c5dfa] p-2.5 rounded-2xl shadow-[0_0_20px_rgba(124,93,250,0.4)]">
          <HeartPulse className="text-white w-6 h-6" />
        </div>
        <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
          CAD.AI
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-6">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3.5 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all duration-300
              ${
                isActive
                  ? "bg-[#7c5dfa] text-white shadow-lg shadow-[#7c5dfa]/20"
                  : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <link.icon
                    size={18}
                    className={`${isActive ? "text-white" : "group-hover:text-[#7c5dfa] transition-colors"}`}
                  />
                  <span>{link.name}</span>
                </div>
                <ChevronRight
                  size={14}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout Section */}
      <div className="p-6 bg-[#252541]/40 border-t border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="bg-[#7c5dfa]/10 p-1 rounded-xl shrink-0">
            <UserCircle className="text-[#7c5dfa] w-8 h-8" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white truncate uppercase">
              {user?.name}
            </p>
            <p className="text-[9px] font-black text-[#7c5dfa] uppercase tracking-widest mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

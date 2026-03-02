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
    <aside className="w-68 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-40 no-print shadow-[10px_0_40px_rgba(0,0,0,0.02)]">
      {/* Brand Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-[#0ea5e9] p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
          <HeartPulse className="text-white w-6 h-6" />
        </div>
        <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic">
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
              group flex items-center justify-between px-4 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300
              ${
                isActive
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <link.icon
                    size={18}
                    className={`${isActive ? "text-[#0ea5e9]" : "group-hover:text-[#0ea5e9] transition-colors"}`}
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
      <div className="p-6 bg-slate-50/50 border-t border-slate-100 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="bg-blue-50 p-1 rounded-xl shrink-0">
            <UserCircle className="text-[#0ea5e9] w-8 h-8" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate uppercase">
              {user?.name || "Guest User"}
            </p>
            <p className="text-[9px] font-black text-[#0ea5e9] uppercase tracking-widest mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const MainLayout: React.FC = () => {
  return (
    <div className="flex bg-[#1a1a2e] min-h-screen">
      {/* Sidebar remains fixed on the left */}
      <Sidebar />

      {/* Main Content Area:
          - ml-68 matches the width of the Sidebar
          - bg-[#1a1a2e] ensures a seamless dark theme across the whole screen
      */}
      <main className="flex-1 ml-68 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-8 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

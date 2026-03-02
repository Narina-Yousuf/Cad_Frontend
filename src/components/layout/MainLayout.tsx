import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const MainLayout: React.FC = () => {
  return (
    <div className="flex bg-[#f0f9ff] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Decorative Background Glow */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/40 to-transparent pointer-events-none" />

      {/* Sidebar remains fixed on the left */}
      <Sidebar />

      {/* Main Content Area:
          - ml-68 matches your specific Sidebar width
          - bg-transparent allows the subtle blue tint to show through
      */}
      <main className="flex-1 ml-68 min-h-screen overflow-y-auto relative z-10">
        <div className="p-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header Space (Optional: You can add a TopNav here later) */}
          <div className="mb-2" />
          
          <Outlet />
          
          {/* Footer Space */}
          <div className="h-10" />
        </div>
      </main>
    </div>
  );
};
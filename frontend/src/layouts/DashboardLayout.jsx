import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

/**
 * Reusable dashboard layout.
 * It shows the Sidebar + Navbar around every protected page.
 * <Outlet /> renders the current child page (Dashboard, Tasks, etc.).
 */
const DashboardLayout = () => {
  // Controls whether the sidebar is open on mobile.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area: navbar on top, page content below. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

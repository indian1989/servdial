import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { FaBars } from "react-icons/fa";

function AdminLayout() {
  const { user, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const allowedRoles = ["admin", "superadmin"];

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading admin panel...
        </div>
      </div>
    );
  }

  // ACCESS CONTROL
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
          <p className="text-gray-500 mt-2">
            Admin panel is restricted to admin and superadmin only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        <FaBars />
      </button>

      {/* SIDEBAR (DESKTOP) */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="w-64 bg-gray-900 text-white"
          >
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>

          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <AdminHeader />

        {/* CONTENT */}
        <main className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;